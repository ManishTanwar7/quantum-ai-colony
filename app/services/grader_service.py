import math
from typing import Dict, Any, Optional
from app.services.quantum_engine import QuantumEngine

class QuantumGraderService:
    @staticmethod
    def grade_challenge(
        challenge_id: str,
        expected_probabilities: Dict[str, float],
        max_gates: int,
        circuit_data: Optional[Dict[str, Any]] = None,
        qiskit_code: Optional[str] = None
    ) -> Dict[str, Any]:
        num_qubits = 2
        gates = []

        if circuit_data and "gates" in circuit_data:
            num_qubits = circuit_data.get("num_qubits", 2)
            gates = circuit_data.get("gates", [])
        elif qiskit_code:
            num_qubits, gates = QuantumEngine.parse_qiskit_code(qiskit_code)

        if not gates:
            return {
                "passed": False,
                "fidelity": 0.0,
                "message": "Empty circuit submitted.",
                "feedback": "No gates were detected in your submission. Construct your circuit using the visual builder or code editor.",
                "actual_probabilities": {},
                "expected_probabilities": expected_probabilities
            }

        if len(gates) > max_gates:
            return {
                "passed": False,
                "fidelity": 0.0,
                "message": f"Circuit exceeds gate constraint: {len(gates)} gates used (maximum allowed: {max_gates}).",
                "feedback": "Optimize your circuit to use fewer quantum operations. Consult the Optimizer AI in the Colony Station!",
                "actual_probabilities": {},
                "expected_probabilities": expected_probabilities
            }

        try:
            engine = QuantumEngine(num_qubits=num_qubits)
            res = engine.execute_circuit(gates)
            actual_probs = res["probabilities"]
        except Exception as e:
            return {
                "passed": False,
                "fidelity": 0.0,
                "message": f"Execution error: {str(e)}",
                "feedback": "The quantum statevector simulator encountered a mathematical error executing your gate sequence.",
                "actual_probabilities": {},
                "expected_probabilities": expected_probabilities
            }

        # Calculate classical Bhattacharyya fidelity F = sum(sqrt(p_expected * p_actual))
        all_keys = set(expected_probabilities.keys()).union(set(actual_probs.keys()))
        fidelity = 0.0
        for k in all_keys:
            p_exp = expected_probabilities.get(k, 0.0)
            p_act = actual_probs.get(k, 0.0)
            fidelity += math.sqrt(p_exp * p_act)

        fidelity = round(min(1.0, max(0.0, fidelity)), 4)
        passed = fidelity >= 0.98

        if passed:
            feedback = (
                f"Excellent work! Your circuit achieved {round(fidelity*100, 1)}% target state fidelity. "
                f"All quantum basis state amplitudes align with the expected theoretical distribution."
            )
        else:
            feedback = (
                f"Fidelity reached {round(fidelity*100, 1)}% (threshold is 98%). "
                f"Expected states: {expected_probabilities}. Your states: {actual_probs}. "
                f"Check relative phases and entangling gate controls."
            )

        return {
            "passed": passed,
            "fidelity": fidelity,
            "message": "Challenge Passed! Quantum state synthesized successfully." if passed else "Challenge Incomplete. Output state divergence detected.",
            "feedback": feedback,
            "actual_probabilities": actual_probs,
            "expected_probabilities": expected_probabilities
        }
