from pydantic import BaseModel
from typing import List, Dict, Optional, Any

class GateOperation(BaseModel):
    gate: str              # H, X, Y, Z, S, T, CX, CZ, SWAP, RX, RY, RZ, MEASURE
    target: int            # Target qubit index (0-indexed)
    control: Optional[int] = None # Control qubit for 2-qubit gates
    param: Optional[float] = None # Rotation angle (radians) for RX, RY, RZ
    step: Optional[int] = 0       # Time step in circuit grid

class BlochVector(BaseModel):
    qubit: int
    x: float
    y: float
    z: float
    theta: float
    phi: float

class CircuitRunRequest(BaseModel):
    num_qubits: int = 2
    gates: List[GateOperation]
    shots: int = 1024
    qiskit_code: Optional[str] = None

class CircuitRunResponse(BaseModel):
    num_qubits: int
    statevector: List[Dict[str, float]] # [{real: float, imag: float}, ...]
    probabilities: Dict[str, float]      # {"00": 0.5, "11": 0.5}
    counts: Dict[str, int]               # {"00": 512, "11": 512}
    bloch_vectors: List[BlochVector]
    circuit_depth: int
    gate_count: int
    qiskit_code: str
    timeline_steps: Optional[List[Dict[str, Any]]] = None

class SavedCircuitCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    circuit_json: str
    qiskit_code: Optional[str] = ""
    num_qubits: int = 2

class SavedCircuitResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str]
    circuit_json: str
    qiskit_code: Optional[str]
    num_qubits: int

    class Config:
        from_attributes = True
