import React, { useState, useEffect } from 'react';
import { 
  Trophy, CheckCircle2, XCircle, Sparkles, 
  Layers, Code2 
} from 'lucide-react';
import CircuitBuilder from '../components/CircuitBuilder';
import CodeEditor from '../components/CodeEditor';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ChallengeCenter() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [activeChallengeId, setActiveChallengeId] = useState(null);
  const [activeTab, setActiveTab] = useState('grid');
  const [gates, setGates] = useState([]);
  const [qiskitCode, setQiskitCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gradeResult, setGradeResult] = useState(null);
  const [userProgress, setUserProgress] = useState({ passed_challenges: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const cList = await api.getChallenges();
        setChallenges(cList);
        if (cList.length > 0) {
          selectChallenge(cList[0]);
        }
        if (user) {
          const prog = await api.getMyProgress();
          setUserProgress(prog);
        }
      } catch (err) {
        console.error("Error loading challenges:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const selectChallenge = (chal) => {
    setActiveChallengeId(chal.id);
    setGates(chal.starter_circuit || []);
    setQiskitCode(chal.starter_code || '');
    setGradeResult(null);
  };

  const activeChallenge = challenges.find(c => c.id === activeChallengeId) || challenges[0];

  const handleSubmit = async () => {
    if (!activeChallenge) return;
    setIsSubmitting(true);
    try {
      const res = await api.submitChallenge(
        activeChallenge.id,
        activeTab === 'grid' ? { num_qubits: activeChallenge.max_qubits, gates } : null,
        activeTab === 'code' ? qiskitCode : null
      );
      setGradeResult(res);
      if (res.passed) {
        setUserProgress(prev => ({
          ...prev,
          passed_challenges: [...new Set([...(prev.passed_challenges || []), activeChallenge.id])]
        }));
      }
    } catch (err) {
      console.error("Challenge submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !activeChallenge) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500 font-mono">
        Loading quantum challenges...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 bg-white min-h-screen">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <span>Quantum Challenge Arena</span>
            <span className="text-xs px-2.5 py-0.5 rounded bg-gray-100 border border-gray-300 text-gray-700 font-mono font-normal">
              FIDELITY AUTO-GRADER • LIVE SYNTHESIS
            </span>
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Solve quantum circuit objectives. Circuits are auto-evaluated against target state vectors.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded border border-gray-300 text-xs font-mono text-gray-700">
          <Trophy className="w-4 h-4 text-gray-800" />
          <span>Completed: {userProgress.passed_challenges?.length || 0} / {challenges.length} Missions</span>
        </div>
      </div>

      {/* Main Challenge Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Challenge Selector & Target State Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-bold font-mono uppercase text-gray-500 px-1">
            Challenges
          </h3>

          <div className="space-y-2">
            {challenges.map((c) => {
              const selected = c.id === activeChallenge.id;
              const passed = userProgress.passed_challenges?.includes(c.id);

              return (
                <button
                  key={c.id}
                  onClick={() => selectChallenge(c)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selected
                      ? 'bg-gray-50 border-gray-900 shadow-xs'
                      : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 border border-gray-300 text-gray-800 font-semibold">
                      {c.difficulty}
                    </span>
                    {passed ? (
                      <span className="flex items-center gap-1 text-emerald-700 text-[10px] font-mono font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Solved</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-500 font-mono">Max {c.max_gates} Gates</span>
                    )}
                  </div>

                  <div className="font-bold text-sm text-gray-900 mt-2">
                    {c.title}
                  </div>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Target Quantum State Specs Card */}
          <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-3 shadow-xs">
            <h4 className="text-xs font-bold font-mono uppercase text-gray-900">
              Target Objective
            </h4>
            <div className="p-3 bg-gray-50 rounded border border-gray-200 font-mono text-center">
              <div className="text-gray-500 text-[10px]">Expected State Vector</div>
              <div className="text-lg font-bold text-gray-900 mt-0.5">
                {activeChallenge.target_state}
              </div>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed">
              {activeChallenge.prompt}
            </p>

            <div className="pt-2 border-t border-gray-200 text-[11px] font-mono text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Allocated Qubits:</span>
                <span className="text-gray-900 font-bold">{activeChallenge.max_qubits}</span>
              </div>
              <div className="flex justify-between">
                <span>Gate Constraint:</span>
                <span className="text-gray-900 font-bold">≤ {activeChallenge.max_gates} gates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Studio Workspace & Auto-Grader Output (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Workspace Switcher & Submit Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-xs">
            <div className="flex items-center bg-gray-100 p-0.5 rounded border border-gray-300 text-xs">
              <button
                onClick={() => setActiveTab('grid')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors font-mono ${
                  activeTab === 'grid' ? 'bg-white text-gray-900 border border-gray-900 font-bold shadow-xs' : 'text-gray-600 hover:text-black'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Grid Editor</span>
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors font-mono ${
                  activeTab === 'code' ? 'bg-white text-gray-900 border border-gray-900 font-bold shadow-xs' : 'text-gray-600 hover:text-black'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Qiskit Code</span>
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs rounded border border-gray-900 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-gray-900" />
              <span>{isSubmitting ? 'AUTO-GRADING...' : 'SUBMIT & AUTO-GRADE'}</span>
            </button>
          </div>

          {/* Circuit Editor Area */}
          {activeTab === 'grid' ? (
            <CircuitBuilder
              numQubits={activeChallenge.max_qubits}
              gates={gates}
              onUpdateGates={setGates}
              onRunSimulation={handleSubmit}
              isRunning={isSubmitting}
            />
          ) : (
            <div className="h-[380px]">
              <CodeEditor
                code={qiskitCode}
                onChangeCode={setQiskitCode}
              />
            </div>
          )}

          {/* Auto-Grader Feedback Display */}
          {gradeResult && (
            <div className={`p-5 rounded-xl border ${
              gradeResult.passed 
                ? 'bg-emerald-50/70 border-emerald-600 text-emerald-950'
                : 'bg-rose-50/70 border-rose-500 text-rose-950'
            } space-y-3`}>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {gradeResult.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600" />
                  )}
                  <h3 className="text-base font-bold font-mono text-gray-900">
                    {gradeResult.message}
                  </h3>
                </div>

                <div className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-white border border-gray-300 text-gray-900">
                  Fidelity: {Math.round(gradeResult.fidelity * 100)}%
                </div>
              </div>

              <p className="text-xs text-gray-700 leading-relaxed">
                {gradeResult.feedback}
              </p>

              {/* State Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-white rounded border border-gray-200 text-xs font-mono">
                  <div className="text-gray-500 text-[10px]">Expected Probabilities:</div>
                  <div className="text-gray-900 font-bold mt-1">
                    {JSON.stringify(gradeResult.expected_probabilities)}
                  </div>
                </div>

                <div className="p-3 bg-white rounded border border-gray-200 text-xs font-mono">
                  <div className="text-gray-500 text-[10px]">Your Output Probabilities:</div>
                  <div className="text-gray-900 font-bold mt-1">
                    {JSON.stringify(gradeResult.actual_probabilities)}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
