import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw, Clock } from 'lucide-react';

export default function CircuitTimeline({ timelineSteps = [] }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (timelineSteps.length > 0) {
      setCurrentStep(timelineSteps.length - 1);
    }
  }, [timelineSteps]);

  useEffect(() => {
    let timer;
    if (isPlaying && timelineSteps.length > 0) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= timelineSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timelineSteps]);

  if (!timelineSteps || timelineSteps.length === 0) {
    return null;
  }

  const activeStepData = timelineSteps[currentStep] || timelineSteps[0];
  const stepProbs = activeStepData.state_summary || {};

  return (
    <div className="flex flex-col bg-quantum-surface border border-quantum-border rounded-2xl p-4 shadow-xl">
      
      {/* Header & Playback Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-400" />
          <h4 className="text-xs font-bold font-mono uppercase text-slate-200">
            Circuit Execution Timeline & Wavefront
          </h4>
        </div>

        {/* Play / Step Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setCurrentStep(0)}
            title="Reset to T0"
            className="p-1 hover:text-cyan-400 text-slate-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 text-cyan-400 hover:text-cyan-300 transition-colors"
            title={isPlaying ? "Pause" : "Play Timeline"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-cyan-400" />}
          </button>
          <button
            onClick={() => setCurrentStep((prev) => Math.min(timelineSteps.length - 1, prev + 1))}
            disabled={currentStep >= timelineSteps.length - 1}
            title="Next Step"
            className="p-1 hover:text-cyan-400 disabled:opacity-30 text-slate-400 transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-cyan-300 ml-1">
            Step {currentStep}/{timelineSteps.length - 1}
          </span>
        </div>
      </div>

      {/* Stepped Timeline Progress Line */}
      <div className="relative py-4">
        {/* Track Line */}
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
            style={{ width: `${(currentStep / Math.max(1, timelineSteps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Step Nodes */}
        <div className="flex justify-between -mt-2.5 relative z-10">
          {timelineSteps.map((s, idx) => {
            const isSelected = currentStep === idx;
            const isPast = currentStep >= idx;

            return (
              <button
                key={idx}
                onClick={() => { setCurrentStep(idx); setIsPlaying(false); }}
                className={`relative flex flex-col items-center group`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-cyan-500 border-white ring-4 ring-cyan-500/30 scale-125'
                      : isPast
                      ? 'bg-slate-900 border-cyan-400 text-cyan-400'
                      : 'bg-slate-950 border-slate-700 text-slate-600'
                  }`}
                >
                  <span className="text-[8px] font-bold font-mono">
                    {idx === 0 ? '0' : s.gate ? s.gate[0] : idx}
                  </span>
                </div>

                <span className={`text-[9px] font-mono mt-1 ${isSelected ? 'text-cyan-300 font-bold' : 'text-slate-500'}`}>
                  {s.gate || `T${idx}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Quantum State Preview */}
      <div className="mt-2 p-3 bg-quantum-dark/90 rounded-xl border border-quantum-border/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div>
          <span className="text-slate-400 text-[10px]">Applied Unitary:</span>
          <div className="text-cyan-300 font-bold text-sm">
            {activeStepData.gate === 'INIT' ? 'Initial |00...0⟩' : `${activeStepData.gate} on Qubit ${activeStepData.target}`}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[10px]">State Amplitudes:</span>
          <div className="flex items-center gap-1.5">
            {Object.entries(stepProbs).slice(0, 4).map(([st, p]) => (
              <span key={st} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-purple-300">
                |{st}⟩: {Math.round(p * 100)}%
              </span>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
