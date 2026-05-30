from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models
from app.auth import get_current_user
from app.schemas import FollowResponse

router = APIRouter(prefix="/follows", tags=["Follows"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ✅ Follow a user
@router.post("/{user_id}", response_model=FollowResponse)
def follow_user(user_id: int, current_user: int = Depends(get_current_user), db: Session = Depends(get_db)):
    if user_id == current_user:
        raise HTTPException(status_code=400, detail="You cannot follow yourself")

    target_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    existing_follow = db.query(models.Follow).filter(
        models.Follow.follower_id == current_user,
        models.Follow.following_id == user_id
    ).first()

    if existing_follow:
        raise HTTPException(status_code=400, detail="Already following this user")

    follow = models.Follow(follower_id=current_user, following_id=user_id)
    db.add(follow)

    # 🔔 Create notification
    notification = models.Notification(
        user_id=user_id,
        message=f"User {current_user} started following you"
    )
    db.add(notification)

    db.commit()

    return {"message": "Followed successfully"}
    

# ❌ Unfollow a user
@router.delete("/{user_id}")
def unfollow_user(user_id: int, current_user: int = Depends(get_current_user), db: Session = Depends(get_db)):
    follow = db.query(models.Follow).filter(
        models.Follow.follower_id == current_user,
        models.Follow.following_id == user_id
    ).first()

    if not follow:
        raise HTTPException(status_code=404, detail="You are not following this user")

    db.delete(follow)
    db.commit()

    return {"message": "Unfollowed successfully"}
