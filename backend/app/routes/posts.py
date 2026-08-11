from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional, List

from app.database import SessionLocal
from app import models, schemas
from app.auth import get_current_user
from app.utils.file_upload import save_file

router = APIRouter(tags=["Posts"])


# ---------------- DB Dependency ----------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- Helper Function ----------------

def build_post_response(post, current_user):
    image_url = None
    video_url = None

    if post.media_url:
        if post.media_url.lower().endswith((".jpg", ".jpeg", ".png", ".gif")):
            image_url = post.media_url
        elif post.media_url.lower().endswith((".mp4", ".mov", ".avi")):
            video_url = post.media_url

    return {
        "id": post.id,
        "content": post.content,
        "image_url": image_url,
        "video_url": video_url,
        "created_at": post.created_at,
        "user_id": post.owner_id,
        "likes_count": len(post.likes),
        "comments_count": len(post.comments),
        "is_liked_by_me": any(l.user_id == current_user for l in post.likes)
    }



# ---------------- CREATE POST ----------------


@router.post("/", response_model=schemas.PostOut)
async def create_post(
    content: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    media_url = None   # ✅ ALWAYS DEFINE

    if file:
        media_url = await save_file(file)

    new_post = models.Post(
        content=content,
        media_url=media_url,
        owner_id=current_user
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return build_post_response(new_post, current_user)
# ---------------- GET ALL POSTS ----------------

@router.get("/", response_model=List[schemas.PostOut])
def get_all_posts(
    limit: int = 10,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user)
):
    posts =   (db.query(models.Post)\
              .order_by(models.Post.created_at.desc())\
              .limit(limit)
              .offset(offset)
              .all())

    return [build_post_response(post, current_user) for post in posts]


# ---------------- GET MY POSTS ----------------




# ---------------- GET USER POSTS ----------------

@router.get("/user/{user_id}", response_model=List[schemas.PostOut])
def get_user_posts(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user)
):
    posts = db.query(models.Post)\
              .filter(models.Post.owner_id == user_id)\
              .order_by(models.Post.created_at.desc())\
              .all()

    return [build_post_response(post, current_user) for post in posts]
@router.get("/my", response_model=List[schemas.PostOut])
def get_my_posts(
    limit: int = 10,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    posts = (db.query(models.Post).filter(
        models.Post.owner_id == current_user
    ).limit(limit).offset(offset).all())
        
    return [build_post_response(post, current_user) for post in posts]


# ---------------- DELETE POST ----------------

@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    from fastapi import HTTPException
    
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if post.owner_id != current_user:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")
    
    db.delete(post)
    db.commit()
    
    return {"message": "Post deleted successfully"}