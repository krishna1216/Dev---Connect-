from pathlib import Path
from fastapi import FastAPI
from .database import engine, Base
from app import models
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load environment variables from backend folder and repo root
backend_dir = Path(__file__).resolve().parent.parent
load_dotenv(backend_dir / ".env")
load_dotenv(backend_dir.parent / ".env")

app = FastAPI()

# Support one or more frontend origins (comma-separated) and Vercel preview domains
frontend_urls = [
    origin.strip()
    for origin in os.getenv("FRONTEND_URL", "http://localhost:5173").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_urls,
    allow_origin_regex=r"^https://.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"message": "DevConnect API with Database 🚀"}
from app.routes import user
models.Base.metadata.create_all(bind=engine)
app.include_router(user.router, prefix="/users")

from app.routes import posts
app.include_router(posts.router,prefix="/posts")

from fastapi.staticfiles import StaticFiles
app.mount("/media", StaticFiles(directory="media"), name="media")

from app.routes import likes, comments
app.include_router(likes.router)
app.include_router(comments.router)

from app.routes import follows, notifications
app.include_router(follows.router)
app.include_router(notifications.router)

from app.routes import feed
app.include_router(feed.router) 
