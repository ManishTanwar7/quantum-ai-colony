import json
from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.models.circuit import SavedCircuit
from app.models.mission import MissionLog
from app.models.progress import LessonProgress, ChallengeSubmission
from app.services.auth_service import hash_password
from app.services.quantum_engine import QuantumEngine

SAMPLE_LESSONS = [
    {
        "id": "lesson-1",
        "order": 1,
        "title": "Qubits & The Bloch Sphere",
        "category": "Foundations",
        "description": "Understand the fundamental unit of quantum information and its 3D geometric representation on the Bloch sphere.",
        "content_markdown": """# Qubits & The Bloch Sphere

In classical computing, the fundamental unit of information is a bit, which can strictly exist in one of two states: **0** or **1**.

A quantum bit, or **qubit**, is a two-state quantum-mechanical system. Unlike a classical bit, a qubit can exist in a linear combination of both states simultaneously:

$$|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$$

Where $\\alpha$ and $\\beta$ are complex probability amplitudes satisfying the normalization condition:

$$|\\alpha|^2 + |\\beta|^2 = 1$$

## The Bloch Sphere Representation
Any pure single-qubit state can be mapped to a point on the surface of a unit sphere in $\\mathbb{R}^3$, termed the **Bloch Sphere**:

$$|\\psi\\rangle = \\cos\\left(\\frac{\\theta}{2}\\right)|0\\rangle + e^{i\\phi}\\sin\\left(\\frac{\\theta}{2}\\right)|1\\rangle$$

- The north pole corresponds to $|0\\rangle$ ($\theta = 0$)
- The south pole corresponds to $|1\\rangle$ ($\theta = \pi$)
- The equator represents equal superpositions with relative phase $\phi$""",
        "theory_cards": [
            {"title": "State Vector", "description": "Normalized vector in 2-dimensional complex Hilbert space C^2."},
            {"title": "Probability Amplitudes", "description": "The probability of measuring |0> is |alpha|^2, and measuring |1> is |beta|^2."},
            {"title": "Bloch Vector (x,y,z)", "description": "Expectation values of Pauli operators X, Y, and Z."}
        ],
        "quiz": [
            {
                "id": "q1-1",
                "question": "What is the probability of measuring state |0> given |psi> = 1/sqrt(2)|0> + 1/sqrt(2)|1>?",
                "options": ["25%", "50%", "75%", "100%"],
                "correct_index": 1,
                "explanation": "P(|0>) = |1/sqrt(2)|^2 = 1/2 = 50%."
            },
            {
                "id": "q1-2",
                "question": "Which point on the Bloch sphere represents the state |1>?",
                "options": ["North Pole (z=1)", "South Pole (z=-1)", "Positive X-axis (x=1)", "Origin (0,0,0)"],
                "correct_index": 1,
                "explanation": "State |1> corresponds to theta = pi, located precisely at the South Pole (z=-1)."
            }
        ]
    },
    {
        "id": "lesson-2",
        "order": 2,
        "title": "Superposition & Quantum Gates",
        "category": "Quantum Gates",
        "description": "Learn how unitary quantum logic gates transform qubit states and how the Hadamard gate creates superposition.",
        "content_markdown": """# Quantum Gates and Superposition

Quantum logic gates are represented by unitary matrices $U$ such that $U^\\dagger U = I$. This guarantees that operations preserve state norm and are physically reversible.

## The Hadamard Gate (H)
The Hadamard gate transforms computational basis states into balanced superpositions:

$$H = \\frac{1}{\\sqrt{2}}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$$

$$H|0\\rangle = \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}} = |+\\rangle$$
$$H|1\\rangle = \\frac{|0\\rangle - |1\\rangle}{\\sqrt{2}} = |-\\rangle$$

## Pauli Gates
- **X Gate**: Quantum NOT gate, flips $|0\\rangle \\leftrightarrow |1\\rangle$.
- **Y Gate**: Bit-flip and phase-flip combined with imaginary factor $i$.
- **Z Gate**: Phase-flip gate, leaves $|0\\rangle$ untouched and inverts $|1\\rangle \\to -|1\\rangle$.""",
        "theory_cards": [
            {"title": "Unitary Evolution", "description": "All closed quantum gates preserve probability norms and are reversible."},
            {"title": "Self-Inverse Gates", "description": "H, X, Y, Z gates are Hermitian and unitary, meaning U * U = I."},
            {"title": "Phase Kickback", "description": "Eigenvalues of target gates feed back into control qubit phase."}
        ],
        "quiz": [
            {
                "id": "q2-1",
                "question": "What happens if you apply the Hadamard gate twice in succession (H * H)?",
                "options": ["Flips state to |1>", "Leaves state unchanged (Identity)", "Rotates state by 90 degrees", "Destroys the qubit"],
                "correct_index": 1,
                "explanation": "Because H is unitary and Hermitian, H * H = I (Identity). The state returns to its original configuration."
            }
        ]
    },
    {
        "id": "lesson-3",
        "order": 3,
        "title": "Quantum Entanglement & Bell States",
        "category": "Multi-Qubit Systems",
        "description": "Explore non-local quantum correlations, Einstein-Podolsky-Rosen (EPR) pairs, and the CNOT gate.",
        "content_markdown": """# Quantum Entanglement & Bell States

Entanglement is a purely quantum phenomenon where the composite quantum state of two or more particles cannot be factored as a product of individual states:

$$|\\psi_{AB}\\rangle \\neq |\\psi_A\\rangle \\otimes |\\psi_B\\rangle$$

## The Bell Basis
The four maximally entangled two-qubit Bell states are:

$$|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$$
$$|\\Phi^-\\rangle = \\frac{|00\\rangle - |11\\rangle}{\\sqrt{2}}$$
$$|\\Psi^+\\rangle = \\frac{|01\\rangle + |10\\rangle}{\\sqrt{2}}$$
$$|\\Psi^-\\rangle = \\frac{|01\\rangle - |10\\rangle}{\\sqrt{2}}$$

## Creating a Bell Pair
To create $|\\Phi^+\\rangle$ from $|00\\rangle$:
1. Apply **Hadamard (H)** to qubit 0: transforms $|00\\rangle \\to \\frac{|00\\rangle + |10\\rangle}{\\sqrt{2}}$.
2. Apply **CNOT (CX)** with control qubit 0 and target qubit 1: flips qubit 1 only when qubit 0 is $|1\\rangle$, yielding $\\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$!""",
        "theory_cards": [
            {"title": "EPR Paradox", "description": "Measuring one entangled qubit instantaneously determines the other, regardless of distance."},
            {"title": "CNOT Gate", "description": "Two-qubit conditional gate: |c, t> -> |c, t ^ c>."},
            {"title": "No-Cloning Theorem", "description": "An arbitrary unknown quantum state cannot be copied."}
        ],
        "quiz": [
            {
                "id": "q3-1",
                "question": "If two qubits are in state (|00> + |11>)/sqrt(2), and qubit 0 is measured as 1, what will qubit 1 measure?",
                "options": ["0 with 100% probability", "1 with 100% probability", "0 with 50% probability", "Completely random"],
                "correct_index": 1,
                "explanation": "Because the state has only terms |00> and |11>, observing qubit 0 as 1 collapses the state to |11>, so qubit 1 is guaranteed to be 1."
            }
        ]
    },
    {
        "id": "lesson-4",
        "order": 4,
        "title": "Quantum Teleportation & Grover's Search",
        "category": "Algorithms",
        "description": "Master teleporting quantum states using classical communication and Grover's quadratic database search.",
        "content_markdown": """# Quantum Teleportation & Grover's Search

## Quantum Teleportation Protocol
Teleportation transmits the quantum state of a qubit without sending the physical particle itself.
1. Alice and Bob share an entangled Bell pair $|\\Phi^+\\rangle_{AB}$.
2. Alice interacts her unknown qubit $|\\psi\\rangle$ with her half of the Bell pair using CNOT and Hadamard gates.
3. Alice measures both qubits in the computational basis and transmits 2 classical bits to Bob.
4. Bob applies conditional Pauli corrections ($X^{M_2} Z^{M_1}$) to recover $|\\psi\\rangle$ with 100% fidelity.

## Grover's Search Algorithm
Grover's algorithm searches an unsorted database of $N = 2^n$ items in $\\mathcal{O}(\\sqrt{N})$ queries compared to classical $\\mathcal{O}(N)$.
It iteratively repeats:
1. **Oracle ($U_\\omega$)**: Marks the target state with a negative sign.
2. **Diffusion ($U_s$)**: Inverts amplitudes about their mean, boosting target probability!""",
        "theory_cards": [
            {"title": "Amplitude Amplification", "description": "Constructive interference on target state, destructive interference on non-targets."},
            {"title": "Classical Information Limit", "description": "Teleportation requires classical bits, strictly respecting relativistic causality."},
            {"title": "Oracle Formulation", "description": "Black-box unitary flipping phase of valid solutions: U_w|x> = (-1)^f(x)|x>."}
        ],
        "quiz": [
            {
                "id": "q4-1",
                "question": "How many queries does Grover's algorithm need to search an unsorted list of N items?",
                "options": ["O(N)", "O(log N)", "O(sqrt(N))", "O(1)"],
                "correct_index": 2,
                "explanation": "Grover's algorithm achieves quadratic speedup O(sqrt(N)) using quantum amplitude amplification."
            }
        ]
    }
]

