import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { 
  Cpu, Terminal, ArrowRight, Play, BookOpen, Sparkles
} from 'lucide-react';
import CommandDeck from '../components/CommandDeck';
import MissionGuidanceModal from '../components/MissionGuidanceModal';
import InteractiveQuantumGlobe from '../components/InteractiveQuantumGlobe';

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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-12">
        
        {/* 1. Bright & Clean Hero Section */}
        <div className="relative rounded-3xl p-8 lg:p-12 bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Headlines and Actions (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-mono font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Multi-Agent Quantum Circuit Platform</span>
              </div>

              <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Synthesize Quantum Circuits with{' '}
                <span className="text-purple-700">
                  Colony Intelligence
                </span>
              </h1>

              <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
                Collaborate with 5 specialized AI agents across axiomatic physics, gate synthesis, error auditing, depth optimization, and 3D Bloch sphere projections.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/colony"
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                >
                  <Cpu className="w-4 h-4 text-emerald-300" />
                  <span>Launch Colony Station</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/lab"
                  className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs rounded-xl border border-slate-300 transition-colors shadow-xs"
                >
                  <Terminal className="w-4 h-4 text-purple-600" />
                  <span>Quantum Circuit Studio</span>
                </Link>

                <Link
                  to="/learning"
                  className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-xl border border-slate-200 transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>Learning Hub</span>
                </Link>
              </div>

              {/* Status Row */}
              <div className="flex flex-wrap items-center gap-5 pt-3 border-t border-slate-100 text-xs font-mono text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Statevector Engine: <strong className="text-slate-800 font-medium">Aer Universal</strong></span>
                </div>
                <div>Fidelity: <strong className="text-slate-800 font-medium">99.8%</strong></div>
                <div>Transit Bus: <strong className="text-purple-700 font-medium">Active</strong></div>
              </div>
            </div>

            {/* Right Column: Interactive 3D Quantum Globe (5 cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[400px]">
                <InteractiveQuantumGlobe />
              </div>
            </div>

          </div>
        </div>

        {/* 2. Central Command Deck (5 Labeled Modules) */}
        <CommandDeck />

        {/* 3. Gamified Missions Section */}
        <div className="space-y-4">
          <div>
            <div className="text-xs font-mono uppercase text-purple-700 font-semibold tracking-wider">
              Interactive Directives
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
              Colony Missions
            </h2>
            <p className="text-xs text-slate-500">
              Select any mission to inspect step-by-step guidance or deploy directly to the AI colony
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {GAMIFIED_MISSIONS.map((m) => (
              <div
                key={m.id}
                onClick={() => setActiveMission(m)}
                className="cursor-pointer p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 transition-all space-y-3 flex flex-col justify-between group shadow-xs hover:shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 border border-purple-200 text-purple-700 font-semibold">
                      {m.difficulty}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {m.steps.length} Phases
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 group-hover:text-purple-700 transition-colors">
                    {m.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {m.prompt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-purple-700 font-medium">
                  <span>View Step Guidance</span>
                  <Play className="w-3.5 h-3.5 fill-purple-700 text-purple-700 group-hover:translate-x-0.5 transition-transform" />
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
