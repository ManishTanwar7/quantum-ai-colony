import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.database import Base

class MissionLog(Base):
    __tablename__ = "mission_logs"

    id = Column(Integer, primary_key=True, index=True)
    mission_id = Column(String(100), index=True, nullable=False)
    title = Column(String(255), nullable=False)
    prompt = Column(Text, nullable=False)
    colony_summary = Column(Text, nullable=True)
    consensus_circuit = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
