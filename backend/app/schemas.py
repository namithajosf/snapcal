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
    calories: int
    fat: int
    protein: int
    carbs: int  