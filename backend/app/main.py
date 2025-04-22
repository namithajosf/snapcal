from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth  # Import your auth router

app = FastAPI()

# CORS setup
origins = [
    "http://localhost",
    "http://127.0.0.1",
    "http://192.168.141.84",
    "http://192.168.141.84:19000",
]

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,         # List of allowed origins
    allow_credentials=True,
    allow_methods=["*"],           # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],           # Allow all headers
)

# Include your authentication router
app.include_router(auth.router)
