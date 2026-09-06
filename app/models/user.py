import datetime
from sqlalchemy import Column, Integer, String, DateTime, Enum
import enum
from app.database import Base

class UserRole(str, enum.Enum):
    STUDENT = "student"
    INSTRUCTOR = "instructor"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default=UserRole.STUDENT.value, nullable=False)
    avatar = Column(String(255), default="qubit-bot")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
