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
