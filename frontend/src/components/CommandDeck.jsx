import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Cpu, Bug, Zap, Eye, X, ArrowRight, 
  ExternalLink, Sliders 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MODULES = [
  {
    id: 'theory',
    name: 'Theory Depot',
    specialist: 'Prof. Evelyn Vance',
    tag: 'MODULE 01 • AXIOMATIC PHYSICS',
    icon: BookOpen,
    color: '#7c3aed',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    shortDesc: 'Mathematical foundations of Hilbert space, Dirac notation & unitaries.',
    deepDive: {
      title: 'Hilbert Space Formalism & Dirac Notation',
      overview: 'Quantum information is represented as state vectors in complex Hilbert spaces C^2^N. Evolution is strictly governed by unitary operators U such that U† U = I.',
      keyConcepts: [
        { label: 'State Superposition', value: '|ψ⟩ = α|0⟩ + β|1⟩ where |α|² + |β|² = 1' },
        { label: 'Unitary Reversibility', value: 'U† U = I preserves probability amplitude norms' },
        { label: 'EPR Entanglement', value: '|Φ⁺⟩ = (|00⟩ + |11⟩)/√2 non-separable tensor state' },
      ],
      actionLabel: 'Explore Learning Modules',
      actionLink: '/learning'
    }
  },
  {
    id: 'foundry',
    name: 'Circuit Foundry',
    specialist: 'Devin Matrix',
    tag: 'MODULE 02 • GATE SYNTHESIS',
    icon: Cpu,
    color: '#059669',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    shortDesc: 'Drag-and-drop quantum gate assembly & Qiskit code synthesis.',
    deepDive: {
      title: 'Quantum Logic Architecture & Synthesis',
      overview: 'Synthesize discrete gate sequences from elementary Clifford+T universal sets. Construct superposition matrices and multi-qubit entangling gates.',
      keyConcepts: [
        { label: 'Single-Qubit Rotations', value: 'H, X, Y, Z, S, T, Rx(θ), Ry(θ), Rz(θ)' },
        { label: 'Bipartite Coupling', value: 'CNOT (CX), CZ, and SWAP entangling gates' },
        { label: 'Target Backends', value: 'Aer Statevector, IBM Quantum, Cirq, PennyLane' },
      ],
      actionLabel: 'Open Circuit Foundry Studio',
      actionLink: '/lab'
    }
  },
  {
    id: 'debug',
    name: 'Debug Siding',
    specialist: 'Agent BugHunter',
    tag: 'MODULE 03 • ERROR AUDIT',
    icon: Bug,
    color: '#e11d48',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    shortDesc: 'Decoherence audit, unitarity leak detection & phase diagnostics.',
    deepDive: {
      title: 'Quantum Coherence & Unitarity Auditing',
      overview: 'Automated diagnostic scans detecting phase kickback inversion errors, unmeasured target qubits, out-of-boundary indexing, and circuit depth decoherence risks.',
      keyConcepts: [
        { label: 'Unitarity Checker', value: 'Ensures no probability leaks occur (∑ P_i = 1.0)' },
        { label: 'Coherence Margin', value: 'Monitors NISQ T1 relaxation & T2 dephasing bounds' },
        { label: 'Control Inversion Check', value: 'Detects accidental self-control loops (c == t)' },
      ],
      actionLabel: 'Run Diagnostics in Colony',
      actionLink: '/colony'
    }
  },
  {
    id: 'optimizer',
    name: 'Optimizer Junction',
    specialist: 'OptiPrime',
    tag: 'MODULE 04 • DEPTH REDUCTION',
    icon: Zap,
    color: '#d97706',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    shortDesc: 'Gate cancellation passes, depth compression & T-count reduction.',
    deepDive: {
      title: 'Peephole Optimization & Circuit Compaction',
      overview: 'Identifies adjacent self-inverse operators (H·H = I, X·X = I, CX·CX = I), merges consecutive Z-rotations, and maximizes circuit parallelism.',
      keyConcepts: [
        { label: 'Self-Inverse Cancellation', value: 'Eliminates redundant pairs (saves ~25% depth)' },
        { label: 'Phase Consolidation', value: 'Rz(θ₁) · Rz(θ₂) → Rz(θ₁ + θ₂)' },
        { label: 'Commutation Rules', value: 'Reorders diagonal gates to parallelize executions' },
      ],
      actionLabel: 'Launch Optimizer Bench',
      actionLink: '/lab'
    }
  },
  {
    id: 'visualizer',
    name: 'Visualizer Terminal',
    specialist: 'Iris Quantum',
    tag: 'MODULE 05 • 3D PROJECTION',
    icon: Eye,
    color: '#4f46e5',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    shortDesc: '3D Bloch sphere state mapping & measurement probability distribution.',
    deepDive: {
      title: 'Hilbert Space Geometric Mapping',
      overview: 'Computes partial traces over density matrices ρ_k = Tr_{k̄}(ρ) to extract exact single-qubit Bloch vectors (x, y, z) and spherical angles (θ, φ).',
      keyConcepts: [
        { label: 'Bloch Vector (x,y,z)', value: 'x = 2Re(ρ₀₁), y = 2Im(ρ₁₀), z = ρ₀₀ - ρ₁₁' },
        { label: 'Spherical Coordinates', value: 'θ = arccos(z), φ = arctan2(y, x)' },
        { label: 'Probability Histogram', value: 'Displays exact amplitudes & 1024 shot samplings' },
      ],
      actionLabel: 'View 3D Studio & Timelines',
      actionLink: '/lab'
    }
  },
];

