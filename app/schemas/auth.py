from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    email: str
    name: str
    password: str
    role: Optional[str] = "student"

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: str
    avatar: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
