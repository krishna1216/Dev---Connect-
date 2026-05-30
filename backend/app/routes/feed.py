from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import SessionLocal
from app import models
from app.auth import get_current_user
from app.schemas import PostOut

router = APIRouter(prefix="/feed", tags=["Feed"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


from sqlalchemy import func, select

@router.get("/", response_model=List[PostOut])
def get_feed(
    page: int = 1,
    limit: int = 5,
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    offset = (page - 1) * limit

    # Subquery: users I follow
    following_subquery = (
        db.query(models.Follow.following_id)
        .filter(models.Follow.follower_id == current_user)
        .subquery()
    )

    # Subquery: check if liked by me
    liked_subquery = (
        db.query(models.Like.post_id)
        .filter(models.Like.user_id == current_user)
        .subquery()
    )

    posts = (
        db.query(
            models.Post,
            func.count(models.Like.id).label("likes_count"),
            func.count(models.Comment.id).label("comments_count"),
            func.count(models.Like.id)
                .filter(models.Like.user_id == current_user)
                .label("is_liked_by_me")
        )
        .outerjoin(models.Like, models.Like.post_id == models.Post.id)
        .outerjoin(models.Comment, models.Comment.post_id == models.Post.id)
        .filter(models.Post.owner_id.in_(following_subquery))
        .group_by(models.Post.id)
        .order_by(models.Post.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    result = []

    for post, likes_count, comments_count, is_liked in posts:
        image_url = None
        video_url = None

        if post.media_url:
            if post.media_url.lower().endswith((".jpg", ".jpeg", ".png", ".gif")):
                image_url = post.media_url
            elif post.media_url.lower().endswith((".mp4", ".mov", ".avi")):
                video_url = post.media_url

        result.append({
            "id": post.id,
            "content": post.content,
            "image_url": image_url,
            "video_url": video_url,
            "created_at": post.created_at,
            "user_id": post.owner_id,
            "likes_count": likes_count,
            "comments_count": comments_count,
            "is_liked_by_me": bool(is_liked)
        })

    return result
