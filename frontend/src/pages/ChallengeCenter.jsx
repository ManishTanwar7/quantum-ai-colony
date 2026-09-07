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
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500 font-mono">
        Loading quantum challenges...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <span>Quantum Challenge Arena</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-mono font-medium">
              FIDELITY AUTO-GRADER • LIVE SYNTHESIS
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Solve quantum circuit objectives. Circuits are auto-evaluated against target state vectors.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl border border-slate-200 text-xs font-mono text-slate-700 shadow-xs">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Completed: {userProgress.passed_challenges?.length || 0} / {challenges.length} Missions</span>
        </div>
      </div>

      {/* Main Challenge Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Challenge Selector & Target State Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-bold font-mono uppercase text-slate-500 px-1">
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
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    selected
                      ? 'bg-purple-50 border-purple-600 text-purple-950 font-bold shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 border border-purple-200 text-purple-700 font-semibold">
                      {c.difficulty}
                    </span>
                    {passed ? (
                      <span className="flex items-center gap-1 text-emerald-600 text-[10px] font-mono font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Solved</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">Max {c.max_gates} Gates</span>
                    )}
                  </div>

                  <div className="font-bold text-sm text-slate-900 mt-2">
                    {c.title}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-normal">
                    {c.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Target Quantum State Specs Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <h4 className="text-xs font-bold font-mono uppercase text-purple-700">
              Target Objective
            </h4>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-center shadow-xs">
              <div className="text-slate-500 text-[10px]">Expected State Vector</div>
              <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                {activeChallenge.target_state}
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {activeChallenge.prompt}
            </p>

            <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Allocated Qubits:</span>
                <span className="text-slate-800 font-bold">{activeChallenge.max_qubits}</span>
              </div>
              <div className="flex justify-between">
                <span>Gate Constraint:</span>
                <span className="text-slate-800 font-bold">≤ {activeChallenge.max_gates} gates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Studio Workspace & Auto-Grader Output (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Workspace Switcher & Submit Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-mono">
              <button
                onClick={() => setActiveTab('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'grid' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-purple-600" />
                <span>Grid Editor</span>
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'code' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-purple-600" />
                <span>Qiskit Code</span>
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-purple-300" />
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
            <div className={`p-6 rounded-2xl border ${
              gradeResult.passed 
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-rose-50 border-rose-200'
            } space-y-4 shadow-xs`}>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {gradeResult.passed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-600" />
                  )}
                  <h3 className="text-base font-bold text-slate-900 font-mono">
                    {gradeResult.message}
                  </h3>
                </div>

                <div className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white border border-slate-200 text-slate-800 shadow-xs">
                  Fidelity: {Math.round(gradeResult.fidelity * 100)}%
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {gradeResult.feedback}
              </p>

              {/* State Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs font-mono shadow-xs">
                  <div className="text-slate-500 text-[10px]">Expected Probabilities:</div>
                  <div className="text-slate-900 font-bold mt-1">
                    {JSON.stringify(gradeResult.expected_probabilities)}
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs font-mono shadow-xs">
                  <div className="text-slate-500 text-[10px]">Your Output Probabilities:</div>
                  <div className="text-emerald-700 font-bold mt-1">
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
