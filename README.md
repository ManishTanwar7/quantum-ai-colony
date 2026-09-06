# ⚛️ Quantum AI Colony

> A futuristic, production-ready full-stack web application featuring an autonomous Multi-Agent AI Colony for quantum computing simulation, circuit design, and interactive learning.

Deployable on **Render** with PostgreSQL, FastAPI, and React + Tailwind CSS + Framer Motion.

---

## 🌟 Key Features

### 1. Multi-Agent AI Colony & Real-Time Message Bus
- **Professor AI (Prof. Evelyn Vance)**: Explains Hilbert space axioms, Hamiltonians, and algorithm theory.
- **Engineer AI (Devin Matrix)**: Synthesizes quantum logic gate sequences and generates executable Qiskit code.
- **Debugger AI (Agent BugHunter)**: Audits circuits for decoherence sensitivity, unitarity leaks, and phase errors.
- **Optimizer AI (OptiPrime)**: Cancels adjacent self-inverses ($H \cdot H = I$, $X \cdot X = I$) and minimizes circuit depth.
- **Visualizer AI (Iris Quantum)**: Computes single-qubit reduced density matrices, Bloch coordinates $(x,y,z)$, and probability distributions.
- **WebSocket Synapse Bus**: Live bidirectional communication stream broadcasting agent movements and animated chat bubbles.
- **Animated Railway Track Dashboard**: Avatars glide along a 5-station track (`Theory Depot` $\to$ `Circuit Foundry` $\to$ `Debug Siding` $\to$ `Optimizer Junction` $\to$ `Visualizer Terminal`) with glowing laser pulses.

### 2. Quantum Circuit Studio & Dual-Mode Editor
- **Drag-and-Drop Circuit Foundry**: Visual gate placement across 1 to 4 qubits for $H, X, Y, Z, S, T, CNOT, CZ, SWAP, M$.
- **Qiskit Code Editor**: High-performance syntax-aware editor with bidirectional synchronization to the visual grid.
- **Exact Statevector Simulator**: Pure NumPy statevector simulator computing exact state amplitudes, measurement shot distributions (1024 shots), and circuit metrics.

### 3. Advanced Quantum Visualizations
- **Interactive 3D Bloch Sphere**: 3D Canvas visualizer with drag rotation, coordinate axes, and animated state vector arrows.
- **Probability Distribution Charts**: Real-time bar charts showing $|00\dots\rangle \dots |11\dots\rangle$ probabilities and measurement counts.
- **Circuit Execution Timeline**: Framer Motion stepped playback advancing the quantum clock step-by-step with state collapse previews.

### 4. Interactive Learning Modules & Quantum Auto-Grader
- **Curriculum Modules**: Lessons covering Qubits, Superposition, Entanglement & Bell States, Quantum Teleportation, and Grover's Search.
- **Interactive Checkpoints**: In-lesson quizzes with instant score tracking.
- **Automated Quantum Grader**: Evaluates student circuit submissions against target statevectors, computes Bhattacharyya fidelity $F = \sum \sqrt{P_{target} P_{actual}}$, and enforces gate count constraints.

### 5. Role-Based Authentication & Instructor Deck
- **Roles**: `student`, `instructor`, `admin`.
- **Instructor Dashboard**: Cohort analytics, challenge completion rates, and student submission logs.
- **Demo Accounts**: Instant 1-click demo login buttons for Student, Instructor, and Admin.

---

## 🗂️ Project Structure

