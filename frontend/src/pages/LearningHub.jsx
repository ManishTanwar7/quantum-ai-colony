import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Award, HelpCircle, RefreshCw, BookOpen 
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LearningHub() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [userProgress, setUserProgress] = useState({ completed_lessons: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const lList = await api.getLessons();
        setLessons(lList);
        if (lList.length > 0) {
          setSelectedLessonId(lList[0].id);
        }
        if (user) {
          const prog = await api.getMyProgress();
          setUserProgress(prog);
        }
      } catch (err) {
        console.error("Error loading lessons:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const activeLesson = lessons.find(l => l.id === selectedLessonId) || lessons[0];

  const handleSelectOption = (questionId, optionIdx) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeLesson) return;
    try {
      const res = await api.submitQuiz(activeLesson.id, selectedAnswers);
      setQuizResult(res);
      if (res.passed) {
        setUserProgress(prev => ({
          ...prev,
          completed_lessons: [...new Set([...(prev.completed_lessons || []), activeLesson.id])]
        }));
      }
    } catch (err) {
      console.error("Quiz submission error:", err);
    }
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setQuizResult(null);
  };

  if (loading || !activeLesson) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400 font-mono">
        Loading quantum curriculum...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white flex items-center gap-3">
            <span>Quantum Learning Hub</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 font-mono font-normal shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              CURRICULUM • INTERACTIVE QUIZZES
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Master quantum computing from single-qubit geometry to multi-qubit algorithms.
          </p>
        </div>

        {/* Progress Pill */}
        <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-900/80 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 shadow-md">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Completed: {userProgress.completed_lessons?.length || 0} / {lessons.length} Modules</span>
        </div>
      </div>

      {/* Main Learning Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Module Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold font-mono uppercase text-slate-400 px-1">
            Course Modules
          </h3>

          <div className="space-y-2">
            {lessons.map((lesson) => {
              const selected = lesson.id === activeLesson.id;
              const completed = userProgress.completed_lessons?.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => { setSelectedLessonId(lesson.id); resetQuiz(); }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    selected
                      ? 'bg-gradient-to-r from-purple-950/60 to-slate-900/90 border-purple-500/80 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                      : 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase">
                      Module 0{lesson.order} • {lesson.category}
                    </span>
                    {completed ? (
                      <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-mono font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-700" />
                    )}
                  </div>

                  <div className="font-bold text-sm text-white mt-1.5">
                    {lesson.title}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {lesson.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Viewer (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Lesson Reader */}
          <div className="p-6 lg:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl backdrop-blur-xl">
            
            <div className="border-b border-slate-800 pb-4">
              <div className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                {activeLesson.category}
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">
                {activeLesson.title}
              </h2>
            </div>

            {/* Theory Cards */}
            {activeLesson.theory_cards && activeLesson.theory_cards.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {activeLesson.theory_cards.map((card, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                    <div className="font-bold text-cyan-300 font-mono">{card.title}</div>
                    <div className="text-slate-400 text-[11px] leading-relaxed">{card.description}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Lesson Body Content */}
            <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-line font-sans">
              {activeLesson.content_markdown}
            </div>

          </div>

          {/* Interactive Quiz Section */}
          {activeLesson.quiz && activeLesson.quiz.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl backdrop-blur-xl">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white font-mono">
                    Knowledge Checkpoint
                  </h3>
                </div>

                {quizResult && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                    quizResult.passed 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    {quizResult.score_pct}% Score {quizResult.passed ? '— Passed!' : '— Retake Recommended'}
                  </span>
                )}
              </div>

              <div className="space-y-5">
                {activeLesson.quiz.map((q, qIndex) => {
                  const selectedIdx = selectedAnswers[q.id];
                  const isSubmitted = !!quizResult;

                  return (
                    <div key={q.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                      <div className="font-semibold text-sm text-slate-200">
                        {qIndex + 1}. {q.question}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => {
                          const isOptionSelected = selectedIdx === optIdx;
                          let btnStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:border-purple-500/40 hover:bg-slate-850";

                          if (isSubmitted) {
                            if (optIdx === q.correct_index) {
                              btnStyle = "bg-emerald-950/60 border-emerald-500 text-emerald-300 font-semibold shadow-[0_0_10px_rgba(52,211,153,0.2)]";
                            } else if (isOptionSelected) {
                              btnStyle = "bg-rose-950/60 border-rose-500 text-rose-300";
                            }
                          } else if (isOptionSelected) {
                            btnStyle = "bg-purple-900/40 border-purple-500 text-purple-200 font-semibold shadow-[0_0_10px_rgba(168,85,247,0.2)]";
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={isSubmitted}
                              onClick={() => handleSelectOption(q.id, optIdx)}
                              className={`p-3 rounded-xl border text-left text-xs transition-all ${btnStyle}`}
                            >
                              <span className="font-mono mr-2 text-slate-500">[{String.fromCharCode(65 + optIdx)}]</span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation card after submit */}
                      {isSubmitted && (
                        <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 text-xs text-slate-400 font-mono">
                          <strong className="text-cyan-300">Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quiz Submit Bar */}
              <div className="flex items-center justify-between pt-2">
                {quizResult ? (
                  <button
                    onClick={resetQuiz}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700 font-mono transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retake Quiz</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(selectedAnswers).length < activeLesson.quiz.length}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-lg transition-all hover:scale-105"
                  >
                    <Award className="w-4 h-4" />
                    <span>Submit Answers & Record Progress</span>
                  </button>
                )}
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
