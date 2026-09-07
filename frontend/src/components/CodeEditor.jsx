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
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs font-mono text-xs">
      
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-purple-600" />
          <span className="font-semibold text-slate-800">circuit_program.py</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
            Qiskit Aer
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onSyncToCircuit && (
            <button
              onClick={onSyncToCircuit}
              className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-[11px] font-medium transition-colors shadow-xs"
              title="Parse Qiskit Code and update visual circuit"
            >
              <RefreshCw className="w-3 h-3 text-purple-600" />
              <span>Sync to Grid</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-[11px] font-medium transition-colors shadow-xs"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 p-3 bg-white relative">
        <textarea
          value={code}
          onChange={(e) => onChangeCode && onChangeCode(e.target.value)}
          spellCheck="false"
          className="w-full h-full min-h-[260px] bg-transparent text-slate-900 font-mono text-xs leading-relaxed resize-none focus:outline-none focus:ring-0 selection:bg-purple-100"
          placeholder="# Write or paste Qiskit Python code..."
        />
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
        <span>Target: Qiskit 1.0+ / Aer Simulator</span>
        <span>UTF-8 • Python 3</span>
      </div>

    </div>
  );
}
