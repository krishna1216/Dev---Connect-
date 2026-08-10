from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from app import models, schemas
from app.database import SessionLocal
from app.utils.security import hash_password, verify_password
from app.auth import create_access_token, get_current_user

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = models.User(
        email=user.email,
        hashed_password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully"}


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == form_data.username).first()

    if not db_user or not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"user_id": db_user.id})

    return {"access_token": access_token, "token_type": "bearer", "user": {"id": db_user.id, "email": db_user.email}}


@router.get("/me")
def read_users_me(db: Session = Depends(get_db), current_user: int = Depends(get_current_user)):
    user = db.query(models.User).filter(models.User.id == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    followers_count = db.query(models.Follow).filter(models.Follow.following_id == current_user).count()
    following_count = db.query(models.Follow).filter(models.Follow.follower_id == current_user).count()

    return {
        "id": user.id,
        "email": user.email,
        "is_following": False,
        "followers_count": followers_count,
        "following_count": following_count,
    }

@router.get("/search")
def search_users(query: str, db: Session = Depends(get_db), current_user: int = Depends(get_current_user)):
    if not query:
        return []

    users = db.query(models.User).filter(
        models.User.email.ilike(f"%{query}%")
    ).limit(10).all()

    return [{"id": user.id, "email": user.email} for user in users]

@router.get("/{user_id}")
def get_user_profile(user_id: int, db: Session = Depends(get_db), current_user: int = Depends(get_current_user)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    is_following = db.query(models.Follow).filter(
        models.Follow.follower_id == current_user,
        models.Follow.following_id == user_id
    ).first() is not None

    followers_count = db.query(models.Follow).filter(models.Follow.following_id == user_id).count()
    following_count = db.query(models.Follow).filter(models.Follow.follower_id == user_id).count()

    return {
        "id": user.id,
        "email": user.email,
        "is_following": is_following,
        "followers_count": followers_count,
        "following_count": following_count,
    }

@router.post("/posts")
def create_post(post: schemas.PostCreate,
                db: Session = Depends(get_db),
                current_user: int = Depends(get_current_user)):

    new_post = models.Post(
        content=post.content,
        owner_id=current_user
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return new_post
