from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


# ---------------- USERS ----------------

class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ---------------- POSTS ----------------

class PostCreate(BaseModel):
    content: Optional[str] = None


class PostOut(BaseModel):
    id: int
    content: Optional[str]= None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    created_at: datetime
    user_id: int
    likes_count: int
    comments_count: int
    is_liked_by_me: bool

    model_config = {
        "from_attributes": True
    }


# ---------------- LIKES ----------------

class LikeOut(BaseModel):
    post_id: int
    total_likes: int

    model_config = {
        "from_attributes": True
    }


# ---------------- COMMENTS ----------------

class CommentCreate(BaseModel):
    content: str


class CommentOut(BaseModel):
    id: int
    content: str
    user_id: int
    post_id: int
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


# ---------------- NOTIFICATIONS ----------------

class NotificationBase(BaseModel):
    message: str


class NotificationCreate(NotificationBase):
    user_id: int


class NotificationResponse(NotificationBase):
    id: int
    user_id: int
    is_read: bool
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


# ---------------- FOLLOW ----------------

class FollowBase(BaseModel):
    follower_id: int
    following_id: int


class FollowCreate(BaseModel):
    following_id: int


class FollowResponse(FollowBase):
    id: int
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
class PostResponse(BaseModel):
    id: int
    content: str
    created_at: datetime
    user_id: int
    likes_count: int
    comments_count: int
    is_liked_by_me: bool

    model_config = { "from_attributes": True
    }
