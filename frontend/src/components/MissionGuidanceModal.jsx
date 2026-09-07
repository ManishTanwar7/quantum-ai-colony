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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="w-full max-w-2xl bg-white border border-gray-300 rounded-2xl overflow-hidden shadow-lg flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-white border border-gray-300 text-gray-900">
              <Sparkles className="w-4 h-4 text-gray-800" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                Mission Guidance Protocol
              </div>
              <h3 className="text-base font-bold text-gray-900">
                {mission.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-black rounded border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body with Step-by-Step Guidance */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          
          <p className="text-xs text-gray-700 leading-relaxed">
            {mission.prompt}
          </p>

          {/* Stepper Tabs (Flat Style) */}
          <div className="grid grid-cols-3 gap-2">
            {steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded border text-left text-xs transition-colors ${
                  activeStep === idx
                    ? 'bg-gray-100 border-gray-900 text-gray-900 font-bold'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="text-[10px] font-mono text-gray-500">PHASE 0{idx + 1}</div>
                <div className="truncate mt-0.5">{step.title.split(':')[1] || step.title}</div>
              </button>
            ))}
          </div>

          {/* Active Step Content */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-gray-900 font-mono flex items-center gap-1.5">
                <span>0{activeStep + 1}.</span>
                <span>{steps[activeStep].title}</span>
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-white border border-gray-300 text-gray-700">
                Active
              </span>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed">
              {steps[activeStep].description}
            </p>

            {/* Formula card */}
            {steps[activeStep].formula && (
              <div className="p-3 bg-white rounded border border-gray-300 text-center font-mono text-xs text-gray-900">
                <div className="text-[10px] text-gray-500 mb-0.5">Mathematical Operator:</div>
                <div className="text-sm font-bold text-gray-900">{steps[activeStep].formula}</div>
              </div>
            )}

            {/* Gate Assembly Preview */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-gray-600 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-gray-700" />
                <span>Gate Logic Preview:</span>
              </div>
              <pre className="p-3 bg-white rounded border border-gray-300 text-[11px] font-mono text-gray-900 overflow-x-auto">
                {steps[activeStep].gatePreview}
              </pre>
            </div>
          </div>

        </div>

        {/* Modal Footer Controls (Flat Buttons) */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-3">
          <button
            onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1))}
            className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-900 rounded border border-gray-900 text-xs font-mono font-medium transition-colors"
          >
            Previous Phase
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0))}
              className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-900 rounded border border-gray-300 text-xs font-mono font-medium transition-colors"
            >
              Next Phase
            </button>

            <button
              onClick={() => {
                onClose();
                if (onLaunchToColony) onLaunchToColony(mission.title, mission.prompt);
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs rounded border border-gray-900 transition-colors"
            >
              <Play className="w-3 h-3 fill-gray-900" />
              <span>Deploy to Colony Station</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
