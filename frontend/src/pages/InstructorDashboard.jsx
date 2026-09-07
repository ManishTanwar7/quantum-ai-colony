import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Users, Trophy, Activity, CheckCircle2, 
  XCircle, ArrowUpRight, Lock, Sparkles 
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function InstructorDashboard() {
  const { user, demoLogin } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [students, setStudents] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const isInstructor = user && (user.role === 'instructor' || user.role === 'admin');

  useEffect(() => {
    if (isInstructor) {
      const loadInstructorData = async () => {
        try {
          const [an, st, sub] = await Promise.all([
            api.getInstructorAnalytics(),
            api.getStudentsList(),
            api.getSubmissionsList(),
          ]);
          setAnalytics(an);
          setStudents(st);
          setSubmissions(sub);
        } catch (err) {
          console.error("Error loading instructor data:", err);
        } finally {
          setLoading(false);
        }
      };
      loadInstructorData();
    } else {
      setLoading(false);
    }
  }, [user, isInstructor]);

  if (!isInstructor) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-5 shadow-lg">
        <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 mx-auto shadow-xs">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Instructor Access Restricted</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          This portal displays quantum telemetry, student progress heatmaps, and challenge fidelity audit logs. Sign in with an instructor profile to continue.
        </p>
        <button
          onClick={() => demoLogin('instructor')}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
        >
          Sign In as Instructor Demo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-8 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-mono font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Instructor & Admin Deck</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-1">
            Quantum Cohort Analytics
          </h1>
          <p className="text-xs text-slate-500">
            Real-time telemetry on student learning curves, circuit fidelity, and colony assignments
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl border border-slate-200 text-xs font-mono text-slate-700 shadow-xs">
          <span>Instructor: <strong className="text-slate-900">{user?.name}</strong></span>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
              <span>Active Students</span>
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {analytics.overview?.total_students || 1}
            </div>
            <div className="text-[11px] text-emerald-600 flex items-center gap-1 font-mono font-semibold">
              <ArrowUpRight className="w-3 h-3" />
              <span>100% Active</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
              <span>Challenge Pass Rate</span>
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {analytics.overview?.pass_rate || 92}%
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              {analytics.overview?.passed_submissions} / {analytics.overview?.total_submissions} Passed
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
              <span>Saved Circuits</span>
              <Activity className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {analytics.overview?.total_circuits || 2}
            </div>
            <div className="text-[11px] text-purple-700 font-mono font-medium">
              Multi-Qubit Architectures
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
              <span>Colony Missions</span>
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {analytics.overview?.total_missions || 2}
            </div>
            <div className="text-[11px] text-emerald-700 font-mono font-medium">
              Autonomous Consensus
            </div>
          </div>
        </div>
      )}

      {/* Tables Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Student Roster (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold font-mono uppercase text-slate-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" />
            <span>Enrolled Students</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="pb-3 font-semibold">Name</th>
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold">Lessons</th>
                  <th className="pb-3 font-semibold">Challenges</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-semibold text-slate-900">
                      <div>{st.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{st.email}</div>
                    </td>
                    <td className="py-3 uppercase text-[10px] text-purple-700 font-bold">{st.role}</td>
                    <td className="py-3 text-emerald-600 font-bold">{st.completed_lessons}</td>
                    <td className="py-3 text-amber-600 font-bold">{st.passed_challenges}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Submissions Log (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold font-mono uppercase text-slate-800 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Recent Auto-Grading Stream</span>
          </h3>

          <div className="space-y-2.5">
            {submissions.length === 0 ? (
              <div className="text-xs text-slate-400 font-mono py-8 text-center">
                No recent submissions recorded yet
              </div>
            ) : (
              submissions.map((sub) => (
                <div key={sub.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-mono">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      {sub.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      )}
                      <span>{sub.student_name}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">{sub.challenge_id} • {sub.timestamp}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    sub.passed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {Math.round(sub.fidelity * 100)}% Fidelity
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
