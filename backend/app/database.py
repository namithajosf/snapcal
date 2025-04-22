# app/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings  # Import settings from config.py

DATABASE_URL = settings.DATABASE_URL


# Creating the engine using DATABASE_URL from settings
engine = create_engine(settings.DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {})

# Creating a local session maker for database transactions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models to inherit from
Base = declarative_base()

# Dependency that provides a database session
def get_db():
    """ Returns a new session for each request and closes it at the end """
    db = SessionLocal()  # Create a new session
    try:
        yield db  # Return the session
    finally:
        db.close()  # Close the session after the request finishes
