import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from app.database import Base

class SavedCircuit(Base):
    __tablename__ = "saved_circuits"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    circuit_json = Column(Text, nullable=False)  # JSON representation of gates
    qiskit_code = Column(Text, nullable=True)
    num_qubits = Column(Integer, default=2)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
