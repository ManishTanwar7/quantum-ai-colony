import math
import cmath
import re
from typing import List, Dict, Tuple, Any, Optional
import numpy as np

# Single qubit unitary gates
I_GATE = np.array([[1, 0], [0, 1]], dtype=complex)
X_GATE = np.array([[0, 1], [1, 0]], dtype=complex)
Y_GATE = np.array([[0, -1j], [1j, 0]], dtype=complex)
Z_GATE = np.array([[1, 0], [0, -1]], dtype=complex)
H_GATE = np.array([[1, 1], [1, -1]], dtype=complex) / np.sqrt(2)
S_GATE = np.array([[1, 0], [0, 1j]], dtype=complex)
T_GATE = np.array([[1, 0], [0, np.exp(1j * np.pi / 4)]], dtype=complex)

def rx_gate(theta: float) -> np.ndarray:
    return np.array([
        [np.cos(theta / 2), -1j * np.sin(theta / 2)],
        [-1j * np.sin(theta / 2), np.cos(theta / 2)]
    ], dtype=complex)

def ry_gate(theta: float) -> np.ndarray:
    return np.array([
        [np.cos(theta / 2), -np.sin(theta / 2)],
        [np.sin(theta / 2), np.cos(theta / 2)]
    ], dtype=complex)

def rz_gate(theta: float) -> np.ndarray:
    return np.array([
        [np.exp(-1j * theta / 2), 0],
        [0, np.exp(1j * theta / 2)]
    ], dtype=complex)

