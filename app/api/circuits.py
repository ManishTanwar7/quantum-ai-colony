import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.circuit import SavedCircuit
from app.schemas.circuit import (
    CircuitRunRequest,
    CircuitRunResponse,
    SavedCircuitCreate,
    SavedCircuitResponse,
    BlochVector
)
from app.services.auth_service import get_current_user
from app.services.quantum_engine import QuantumEngine

router = APIRouter(prefix="/circuits", tags=["Quantum Circuits"])

@router.post("/run", response_model=CircuitRunResponse)
def run_circuit(req: CircuitRunRequest):
    num_qubits = req.num_qubits
    gates = [g.model_dump() for g in req.gates]

    # If qiskit_code provided without gates, parse it
    if req.qiskit_code and not gates:
        num_qubits, gates = QuantumEngine.parse_qiskit_code(req.qiskit_code)

    try:
        engine = QuantumEngine(num_qubits=num_qubits)
        result = engine.execute_circuit(gates)
        counts = engine.sample_counts(shots=req.shots or 1024)
        qiskit_code = req.qiskit_code or QuantumEngine.generate_qiskit_code(num_qubits, gates)

        bloch_vectors = [
            BlochVector(
                qubit=b["qubit"],
                x=b["x"],
                y=b["y"],
                z=b["z"],
                theta=b["theta"],
                phi=b["phi"]
            )
            for b in result["bloch_vectors"]
        ]

        return CircuitRunResponse(
            num_qubits=num_qubits,
            statevector=result["statevector"],
            probabilities=result["probabilities"],
            counts=counts,
            bloch_vectors=bloch_vectors,
            circuit_depth=len(gates),
            gate_count=len(gates),
            qiskit_code=qiskit_code,
            timeline_steps=result["timeline_steps"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Quantum execution failed: {str(e)}"
        )

@router.post("/save", response_model=SavedCircuitResponse)
def save_circuit(
    circuit_data: SavedCircuitCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sc = SavedCircuit(
        user_id=user.id,
        title=circuit_data.title,
        description=circuit_data.description,
        circuit_json=circuit_data.circuit_json,
        qiskit_code=circuit_data.qiskit_code,
        num_qubits=circuit_data.num_qubits
    )
    db.add(sc)
    db.commit()
    db.refresh(sc)
    return sc

@router.get("/list", response_model=List[SavedCircuitResponse])
def list_circuits(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(SavedCircuit).filter(SavedCircuit.user_id == user.id).all()

@router.delete("/{circuit_id}")
def delete_circuit(
    circuit_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sc = db.query(SavedCircuit).filter(SavedCircuit.id == circuit_id, SavedCircuit.user_id == user.id).first()
    if not sc:
        raise HTTPException(status_code=404, detail="Circuit not found")
    db.delete(sc)
    db.commit()
    return {"message": "Circuit deleted successfully"}
