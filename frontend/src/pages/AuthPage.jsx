import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Atom, Lock, Mail, User, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register, demoLogin } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLoginTab) {
        await login(email, password);
      } else {
        await register(name, email, password, role);
      }
      navigate('/colony');
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (demoRole) => {
    setLoading(true);
    setError(null);
    try {
      await demoLogin(demoRole);
      navigate(demoRole === 'instructor' ? '/instructor' : '/colony');
    } catch (err) {
      setError(err.message || "Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl -bottom-20 -right-20 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md p-6 lg:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 backdrop-blur-xl">
        
        {/* Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-purple-950/80 border border-purple-500/40 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <Atom className="w-8 h-8 animate-spin-slow" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            QUANTUM AI COLONY
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Secure Synapse Authentication & Role Access
          </p>
        </div>

        {/* 1-Click Demo Logins Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-center">
          <div className="text-[11px] font-mono text-purple-300 font-semibold flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Instant Demo Access</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemo('student')}
              disabled={loading}
              className="py-1.5 px-2 bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 rounded-lg text-xs font-mono font-semibold transition-all hover:scale-105"
            >
              Student
            </button>
            <button
              onClick={() => handleDemo('instructor')}
              disabled={loading}
              className="py-1.5 px-2 bg-purple-950/60 hover:bg-purple-900 text-purple-300 border border-purple-800 rounded-lg text-xs font-mono font-semibold transition-all hover:scale-105"
            >
              Instructor
            </button>
            <button
              onClick={() => handleDemo('admin')}
              disabled={loading}
              className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-mono font-semibold transition-all hover:scale-105"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Tab Switcher: Sign In vs Register */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => { setIsLoginTab(true); setError(null); }}
            className={`py-2 rounded-lg transition-colors font-semibold ${
              isLoginTab ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLoginTab(false); setError(null); }}
            className={`py-2 rounded-lg transition-colors font-semibold ${
              !isLoginTab ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-mono">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginTab && (
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Richard Feynman"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@colony.io"
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {!isLoginTab && (
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'AUTHENTICATING...' : isLoginTab ? 'INITIALIZE SESSION' : 'REGISTER PROFILE'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
