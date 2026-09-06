from typing import Dict, Any
from app.services.agents.base_agent import BaseAgent

class ProfessorAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            agent_id="professor",
            name="Prof. Evelyn Vance",
            role="Quantum Theory & Axiom Specialist",
            avatar="atom",
            color="#06b6d4",
            station="theory"
        )

    def process_task(self, prompt: str, context: Dict[str, Any]) -> Dict[str, Any]:
        prompt_lower = prompt.lower()
        
        if "grover" in prompt_lower:
            explanation = (
                "Theoretical Foundation: Grover's Search Algorithm achieves a quadratic speedup "
                "\\(O(\\sqrt{N})\\) over classical searches. We begin in uniform superposition "
                "\\(|\\psi\\rangle = \\frac{1}{2}(|00\\rangle + |01\\rangle + |10\\rangle + |11\\rangle)\\). "
                "The algorithm applies two key unitaries: (1) an Oracle \\(U_\\omega = I - 2|\\omega\\rangle\\langle\\omega|\\) "
                "that inverts the phase of the marked state, and (2) the Diffusion Operator "
                "\\(U_s = 2|s\\rangle\\langle s| - I\\) which inverts amplitudes about their mean."
            )
        elif "teleport" in prompt_lower:
            explanation = (
                "Theoretical Foundation: Quantum Teleportation transfers an unknown state \\(|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle\\) "
                "using an entangled Bell pair \\(|\\Phi^+\\rangle_{AB} = \\frac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)\\) "
                "and two classical bits. By performing a Bell-basis measurement on Alice's qubit and the unknown state, "
                "Bob can reconstruct \\(|\\psi\\rangle\\) with deterministic Pauli corrections \\(Z^{M_1} X^{M_2}\\)."
            )
        elif "bell" in prompt_lower or "entangle" in prompt_lower:
            explanation = (
                "Theoretical Foundation: Bell states represent maximally entangled two-qubit states. "
                "Applying a Hadamard gate creates superposition: \\(H|0\\rangle = \\frac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle)\\). "
                "Following with an entangling CNOT gate transforms \\(\\frac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle) \\otimes |0\\rangle\\) "
                "into the EPR pair \\(|\\Phi^+\\rangle = \\frac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)\\). "
                "Measurement of one qubit immediately collapses the other."
            )
        elif "fourier" in prompt_lower or "qft" in prompt_lower:
            explanation = (
                "Theoretical Foundation: The Quantum Fourier Transform (QFT) is the quantum analogue of the discrete Fourier transform. "
                "It maps computational basis states \\(|j\\rangle \\mapsto \\frac{1}{\\sqrt{N}}\\sum_{k=0}^{N-1} e^{2\\pi i j k / N}|k\\rangle\\). "
                "Constructed via cascading Hadamard gates and controlled phase rotations \\(R_k = \\begin{pmatrix} 1 & 0 \\\\ 0 & e^{2\\pi i / 2^k} \\end{pmatrix}\\)."
            )
        else:
            explanation = (
                f"Theoretical Analysis for '{prompt}': Quantum state evolution is governed by unitary transformations "
                "\\(U^\\dagger U = I\\) within a complex Hilbert space \\(\\mathcal{H}^{\\otimes n}\\). "
                "We must initialize computational basis states in \\(|0\\rangle^{\\otimes n}\\), generate necessary coherence "
                "using single-qubit rotations, and generate entanglement to leverage quantum interference."
            )

        return self.create_message(explanation)
