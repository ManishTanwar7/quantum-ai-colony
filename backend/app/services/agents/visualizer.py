from typing import Dict, Any
from app.services.agents.base_agent import BaseAgent
from app.services.quantum_engine import QuantumEngine

class VisualizerAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            agent_id="visualizer",
            name="Iris Quantum",
            role="Quantum State & Geometric Mapper",
            avatar="eye",
            color="#8b5cf6",
            station="visualizer"
        )

    def process_task(self, prompt: str, context: Dict[str, Any]) -> Dict[str, Any]:
        gates = context.get("gates", [])
        num_qubits = context.get("num_qubits", 2)

        engine = QuantumEngine(num_qubits=num_qubits)
        execution_result = engine.execute_circuit(gates)
        probs = execution_result["probabilities"]
        bloch_vectors = execution_result["bloch_vectors"]

        # Summarize most probable basis states
        sorted_probs = sorted(probs.items(), key=lambda item: item[1], reverse=True)
        top_states = [f"|{state}⟩ ({int(p*100)}%)" for state, p in sorted_probs if p > 0.01]
        top_str = ", ".join(top_states) if top_states else "Equiprobable"

        bloch_summary = []
        for b in bloch_vectors:
            bloch_summary.append(f"Qubit {b['qubit']}: (x={b['x']}, y={b['y']}, z={b['z']})")
        bloch_str = "; ".join(bloch_summary)

        content = (
            f"Quantum State Geometry Synthesized: Computed Hilbert space projection across {num_qubits} qubits. "
            f"Dominant measurement outcomes: {top_str}. "
            f"Bloch sphere trajectories mapped: {bloch_str}. Ready for 3D sphere render & probability timeline."
        )

        bloch_data = {
            "probabilities": probs,
            "bloch_vectors": bloch_vectors,
            "timeline_steps": execution_result["timeline_steps"]
        }

        context["simulation_result"] = bloch_data

        return self.create_message(
            content=content,
            bloch_data=bloch_data
        )
