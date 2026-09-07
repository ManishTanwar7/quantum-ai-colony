import React, { useState, useEffect } from 'react';
import { 
  Layers, Code2, Save, CheckCircle2 
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
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 bg-white min-h-screen">
      
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 flex items-center gap-2.5">
            <span>Quantum Circuit Studio</span>
            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 border border-gray-300 text-gray-700 font-mono font-normal">
              AER SIMULATOR • EXACT STATEVECTOR
            </span>
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Design unitary quantum circuits with visual drag-and-drop or Python Qiskit code.
          </p>
        </div>

        {/* View mode switcher & Save dialog (Flat Style) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 p-0.5 rounded border border-gray-300 text-xs">
            <button
              onClick={() => setActiveTab('grid')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors font-mono ${
                activeTab === 'grid' ? 'bg-white text-gray-900 border border-gray-900 font-bold shadow-xs' : 'text-gray-600 hover:text-black'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors font-mono ${
                activeTab === 'code' ? 'bg-white text-gray-900 border border-gray-900 font-bold shadow-xs' : 'text-gray-600 hover:text-black'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Code</span>
            </button>
          </div>

          {user && (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                placeholder="Circuit name..."
                className="bg-white border border-gray-300 text-xs text-gray-900 px-2.5 py-1 rounded focus:outline-none focus:border-gray-900 w-36"
              />
              <button
                onClick={handleSaveCircuit}
                disabled={!saveTitle.trim()}
                className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-gray-100 disabled:opacity-40 text-gray-900 text-xs rounded border border-gray-900 font-mono transition-colors"
              >
                {savedSuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Save className="w-3.5 h-3.5" />}
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
