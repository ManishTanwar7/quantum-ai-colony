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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      <div className="relative z-10 w-full max-w-md p-6 lg:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
        
        {/* Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 shadow-xs">
            <Atom className="w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            QUANTUM AI COLONY
          </h2>
          <p className="text-xs text-slate-500 font-mono">
            Secure Synapse Authentication & Role Access
          </p>
        </div>

        {/* 1-Click Demo Logins Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-center">
          <div className="text-[11px] font-mono text-purple-700 font-semibold flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Instant Demo Access</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemo('student')}
              disabled={loading}
              className="py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-mono font-semibold transition-colors shadow-xs"
            >
              Student
            </button>
            <button
              onClick={() => handleDemo('instructor')}
              disabled={loading}
              className="py-1.5 px-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg text-xs font-mono font-semibold transition-colors shadow-xs"
            >
              Instructor
            </button>
            <button
              onClick={() => handleDemo('admin')}
              disabled={loading}
              className="py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-mono font-semibold transition-colors shadow-xs"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Tab Switcher: Sign In vs Register */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-mono">
          <button
            onClick={() => { setIsLoginTab(true); setError(null); }}
            className={`py-2 rounded-lg transition-colors font-semibold ${
              isLoginTab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLoginTab(false); setError(null); }}
            className={`py-2 rounded-lg transition-colors font-semibold ${
              !isLoginTab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginTab && (
            <div>
              <label className="block text-xs font-mono text-slate-600 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Richard Feynman"
                  className="w-full bg-white border border-slate-300 focus:border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors shadow-xs"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-slate-600 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@colony.io"
                className="w-full bg-white border border-slate-300 focus:border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-600 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-300 focus:border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors shadow-xs"
              />
            </div>
          </div>

          {!isLoginTab && (
            <div>
              <label className="block text-xs font-mono text-slate-600 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white border border-slate-300 focus:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none shadow-xs"
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
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>{loading ? 'AUTHENTICATING...' : isLoginTab ? 'INITIALIZE SESSION' : 'REGISTER PROFILE'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