SAMPLE_CHALLENGES = [
    {
        "id": "chal-1",
        "title": "Superposition Creator",
        "difficulty": "Beginner",
        "description": "Initialize a single qubit in the uniform superposition state |+> = (|0> + |1>) / sqrt(2).",
        "prompt": "Apply a Hadamard gate to qubit 0 to prepare equal measurement probabilities (50% |0>, 50% |1>).",
        "target_state": "|+⟩ = (|0⟩ + |1⟩)/√2",
        "expected_probabilities": {"0": 0.5, "1": 0.5},
        "max_qubits": 1,
        "max_gates": 2,
        "starter_code": """# Prepare superposition on Qubit 0
from qiskit import QuantumCircuit
qc = QuantumCircuit(1)
# Write your code below:
qc.h(0)
""",
        "starter_circuit": [
            {"gate": "H", "target": 0}
        ]
    },
    {
        "id": "chal-2",
        "title": "Bell State Generator",
        "difficulty": "Intermediate",
        "description": "Construct the famous maximally entangled Bell pair |Phi+> = (|00> + |11>) / sqrt(2).",
        "prompt": "Create an entangled EPR pair across qubits 0 and 1. Expected measurement results: 50% |00> and 50% |11>.",
        "target_state": "|Φ⁺⟩ = (|00⟩ + |11⟩)/√2",
        "expected_probabilities": {"00": 0.5, "11": 0.5},
        "max_qubits": 2,
        "max_gates": 3,
        "starter_code": """# Create Bell State |Phi+>
from qiskit import QuantumCircuit
qc = QuantumCircuit(2)
# Step 1: Put qubit 0 into superposition
qc.h(0)
# Step 2: Entangle qubit 0 with qubit 1
qc.cx(0, 1)
""",
        "starter_circuit": [
            {"gate": "H", "target": 0},
            {"gate": "CX", "control": 0, "target": 1}
        ]
    },
    {
        "id": "chal-3",
        "title": "GHZ Tripartite Entanglement",
        "difficulty": "Advanced",
        "description": "Synthesize the 3-qubit Greenberger-Horne-Zeilinger (GHZ) state: (|000> + |111>) / sqrt(2).",
        "prompt": "Entangle 3 qubits into a unified macroscopic quantum superposition. Measuring any qubit as 0 or 1 fixes all three!",
        "target_state": "|GHZ⟩ = (|000⟩ + |111⟩)/√2",
        "expected_probabilities": {"000": 0.5, "111": 0.5},
        "max_qubits": 3,
        "max_gates": 4,
        "starter_code": """# Create 3-Qubit GHZ State
from qiskit import QuantumCircuit
qc = QuantumCircuit(3)
qc.h(0)
qc.cx(0, 1)
qc.cx(1, 2)
""",
        "starter_circuit": [
            {"gate": "H", "target": 0},
            {"gate": "CX", "control": 0, "target": 1},
            {"gate": "CX", "control": 1, "target": 2}
        ]
    }
]

