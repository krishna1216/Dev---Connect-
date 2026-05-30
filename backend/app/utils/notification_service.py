from app.database import SessionLocal
from app import models

def create_notifications_for_followers(post_id: int):
    db = SessionLocal()

    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        db.close()
        return

    followers = db.query(models.Follow).filter(
        models.Follow.following_id == post.user_id
    ).all()

    for follower in followers:
        notification = models.Notification(
            user_id=follower.follower_id,
            message=f"User {post.user_id} created a new post"
        )
        db.add(notification)

    db.commit()
    db.close()
