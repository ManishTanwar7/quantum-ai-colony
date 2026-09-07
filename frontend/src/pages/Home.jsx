import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Terminal, ArrowRight, Play, BookOpen, Trophy, Sparkles, Sliders, Zap
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
    <div className="min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-16">
        
        {/* 1. Hero Section with Interactive 3D Quantum Globe */}
        <div className="relative rounded-3xl p-8 lg:p-12 bg-gradient-to-b from-[#0f172a]/95 via-[#0b1026]/90 to-[#070b16]/95 border border-purple-500/30 overflow-hidden shadow-2xl backdrop-blur-xl">
          {/* Ambient Lighting */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Column: Headlines and Actions (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-mono shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" style={{ animationDuration: '10s' }} />
                <span>Autonomous Multi-Agent Quantum Architecture</span>
              </div>

              <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Synthesize Quantum Circuits with{' '}
                <span className="bg-gradient-to-r from-slate-100 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                  Colony Intelligence
                </span>
              </h1>

              <p className="text-sm lg:text-base text-slate-300 leading-relaxed font-light">
                Deliberate across 5 specialized AI agents along an animated railway transit. Synthesize discrete gate sequences, detect unitarity leaks, optimize circuit depth, and project statevectors onto interactive 3D Bloch spheres.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/colony"
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all hover:scale-105"
                >
                  <Cpu className="w-4 h-4 text-cyan-200" />
                  <span>Launch Colony Station</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/lab"
                  className="flex items-center gap-2 px-5 py-3 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 hover:border-purple-500/40 transition-all hover:scale-105 shadow-md"
                >
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span>Quantum Circuit Studio</span>
                </Link>

                <Link
                  to="/learning"
                  className="flex items-center gap-2 px-4 py-3 bg-slate-900/50 hover:bg-slate-800/80 text-slate-300 font-medium text-xs rounded-xl border border-slate-800 transition-all"
                >
                  <BookOpen className="w-4 h-4 text-amber-300" />
                  <span>Learning Hub</span>
                </Link>
              </div>

              {/* Live telemetry row */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-800/80 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Statevector Engine: <strong>Aer Universal</strong></span>
                </div>
                <div>Fidelity: <strong className="text-white">99.8%</strong></div>
                <div>Transit Bus: <strong className="text-cyan-300">Active</strong></div>
              </div>
            </div>

            {/* Right Column: Interactive 3D Quantum Globe (5 cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[420px]">
                <InteractiveQuantumGlobe />
              </div>
            </div>

          </div>
        </div>

        {/* 2. Central Command Deck (5 Labeled Modules with 3D Tilt) */}
        <CommandDeck />

        {/* 3. Gamified Missions Section */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase text-purple-400 tracking-wider">
                Interactive Directives
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white mt-1">
                Gamified Colony Missions
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Click any mission to inspect step-by-step guidance or deploy directly to the AI colony
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {GAMIFIED_MISSIONS.map((m) => (
              <motion.div
                key={m.id}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => setActiveMission(m)}
                className="cursor-pointer p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/60 transition-all space-y-4 shadow-xl flex flex-col justify-between group backdrop-blur-md relative overflow-hidden"
              >
                {/* Subtle top card glow */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/60 text-purple-300 font-semibold">
                      {m.difficulty}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {m.steps.length} Phases
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white group-hover:text-purple-300 transition-colors">
                    {m.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {m.prompt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-purple-300">
                  <span className="group-hover:text-white transition-colors">View Step Guidance</span>
                  <Play className="w-3.5 h-3.5 fill-purple-400 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
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