```
quantum-ai-colony/
├── backend/
│   ├── app/
│   │   ├── api/                     # REST Endpoints
│   │   │   ├── auth.py              # Register, login, demo profiles
│   │   │   ├── circuits.py          # Run simulation, save/load circuits
│   │   │   ├── colony.py            # Missions, agents, WebSocket endpoint
│   │   │   ├── learning.py          # Lessons, quizzes, challenge auto-grader
│   │   │   └── instructor.py        # Analytics, cohort telemetry
│   │   ├── models/                  # SQLAlchemy ORM Models
│   │   │   ├── user.py              # User model with roles
│   │   │   ├── circuit.py           # Saved quantum circuits
│   │   │   ├── progress.py          # Lesson progress & challenge submissions
│   │   │   └── mission.py           # Colony mission logs
│   │   ├── schemas/                 # Pydantic Schemas
│   │   │   ├── auth.py
│   │   │   ├── circuit.py
│   │   │   ├── colony.py
│   │   │   └── learning.py
│   │   ├── services/
│   │   │   ├── auth_service.py      # Bcrypt hashing & PyJWT auth
│   │   │   ├── quantum_engine.py    # Physical statevector math & Bloch calculator
│   │   │   ├── colony_bus.py        # WebSocket coordinator & pipeline
│   │   │   ├── grader_service.py   # Quantum auto-grader
│   │   │   └── agents/              # The 5 Colony AI Agents
│   │   │       ├── base_agent.py
│   │   │       ├── professor.py
│   │   │       ├── engineer.py
│   │   │       ├── debugger.py
│   │   │       ├── optimizer.py
│   │   │       └── visualizer.py
│   │   ├── config.py                # App settings & environment loader
│   │   ├── database.py              # DB Engine & SessionLocal
│   │   ├── seed_data.py             # Pre-seeded users, lessons, challenges
│   │   └── main.py                  # FastAPI app entry & SPA static server
│   ├── tests/
│   │   └── test_quantum_engine.py   # Unit tests for quantum gate matrices
│   └── requirements.txt             # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Sci-Fi navigation with live bus indicator
│   │   │   ├── RailwayTrack.jsx     # Animated 5-station agent transit track
│   │   │   ├── AgentChatModal.jsx   # Real-time dialogue bubbles & prompt input
│   │   │   ├── BlochSphere3D.jsx    # Interactive 3D Bloch sphere
│   │   │   ├── CircuitBuilder.jsx   # Drag-and-Drop quantum gate grid
│   │   │   ├── CircuitTimeline.jsx  # Stepped wave timeline playback
│   │   │   ├── ProbabilityChart.jsx # Quantum basis state probability bars
│   │   │   ├── CodeEditor.jsx       # Qiskit syntax editor
│   │   │   └── ProtectedRoute.jsx   # Role guard
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Hero landing & agent showcases
│   │   │   ├── ColonyStation.jsx    # Multi-agent simulation command center
│   │   │   ├── QuantumLab.jsx       # Full quantum circuit design studio
│   │   │   ├── LearningHub.jsx      # Lessons & interactive quizzes
│   │   │   ├── ChallengeCenter.jsx  # Coding challenges with auto-grader
│   │   │   ├── InstructorDashboard.jsx # Cohort analytics & fidelity logs
│   │   │   └── AuthPage.jsx         # Login, register & 1-click demo access
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Authentication session context
│   │   ├── services/
│   │   │   └── api.js               # API client with JWT injection
│   │   ├── App.jsx                  # React Router application shell
│   │   ├── index.css                # Quantum styling & neon glowing effects
│   │   └── main.jsx                 # React root entry
│   ├── index.html                   # HTML5 entry with quantum favicon
│   ├── vite.config.js               # Vite configuration with proxy
│   ├── tailwind.config.js           # Custom quantum color palette
│   └── package.json                 # Frontend dependencies
├── render.yaml                      # Render Blueprint deployment definition
├── .env.example                     # Environment variables template
└── README.md                        # Documentation
```

---

## 🚀 Local Development Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Start Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 10000 --reload
```
*The database automatically creates tables and seeds default users, lessons, and challenges upon launch.*
- API Documentation: `http://localhost:10000/docs`
- Health Check: `http://localhost:10000/healthz`

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
*The frontend development server will launch at `http://localhost:3000` or `http://localhost:5173` with automatic API and WebSocket proxying to the backend.*

---

## 🔑 Pre-Seeded Demo Accounts

You can test without registration using the **Instant Demo Buttons** on the sign-in page:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Student** | `student@quantumcolony.io` | `quantum123` | Full access to Colony, Lab, Lessons & Challenges |
| **Instructor** | `instructor@quantumcolony.io` | `quantum123` | Access to Student features + Instructor Analytics Deck |
| **Admin** | `admin@quantumcolony.io` | `quantum123` | Full administrative capabilities |

---

## ☁️ Deployment on Render

### Option A: Automatic Blueprint Deployment (Recommended)
1. Push this repository to GitHub or GitLab.
2. Log in to [Render](https://dashboard.render.com/).
3. Click **New +** $\to$ **Blueprint**.
4. Connect your repository. Render will automatically read `render.yaml` and provision:
   - `quantum-ai-colony-backend` (Web Service)
   - `quantum-ai-colony-frontend` (Web Service)
   - `quantum-colony-db` (Managed PostgreSQL Database)

### Option B: Manual Service Configuration

#### Backend Web Service
- **Environment**: Python
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
- **Environment Variables**:
  - `DATABASE_URL`: Your PostgreSQL connection string
  - `JWT_SECRET`: Random 32+ character string
  - `CORS_ORIGINS`: `*`

#### Frontend Web Service
- **Environment**: Node
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npx serve -s dist -l 3000`
- **Environment Variables**:
  - `VITE_API_URL`: URL of your deployed backend

---

## 🧪 Testing

To run the quantum engine unit tests:
```bash
cd backend
python -c "from tests.test_quantum_engine import test_hadamard_single_qubit, test_pauli_x_gate, test_bell_state_generation, test_qiskit_code_parser; test_hadamard_single_qubit(); test_pauli_x_gate(); test_bell_state_generation(); test_qiskit_code_parser(); print('All tests passed!')"
```
