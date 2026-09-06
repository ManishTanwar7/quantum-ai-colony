import React, { useState } from 'react';
import { Terminal, Copy, Check, RefreshCw } from 'lucide-react';

export default function CodeEditor({ code, onChangeCode, onSyncToCircuit }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-quantum-dark rounded-2xl border border-quantum-border overflow-hidden shadow-xl font-mono text-xs">
      
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-quantum-surface border-b border-quantum-border/60">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-200">circuit_program.py</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-700/40">
            Qiskit Aer
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onSyncToCircuit && (
            <button
              onClick={onSyncToCircuit}
              className="flex items-center gap-1 px-2.5 py-1 bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800 rounded text-[11px] transition-colors"
              title="Parse Qiskit Code and update visual circuit"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Sync to Grid</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-[11px] transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 p-3 bg-quantum-dark relative">
        <textarea
          value={code}
          onChange={(e) => onChangeCode && onChangeCode(e.target.value)}
          spellCheck="false"
          className="w-full h-full min-h-[260px] bg-transparent text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none focus:ring-0 selection:bg-cyan-500/30"
          placeholder="# Write or paste Qiskit Python code..."
        />
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 bg-quantum-surface/60 border-t border-quantum-border/40 flex items-center justify-between text-[10px] text-slate-500">
        <span>Target: Qiskit 1.0+ / Aer Simulator</span>
        <span>UTF-8 • Python 3</span>
      </div>

    </div>
  );
}
