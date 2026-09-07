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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-white">
      <div className="w-full max-w-md p-6 lg:p-8 rounded-xl bg-white border border-gray-300 shadow-sm space-y-6">
        
        {/* Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-2.5 rounded-lg bg-gray-100 border border-gray-300 text-gray-900">
            <Atom className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
            QUANTUM AI COLONY
          </h2>
          <p className="text-xs text-gray-600 font-mono">
            Authentication & Role Access
          </p>
        </div>

        {/* 1-Click Demo Logins Banner */}
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-2 text-center">
          <div className="text-[11px] font-mono text-gray-700 font-semibold flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gray-700" />
            <span>Instant Demo Access</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemo('student')}
              disabled={loading}
              className="py-1.5 px-2 bg-white hover:bg-gray-100 text-gray-900 border border-gray-900 rounded text-xs font-mono font-medium transition-colors"
            >
              Student
            </button>
            <button
              onClick={() => handleDemo('instructor')}
              disabled={loading}
              className="py-1.5 px-2 bg-white hover:bg-gray-100 text-gray-900 border border-gray-900 rounded text-xs font-mono font-medium transition-colors"
            >
              Instructor
            </button>
            <button
              onClick={() => handleDemo('admin')}
              disabled={loading}
              className="py-1.5 px-2 bg-white hover:bg-gray-100 text-gray-900 border border-gray-900 rounded text-xs font-mono font-medium transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Tab Switcher: Sign In vs Register (Flat Style) */}
        <div className="grid grid-cols-2 p-0.5 bg-gray-100 rounded border border-gray-300 text-xs font-mono">
          <button
            onClick={() => { setIsLoginTab(true); setError(null); }}
            className={`py-1.5 rounded transition-colors font-semibold ${
              isLoginTab ? 'bg-white text-gray-900 border border-gray-900 shadow-xs' : 'text-gray-600 hover:text-black'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLoginTab(false); setError(null); }}
            className={`py-1.5 rounded transition-colors font-semibold ${
              !isLoginTab ? 'bg-white text-gray-900 border border-gray-900 shadow-xs' : 'text-gray-600 hover:text-black'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="p-3 rounded bg-rose-50 border border-rose-400 text-rose-800 text-xs font-mono">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginTab && (
            <div>
              <label className="block text-xs font-mono text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Richard Feynman"
                  className="w-full bg-white border border-gray-300 focus:border-gray-900 rounded pl-9 pr-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@colony.io"
                className="w-full bg-white border border-gray-300 focus:border-gray-900 rounded pl-9 pr-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-gray-300 focus:border-gray-900 rounded pl-9 pr-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {!isLoginTab && (
            <div>
              <label className="block text-xs font-mono text-gray-700 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white border border-gray-300 focus:border-gray-900 rounded px-3 py-2 text-xs text-gray-900 focus:outline-none"
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
            className="w-full py-2.5 bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs rounded border border-gray-900 transition-colors flex items-center justify-center gap-2"
          >
            <span>{loading ? 'AUTHENTICATING...' : isLoginTab ? 'INITIALIZE SESSION' : 'REGISTER PROFILE'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
