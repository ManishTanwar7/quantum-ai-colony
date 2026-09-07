import React, { useState, useEffect } from 'react';
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
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
      
      {/* Header & Playback Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-800" />
          <h4 className="text-xs font-bold font-mono uppercase text-gray-900">
            Execution Timeline
          </h4>
        </div>

        {/* Play / Step Buttons (Flat Style) */}
        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded border border-gray-200">
          <button
            onClick={() => setCurrentStep(0)}
            title="Reset to T0"
            className="p-1 text-gray-600 hover:text-black transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 text-gray-900 hover:text-black transition-colors"
            title={isPlaying ? "Pause" : "Play Timeline"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-gray-900" />}
          </button>
          <button
            onClick={() => setCurrentStep((prev) => Math.min(timelineSteps.length - 1, prev + 1))}
            disabled={currentStep >= timelineSteps.length - 1}
            title="Next Step"
            className="p-1 text-gray-600 hover:text-black disabled:opacity-30 transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-gray-800 font-medium ml-1">
            Step {currentStep}/{timelineSteps.length - 1}
          </span>
        </div>
      </div>

      {/* Stepped Timeline Progress Line */}
      <div className="relative py-4">
        {/* Track Line */}
        <div className="h-1 bg-gray-200 rounded-full relative">
          <div
            className="h-full bg-gray-900 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / Math.max(1, timelineSteps.length - 1)) * 100}%` }}
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
                className="relative flex flex-col items-center group"
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-gray-900 border-gray-900 text-white font-bold scale-110'
                      : isPast
                      ? 'bg-white border-gray-900 text-gray-900'
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                  }`}
                >
                  <span className="text-[8px] font-mono">
                    {idx === 0 ? '0' : s.gate ? s.gate[0] : idx}
                  </span>
                </div>

                <span className={`text-[9px] font-mono mt-1 ${isSelected ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
                  {s.gate || `T${idx}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Quantum State Preview */}
      <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div>
          <span className="text-gray-500 text-[10px]">Applied Operator:</span>
          <div className="text-gray-900 font-bold">
            {activeStepData.gate === 'INIT' ? 'Initial |00...0⟩' : `${activeStepData.gate} on Qubit ${activeStepData.target}`}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-[10px]">Amplitudes:</span>
          <div className="flex items-center gap-1.5">
            {Object.entries(stepProbs).slice(0, 4).map(([st, p]) => (
              <span key={st} className="px-2 py-0.5 rounded bg-white border border-gray-300 text-[11px] text-gray-800 font-medium">
                |{st}⟩: {Math.round(p * 100)}%
              </span>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
