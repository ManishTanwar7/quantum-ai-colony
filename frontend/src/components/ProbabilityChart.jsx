import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

export default function ProbabilityChart({ probabilities = {}, counts = {}, shots = 1024 }) {
  const entries = Object.entries(probabilities).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-purple-600" />
          <h4 className="text-xs font-bold font-mono uppercase text-slate-800">
            Quantum State Probability Distribution
          </h4>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">
          Shots: {shots}
        </span>
      </div>

      {/* Bar Chart Display */}
      {entries.length === 0 ? (
        <div className="h-44 flex items-center justify-center text-slate-400 text-xs font-mono">
          Run circuit to generate quantum measurement distribution
        </div>
      ) : (
        <div className="space-y-3 py-1">
          {entries.map(([basisState, prob]) => {
            const pct = Math.round(prob * 100);
            const shotCount = counts[basisState] || 0;

            return (
              <div key={basisState} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-purple-700">
                    |{basisState}⟩
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[11px]">{shotCount} shots</span>
                    <span className="font-bold text-slate-900">{pct}%</span>
                  </div>
                </div>

                {/* Animated Probability Bar */}
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      pct > 0 
                        ? 'bg-purple-600'
                        : 'bg-transparent'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between font-mono">
        <span>Basis States: 2^{Object.keys(probabilities).length ? Math.log2(Object.keys(probabilities).length) : 2}</span>
        <span>Σ P_i = 1.000</span>
      </div>

    </div>
  );
}
