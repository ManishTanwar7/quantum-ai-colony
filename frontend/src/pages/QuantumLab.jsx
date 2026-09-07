import React, { useState, useEffect } from 'react';
import { 
  Terminal, Layers, Code2, Save, CheckCircle2 
} from 'lucide-react';
import CircuitBuilder from '../components/CircuitBuilder';
import CodeEditor from '../components/CodeEditor';
import BlochSphere3D from '../components/BlochSphere3D';
import ProbabilityChart from '../components/ProbabilityChart';
import CircuitTimeline from '../components/CircuitTimeline';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function QuantumLab() {
  const { user } = useAuth();
  const [numQubits, setNumQubits] = useState(2);
  const [gates, setGates] = useState([
    { gate: 'H', target: 0, step: 0 },
    { gate: 'CX', control: 0, target: 1, step: 1 }
  ]);
  const [qiskitCode, setQiskitCode] = useState('');
  const [activeTab, setActiveTab] = useState('grid');
  const [isRunning, setIsRunning] = useState(false);
  const [selectedQubit, setSelectedQubit] = useState(0);
  const [saveTitle, setSaveTitle] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Simulation outputs
  const [probabilities, setProbabilities] = useState({ "00": 0.5, "11": 0.5 });
  const [counts, setCounts] = useState({ "00": 512, "11": 512 });
  const [blochVectors, setBlochVectors] = useState([
    { qubit: 0, x: 0, y: 0, z: 0, theta: 1.57, phi: 0 },
    { qubit: 1, x: 0, y: 0, z: 0, theta: 1.57, phi: 0 }
  ]);
  const [timelineSteps, setTimelineSteps] = useState([]);

  // Check if a circuit was transferred from Colony Station
  useEffect(() => {
    const transferred = sessionStorage.getItem('colony_transfer_circuit');
    const transferredCode = sessionStorage.getItem('colony_transfer_qiskit');
    if (transferred) {
      try {
        const cObj = JSON.parse(transferred);
        if (cObj.num_qubits) setNumQubits(cObj.num_qubits);
        if (cObj.gates) setGates(cObj.gates);
        sessionStorage.removeItem('colony_transfer_circuit');
      } catch (e) {}
    }
    if (transferredCode) {
      setQiskitCode(transferredCode);
      sessionStorage.removeItem('colony_transfer_qiskit');
    }
  }, []);

  // Update Qiskit code when gates change
  useEffect(() => {
    generateQiskitSnippet(numQubits, gates);
  }, [numQubits, gates]);

  const generateQiskitSnippet = (nq, gList) => {
    let lines = [
      "from qiskit import QuantumCircuit, Aer, execute",
      "",
      `# Initialize ${nq}-qubit Quantum Circuit`,
      `qc = QuantumCircuit(${nq}, ${nq})`,
      ""
    ];
    gList.forEach(g => {
      const gate = g.gate.toUpperCase();
      if (gate === 'H') lines.push(`qc.h(${g.target})`);
      else if (gate === 'X') lines.push(`qc.x(${g.target})`);
      else if (gate === 'Y') lines.push(`qc.y(${g.target})`);
      else if (gate === 'Z') lines.push(`qc.z(${g.target})`);
      else if (gate === 'S') lines.push(`qc.s(${g.target})`);
      else if (gate === 'T') lines.push(`qc.t(${g.target})`);
      else if (gate === 'CX' || gate === 'CNOT') lines.push(`qc.cx(${g.control !== null && g.control !== undefined ? g.control : 0}, ${g.target})`);
      else if (gate === 'CZ') lines.push(`qc.cz(${g.control !== null && g.control !== undefined ? g.control : 0}, ${g.target})`);
      else if (gate === 'SWAP') lines.push(`qc.swap(${g.control !== null && g.control !== undefined ? g.control : 0}, ${g.target})`);
      else if (gate === 'M') lines.push(`qc.measure(${g.target}, ${g.target})`);
    });
    lines.push("");
    lines.push("# Aer statevector execution");
    lines.push("simulator = Aer.get_backend('aer_simulator')");
    lines.push("job = execute(qc, simulator, shots=1024)");
    setQiskitCode(lines.join("\n"));
  };

  const handleRunSimulation = async () => {
    setIsRunning(true);
    try {
      const res = await api.runCircuit(numQubits, gates, 1024, activeTab === 'code' ? qiskitCode : null);
      setProbabilities(res.probabilities || {});
      setCounts(res.counts || {});
      if (res.bloch_vectors) setBlochVectors(res.bloch_vectors);
      if (res.timeline_steps) setTimelineSteps(res.timeline_steps);
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSyncCodeToGrid = () => {
    const singleMatches = [...qiskitCode.matchAll(/qc\.([a-z]+)\((\d+)\)/g)];
    const twoMatches = [...qiskitCode.matchAll(/qc\.([a-z]+)\((\d+),\s*(\d+)\)/g)];

    const parsedGates = [];
    let stepCount = 0;

    singleMatches.forEach(m => {
      const gName = m[1].toUpperCase();
      const target = parseInt(m[2]);
      if (['H', 'X', 'Y', 'Z', 'S', 'T', 'M'].includes(gName)) {
        parsedGates.push({ gate: gName, target, step: stepCount % 8 });
        stepCount++;
      }
    });

    twoMatches.forEach(m => {
      const gName = m[1].toUpperCase();
      const c = parseInt(m[2]);
      const t = parseInt(m[3]);
      if (['CX', 'CZ', 'SWAP'].includes(gName)) {
        parsedGates.push({ gate: gName, control: c, target: t, step: stepCount % 8 });
        stepCount++;
      }
    });

    if (parsedGates.length > 0) {
      setGates(parsedGates);
      setActiveTab('grid');
    }
  };

  const handleSaveCircuit = async () => {
    if (!saveTitle.trim()) return;
    try {
      await api.saveCircuit(
        saveTitle.trim(),
        "Saved via Quantum Lab Studio",
        JSON.stringify(gates),
        qiskitCode,
        numQubits
      );
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      setSaveTitle('');
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 min-h-screen">
      
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white flex items-center gap-3">
            <span>Quantum Circuit Studio</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 font-mono font-normal shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              AER SIMULATOR • EXACT STATEVECTOR
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Design unitary quantum circuits with visual drag-and-drop or Python Qiskit code.
          </p>
        </div>

        {/* View mode switcher & Save dialog */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-mono ${
                activeTab === 'grid' 
                  ? 'bg-purple-600 text-white font-bold shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Grid Builder</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-mono ${
                activeTab === 'code' 
                  ? 'bg-purple-600 text-white font-bold shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Qiskit Code</span>
            </button>
          </div>

          {user && (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                placeholder="Circuit name..."
                className="bg-slate-900 border border-slate-800 text-xs text-slate-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-purple-500 w-36"
              />
              <button
                onClick={handleSaveCircuit}
                disabled={!saveTitle.trim()}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs rounded-lg border border-slate-700 font-mono transition-colors"
              >
                {savedSuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
                <span>{savedSuccess ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Studio Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Circuit Builder or Code Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activeTab === 'grid' ? (
            <CircuitBuilder
              numQubits={numQubits}
              onChangeQubits={(n) => {
                setNumQubits(n);
                setGates(prev => prev.filter(g => g.target < n && (g.control === null || g.control === undefined || g.control < n)));
              }}
              gates={gates}
              onUpdateGates={setGates}
              onRunSimulation={handleRunSimulation}
              isRunning={isRunning}
            />
          ) : (
            <div className="h-[460px]">
              <CodeEditor
                code={qiskitCode}
                onChangeCode={setQiskitCode}
                onSyncToCircuit={handleSyncCodeToGrid}
              />
            </div>
          )}

          {/* Stepped Execution Timeline */}
          {timelineSteps.length > 0 && (
            <CircuitTimeline timelineSteps={timelineSteps} />
          )}
        </div>

        {/* Right Column: 3D Bloch Sphere & Probabilities (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <BlochSphere3D
            blochVectors={blochVectors}
            selectedQubit={selectedQubit}
            onSelectQubit={setSelectedQubit}
          />

          <ProbabilityChart
            probabilities={probabilities}
            counts={counts}
            shots={1024}
          />
        </div>

      </div>

    </div>
  );
}
