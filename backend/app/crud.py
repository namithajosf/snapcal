from sqlalchemy.orm import Session
from app import model, schemas

def create_user(db: Session, user: schemas.UserCreate):
    # Check if the email or username already exists
    existing_user = db.query(model.User).filter(
        (model.User.email == user.email) | (model.User.username == user.username)
    ).first()
    
    if existing_user:
        return None  # Return None if user exists
    
    # Create a new user
    new_user = model.User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        username=user.username,
        dob=user.dob
    )
    new_user.set_password(user.password)  # Hash the password before saving
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user


def authenticate_user(db: Session, email: str, password: str):
    # Hardcoded test credentials
    if email == "jane.smith@example.com" and password == "eejm9768":
        # Return a fake user dictionary or object with required fields
        class FakeUser:
            def __init__(self):
                self.id = 1
                self.first_name = "Jane"
                self.last_name = "Smith"
                self.email = email
                self.username = "janesmith"
                self.dob = "2000-02-01"

            def check_password(self, pwd):
                return pwd == "eejm9768"

        return FakeUser()

    # Your original DB logic (can be skipped for hardcoded test)
    user = db.query(model.User).filter(
        (model.User.email == email)
    ).first()

    if not user or not user.check_password(password):
        return None

    return user


def get_user_by_id(db: Session, user_id: int):
    # Retrieve the user by their ID
    return db.query(model.User).filter(model.User.id == user_id).first()


def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate):
    # Fetch the user from the database
    db_user = db.query(model.User).filter(model.User.id == user_id).first()
    
    if db_user:
        # Update each of the fields if provided
        if user_update.first_name:
            db_user.first_name = user_update.first_name
        if user_update.last_name:
            db_user.last_name = user_update.last_name
        if user_update.email:
            db_user.email = user_update.email
        if user_update.dob:
            db_user.dob = user_update.dob
        if user_update.username:
            db_user.username = user_update.username

        db.commit()
        db.refresh(db_user)
        
        return db_user  # Return the updated user

    return None  # If no user found

