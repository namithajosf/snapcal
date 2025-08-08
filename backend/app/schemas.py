from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import date

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    username: str
    password: str
    dob: date

    class Config:
        orm_mode = True

class Login(BaseModel):
    email: EmailStr
    password: str

# Schema for updating user profile
class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    dob: Optional[date] = None

class LogMealRequest(BaseModel):
    user_id: int
    title: str
    calories: float
    fat: float
    protein: float
    carbs: float
    meal_type: Optional[str] = "Other"

class MealOut(BaseModel):
    id: int
    user_id: int
    record_date: date
    meal_name: str
    consumed_calories: int
    fat_consumed: float
    protein_consumed: float
    carbs_consumed: float
    meal_type: str

    class Config:
        orm_mode = True

class NutritionGoalsSchema(BaseModel):
    daily_calories: Optional[int] = None
    water_goal_ml: Optional[int] = None
    fat_goal: Optional[float] = None
    protein_goal: Optional[float] = None
    carbs_goal: Optional[float] = None

    class Config:
        orm_mode = True