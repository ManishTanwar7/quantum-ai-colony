import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { 
  Cpu, Terminal, ArrowRight, Play, BookOpen, Trophy
} from 'lucide-react';
import CommandDeck from '../components/CommandDeck';
import MissionGuidanceModal from '../components/MissionGuidanceModal';

const GAMIFIED_MISSIONS = [
  {
    id: 'grover',
    title: "Design Grover's Algorithm",
    difficulty: "Intermediate",
    prompt: "Colony, synthesize a minimal 2-qubit Grover search circuit targeting state |11> with oracle and diffusion operators.",
    steps: [
      {
        title: "Step 1: Superposition Seeding",
        description: "Apply Hadamard gates to qubits 0 and 1 to create an equal superposition state (|00> + |01> + |10> + |11>)/2.",
        formula: "|s⟩ = H⊗2 |00⟩ = 1/2(|00⟩ + |01⟩ + |10⟩ + |11⟩)",
        gatePreview: "qc.h(0)\nqc.h(1)"
      },
      {
        title: "Step 2: Controlled-Z Phase Oracle",
        description: "Apply a Controlled-Z gate targeting state |11> to flip its phase from +0.5 to -0.5 via phase kickback.",
        formula: "U_ω |x⟩ = (-1)^(x==11) |x⟩",
        gatePreview: "qc.cz(0, 1)"
      },
      {
        title: "Step 3: Diffusion Inversion About Mean",
        description: "Invert all amplitudes about their mean to amplify the target state |11> probability to ~100%.",
        formula: "U_s = 2|s⟩⟨s| - I = H·X·CZ·X·H",
        gatePreview: "qc.h([0,1])\nqc.x([0,1])\nqc.cz(0,1)\nqc.x([0,1])\nqc.h([0,1])"
      }
    ]
  },
  {
    id: 'teleport',
    title: "Quantum Teleportation Relay",
    difficulty: "Advanced",
    prompt: "Colony, build a 3-qubit quantum teleportation protocol with Bell EPR pair distribution and Alice-Bob feed-forward corrections.",
    steps: [
      {
        title: "Step 1: Entangled Resource Distribution",
        description: "Create an entangled Bell state |Φ⁺⟩ between Alice (q1) and Bob (q2) using Hadamard and CNOT.",
        formula: "|Φ⁺⟩₁₂ = (|00⟩ + |11⟩)/√2",
        gatePreview: "qc.h(1)\nqc.cx(1, 2)"
      },
      {
        title: "Step 2: Alice's Bell-Basis Measurement",
        description: "Alice interacts her unknown state qubit (q0) with her EPR half (q1) via CNOT and Hadamard.",
        formula: "(H ⊗ I) · CX₀₁ (|ψ⟩₀ ⊗ |Φ⁺⟩₁₂)",
        gatePreview: "qc.cx(0, 1)\nqc.h(0)"
      },
      {
        title: "Step 3: Bob's Unitary Pauli Recovery",
        description: "Bob applies conditional X and Z operations based on Alice's classical measurement bits to reconstruct |ψ⟩.",
        formula: "BobState = Z^(M₁) · X^(M₂) |ψ⟩",
        gatePreview: "qc.cx(1, 2)\nqc.cz(0, 2)"
      }
    ]
  },
  {
    id: 'bell',
    title: "Maximally Entangled Bell Pair",
    difficulty: "Beginner",
    prompt: "Colony, formulate the EPR Bell state (|00> + |11>)/sqrt(2) and verify non-local quantum correlations.",
    steps: [
      {
        title: "Step 1: Superposition Initialization",
        description: "Apply Hadamard to qubit 0 to prepare the balanced superposition (|0> + |1>)/sqrt(2).",
        formula: "H|0⟩ = (|0⟩ + |1⟩)/√2",
        gatePreview: "qc.h(0)"
      },
      {
        title: "Step 2: Entangling CNOT Coupling",
        description: "Use qubit 0 as control to conditionally invert qubit 1, producing the maximally entangled EPR pair.",
        formula: "CNOT₀₁ ((|0⟩+|1⟩)/√2 ⊗ |0⟩) = (|00⟩+|11⟩)/√2",
        gatePreview: "qc.cx(0, 1)"
      }
    ]
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [activeMission, setActiveMission] = useState(null);

  const handleLaunchToColony = (title, prompt) => {
    sessionStorage.setItem('colony_launch_prompt', prompt);
    sessionStorage.setItem('colony_launch_title', title);
    navigate('/colony');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-12">
        
        {/* 1. Hero Section (Clean Office Style) */}
        <div className="rounded-xl p-8 lg:p-12 bg-gray-50 border border-gray-200">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white border border-gray-300 text-gray-700 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-gray-900" />
              <span>Autonomous Multi-Agent Quantum Computing Platform</span>
            </div>

            <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
              Quantum Circuit Design with Colony Intelligence
            </h1>

            <p className="text-base text-gray-700 leading-relaxed">
              Coordinate 5 specialized AI agents across theory, circuit synthesis, coherence auditing, depth optimization, and 3D Bloch sphere projections. Easy to navigate and deploy in seconds.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/colony"
                className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs rounded border border-gray-900 transition-colors"
              >
                <Cpu className="w-4 h-4 text-gray-900" />
                <span>Launch Colony Station</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/lab"
                className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-100 text-gray-800 font-medium text-xs rounded border border-gray-300 transition-colors"
              >
                <Terminal className="w-4 h-4 text-gray-700" />
                <span>Quantum Circuit Studio</span>
              </Link>

              <Link
                to="/learning"
                className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-100 text-gray-800 font-medium text-xs rounded border border-gray-300 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-gray-700" />
                <span>Learning Hub</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Central Command Deck (5 Labeled Modules) */}
        <CommandDeck />

        {/* 3. Gamified Missions Section */}
        <div className="space-y-4">
          <div>
            <div className="text-xs font-mono uppercase text-gray-500 tracking-wider">
              Interactive Directives
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">
              Colony Missions
            </h2>
            <p className="text-xs text-gray-600 mt-0.5">
              Select any mission to inspect step-by-step guidance or deploy directly to the AI colony
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {GAMIFIED_MISSIONS.map((m) => (
              <div
                key={m.id}
                onClick={() => setActiveMission(m)}
                className="cursor-pointer p-5 rounded-xl bg-white border border-gray-200 hover:border-gray-900 hover:bg-gray-50/50 transition-all space-y-3 flex flex-col justify-between group shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 border border-gray-300 text-gray-800 font-semibold">
                      {m.difficulty}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {m.steps.length} Phases
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-gray-900 group-hover:underline">
                    {m.title}
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                    {m.prompt}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-mono text-gray-900 font-medium">
                  <span className="group-hover:underline">View Step Guidance</span>
                  <Play className="w-3 h-3 fill-gray-900" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Step-by-Step Guidance Modal */}
      <AnimatePresence>
        {activeMission && (
          <MissionGuidanceModal
            mission={activeMission}
            onClose={() => setActiveMission(null)}
            onLaunchToColony={handleLaunchToColony}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
