import numpy as np
from app.services.quantum_engine import QuantumEngine

def test_hadamard_single_qubit():
    engine = QuantumEngine(num_qubits=1)
    res = engine.execute_circuit([{"gate": "H", "target": 0}])
    probs = res["probabilities"]
    assert abs(probs.get("0", 0) - 0.5) < 1e-3
    assert abs(probs.get("1", 0) - 0.5) < 1e-3
    
    # Check Bloch vector
    bloch = res["bloch_vectors"][0]
    assert abs(bloch["x"] - 1.0) < 1e-2
    assert abs(bloch["z"]) < 1e-2

def test_pauli_x_gate():
    engine = QuantumEngine(num_qubits=1)
    res = engine.execute_circuit([{"gate": "X", "target": 0}])
    probs = res["probabilities"]
    assert probs.get("1", 0) == 1.0
    bloch = res["bloch_vectors"][0]
    assert abs(bloch["z"] - (-1.0)) < 1e-2

def test_bell_state_generation():
    engine = QuantumEngine(num_qubits=2)
    # Apply H on qubit 0, then CX control=0, target=1
    res = engine.execute_circuit([
        {"gate": "H", "target": 0},
        {"gate": "CX", "control": 0, "target": 1}
    ])
    probs = res["probabilities"]
    # Expect 50% |00> and 50% |11>
    assert abs(probs.get("00", 0) - 0.5) < 1e-3
    assert abs(probs.get("11", 0) - 0.5) < 1e-3
    assert probs.get("01", 0) == 0.0
    assert probs.get("10", 0) == 0.0

def test_qiskit_code_parser():
    code = """
qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)
"""
    num_q, gates = QuantumEngine.parse_qiskit_code(code)
    assert num_q == 2
    assert len(gates) == 2
    assert gates[0]["gate"] == "H" and gates[0]["target"] == 0
    assert gates[1]["gate"] == "CX" and gates[1]["control"] == 0 and gates[1]["target"] == 1
