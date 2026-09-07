import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function ProbabilityChart({ probabilities = {}, counts = {}, shots = 1024 }) {
  const entries = Object.entries(probabilities).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-gray-800" />
          <h4 className="text-xs font-bold font-mono uppercase text-gray-900">
            Probability Distribution
          </h4>
        </div>
        <span className="text-[10px] text-gray-500 font-mono">
          Shots: {shots}
        </span>
      </div>

      {/* Bar Chart Display */}
      {entries.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-gray-500 text-xs font-mono">
          Run circuit simulation to generate state probabilities
        </div>
      ) : (
        <div className="space-y-3 py-1">
          {entries.map(([basisState, prob]) => {
            const pct = Math.round(prob * 100);
            const shotCount = counts[basisState] || 0;

            return (
              <div key={basisState} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-gray-900">
                    |{basisState}⟩
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-[11px]">{shotCount} shots</span>
                    <span className="font-bold text-gray-900">{pct}%</span>
                  </div>
                </div>

                {/* Neutral Probability Bar */}
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-gray-900 transition-all duration-300 rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-200 text-[10px] text-gray-500 flex items-center justify-between font-mono">
        <span>Basis States: {entries.length}</span>
        <span>Σ P_i = 1.000</span>
      </div>

    </div>
  );
}
