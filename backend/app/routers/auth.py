import logging
import os
import shutil
import uuid
import httpx
import re
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy import func
from sqlalchemy.orm import Session
from app import crud, schemas, model
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

# Route to update user profile (exclude password for now, unless specified)
@router.put("/update-profile/{user_id}")
def update_profile(user_id: int, user_update: schemas.UserUpdate, db: Session = Depends(get_db)):
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
    user = db.query(model.User).filter(model.User.id == payload.user_id).first()
    if not user:
        logger.error(f"User ID {payload.user_id} not found")
        raise HTTPException(status_code=404, detail="User not found")

    # Create a new DailyNutrition entry
    new_meal = model.DailyNutrition(
        user_id=payload.user_id,
        record_date=func.current_date(),
        consumed_calories=payload.calories,
        fat_consumed=payload.fat,
        protein_consumed=payload.protein,
        carbs_consumed=payload.carbs,
        meal_name=payload.title  # Use the title as meal name
    )

    db.add(new_meal)
    db.commit()
    db.refresh(new_meal)

    logger.info(f"Meal logged successfully for user ID: {payload.user_id}, meal: {new_meal.meal_name}")
    return {"message": "Meal logged successfully", "meal": new_meal}
