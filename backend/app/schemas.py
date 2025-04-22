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
    