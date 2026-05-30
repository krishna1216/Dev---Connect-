from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models
from app.auth import get_current_user

router = APIRouter(prefix="/likes", tags=["Likes"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
@router.post("/{post_id}")
def like_post(post_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing_like = db.query(models.Like).filter(
        models.Like.post_id == post_id,
        models.Like.user_id == user_id
    ).first()

    if existing_like:
        raise HTTPException(status_code=400, detail="Already liked")

    like = models.Like(user_id=user_id, post_id=post_id)
    db.add(like)
    db.commit()

    total_likes = db.query(models.Like).filter(models.Like.post_id == post_id).count()

    return {"post_id": post_id, "total_likes": total_likes}
@router.delete("/{post_id}")
def unlike_post(post_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    
    like = db.query(models.Like).filter(
        models.Like.post_id == post_id,
        models.Like.user_id == user_id
    ).first()

    if not like:
        raise HTTPException(status_code=404, detail="Like not found")

    db.delete(like)
    db.commit()

    total_likes = db.query(models.Like).filter(models.Like.post_id == post_id).count()

    return {"post_id": post_id, "total_likes": total_likes}