SAMPLE_MISSIONS = [
    {
        "mission_id": "mission-grover",
        "title": "Synthesize 2-Qubit Grover Search",
        "prompt": "Colony, please design a minimal 2-qubit Grover search circuit targeting computational basis state |11>.",
        "colony_summary": "Autonomous collaboration generated a 2-qubit amplitude amplification circuit with phase oracle and diffusion operator.",
        "consensus_circuit": json.dumps({
            "num_qubits": 2,
            "gates": [
                {"gate": "H", "target": 0},
                {"gate": "H", "target": 1},
                {"gate": "CZ", "control": 0, "target": 1},
                {"gate": "H", "target": 0},
                {"gate": "H", "target": 1},
                {"gate": "X", "target": 0},
                {"gate": "X", "target": 1},
                {"gate": "CZ", "control": 0, "target": 1},
                {"gate": "X", "target": 0},
                {"gate": "X", "target": 1},
                {"gate": "H", "target": 0},
                {"gate": "H", "target": 1}
            ]
        })
    },
    {
        "mission_id": "mission-teleport",
        "title": "Quantum Teleportation Relay",
        "prompt": "Colony, synthesize the 3-qubit teleportation channel from Alice to Bob with Bell measurement.",
        "colony_summary": "Multi-agent consensus achieved for bipartite EPR distribution and feed-forward Pauli corrections.",
        "consensus_circuit": json.dumps({
            "num_qubits": 3,
            "gates": [
                {"gate": "H", "target": 0},
                {"gate": "H", "target": 1},
                {"gate": "CX", "control": 1, "target": 2},
                {"gate": "CX", "control": 0, "target": 1},
                {"gate": "H", "target": 0},
                {"gate": "CX", "control": 1, "target": 2},
                {"gate": "CZ", "control": 0, "target": 2}
            ]
        })
    }
]

