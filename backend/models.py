from sqlalchemy import Column, Integer, String, Date, ForeignKey, TIMESTAMP, JSON
from sqlalchemy.orm import relationship
from .database import Base
from sqlalchemy.sql import func

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    nutrition = relationship("DailyNutrition", back_populates="user")


class DailyNutrition(Base):
    __tablename__ = "daily_nutrition"

    record_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    record_date = Column(Date, server_default=func.current_date(), nullable=False)
    consumed_calories = Column(Integer, default=0, nullable=False)
    daily_goal = Column(Integer, nullable=False)

    user = relationship("User", back_populates="nutrition")


class DailyMacros(Base):
    __tablename__ = "daily_macros"

    record_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    record_date = Column(Date, server_default=func.current_date(), nullable=False)
    fat_consumed = Column(Integer, default=0, nullable=False)
    fat_goal = Column(Integer, nullable=False)
    protein_consumed = Column(Integer, default=0, nullable=False)
    protein_goal = Column(Integer, nullable=False)
    carbs_consumed = Column(Integer, default=0, nullable=False)
    carbs_goal = Column(Integer, nullable=False)


class DailyHydration(Base):
    __tablename__ = "daily_hydration"

    record_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    record_date = Column(Date, server_default=func.current_date(), nullable=False)
    water_ml = Column(Integer, default=0, nullable=False)
    water_goal_ml = Column(Integer, nullable=False)


class BeverageType(Base):
    __tablename__ = "beverage_types"

    beverage_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    default_ml = Column(Integer)
    default_calories = Column(Integer)


class DailyBeverages(Base):
    __tablename__ = "daily_beverages"

    record_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    beverage_id = Column(Integer, ForeignKey("beverage_types.beverage_id"), nullable=False)
    record_date = Column(Date, server_default=func.current_date(), nullable=False)
    servings = Column(Integer, default=1, nullable=False)
    volume_ml = Column(Integer)
    calories = Column(Integer)


class NutritionHistory(Base):
    __tablename__ = "nutrition_history"

    history_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    table_affected = Column(String(50), nullable=False)
    record_id = Column(Integer, nullable=False)
    action = Column(String(20), nullable=False)  # 'INSERT', 'UPDATE', 'DELETE'
    changed_fields = Column(JSON)
    timestamp = Column(TIMESTAMP, server_default=func.now())
