import React, { useState } from 'react';
import { Play, Trash2, Sliders } from 'lucide-react';

const GATE_PALETTE = [
  { gate: 'H', label: 'H', desc: 'Hadamard (Superposition)', color: 'bg-sky-50 text-sky-800 border-sky-300 hover:bg-sky-100' },
  { gate: 'X', label: 'X', desc: 'Pauli-X (NOT bit-flip)', color: 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100' },
  { gate: 'Y', label: 'Y', desc: 'Pauli-Y (Bit & Phase flip)', color: 'bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100' },
  { gate: 'Z', label: 'Z', desc: 'Pauli-Z (Phase-flip)', color: 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100' },
  { gate: 'S', label: 'S', desc: 'Phase Gate (pi/2)', color: 'bg-indigo-50 text-indigo-800 border-indigo-300 hover:bg-indigo-100' },
  { gate: 'T', label: 'T', desc: 'pi/4 Phase Gate', color: 'bg-violet-50 text-violet-800 border-violet-300 hover:bg-violet-100' },
  { gate: 'CX', label: 'CX', desc: 'Controlled-NOT (CNOT)', color: 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 font-bold' },
  { gate: 'CZ', label: 'CZ', desc: 'Controlled-Z', color: 'bg-orange-50 text-orange-800 border-orange-300 hover:bg-orange-100 font-bold' },
  { gate: 'SWAP', label: 'SW', desc: 'SWAP Qubits', color: 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-300 hover:bg-fuchsia-100 font-bold' },
  { gate: 'M', label: 'M', desc: 'Measurement', color: 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200' },
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
  const numSteps = 8; // Columns in grid

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
    <div className="flex flex-col bg-white border border-slate-200 rounded-2xl p-4 lg:p-6 shadow-xs">
      
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span>Visual Circuit Foundry</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-50 border border-purple-200 text-purple-700 font-semibold">
              {gates.length} Gates
            </span>
          </h3>

          {/* Qubit Count Controller */}
          <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 text-xs font-mono">
            <span className="text-slate-500 text-[11px]">Qubits:</span>
            {[1, 2, 3, 4].map(n => (
              <button
                key={n}
                onClick={() => onChangeQubits && onChangeQubits(n)}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${
                  numQubits === n ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
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
          <div className="hidden sm:flex items-center gap-1 text-xs font-mono">
            <span className="text-slate-500 text-[11px]">Presets:</span>
            <button
              onClick={() => loadPreset('bell')}
              className="px-2 py-1 bg-white hover:bg-slate-50 text-slate-700 rounded border border-slate-200 text-[11px] transition-colors shadow-xs"
            >
              Bell State
            </button>
            <button
              onClick={() => loadPreset('ghz')}
              className="px-2 py-1 bg-white hover:bg-slate-50 text-slate-700 rounded border border-slate-200 text-[11px] transition-colors shadow-xs"
            >
              GHZ State
            </button>
            <button
              onClick={() => loadPreset('grover')}
              className="px-2 py-1 bg-white hover:bg-slate-50 text-slate-700 rounded border border-slate-200 text-[11px] transition-colors shadow-xs"
            >
              Grover 2Q
            </button>
          </div>

          <button
            onClick={clearCircuit}
            title="Clear Circuit"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={onRunSimulation}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isRunning ? 'SIMULATING...' : 'RUN SIMULATION'}</span>
          </button>
        </div>
      </div>

      {/* Gate Palette (Toolbox) */}
      <div className="py-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500 font-mono mr-1">Palette:</span>
        {GATE_PALETTE.map((g) => {
          const isSelected = selectedGate?.gate === g.gate;
          return (
            <div
              key={g.gate}
              draggable
              onDragStart={() => setDraggedGate(g)}
              onClick={() => setSelectedGate(isSelected ? null : g)}
              className={`w-9 h-9 rounded-lg border flex items-center justify-center font-bold text-xs font-mono cursor-pointer select-none transition-all ${g.color} ${
                isSelected ? 'ring-2 ring-purple-600 scale-105 shadow-xs' : 'hover:scale-105'
              }`}
              title={`${g.label} - ${g.desc}`}
            >
              {g.label}
            </div>
          );
        })}
        {selectedGate && (
          <span className="text-[11px] text-purple-700 font-mono ml-2">
            Click circuit slot to place <strong className="text-slate-900">[{selectedGate.gate}]</strong>
          </span>
        )}
      </div>

      {/* Quantum Circuit Grid */}
      <div className="mt-2 bg-slate-50 rounded-xl p-4 border border-slate-200 overflow-x-auto">
        <div className="min-w-[540px] space-y-4">
          {Array.from({ length: numQubits }).map((_, qIdx) => (
            <div key={qIdx} className="relative flex items-center">
              
              {/* Qubit Label */}
              <div className="w-16 flex items-center gap-2 font-mono text-xs font-semibold text-slate-800 shrink-0">
                <span>|0⟩ q{qIdx}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>

              {/* Quantum Wire */}
              <div className="absolute left-16 right-4 top-1/2 -translate-y-1/2 h-[2px] bg-slate-300 pointer-events-none" />

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
                          ? 'bg-white border-purple-500 shadow-xs text-purple-900'
                          : 'bg-white border-slate-200 hover:border-purple-300 hover:bg-purple-50/20'
                      }`}
                    >
                      {gateObj ? (
                        <div className="flex flex-col items-center justify-center font-mono text-xs font-bold text-purple-900">
                          <span>{gateObj.gate}</span>
                          {gateObj.control !== null && gateObj.control !== undefined && (
                            <span className="text-[8px] text-amber-700 font-normal">
                              c:{gateObj.control}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>

        {/* Step Timestamps Header */}
        <div className="flex items-center pl-20 pr-4 mt-3 text-[10px] font-mono text-slate-400 justify-between min-w-[540px]">
          {Array.from({ length: numSteps }).map((_, s) => (
            <span key={s} className="w-11 text-center">T{s}</span>
          ))}
        </div>

      </div>

    </div>
  );
}
