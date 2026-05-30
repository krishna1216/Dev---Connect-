from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
from pathlib import Path
from urllib.parse import urlparse
import socket
import logging

# Load .env file from backend folder
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# { changed code }
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError(f"DATABASE_URL environment variable not set in .env (checked {env_path})")

# Attempt to resolve DB host; if it fails, fall back to a local SQLite dev DB
parsed = urlparse(DATABASE_URL)
hostname = parsed.hostname
try:
    if hostname:
        socket.gethostbyname(hostname)
    engine = create_engine(DATABASE_URL)
except Exception as e:
    logging.warning(
        f"Could not resolve/connect to database host '{hostname}': {e}. "
        "Falling back to local SQLite (dev) database './dev.db'."
    )
    engine = create_engine("sqlite:///./dev.db", connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
