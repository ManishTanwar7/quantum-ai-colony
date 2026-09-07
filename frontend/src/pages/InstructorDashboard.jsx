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
      <div className="max-w-md mx-auto my-20 p-8 rounded-xl bg-white border border-gray-300 text-center space-y-4 shadow-sm">
        <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-800 mx-auto">
          <Lock className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Instructor Access Restricted</h2>
        <p className="text-xs text-gray-600 leading-relaxed">
          This portal displays quantum metrics, student progress, and challenge fidelity logs. Sign in with an instructor profile to continue.
        </p>
        <button
          onClick={() => demoLogin('instructor')}
          className="w-full py-2.5 bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs rounded border border-gray-900 transition-colors"
        >
          Sign In as Instructor Demo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 bg-white min-h-screen">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-gray-100 border border-gray-300 text-gray-700 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-gray-800" />
            <span>Instructor & Admin Deck</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mt-1">
            Quantum Cohort Analytics
          </h1>
          <p className="text-xs text-gray-600">
            Real-time telemetry on student learning curves, circuit fidelity, and colony assignments
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded border border-gray-300 text-xs font-mono text-gray-700">
          <span>Instructor: <strong>{user?.name}</strong></span>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 text-xs font-mono">
              <span>Active Students</span>
              <Users className="w-4 h-4 text-gray-700" />
            </div>
            <div className="text-3xl font-extrabold text-gray-900">
              {analytics.overview?.total_students || 1}
            </div>
            <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-mono">
              <ArrowUpRight className="w-3 h-3" />
              <span>100% Active</span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 text-xs font-mono">
              <span>Challenge Pass Rate</span>
              <Trophy className="w-4 h-4 text-gray-700" />
            </div>
            <div className="text-3xl font-extrabold text-gray-900">
              {analytics.overview?.pass_rate || 92}%
            </div>
            <div className="text-[11px] text-gray-600 font-mono">
              {analytics.overview?.passed_submissions} / {analytics.overview?.total_submissions} Passed
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 text-xs font-mono">
              <span>Saved Circuits</span>
              <Activity className="w-4 h-4 text-gray-700" />
            </div>
            <div className="text-3xl font-extrabold text-gray-900">
              {analytics.overview?.total_circuits || 2}
            </div>
            <div className="text-[11px] text-gray-600 font-mono">
              Multi-Qubit Architectures
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 text-xs font-mono">
              <span>Colony Missions</span>
              <Sparkles className="w-4 h-4 text-gray-700" />
            </div>
            <div className="text-3xl font-extrabold text-gray-900">
              {analytics.overview?.total_missions || 2}
            </div>
            <div className="text-[11px] text-gray-600 font-mono">
              Autonomous Consensus
            </div>
          </div>
        </div>
      )}

      {/* Tables Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Student Roster (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-white border border-gray-200 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold font-mono uppercase text-gray-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-800" />
            <span>Enrolled Students</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-gray-200 text-gray-500">
                <tr>
                  <th className="pb-2.5">Name</th>
                  <th className="pb-2.5">Role</th>
                  <th className="pb-2.5">Lessons</th>
                  <th className="pb-2.5">Challenges</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-gray-50">
                    <td className="py-2.5 font-semibold text-gray-900">
                      <div>{st.name}</div>
                      <div className="text-[10px] text-gray-500">{st.email}</div>
                    </td>
                    <td className="py-2.5 uppercase text-[10px] text-gray-700">{st.role}</td>
                    <td className="py-2.5 text-emerald-700 font-bold">{st.completed_lessons}</td>
                    <td className="py-2.5 text-gray-900 font-bold">{st.passed_challenges}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Submissions Log (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-white border border-gray-200 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold font-mono uppercase text-gray-900 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-gray-800" />
            <span>Recent Auto-Grading Stream</span>
          </h3>

          <div className="space-y-2">
            {submissions.length === 0 ? (
              <div className="text-xs text-gray-500 font-mono py-8 text-center">
                No recent submissions recorded yet
              </div>
            ) : (
              submissions.map((sub) => (
                <div key={sub.id} className="p-3 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-between text-xs font-mono">
                  <div className="space-y-0.5">
                    <div className="font-bold text-gray-900 flex items-center gap-1.5">
                      {sub.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      )}
                      <span>{sub.student_name}</span>
                    </div>
                    <div className="text-[10px] text-gray-500">{sub.challenge_id} • {sub.timestamp}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    sub.passed ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-rose-50 text-rose-800 border border-rose-300'
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
