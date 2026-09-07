import React, { useState } from 'react';
import { Play, Trash2, Sliders } from 'lucide-react';

const GATE_PALETTE = [
  { gate: 'H', label: 'H', desc: 'Hadamard (Superposition)', color: 'bg-white text-gray-900 border-gray-900 hover:bg-gray-100' },
  { gate: 'X', label: 'X', desc: 'Pauli-X (NOT bit-flip)', color: 'bg-white text-gray-900 border-gray-900 hover:bg-gray-100' },
  { gate: 'Y', label: 'Y', desc: 'Pauli-Y (Bit & Phase flip)', color: 'bg-white text-gray-900 border-gray-900 hover:bg-gray-100' },
  { gate: 'Z', label: 'Z', desc: 'Pauli-Z (Phase-flip)', color: 'bg-white text-gray-900 border-gray-900 hover:bg-gray-100' },
  { gate: 'S', label: 'S', desc: 'Phase Gate (pi/2)', color: 'bg-white text-gray-900 border-gray-900 hover:bg-gray-100' },
  { gate: 'T', label: 'T', desc: 'pi/4 Phase Gate', color: 'bg-white text-gray-900 border-gray-900 hover:bg-gray-100' },
  { gate: 'CX', label: 'CX', desc: 'Controlled-NOT (CNOT)', color: 'bg-gray-100 text-gray-900 border-gray-900 font-bold hover:bg-gray-200' },
  { gate: 'CZ', label: 'CZ', desc: 'Controlled-Z', color: 'bg-gray-100 text-gray-900 border-gray-900 font-bold hover:bg-gray-200' },
  { gate: 'SWAP', label: 'SW', desc: 'SWAP Qubits', color: 'bg-gray-100 text-gray-900 border-gray-900 font-bold hover:bg-gray-200' },
  { gate: 'M', label: 'M', desc: 'Measurement', color: 'bg-white text-gray-700 border-gray-400 hover:bg-gray-100' },
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
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl p-4 lg:p-6 shadow-xs">
      
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h3 className="text-xs font-bold font-mono text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <span>Visual Circuit Foundry</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 border border-gray-300 text-gray-800">
              {gates.length} Gates
            </span>
          </h3>

          {/* Qubit Count Controller */}
          <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded border border-gray-300 text-xs font-mono">
            <span className="text-gray-600 text-[11px]">Qubits:</span>
            {[1, 2, 3, 4].map(n => (
              <button
                key={n}
                onClick={() => onChangeQubits && onChangeQubits(n)}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${
                  numQubits === n 
                    ? 'bg-white border border-gray-900 text-gray-900 font-bold shadow-xs' 
                    : 'text-gray-600 hover:text-black'
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
            <span className="text-gray-500 text-[11px]">Presets:</span>
            <button
              onClick={() => loadPreset('bell')}
              className="px-2 py-1 bg-white hover:bg-gray-100 text-gray-900 rounded border border-gray-900 text-[11px] font-medium transition-colors"
            >
              Bell State
            </button>
            <button
              onClick={() => loadPreset('ghz')}
              className="px-2 py-1 bg-white hover:bg-gray-100 text-gray-900 rounded border border-gray-900 text-[11px] font-medium transition-colors"
            >
              GHZ State
            </button>
            <button
              onClick={() => loadPreset('grover')}
              className="px-2 py-1 bg-white hover:bg-gray-100 text-gray-900 rounded border border-gray-900 text-[11px] font-medium transition-colors"
            >
              Grover 2Q
            </button>
          </div>

          <button
            onClick={clearCircuit}
            title="Clear Circuit"
            className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded border border-gray-300 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onRunSimulation}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs rounded border border-gray-900 transition-colors disabled:opacity-50"
          >
            <Play className="w-3 h-3 fill-gray-900" />
            <span>{isRunning ? 'RUNNING...' : 'RUN SIMULATION'}</span>
          </button>
        </div>
      </div>

      {/* Gate Palette (Toolbox) */}
      <div className="py-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-600 font-mono mr-1">Palette:</span>
        {GATE_PALETTE.map((g) => {
          const isSelected = selectedGate?.gate === g.gate;
          return (
            <div
              key={g.gate}
              draggable
              onDragStart={() => setDraggedGate(g)}
              onClick={() => setSelectedGate(isSelected ? null : g)}
              className={`w-8 h-8 rounded border flex items-center justify-center font-bold text-xs font-mono cursor-pointer select-none transition-all ${g.color} ${
                isSelected ? 'ring-2 ring-gray-900 scale-105 shadow-xs' : 'hover:border-gray-900'
              }`}
              title={`${g.label} - ${g.desc}`}
            >
              {g.label}
            </div>
          );
        })}
        {selectedGate && (
          <span className="text-[11px] text-gray-800 font-mono ml-2">
            Click grid to place <strong>[{selectedGate.gate}]</strong>
          </span>
        )}
      </div>

      {/* Quantum Circuit Grid */}
      <div className="mt-2 bg-gray-50 rounded-xl p-4 border border-gray-200 overflow-x-auto">
        <div className="min-w-[540px] space-y-4">
          {Array.from({ length: numQubits }).map((_, qIdx) => (
            <div key={qIdx} className="relative flex items-center">
              
              {/* Qubit Label */}
              <div className="w-16 flex items-center gap-1.5 font-mono text-xs font-bold text-gray-900 shrink-0">
                <span>|0⟩ q{qIdx}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              </div>

              {/* Quantum Wire */}
              <div className="absolute left-16 right-4 top-1/2 -translate-y-1/2 h-[2px] bg-gray-300 pointer-events-none" />

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
                      className={`h-10 rounded border flex items-center justify-center cursor-pointer transition-colors ${
                        gateObj
                          ? 'bg-white border border-gray-900 shadow-xs'
                          : 'bg-white border border-dashed border-gray-300 hover:border-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {gateObj ? (
                        <div className="flex flex-col items-center justify-center font-mono text-xs font-bold text-gray-900">
                          <span>{gateObj.gate}</span>
                          {gateObj.control !== null && gateObj.control !== undefined && (
                            <span className="text-[8px] text-gray-600 font-normal">
                              c:{gateObj.control}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>

        {/* Step Timestamps Header */}
        <div className="flex items-center pl-20 pr-4 mt-3 text-[10px] font-mono text-gray-500 justify-between min-w-[540px]">
          {Array.from({ length: numSteps }).map((_, s) => (
            <span key={s} className="w-10 text-center">T{s}</span>
          ))}
        </div>

      </div>

    </div>
  );
}
