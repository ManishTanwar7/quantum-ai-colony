import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Play, Sparkles, Terminal, ArrowRight } from 'lucide-react';

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
      gatePreview: "qc.cz(0, 1)"
    },
    {
      title: "Step 3: Diffusion Operator & Amplification",
      description: "Invert amplitudes about their mathematical mean to maximize constructive interference on target state.",
      formula: "U_s = 2|s⟩⟨s| - I",
      gatePreview: "qc.h([0,1]); qc.x([0,1]); qc.cz(0,1); qc.x([0,1]); qc.h([0,1])"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 shadow-xs">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-purple-700 font-bold uppercase tracking-wider">
                Gamified Colony Mission
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {mission.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with Step-by-Step Guidance */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          
          <p className="text-xs text-slate-600 leading-relaxed">
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
                    ? 'bg-purple-50 border-purple-600 text-purple-900 font-bold shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="text-[10px] font-mono text-slate-400">PHASE 0{idx + 1}</div>
                <div className="truncate mt-0.5">{step.title.split(':')[1] || step.title}</div>
              </button>
            ))}
          </div>

          {/* Active Step Content */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 font-mono flex items-center gap-2">
                <span className="text-purple-700">0{activeStep + 1}.</span>
                <span>{steps[activeStep].title}</span>
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 border border-purple-200 text-purple-700 font-semibold">
                Phase Active
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {steps[activeStep].description}
            </p>

            {/* Formula card */}
            {steps[activeStep].formula && (
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-center font-mono text-xs text-purple-800 shadow-xs">
                <div className="text-[10px] text-slate-500 mb-0.5 font-sans">Mathematical Operator:</div>
                <div className="text-sm font-bold text-purple-900">{steps[activeStep].formula}</div>
              </div>
            )}

            {/* Gate Assembly Preview */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-slate-600 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-600" />
                <span>Synthesized Gate Logic:</span>
              </div>
              <pre className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] font-mono text-slate-800 overflow-x-auto shadow-xs">
                {steps[activeStep].gatePreview}
              </pre>
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1))}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-300 text-xs font-mono transition-colors shadow-xs"
          >
            Previous Phase
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0))}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-300 text-xs font-mono transition-colors shadow-xs"
            >
              Next Phase
            </button>

            <button
              onClick={() => {
                onClose();
                if (onLaunchToColony) onLaunchToColony(mission.title, mission.prompt);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Deploy to Colony Station</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
