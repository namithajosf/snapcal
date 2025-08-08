from sqlalchemy import Column, Integer, String, Date, ForeignKey, TIMESTAMP, JSON, Float
from sqlalchemy.orm import relationship
from .database import Base
from sqlalchemy.sql import func
import bcrypt

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    username = Column(String, unique=True, index=True)
    dob = Column(Date)

    # Relationships
    daily_nutrition = relationship("DailyNutrition", back_populates="user")
    nutrition_history = relationship("NutritionHistory", back_populates="user")
    daily_hydration = relationship("DailyHydration", back_populates="user")
    nutrition_goals = relationship("NutritionGoals", back_populates="user", uselist=False)  # One-to-one

    def set_password(self, password: str):
        self.password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password: str) -> bool:
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))


class DailyNutrition(Base):
    __tablename__ = "daily_nutrition"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    record_date = Column(Date, default=func.current_date())
    meal_name = Column(String)
    consumed_calories = Column(Integer)
    fat_consumed = Column(Float)
    protein_consumed = Column(Float)
    carbs_consumed = Column(Float)
    meal_type = Column(String, default="Other")

    user = relationship("User", back_populates="daily_nutrition")


class DailyHydration(Base):
    __tablename__ = "daily_hydration"

    record_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    record_date = Column(Date, server_default=func.current_date(), nullable=False)

    water_ml = Column(Integer, default=0, nullable=False)

    user = relationship("User", back_populates="daily_hydration")


class NutritionGoals(Base):
    __tablename__ = "nutrition_goals"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)

    daily_calories = Column(Integer, nullable=False)
    water_goal_ml = Column(Integer, nullable=False)

    fat_goal = Column(Integer, nullable=False)
    protein_goal = Column(Integer, nullable=False)
    carbs_goal = Column(Integer, nullable=False)

    user = relationship("User", back_populates="nutrition_goals")


class NutritionHistory(Base):
    __tablename__ = "nutrition_history"

    history_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    table_affected = Column(String(50), nullable=False)
    record_id = Column(Integer, nullable=False)
    action = Column(String(20), nullable=False)
    changed_fields = Column(JSON)
    timestamp = Column(TIMESTAMP, server_default=func.now())

    user = relationship("User", back_populates="nutrition_history")
