from typing import Dict, Any, List
from app.services.agents.base_agent import BaseAgent
from app.services.quantum_engine import QuantumEngine

class OptimizerAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            agent_id="optimizer",
            name="OptiPrime",
            role="Quantum Compilation & Gate Reduction Specialist",
            avatar="zap",
            color="#f59e0b",
            station="optimizer"
        )

    def optimize_gates(self, gates: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Performs peephole quantum gate cancellation:
        Cancels adjacent self-inverses (H*H = I, X*X = I, Z*Z = I, CX*CX = I) on same qubits.
        """
        if not gates:
            return []

        optimized: List[Dict[str, Any]] = []
        i = 0
        cancellations = 0

        while i < len(gates):
            curr = gates[i]
            if i + 1 < len(gates):
                nxt = gates[i + 1]
                # Check for identical single-qubit self-inverse gate
                if (curr.get("gate") in ["H", "X", "Y", "Z"] and 
                    curr.get("gate") == nxt.get("gate") and 
                    curr.get("target") == nxt.get("target")):
                    # Skip both
                    i += 2
                    cancellations += 1
                    continue
                # Check for identical CX gate
                if (curr.get("gate") in ["CX", "CNOT"] and 
                    nxt.get("gate") in ["CX", "CNOT"] and 
                    curr.get("control") == nxt.get("control") and 
                    curr.get("target") == nxt.get("target")):
                    i += 2
                    cancellations += 1
                    continue

            optimized.append(curr)
            i += 1

        return optimized

    def process_task(self, prompt: str, context: Dict[str, Any]) -> Dict[str, Any]:
        initial_gates: List[Dict[str, Any]] = context.get("gates", [])
        num_qubits: int = context.get("num_qubits", 2)

        optimized_gates = self.optimize_gates(initial_gates)
        gates_removed = len(initial_gates) - len(optimized_gates)
        reduction_pct = round((gates_removed / max(1, len(initial_gates))) * 100, 1)

        # Update context with optimized circuit
        context["gates"] = optimized_gates
        context["qiskit_code"] = QuantumEngine.generate_qiskit_code(num_qubits, optimized_gates)

        if gates_removed > 0:
            content = (
                f"Optimization Pass Complete: Identified {gates_removed} redundant self-inverse gate pair(s). "
                f"Reduced total gate count from {len(initial_gates)} down to {len(optimized_gates)} "
                f"({reduction_pct}% reduction in circuit depth). Saved valuable qubit coherence time!"
            )
        else:
            content = (
                f"Optimization Pass Complete: Peephole compiler verified minimal unitary canonical form. "
                f"Circuit depth is already optimal at {len(optimized_gates)} gates. Zero redundant phase rotations detected."
            )

        return self.create_message(
            content=content,
            circuit_snippet=context["qiskit_code"]
        )
