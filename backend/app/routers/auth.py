import logging
import os
import re
import shutil
import uuid
from typing import List

import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy import func
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.database import get_db
from app.model.yolo_model import predict_food_from_image

router = APIRouter()
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Route for user registration
@router.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    logger.info(f"Attempting to sign up user: {user.email}")
    new_user = crud.create_user(db, user)

    if not new_user:
        logger.error("Email or Username already taken")
        raise HTTPException(status_code=400, detail="Email or Username already taken")

    logger.info(f"User {user.email} created successfully")
    return {"message": "User created successfully"}


# Route for user login
@router.post("/login")
def login(credentials: schemas.Login, db: Session = Depends(get_db)):
    logger.info(f"Attempting to log in with email: {credentials.email}")
    user = crud.authenticate_user(db, credentials.email, credentials.password)

    if not user:
        logger.error(f"Invalid login attempt for email: {credentials.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    logger.info(f"User {credentials.email} logged in successfully")
    return {"message": "Login successful", "user": user}


# Route to update user profile
@router.put("/update-profile/{user_id}")
def update_profile(
    user_id: int, user_update: schemas.UserUpdate, db: Session = Depends(get_db)
):
    logger.info(f"Attempting to update profile for user ID: {user_id}")
    updated_user = crud.update_user(db, user_id, user_update)

    if not updated_user:
        logger.error(f"User ID {user_id} not found")
        raise HTTPException(status_code=404, detail="User not found")

    logger.info(f"User ID {user_id} profile updated successfully")
    return {"message": "Profile updated successfully", "user": updated_user}


# Route for logging meals
@router.post("/log-meal")
async def log_meal(payload: schemas.LogMealRequest, db: Session = Depends(get_db)):
    logger.info(f"Attempting to log meal for user ID: {payload.user_id}")

    # Ensure that the user exists
    user = db.query(models.User).filter(models.User.id == payload.user_id).first()
    if not user:
        logger.error(f"User ID {payload.user_id} not found")
        raise HTTPException(status_code=404, detail="User not found")

    # Create a new DailyNutrition entry
    new_meal = models.DailyNutrition(
        user_id=payload.user_id,
        record_date=func.current_date(),
        consumed_calories=payload.calories,
        fat_consumed=payload.fat,
        protein_consumed=payload.protein,
        carbs_consumed=payload.carbs,
        meal_name=payload.title,
        meal_type=payload.meal_type,
    )

    db.add(new_meal)
    db.commit()
    db.refresh(new_meal)

    logger.info(
        f"Meal logged successfully for user ID: {payload.user_id}, meal: {new_meal.meal_name}"
    )
    return {"message": "Meal logged successfully", "meal": new_meal}


@router.get("/meals/{user_id}", response_model=List[schemas.MealOut])
def get_user_meals(user_id: int, db: Session = Depends(get_db)):
    meals = (
        db.query(models.DailyNutrition)
        .filter(models.DailyNutrition.user_id == user_id)
        .all()
    )
    return meals


# Route for predicting meals from images and fetching nutritional information
@router.post("/predict-meal")
async def predict_meal(
    file: UploadFile = File(...), db: Session = Depends(get_db)
):
    logger.info(f"Received file: {file.filename} for meal prediction")

    # Save image to a temporary file
    file_ext = file.filename.split(".")[-1].lower()
    if file_ext not in ["jpg", "jpeg", "png"]:
        logger.error(f"Unsupported image format: {file_ext}")
        raise HTTPException(status_code=400, detail="Unsupported image format")

    filename = f"{uuid.uuid4()}.{file_ext}"
    temp_path = f"temp/{filename}"
    os.makedirs("temp", exist_ok=True)

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        logger.info(f"Running YOLO food detection on {temp_path}")
        detected_foods = predict_food_from_image(temp_path)
        logger.info(f"Detected foods: {detected_foods}")

        if not detected_foods:
            logger.warning("No food items detected in image")
            raise HTTPException(status_code=404, detail="No food items confidently detected")

        detected_food_name = detected_foods[0]

        # Fetch nutrition info from FatSecret API
        logger.info(f"Fetching nutrition info for detected food: {detected_food_name}")
        food_data = await fetch_nutrition_from_fatsecret(detected_food_name)
        logger.info(f"Fetched nutrition data: {food_data}")

        return {"detected_foods": detected_foods, "nutrition": food_data}

    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

    finally:
        os.remove(temp_path)
        logger.info(f"Temporary file {temp_path} removed")


# Fetch nutrition information from FatSecret
async def fetch_nutrition_from_fatsecret(food_name: str):
    CLIENT_ID = os.getenv("CLIENT_ID")
    CLIENT_SECRET = os.getenv("CLIENT_SECRET")

    if not CLIENT_ID or not CLIENT_SECRET:
        logger.error("FatSecret client credentials are missing")
        raise HTTPException(
            status_code=500, detail="FatSecret client credentials are missing"
        )

    TOKEN_URL = "https://oauth.fatsecret.com/connect/token"
    FOOD_SEARCH_URL = "https://platform.fatsecret.com/rest/foods/search/v1"

    async def get_fatsecret_token():
        logger.info("Fetching FatSecret token")
        async with httpx.AsyncClient() as client:
            response = await client.post(
                TOKEN_URL,
                data={
                    "grant_type": "client_credentials",
                    "client_id": CLIENT_ID,
                    "client_secret": CLIENT_SECRET,
                },
            )
            if response.status_code != 200:
                logger.error(f"Token error: {response.text}")
                raise HTTPException(
                    status_code=500, detail="Authentication with FatSecret failed"
                )
            return response.json().get("access_token")

    async def search_food(query: str, token: str):
        params = {
            "search_expression": query,
            "max_results": 5,
            "format": "json",
        }
        headers = {"Authorization": f"Bearer {token}"}
        async with httpx.AsyncClient() as client:
            response = await client.get(
                FOOD_SEARCH_URL, headers=headers, params=params
            )
            logger.info(
                f"FatSecret Search Response: {response.status_code} - {response.text}"
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=500, detail="Failed to search food from FatSecret"
                )

            data = response.json()
            food_data = data.get("foods", {}).get("food", [])
            if not food_data:
                raise HTTPException(status_code=404, detail="No food found")

            # Try to find the exact match first
            exact_match = next(
                (
                    item
                    for item in food_data
                    if item["food_name"].lower() == query.lower()
                ),
                None,
            )

            if exact_match:
                logger.info(f"Exact match found for {query}")
                return exact_match
            else:
                logger.info("No exact match found, returning the first match")
                return food_data[0]  # Return the first item if no exact match is found

    # Get token and fetch food data
    token = await get_fatsecret_token()
    food_data = await search_food(food_name, token)
    logger.info(f"Nutrition data fetched for {food_name}")

    # Handle the fetched data and extract relevant details
    description = food_data.get("food_description", "")
    calories_per_serving = extract_calories_from_description(description)
    serving_size = food_data.get("serving_size", "100g")

    return {
        "food_name": food_data.get("food_name"),
        "food_description": description,
        "calories_per_serving": calories_per_serving,
        "serving_size": serving_size,
        "food_url": food_data.get("food_url"),
        "raw": food_data,
    }


# Function to extract calories from food description
def extract_calories_from_description(description: str):
    match = re.search(r"Calories:\s*(\d+)", description)
    if match:
        return int(match.group(1))  # Return calories as an integer
    else:
        raise ValueError("Calories not found in food description")


@router.get("/nutrition-goals/{user_id}", response_model=schemas.NutritionGoalsSchema)
def get_goals(
    user_id: int,
    db: Session = Depends(get_db),
):
    # Ensure that the user exists
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        logger.error(f"User ID {user_id} not found")
        raise HTTPException(status_code=404, detail="User not found")

    goals = (
        db.query(models.NutritionGoals)
        .filter(models.NutritionGoals.user_id == user_id)
        .first()
    )
    if not goals:
        raise HTTPException(status_code=404, detail="Goals not set")
    return goals


@router.post("/nutrition-goals/{user_id}", response_model=schemas.NutritionGoalsSchema)
def create_or_update_goals(
    user_id: int,
    goal_data: schemas.NutritionGoalsSchema,
    db: Session = Depends(get_db),
):
    # Ensure that the user exists
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        logger.error(f"User ID {user_id} not found")
        raise HTTPException(status_code=404, detail="User not found")

    goals = (
        db.query(models.NutritionGoals)
        .filter(models.NutritionGoals.user_id == user_id)
        .first()
    )

    if not goals:
        goals = models.NutritionGoals(user_id=user_id, **goal_data.dict())
        db.add(goals)
    else:
        for field, value in goal_data.dict().items():
            setattr(goals, field, value)

    db.commit()
    db.refresh(goals)
    return goals