def seed_database(db: Session):
    # 1. Seed Users
    users_to_seed = [
        ("student@quantumcolony.io", "Student Explorer", "quantum123", UserRole.STUDENT.value, "qubit-bot"),
        ("instructor@quantumcolony.io", "Dr. Quantum Instructor", "quantum123", UserRole.INSTRUCTOR.value, "atom-pro"),
        ("admin@quantumcolony.io", "Colony Administrator", "quantum123", UserRole.ADMIN.value, "nexus-core")
    ]

    for email, name, pwd, role, avatar in users_to_seed:
        existing = db.query(User).filter(User.email == email).first()
        if not existing:
            u = User(
                email=email,
                name=name,
                hashed_password=hash_password(pwd),
                role=role,
                avatar=avatar
            )
            db.add(u)
    db.commit()

    student_user = db.query(User).filter(User.email == "student@quantumcolony.io").first()

    # 2. Seed Sample Saved Circuits
    if student_user:
        circuit_count = db.query(SavedCircuit).filter(SavedCircuit.user_id == student_user.id).count()
        if circuit_count == 0:
            sample_circuits = [
                (
                    "Bell State Generator",
                    "Generates maximally entangled EPR pair |Phi+>",
                    json.dumps([
                        {"gate": "H", "target": 0},
                        {"gate": "CX", "control": 0, "target": 1}
                    ]),
                    2
                ),
                (
                    "Quantum Superposition Test",
                    "Dual qubit Hadamard test bench",
                    json.dumps([
                        {"gate": "H", "target": 0},
                        {"gate": "H", "target": 1}
                    ]),
                    2
                )
            ]
            for title, desc, c_json, nq in sample_circuits:
                gates = json.loads(c_json)
                q_code = QuantumEngine.generate_qiskit_code(nq, gates)
                sc = SavedCircuit(
                    user_id=student_user.id,
                    title=title,
                    description=desc,
                    circuit_json=c_json,
                    qiskit_code=q_code,
                    num_qubits=nq
                )
                db.add(sc)
            db.commit()

    # 3. Seed Mission Logs
    for m in SAMPLE_MISSIONS:
        existing_m = db.query(MissionLog).filter(MissionLog.mission_id == m["mission_id"]).first()
        if not existing_m:
            ml = MissionLog(
                mission_id=m["mission_id"],
                title=m["title"],
                prompt=m["prompt"],
                colony_summary=m["colony_summary"],
                consensus_circuit=m["consensus_circuit"]
            )
            db.add(ml)
    db.commit()
