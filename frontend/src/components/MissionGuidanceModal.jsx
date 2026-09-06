import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CheckCircle2, ChevronRight, Play, Sparkles, 
  Terminal, ShieldCheck, Cpu, ArrowRight 
} from 'lucide-react';

export default function MissionGuidanceModal({ mission, onClose, onLaunchToColony }) {
  const [activeStep, setActiveStep] = useState(0);

  if (!mission) return null;

  const steps = mission.steps || [
    {
      title: "Step 1: Hilbert Space State Preparation",
      description: "Initialize target register in equal superposition across all computational basis states using Hadamard gates.",
      formula: "|ψ₀⟩ = H⊗ⁿ |0⟩ⁿ = 1/√N ∑ |x⟩",
      gatePreview: "qc.h(range(n))"
    },
    {
      title: "Step 2: Quantum Phase Inversion Oracle",
      description: "Apply conditional phase flip unitary U_ω to mark the target state with a negative amplitude phase kickback.",
      formula: "U_ω |x⟩ = (-1)^f(x) |x⟩",
      gatePreview: "qc.cz(0, 1)  # Or multi-controlled Z"
    },
    {
      title: "Step 3: Diffusion Operator & Amplification",
      description: "Invert amplitudes about their mathematical mean to maximize constructive interference on target state.",
      formula: "U_s = 2|s⟩⟨s| - I",
      gatePreview: "qc.h([0,1]); qc.x([0,1]); qc.cz(0,1); qc.x([0,1]); qc.h([0,1])"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-quantum-surface border border-cyan-500/50 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.2)] flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-quantum-border bg-gradient-to-r from-quantum-dark via-quantum-surface to-quantum-dark flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                Gamified Colony Mission
              </div>
              <h3 className="text-lg font-bold text-white">
                {mission.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with Step-by-Step Guidance */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          <p className="text-xs text-slate-300 leading-relaxed">
            {mission.prompt}
          </p>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-3 gap-2">
            {steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  activeStep === idx
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'bg-quantum-dark/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-[10px] font-mono text-slate-500">PHASE 0{idx + 1}</div>
                <div className="truncate mt-0.5">{step.title.split(':')[1] || step.title}</div>
              </button>
            ))}
          </div>

          {/* Active Step Content */}
          <div className="p-5 rounded-2xl bg-quantum-dark border border-quantum-border space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-white font-mono flex items-center gap-2">
                <span className="text-cyan-400">0{activeStep + 1}.</span>
                <span>{steps[activeStep].title}</span>
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                Phase Active
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {steps[activeStep].description}
            </p>

            {/* Formula card */}
            {steps[activeStep].formula && (
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-center font-mono text-xs text-purple-300">
                <div className="text-[10px] text-slate-500 mb-0.5">Mathematical Operator:</div>
                <div className="text-sm font-bold text-cyan-200">{steps[activeStep].formula}</div>
              </div>
            )}

            {/* Gate Assembly Preview */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Synthesized Gate Logic:</span>
              </div>
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                {steps[activeStep].gatePreview}
              </pre>
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 border-t border-quantum-border bg-quantum-dark flex items-center justify-between gap-3">
          <button
            onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1))}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 text-xs font-mono transition-colors"
          >
            Previous Phase
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0))}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 text-xs font-mono transition-colors"
            >
              Next Phase
            </button>

            <button
              onClick={() => {
                onClose();
                if (onLaunchToColony) onLaunchToColony(mission.title, mission.prompt);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Deploy to Colony Station</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
