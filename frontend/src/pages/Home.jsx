import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Atom, Cpu, Terminal, BookOpen, Trophy, ShieldCheck, 
  Sparkles, ArrowRight, Zap, Bug, Eye, Play, CheckCircle2 
} from 'lucide-react';
import EarthWebGlobe from '../components/EarthWebGlobe';
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
  const [showIntro, setShowIntro] = useState(true);
  const [activeMission, setActiveMission] = useState(null);

  const handleLaunchToColony = (title, prompt) => {
    // Navigate to Colony Station with preloaded prompt
    sessionStorage.setItem('colony_launch_prompt', prompt);
    sessionStorage.setItem('colony_launch_title', title);
    navigate('/colony');
  };

  return (
    <div className="min-h-screen bg-[#050814] relative">
      
      {/* 1. Earth Web Network Globe Intro (3-5 second reveal) */}
      <AnimatePresence>
        {showIntro && (
          <EarthWebGlobe onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-16">
        
        {/* 2. Hero Section */}
        <div className="relative rounded-3xl p-8 lg:p-14 bg-gradient-to-b from-[#0e173e] via-quantum-surface to-quantum-dark border border-cyan-500/30 overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.1)]">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Autonomous Multi-Agent Quantum Computing Platform</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
              Pioneer Quantum Circuits with{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 bg-clip-text text-transparent">
                Colony Intelligence
              </span>
            </h1>

            <p className="text-base lg:text-lg text-slate-300 leading-relaxed font-light">
              Collaborate with 5 autonomous AI agents along an animated railway track. Synthesize circuits, eliminate decoherence, optimize gate depth, and project statevectors onto 3D Bloch spheres.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/colony"
                className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all hover:scale-105"
              >
                <Cpu className="w-4 h-4" />
                <span>Launch Colony Station</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/lab"
                className="flex items-center gap-2 px-6 py-3.5 bg-quantum-surface hover:bg-slate-800 text-slate-200 font-semibold text-sm rounded-xl border border-quantum-border hover:border-cyan-400/60 transition-all"
              >
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Quantum Circuit Studio</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Central Command Deck (5 Labeled Modules) */}
        <CommandDeck />

        {/* 4. Gamified Missions Section */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
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
                whileHover={{ y: -4 }}
                onClick={() => setActiveMission(m)}
                className="cursor-pointer p-6 rounded-2xl bg-quantum-surface border border-quantum-border hover:border-cyan-400/60 transition-all space-y-4 shadow-xl flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-semibold">
                      {m.difficulty}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {m.steps.length} Phases
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                    {m.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {m.prompt}
                  </p>
                </div>

                <div className="pt-3 border-t border-quantum-border/60 flex items-center justify-between text-xs font-mono text-cyan-400">
                  <span>View Step Guidance</span>
                  <Play className="w-3.5 h-3.5 fill-cyan-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* 5. Step-by-Step Guidance Modal */}
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
