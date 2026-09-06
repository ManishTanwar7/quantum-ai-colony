import datetime
from sqlalchemy import Column, Integer, String, Boolean, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class LessonProgress(Base):
    __tablename__ = "lesson_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    lesson_id = Column(String(100), nullable=False, index=True)
    completed = Column(Boolean, default=False)
    quiz_score = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class ChallengeSubmission(Base):
    __tablename__ = "challenge_submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    challenge_id = Column(String(100), nullable=False, index=True)
    code = Column(Text, nullable=True)
    circuit_json = Column(Text, nullable=True)
    passed = Column(Boolean, default=False)
    fidelity = Column(Float, default=0.0)
    feedback = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
