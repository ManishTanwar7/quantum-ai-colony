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
    accentBorder: 'border-blue-200',
    accentBg: 'bg-blue-50/50',
    accentText: 'text-blue-800',
    shortDesc: 'Hilbert space formalism, state vectors, and Dirac bracket notation.',
    deepDive: {
      title: 'Hilbert Space Formalism & Dirac Notation',
      overview: 'Quantum states are vectors in complex Hilbert spaces C^2^N. Evolution is strictly governed by unitary operators U such that U† U = I.',
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
    accentBorder: 'border-emerald-200',
    accentBg: 'bg-emerald-50/50',
    accentText: 'text-emerald-800',
    shortDesc: 'Quantum gate net assembly and Qiskit Python code generation.',
    deepDive: {
      title: 'Quantum Logic Architecture & Synthesis',
      overview: 'Synthesize discrete gate sequences from elementary Clifford+T fault-tolerant sets. Construct superposition matrices and multi-qubit entangling gates.',
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
    accentBorder: 'border-rose-200',
    accentBg: 'bg-rose-50/50',
    accentText: 'text-rose-800',
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
    accentBorder: 'border-amber-200',
    accentBg: 'bg-amber-50/50',
    accentText: 'text-amber-800',
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
    accentBorder: 'border-purple-200',
    accentBg: 'bg-purple-50/50',
    accentText: 'text-purple-800',
    shortDesc: '3D Bloch sphere geometry & measurement probability distribution.',
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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-100 border border-gray-300 text-gray-800 text-xs font-mono">
            <Sliders className="w-3.5 h-3.5 text-gray-700" />
            <span>CENTRAL COMMAND DECK • 5 MODULAR STATIONS</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1">
            Quantum Operations Dashboard
          </h2>
          <p className="text-xs text-gray-600">
            Select any station to inspect architecture specifications and operational diagnostics
          </p>
        </div>
      </div>

      {/* 5 Module Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {MODULES.map((mod) => {
          const Icon = mod.icon;
          const isSelected = selectedModule?.id === mod.id;

          return (
            <div
              key={mod.id}
              onClick={() => setSelectedModule(mod)}
              className={`cursor-pointer p-5 rounded-xl border bg-white transition-all duration-150 flex flex-col justify-between space-y-4 shadow-xs ${
                isSelected
                  ? 'border-gray-900 ring-2 ring-gray-900/20'
                  : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${mod.accentBorder} ${mod.accentBg} ${mod.accentText}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">
                    {mod.tag.split('•')[0].trim()}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="font-bold text-base text-gray-900">{mod.name}</h3>
                  <div className="text-xs font-medium text-gray-600 mt-0.5">
                    {mod.specialist}
                  </div>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    {mod.shortDesc}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-mono text-gray-900 font-medium">
                <span className="group-hover:underline">Inspect Details</span>
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-6 lg:p-8 rounded-2xl bg-white border border-gray-300 shadow-md relative"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg border ${selectedModule.accentBorder} ${selectedModule.accentBg} ${selectedModule.accentText}`}>
                  <selectedModule.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                    {selectedModule.tag}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedModule.name} — {selectedModule.deepDive.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedModule(null)}
                className="p-1.5 text-gray-500 hover:text-gray-900 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-700 mt-3 leading-relaxed max-w-4xl">
              {selectedModule.deepDive.overview}
            </p>

            {/* Core Concepts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
              {selectedModule.deepDive.keyConcepts.map((c, i) => (
                <div key={i} className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 text-xs space-y-1 font-mono">
                  <div className="text-gray-500 text-[10px] uppercase font-bold">{c.label}</div>
                  <div className="font-semibold text-gray-900">{c.value}</div>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="mt-5 pt-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-mono text-gray-600">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>Station Specialist: <strong>{selectedModule.specialist}</strong> Online</span>
              </div>

              <Link
                to={selectedModule.deepDive.actionLink}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-gray-900 border border-gray-900 font-medium text-xs rounded transition-colors"
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
