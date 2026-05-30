"""
Root-level main.py for easy uvicorn startup.
Simply run: uvicorn main:app
"""
from app.main import app

__all__ = ["app"]
