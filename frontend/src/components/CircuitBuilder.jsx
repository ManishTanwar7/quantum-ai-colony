import React, { useState } from 'react';
import { Play, Trash2, Plus, RotateCcw, Sparkles, Sliders } from 'lucide-react';

const GATE_PALETTE = [
  { gate: 'H', label: 'H', desc: 'Hadamard (Superposition)', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
  { gate: 'X', label: 'X', desc: 'Pauli-X (NOT bit-flip)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  { gate: 'Y', label: 'Y', desc: 'Pauli-Y (Bit & Phase flip)', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
  { gate: 'Z', label: 'Z', desc: 'Pauli-Z (Phase-flip)', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
  { gate: 'S', label: 'S', desc: 'Phase Gate (pi/2)', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
  { gate: 'T', label: 'T', desc: 'pi/4 Phase Gate', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
  { gate: 'CX', label: 'CX', desc: 'Controlled-NOT (CNOT)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  { gate: 'CZ', label: 'CZ', desc: 'Controlled-Z', color: 'bg-orange-500/20 text-orange-300 border-orange-500/40' },
  { gate: 'SWAP', label: 'SW', desc: 'SWAP Qubits', color: 'bg-pink-500/20 text-pink-300 border-pink-500/40' },
  { gate: 'M', label: 'M', desc: 'Measurement', color: 'bg-slate-700 text-slate-200 border-slate-600' },
];

export default function CircuitBuilder({ 
  numQubits = 2, 
  onChangeQubits, 
  gates = [], 
  onUpdateGates, 
  onRunSimulation, 
  isRunning = false 
}) {
  const [selectedGate, setSelectedGate] = useState(null);
  const [draggedGate, setDraggedGate] = useState(null);
  const numSteps = 8; // Number of columns in the grid

  // Grid representation: grid[qubit][step] = gateObj
  const grid = Array.from({ length: numQubits }, () => Array(numSteps).fill(null));

  // Populate grid from gates array
  gates.forEach((g, idx) => {
    const step = g.step !== undefined ? g.step : (idx % numSteps);
    if (g.target < numQubits && step < numSteps) {
      grid[g.target][step] = g;
    }
  });

  const handleCellClick = (qubitIdx, stepIdx) => {
    if (grid[qubitIdx][stepIdx]) {
      // Remove gate
      const newGates = gates.filter(g => !(g.target === qubitIdx && (g.step === stepIdx || (g.step === undefined && gates.indexOf(g) % numSteps === stepIdx))));
      onUpdateGates(newGates);
    } else if (selectedGate) {
      // Place gate
      const newGateObj = {
        gate: selectedGate.gate,
        target: qubitIdx,
        step: stepIdx,
        control: (selectedGate.gate === 'CX' || selectedGate.gate === 'CZ' || selectedGate.gate === 'SWAP')
          ? (qubitIdx === 0 ? 1 : 0)
          : null
      };
      onUpdateGates([...gates, newGateObj]);
    }
  };

  const handleDrop = (qubitIdx, stepIdx) => {
    if (!draggedGate) return;
    const newGateObj = {
      gate: draggedGate.gate,
      target: qubitIdx,
      step: stepIdx,
      control: (draggedGate.gate === 'CX' || draggedGate.gate === 'CZ' || draggedGate.gate === 'SWAP')
        ? (qubitIdx === 0 ? 1 : 0)
        : null
    };
    onUpdateGates([...gates, newGateObj]);
    setDraggedGate(null);
  };

  const clearCircuit = () => {
    onUpdateGates([]);
  };

  const loadPreset = (presetName) => {
    if (presetName === 'bell') {
      if (onChangeQubits) onChangeQubits(2);
      onUpdateGates([
        { gate: 'H', target: 0, step: 0 },
        { gate: 'CX', control: 0, target: 1, step: 1 },
      ]);
    } else if (presetName === 'ghz') {
      if (onChangeQubits) onChangeQubits(3);
      onUpdateGates([
        { gate: 'H', target: 0, step: 0 },
        { gate: 'CX', control: 0, target: 1, step: 1 },
        { gate: 'CX', control: 1, target: 2, step: 2 },
      ]);
    } else if (presetName === 'grover') {
      if (onChangeQubits) onChangeQubits(2);
      onUpdateGates([
        { gate: 'H', target: 0, step: 0 },
        { gate: 'H', target: 1, step: 0 },
        { gate: 'CZ', control: 0, target: 1, step: 1 },
        { gate: 'H', target: 0, step: 2 },
        { gate: 'H', target: 1, step: 2 },
        { gate: 'X', target: 0, step: 3 },
        { gate: 'X', target: 1, step: 3 },
        { gate: 'CZ', control: 0, target: 1, step: 4 },
        { gate: 'X', target: 0, step: 5 },
        { gate: 'X', target: 1, step: 5 },
        { gate: 'H', target: 0, step: 6 },
        { gate: 'H', target: 1, step: 6 },
      ]);
    }
  };

  return (
    <div className="flex flex-col bg-quantum-surface border border-quantum-border rounded-2xl p-4 lg:p-6 shadow-2xl">
      
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-quantum-border/60">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <span>Visual Circuit Foundry</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-400">
              {gates.length} Gates
            </span>
          </h3>

          {/* Qubit Count Controller */}
          <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400 text-[11px]">Qubits:</span>
            {[1, 2, 3, 4].map(n => (
              <button
                key={n}
                onClick={() => onChangeQubits && onChangeQubits(n)}
                className={`px-2 py-0.5 rounded text-xs font-mono ${
                  numQubits === n ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls & Presets */}
        <div className="flex items-center gap-2">
          {/* Preset Buttons */}
          <div className="hidden sm:flex items-center gap-1 text-xs">
            <span className="text-slate-500 text-[11px]">Presets:</span>
            <button
              onClick={() => loadPreset('bell')}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-[11px] font-mono transition-colors"
            >
              Bell State
            </button>
            <button
              onClick={() => loadPreset('ghz')}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-[11px] font-mono transition-colors"
            >
              GHZ State
            </button>
            <button
              onClick={() => loadPreset('grover')}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-[11px] font-mono transition-colors"
            >
              Grover 2Q
            </button>
          </div>

          <button
            onClick={clearCircuit}
            title="Clear Circuit"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg border border-slate-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={onRunSimulation}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>{isRunning ? 'SIMULATING...' : 'RUN SIMULATION'}</span>
          </button>
        </div>
      </div>

      {/* Gate Palette (Toolbox) */}
      <div className="py-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-mono mr-1">Gate Palette:</span>
        {GATE_PALETTE.map((g) => {
          const isSelected = selectedGate?.gate === g.gate;
          return (
            <div
              key={g.gate}
              draggable
              onDragStart={() => setDraggedGate(g)}
              onClick={() => setSelectedGate(isSelected ? null : g)}
              className={`w-9 h-9 rounded-lg border flex items-center justify-center font-bold text-xs font-mono cursor-pointer select-none transition-all ${g.color} ${
                isSelected ? 'ring-2 ring-cyan-400 scale-110 shadow-[0_0_12px_rgba(0,240,255,0.4)]' : 'hover:scale-105'
              }`}
              title={`${g.label} - ${g.desc}`}
            >
              {g.label}
            </div>
          );
        })}
        {selectedGate && (
          <span className="text-[11px] text-cyan-300 font-mono ml-2">
            Click circuit slot to place <strong className="text-white">[{selectedGate.gate}]</strong>
          </span>
        )}
      </div>

      {/* Quantum Circuit Grid */}
      <div className="mt-2 bg-quantum-dark/80 rounded-xl p-4 border border-quantum-border/80 overflow-x-auto">
        <div className="min-w-[540px] space-y-4">
          {Array.from({ length: numQubits }).map((_, qIdx) => (
            <div key={qIdx} className="relative flex items-center">
              
              {/* Qubit Label */}
              <div className="w-16 flex items-center gap-2 font-mono text-xs font-semibold text-cyan-400 shrink-0">
                <span>|0⟩ q{qIdx}</span>
                <span className="w-2 h-2 rounded-full bg-cyan-500/40" />
              </div>

              {/* Quantum Wire (Horizontal line) */}
              <div className="absolute left-16 right-4 top-1/2 -translate-y-1/2 h-[2px] bg-slate-700 pointer-events-none" />

              {/* Time Step Slots */}
              <div className="flex-1 grid grid-cols-8 gap-2 relative z-10 pl-2">
                {Array.from({ length: numSteps }).map((_, sIdx) => {
                  const gateObj = grid[qIdx][sIdx];

                  return (
                    <div
                      key={sIdx}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(qIdx, sIdx)}
                      onClick={() => handleCellClick(qIdx, sIdx)}
                      className={`h-11 rounded-lg border flex items-center justify-center cursor-pointer transition-all ${
                        gateObj
                          ? 'bg-slate-900 border-cyan-500/60 shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                          : 'bg-slate-950/40 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/40'
                      }`}
                    >
                      {gateObj ? (
                        <div className="flex flex-col items-center justify-center font-mono text-xs font-bold text-cyan-300">
                          <span>{gateObj.gate}</span>
                          {gateObj.control !== null && gateObj.control !== undefined && (
                            <span className="text-[8px] text-amber-400 font-normal">
                              c:{gateObj.control}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>

        {/* Step Timestamps Header */}
        <div className="flex items-center pl-20 pr-4 mt-3 text-[10px] font-mono text-slate-500 justify-between min-w-[540px]">
          {Array.from({ length: numSteps }).map((_, s) => (
            <span key={s} className="w-11 text-center">T{s}</span>
          ))}
        </div>

      </div>

    </div>
  );
}
