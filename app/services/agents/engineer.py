from typing import Dict, Any, List
from app.services.agents.base_agent import BaseAgent
from app.services.quantum_engine import QuantumEngine

class EngineerAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            agent_id="engineer",
            name="Devin Matrix",
            role="Lead Circuit Architect & Hardware Synthesizer",
            avatar="cpu",
            color="#10b981",
            station="foundry"
        )

    def process_task(self, prompt: str, context: Dict[str, Any]) -> Dict[str, Any]:
        prompt_lower = prompt.lower()
        num_qubits = 2
        gates: List[Dict[str, Any]] = []

        if "grover" in prompt_lower:
            num_qubits = 2
            # 2-qubit Grover searching for |11>
            # 1. State preparation
            gates = [
                {"gate": "H", "target": 0},
                {"gate": "H", "target": 1},
                # 2. Oracle for |11>: Controlled-Z
                {"gate": "CZ", "control": 0, "target": 1},
                # 3. Diffusion operator: H on all, X on all, CZ, X on all, H on all
                {"gate": "H", "target": 0},
                {"gate": "H", "target": 1},
                {"gate": "X", "target": 0},
                {"gate": "X", "target": 1},
                {"gate": "CZ", "control": 0, "target": 1},
                {"gate": "X", "target": 0},
                {"gate": "X", "target": 1},
                {"gate": "H", "target": 0},
                {"gate": "H", "target": 1},
                # Redundant gate to give optimizer something to optimize
                {"gate": "H", "target": 0},
                {"gate": "H", "target": 0},
            ]
            content = (
                "Hardware Synthesis Complete: Constructed a 2-qubit Grover Search circuit targeting state |11>. "
                "Circuit layout features uniform Hadamard initialization, a phase oracle implemented via CZ, "
                "and an inversion-about-mean diffusion block."
            )
        elif "teleport" in prompt_lower:
            num_qubits = 3
            # 3-qubit teleportation: q0=input, q1=Alice EPR, q2=Bob EPR
            gates = [
                {"gate": "H", "target": 0},  # Prepare arbitrary state on q0
                {"gate": "H", "target": 1},  # Create Bell pair on q1, q2
                {"gate": "CX", "control": 1, "target": 2},
                # Alice Bell measurement
                {"gate": "CX", "control": 0, "target": 1},
                {"gate": "H", "target": 0},
                # Bob corrections
                {"gate": "CX", "control": 1, "target": 2},
                {"gate": "CZ", "control": 0, "target": 2},
            ]
            content = (
                "Hardware Synthesis Complete: Synthesized a 3-qubit quantum teleportation architecture. "
                "Includes EPR resource distribution across qubits 1 & 2, Alice's Bell-basis projection "
                "on qubits 0 & 1, and feed-forward unitary corrections on Bob's qubit 2."
            )
        elif "bell" in prompt_lower or "entangle" in prompt_lower:
            num_qubits = 2
            gates = [
                {"gate": "H", "target": 0},
                {"gate": "CX", "control": 0, "target": 1},
                # Redundant gate for optimization demo
                {"gate": "X", "target": 1},
                {"gate": "X", "target": 1}
            ]
            content = (
                "Hardware Synthesis Complete: Assembled standard EPR Bell pair generator circuit. "
                "Qubit 0 passes through Hadamard gate (transforming |0> -> (|0>+|1>)/sqrt(2)), "
                "then acts as the control qubit in a CNOT targeting qubit 1."
            )
        elif "fourier" in prompt_lower or "qft" in prompt_lower:
            num_qubits = 3
            gates = [
                {"gate": "H", "target": 0},
                {"gate": "RZ", "target": 0, "param": 1.5708},
                {"gate": "H", "target": 1},
                {"gate": "RZ", "target": 1, "param": 0.7854},
                {"gate": "H", "target": 2},
                {"gate": "SWAP", "control": 0, "target": 2}
            ]
            content = (
                "Hardware Synthesis Complete: Synthesized 3-qubit Quantum Fourier Transform (QFT) circuit. "
                "Interleaved Hadamard transformations with dyadic controlled phase shifts followed by end-stage bit reversal SWAP."
            )
        else:
            num_qubits = 2
            gates = [
                {"gate": "H", "target": 0},
                {"gate": "RY", "target": 1, "param": 1.047},
                {"gate": "CX", "control": 0, "target": 1}
            ]
            content = (
                f"Hardware Synthesis Complete: Assembled dynamic gate network for '{prompt}'. "
                f"Configured {num_qubits} qubits with superposition seeding and coherent coupling."
            )

        qiskit_code = QuantumEngine.generate_qiskit_code(num_qubits, gates)
        context["num_qubits"] = num_qubits
        context["gates"] = gates
        context["qiskit_code"] = qiskit_code

        return self.create_message(
            content=content,
            circuit_snippet=qiskit_code
        )