export default function CommandDeck() {
  const [selectedModule, setSelectedModule] = useState(null);

  return (
    <div className="space-y-6">
      
      {/* Deck Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-medium">
            <Sliders className="w-3.5 h-3.5 text-purple-600" />
            <span>CENTRAL COMMAND DECK • 5 MODULAR STATIONS</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mt-1">
            Quantum Operations Dashboard
          </h2>
          <p className="text-xs text-slate-500">
            Click any station to open interactive progressive-disclosure diagnostics
          </p>
        </div>
      </div>

      {/* 5 Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {MODULES.map((mod) => {
          const Icon = mod.icon;
          const isSelected = selectedModule?.id === mod.id;

          return (
            <div
              key={mod.id}
              onClick={() => setSelectedModule(mod)}
              className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-4 bg-white shadow-xs hover:shadow-sm ${
                isSelected
                  ? 'border-purple-600 ring-2 ring-purple-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center border"
                    style={{ 
                      backgroundColor: `${mod.color}15`, 
                      borderColor: `${mod.color}30`,
                      color: mod.color 
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 font-medium">
                    {mod.tag.split('•')[0].trim()}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="font-bold text-base text-slate-900">{mod.name}</h3>
                  <div
                    className="text-xs font-mono font-semibold mt-0.5"
                    style={{ color: mod.color }}
                  >
                    {mod.specialist}
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {mod.shortDesc}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-purple-700 font-medium">
                <span>Inspect Module</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Progressive Disclosure Modal / Slide-over */}
      <AnimatePresence>
        {selectedModule && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="p-6 lg:p-8 rounded-3xl bg-white border border-slate-300 shadow-md relative overflow-hidden text-slate-800"
          >
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div
                  className="p-2.5 rounded-xl border"
                  style={{ 
                    backgroundColor: `${selectedModule.color}15`, 
                    borderColor: `${selectedModule.color}30`,
                    color: selectedModule.color 
                  }}
                >
                  <selectedModule.icon className="w-6 h-6" />
                </div>
                <div>
                  <div 
                    className="text-[10px] font-mono font-bold tracking-wider uppercase"
                    style={{ color: selectedModule.color }}
                  >
                    {selectedModule.tag}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedModule.name} — {selectedModule.deepDive.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedModule(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-4 leading-relaxed max-w-4xl relative z-10">
              {selectedModule.deepDive.overview}
            </p>

            {/* Core Concepts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 relative z-10">
              {selectedModule.deepDive.keyConcepts.map((c, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 font-mono">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">{c.label}</div>
                  <div className="font-bold text-slate-900">{c.value}</div>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Station Specialist: <strong className="text-slate-800 font-medium">{selectedModule.specialist}</strong> Online</span>
              </div>

              <Link
                to={selectedModule.deepDive.actionLink}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
              >
                <span>{selectedModule.deepDive.actionLabel}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
