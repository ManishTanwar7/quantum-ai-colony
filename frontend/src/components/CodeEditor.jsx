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
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs font-mono text-xs">
      
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-gray-800" />
          <span className="font-semibold text-gray-900">circuit_program.py</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-gray-700 border border-gray-300">
            Qiskit Aer
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onSyncToCircuit && (
            <button
              onClick={onSyncToCircuit}
              className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-900 border border-gray-900 rounded text-[11px] font-medium transition-colors"
              title="Parse Qiskit Code and update visual circuit"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Sync to Grid</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-900 border border-gray-900 rounded text-[11px] font-medium transition-colors"
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
          className="w-full h-full min-h-[260px] bg-transparent text-gray-900 font-mono text-xs leading-relaxed resize-none focus:outline-none focus:ring-0"
          placeholder="# Write or paste Qiskit Python code..."
        />
      </div>

      {/* Footer Info */}
      <div className="px-4 py-1.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-[10px] text-gray-500">
        <span>Target: Qiskit 1.0+ / Aer Simulator</span>
        <span>UTF-8 • Python 3</span>
      </div>

    </div>
  );
}
