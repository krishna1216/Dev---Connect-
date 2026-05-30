from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models
from app.auth import get_current_user
from typing import List
from app.schemas import NotificationResponse

router = APIRouter(prefix="/notifications", tags=["Notifications"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🔔 Get my notification
@router.get("/", response_model=List[NotificationResponse])
def get_notifications(current_user: int = Depends(get_current_user), db: Session = Depends(get_db)):
    notifications = db.query(models.Notification).filter(
        models.Notification.user_id == current_user
    ).order_by(models.Notification.created_at.desc()).all()

    return notifications


# ✅ Mark notification as read
@router.put("/{notification_id}/read")
def mark_notification_read(notification_id: int, current_user: int = Depends(get_current_user), db: Session = Depends(get_db)):
    notification = db.query(models.Notification).filter(
        models.Notification.id == notification_id,
        models.Notification.user_id == current_user
    ).first()

    if notification:
        notification.is_read = True
        db.commit()

    return {"message": "Notification marked as read"}
