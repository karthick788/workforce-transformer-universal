from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Workforce Transformer API",
    description="API for Workforce Transformer Universal",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Example model
class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None

# Example database (replace with your actual database setup)
fake_db = []

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to Workforce Transformer API",
        "status": "running",
        "docs": "/docs"  # Link to API documentation
    }

# Example CRUD endpoints
@app.post("/items/", response_model=Item)
async def create_item(item: Item):
    fake_db.append(item)
    return item

@app.get("/items/", response_model=List[Item])
async def read_items():
    return fake_db

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("DEBUG", "true").lower() == "true"
    )
