from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models, schemas
from app.auth import get_current_user

router = APIRouter(prefix="/comments", tags=["Comments"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
@router.post("/{post_id}", response_model=schemas.CommentOut)
def add_comment(post_id: int, comment: schemas.CommentCreate,
                db: Session = Depends(get_db),
                user_id: int = Depends(get_current_user)):

    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    new_comment = models.Comment(
        content=comment.content,
        user_id=user_id,
        post_id=post_id
    )

    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment
@router.get("/{post_id}", response_model=list[schemas.CommentOut])
def get_comments(post_id: int, db: Session = Depends(get_db)):
    return db.query(models.Comment).filter(models.Comment.post_id == post_id).all()

@router.delete("/{comment_id}")
def delete_comment(comment_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    if comment.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")
    
    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted successfully"}
