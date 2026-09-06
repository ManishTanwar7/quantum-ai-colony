import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Atom, Cpu, Terminal, BookOpen, Trophy, ShieldCheck, 
  Sparkles, ArrowRight, Zap, Bug, Eye, Activity 
} from 'lucide-react';

const AGENTS = [
  { name: 'Prof. Evelyn Vance', role: 'Theory AI', icon: BookOpen, color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', desc: 'Explains Hilbert space axioms, Hamiltonians, and algorithm physics.' },
  { name: 'Devin Matrix', role: 'Engineer AI', icon: Cpu, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', desc: 'Synthesizes unitary logic gate sequences and generates executable Qiskit code.' },
  { name: 'Agent BugHunter', role: 'Debugger AI', icon: Bug, color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10', desc: 'Audits circuits for decoherence sensitivity, unitarity leaks, and phase errors.' },
  { name: 'OptiPrime', role: 'Optimizer AI', icon: Zap, color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10', desc: 'Eliminates redundant gates, cancels self-inverses, and minimizes circuit depth.' },
  { name: 'Iris Quantum', role: 'Visualizer AI', icon: Eye, color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10', desc: 'Maps quantum states to 3D Bloch spheres and computes probability distributions.' },
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-16">
      
      {/* Hero Section */}
      <div className="relative rounded-3xl p-8 lg:p-14 bg-gradient-to-b from-[#0e173e] via-quantum-surface to-quantum-dark border border-cyan-500/30 overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.1)]">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Multi-Agent Quantum Co-Pilot</span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Pioneer Quantum Computing with{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 bg-clip-text text-transparent">
              Autonomous AI
            </span>
          </h1>

          <p className="text-base lg:text-lg text-slate-300 leading-relaxed font-light">
            Assign grand quantum computing challenges to a colony of specialized AI agents. Watch them debate, assemble circuits on an animated railway track, optimize gate depth, and project statevectors onto interactive 3D Bloch spheres.
          </p>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              to="/colony"
              className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all hover:scale-105"
            >
              <Cpu className="w-4 h-4" />
              <span>Launch Colony Station</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/lab"
              className="flex items-center gap-2.5 px-6 py-3.5 bg-quantum-surface hover:bg-slate-800 text-slate-200 font-semibold text-sm rounded-xl border border-quantum-border hover:border-cyan-400/60 transition-all"
            >
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Enter Quantum Lab Studio</span>
            </Link>

            <Link
              to="/challenges"
              className="flex items-center gap-2 px-5 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-sm font-medium rounded-xl border border-slate-800 transition-colors"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Solve Challenges</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Meet the Colony Agents Section */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase text-cyan-400 tracking-wider">Collective Intelligence</div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mt-1">The 5 Colony AI Agents</h2>
          </div>
          <Link to="/colony" className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1">
            <span>Assign Tasks in Colony Station</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {AGENTS.map((agent, i) => {
            const Icon = agent.icon;
            return (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`p-5 rounded-2xl border ${agent.border} ${agent.bg} flex flex-col justify-between space-y-4 shadow-lg hover:border-cyan-400/60 transition-all`}
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-quantum-dark border border-quantum-border shadow-inner ${agent.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-100">{agent.name}</h3>
                  <div className={`text-xs font-mono font-semibold ${agent.color} mt-0.5`}>
                    {agent.role}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {agent.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Bus Node #{i + 1}</span>
                  <span className="text-emerald-400 font-semibold">Active</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Core Platform Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Quantum Circuit Studio */}
        <div className="p-6 rounded-2xl bg-quantum-surface border border-quantum-border hover:border-cyan-500/40 transition-all space-y-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Terminal className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Quantum Circuit Studio</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Drag and drop unitary quantum gates (H, CX, CZ, Pauli, rotations) onto multi-qubit wires with dual-mode Qiskit code synchronization and instant statevector calculation.
          </p>
          <Link to="/lab" className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300">
            <span>Open Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 2: 3D Bloch Sphere & Math */}
        <div className="p-6 rounded-2xl bg-quantum-surface border border-quantum-border hover:border-purple-500/40 transition-all space-y-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">3D Bloch Spheres & Timelines</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Visualize pure and mixed single-qubit states on interactive 3D Bloch spheres. Advance circuit execution step-by-step with animated wave pulses and probability bar charts.
          </p>
          <Link to="/lab" className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300">
            <span>Explore Visualizers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 3: Auto-Graded Challenges */}
        <div className="p-6 rounded-2xl bg-quantum-surface border border-quantum-border hover:border-amber-500/40 transition-all space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Auto-Graded Challenges</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Test your quantum programming skills against rigorous test suites. The auto-grader verifies quantum state fidelity, enforces gate count limits, and provides instant coaching.
          </p>
          <Link to="/challenges" className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300">
            <span>Take Challenges</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
}