class QuantumEngine:
    def __init__(self, num_qubits: int = 2):
        if num_qubits < 1 or num_qubits > 8:
            raise ValueError("Number of qubits must be between 1 and 8")
        self.num_qubits = num_qubits
        self.dim = 2 ** num_qubits
        self.state = np.zeros(self.dim, dtype=complex)
        self.state[0] = 1.0  # Initial state |0...0>

    def reset(self):
        self.state = np.zeros(self.dim, dtype=complex)
        self.state[0] = 1.0

    def apply_single_qubit_gate(self, gate_matrix: np.ndarray, target: int):
        """Applies single-qubit gate to the target qubit (0-indexed)."""
        if target < 0 or target >= self.num_qubits:
            raise ValueError(f"Target qubit {target} out of range [0, {self.num_qubits - 1}]")

        # Build full 2^N x 2^N operator using Kronecker product
        # Convention: Qubit 0 is the least significant bit (LSB)
        op = np.array([[1]], dtype=complex)
        for i in range(self.num_qubits):
            if i == target:
                op = np.kron(gate_matrix, op)
            else:
                op = np.kron(I_GATE, op)

        self.state = op @ self.state

    def apply_two_qubit_gate(self, gate_type: str, control: int, target: int):
        """Applies two-qubit gate (CX, CZ, SWAP) between control and target."""
        if control == target:
            raise ValueError("Control and target qubits cannot be identical")
        if control < 0 or control >= self.num_qubits or target < 0 or target >= self.num_qubits:
            raise ValueError("Qubit indices out of range")

        # Projectors for control qubit
        p0 = np.array([[1, 0], [0, 0]], dtype=complex)
        p1 = np.array([[0, 0], [0, 1]], dtype=complex)

        if gate_type.upper() in ["CX", "CNOT"]:
            target_op0 = I_GATE
            target_op1 = X_GATE
        elif gate_type.upper() == "CZ":
            target_op0 = I_GATE
            target_op1 = Z_GATE
        elif gate_type.upper() == "SWAP":
            # SWAP = CX(c, t) CX(t, c) CX(c, t)
            self.apply_two_qubit_gate("CX", control, target)
            self.apply_two_qubit_gate("CX", target, control)
            self.apply_two_qubit_gate("CX", control, target)
            return
        else:
            raise ValueError(f"Unsupported 2-qubit gate: {gate_type}")

        # Part 1: Control is |0> -> Target has target_op0 (Identity)
        op_part0 = np.array([[1]], dtype=complex)
        for i in range(self.num_qubits):
            if i == control:
                op_part0 = np.kron(p0, op_part0)
            elif i == target:
                op_part0 = np.kron(target_op0, op_part0)
            else:
                op_part0 = np.kron(I_GATE, op_part0)

        # Part 2: Control is |1> -> Target has target_op1 (X or Z)
        op_part1 = np.array([[1]], dtype=complex)
        for i in range(self.num_qubits):
            if i == control:
                op_part1 = np.kron(p1, op_part1)
            elif i == target:
                op_part1 = np.kron(target_op1, op_part1)
            else:
                op_part1 = np.kron(I_GATE, op_part1)

        full_op = op_part0 + op_part1
        self.state = full_op @ self.state

    def execute_circuit(self, gates: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Executes a sequence of gate operations and records step-by-step state.
        Each gate dict: {gate: str, target: int, control: Optional[int], param: Optional[float]}
        """
        self.reset()
        timeline_steps = []

        # Record initial state
        timeline_steps.append({
            "step": 0,
            "gate": "INIT",
            "target": None,
            "state_summary": self.get_probabilities()
        })

        step_idx = 1
        for g in gates:
            gate_name = g.get("gate", "").upper()
            target = g.get("target", 0)
            control = g.get("control")
            param = g.get("param", 0.0)

            if gate_name == "H":
                self.apply_single_qubit_gate(H_GATE, target)
            elif gate_name == "X":
                self.apply_single_qubit_gate(X_GATE, target)
            elif gate_name == "Y":
                self.apply_single_qubit_gate(Y_GATE, target)
            elif gate_name == "Z":
                self.apply_single_qubit_gate(Z_GATE, target)
            elif gate_name == "S":
                self.apply_single_qubit_gate(S_GATE, target)
            elif gate_name == "T":
                self.apply_single_qubit_gate(T_GATE, target)
            elif gate_name == "RX":
                self.apply_single_qubit_gate(rx_gate(param or 0.0), target)
            elif gate_name == "RY":
                self.apply_single_qubit_gate(ry_gate(param or 0.0), target)
            elif gate_name == "RZ":
                self.apply_single_qubit_gate(rz_gate(param or 0.0), target)
            elif gate_name in ["CX", "CNOT"]:
                ctrl = control if control is not None else (0 if target != 0 else 1)
                self.apply_two_qubit_gate("CX", ctrl, target)
            elif gate_name == "CZ":
                ctrl = control if control is not None else (0 if target != 0 else 1)
                self.apply_two_qubit_gate("CZ", ctrl, target)
            elif gate_name == "SWAP":
                ctrl = control if control is not None else (0 if target != 0 else 1)
                self.apply_two_qubit_gate("SWAP", ctrl, target)
            elif gate_name in ["M", "MEASURE"]:
                # Measurement in standard basis does not change pure state probabilities
                pass

            timeline_steps.append({
                "step": step_idx,
                "gate": gate_name,
                "target": target,
                "control": control,
                "state_summary": self.get_probabilities()
            })
            step_idx += 1

        return {
            "statevector": self.get_statevector_formatted(),
            "probabilities": self.get_probabilities(),
            "bloch_vectors": self.get_bloch_vectors(),
            "timeline_steps": timeline_steps
        }

    def get_probabilities(self) -> Dict[str, float]:
        """Returns {basis_state_string: probability}."""
        probs = np.abs(self.state) ** 2
        result = {}
        for i in range(self.dim):
            # Format as binary string e.g. "00", "01", "10", "11"
            # Little endian: qubit 0 is rightmost bit
            bin_str = bin(i)[2:].zfill(self.num_qubits)
            prob_val = float(probs[i])
            if prob_val > 1e-6:
                result[bin_str] = round(prob_val, 4)
            else:
                result[bin_str] = 0.0
        return result

    def sample_counts(self, shots: int = 1024) -> Dict[str, int]:
        """Simulates quantum shot measurements."""
        probs = np.abs(self.state) ** 2
        # Normalize in case of tiny numerical drift
        probs = probs / np.sum(probs)
        samples = np.random.choice(range(self.dim), size=shots, p=probs)
        counts = {bin(i)[2:].zfill(self.num_qubits): 0 for i in range(self.dim)}
        for s in samples:
            k = bin(s)[2:].zfill(self.num_qubits)
            counts[k] += 1
        return counts

    def get_bloch_vectors(self) -> List[Dict[str, Any]]:
        """
        Calculates the reduced density matrix rho_k for each qubit k,
        and computes the Bloch vector (x, y, z) and angles (theta, phi).
        """
        bloch_vectors = []
        # Full density matrix rho = |psi><psi|
        rho_full = np.outer(self.state, np.conj(self.state))

        for k in range(self.num_qubits):
            # Partial trace over all qubits except k
            # Reshape rho_full into 2N tensor
            dims = [2] * (2 * self.num_qubits)
            rho_tensor = rho_full.reshape(dims)

            # Trace out all axes except qubit k (index k and index k + num_qubits)
            # In our Kronecker convention, qubit k corresponds to axis (num_qubits - 1 - k)
            axis = self.num_qubits - 1 - k
            
            # Reduce single qubit density matrix rho_k
            rho_k = np.zeros((2, 2), dtype=complex)
            for i in range(self.dim):
                for j in range(self.dim):
                    # Check if all other qubits match between basis states i and j
                    bit_i = (i >> k) & 1
                    bit_j = (j >> k) & 1
                    # mask of other bits
                    other_mask = ~ (1 << k)
                    if (i & other_mask) == (j & other_mask):
                        rho_k[bit_i, bit_j] += rho_full[i, j]

            # Expectation values of Pauli matrices
            # X: rho[0,1] + rho[1,0] = 2 * Re(rho[0,1])
            # Y: 1j * (rho[0,1] - rho[1,0]) = 2 * Im(rho[1,0])
            # Z: rho[0,0] - rho[1,1]
            x = float(np.real(rho_k[0, 1] + rho_k[1, 0]))
            y = float(np.imag(rho_k[1, 0] - rho_k[0, 1]))
            z = float(np.real(rho_k[0, 0] - rho_k[1, 1]))

            # Clamp to unit sphere
            r = math.sqrt(x*x + y*y + z*z)
            if r > 1.0:
                x, y, z = x/r, y/r, z/r

            # Spherical coordinates
            theta = math.acos(max(-1.0, min(1.0, z)))
            phi = math.atan2(y, x)

            bloch_vectors.append({
                "qubit": k,
                "x": round(x, 4),
                "y": round(y, 4),
                "z": round(z, 4),
                "theta": round(theta, 4),
                "phi": round(phi, 4)
            })

        return bloch_vectors

    def get_statevector_formatted(self) -> List[Dict[str, float]]:
        """Returns statevector amplitudes with real and imaginary parts."""
        return [{"real": round(float(np.real(c)), 4), "imag": round(float(np.imag(c)), 4)} for c in self.state]

    @staticmethod
    def generate_qiskit_code(num_qubits: int, gates: List[Dict[str, Any]]) -> str:
        """Generates clean executable Qiskit Python code."""
        lines = [
            "from qiskit import QuantumCircuit, Aer, execute",
            "import matplotlib.pyplot as plt",
            "",
            f"# Initialize Quantum Circuit with {num_qubits} qubits",
            f"qc = QuantumCircuit({num_qubits}, {num_qubits})",
            ""
        ]
        for g in gates:
            gate = g.get("gate", "").upper()
            target = g.get("target", 0)
            control = g.get("control")
            param = g.get("param")

            if gate == "H":
                lines.append(f"qc.h({target})")
            elif gate == "X":
                lines.append(f"qc.x({target})")
            elif gate == "Y":
                lines.append(f"qc.y({target})")
            elif gate == "Z":
                lines.append(f"qc.z({target})")
            elif gate == "S":
                lines.append(f"qc.s({target})")
            elif gate == "T":
                lines.append(f"qc.t({target})")
            elif gate == "RX":
                lines.append(f"qc.rx({param or 0.0}, {target})")
            elif gate == "RY":
                lines.append(f"qc.ry({param or 0.0}, {target})")
            elif gate == "RZ":
                lines.append(f"qc.rz({param or 0.0}, {target})")
            elif gate in ["CX", "CNOT"]:
                ctrl = control if control is not None else 0
                lines.append(f"qc.cx({ctrl}, {target})")
            elif gate == "CZ":
                ctrl = control if control is not None else 0
                lines.append(f"qc.cz({ctrl}, {target})")
            elif gate == "SWAP":
                ctrl = control if control is not None else 0
                lines.append(f"qc.swap({ctrl}, {target})")
            elif gate in ["M", "MEASURE"]:
                lines.append(f"qc.measure({target}, {target})")

        lines.extend([
            "",
            "# Execute simulation on Qiskit Aer",
            "simulator = Aer.get_backend('qasm_simulator')",
            "job = execute(qc, simulator, shots=1024)",
            "result = job.result()",
            "counts = result.get_counts(qc)",
            "print('Measurement results:', counts)"
        ])
        return "\n".join(lines)

    @staticmethod
    def parse_qiskit_code(code_str: str) -> Tuple[int, List[Dict[str, Any]]]:
        """Extracts num_qubits and gate sequence from simple Qiskit code."""
        num_qubits = 2
        gates = []

        # Find QuantumCircuit(N)
        qc_match = re.search(r"QuantumCircuit\((\d+)", code_str)
        if qc_match:
            num_qubits = min(8, max(1, int(qc_match.group(1))))

        # Match single qubit gates
        single_gate_patterns = [
            (r"qc\.h\((\d+)\)", "H"),
            (r"qc\.x\((\d+)\)", "X"),
            (r"qc\.y\((\d+)\)", "Y"),
            (r"qc\.z\((\d+)\)", "Z"),
            (r"qc\.s\((\d+)\)", "S"),
            (r"qc\.t\((\d+)\)", "T"),
            (r"qc\.measure\((\d+)", "MEASURE"),
        ]

        # Match parameterized gates
        rot_patterns = [
            (r"qc\.rx\(([\d\.\-]+),\s*(\d+)\)", "RX"),
            (r"qc\.ry\(([\d\.\-]+),\s*(\d+)\)", "RY"),
            (r"qc\.rz\(([\d\.\-]+),\s*(\d+)\)", "RZ"),
        ]

        # Match 2-qubit gates
        two_gate_patterns = [
            (r"qc\.cx\((\d+),\s*(\d+)\)", "CX"),
            (r"qc\.cz\((\d+),\s*(\d+)\)", "CZ"),
            (r"qc\.swap\((\d+),\s*(\d+)\)", "SWAP"),
        ]

        for line in code_str.splitlines():
            line = line.strip()
            if not line.startswith("qc."):
                continue

            matched = False
            for pat, g_name in two_gate_patterns:
                m = re.search(pat, line)
                if m:
                    c, t = int(m.group(1)), int(m.group(2))
                    gates.append({"gate": g_name, "control": c, "target": t})
                    matched = True
                    break
            if matched:
                continue

            for pat, g_name in rot_patterns:
                m = re.search(pat, line)
                if m:
                    param, t = float(m.group(1)), int(m.group(2))
                    gates.append({"gate": g_name, "target": t, "param": param})
                    matched = True
                    break
            if matched:
                continue

            for pat, g_name in single_gate_patterns:
                m = re.search(pat, line)
                if m:
                    t = int(m.group(1))
                    gates.append({"gate": g_name, "target": t})
                    matched = True
                    break

        return num_qubits, gates
