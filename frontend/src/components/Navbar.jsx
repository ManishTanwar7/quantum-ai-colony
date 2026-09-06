import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Atom, Cpu, Terminal, BookOpen, Trophy, ShieldCheck, LogOut, User as UserIcon, Zap, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ wsConnected = true }) {
  const location = useLocation();
  const { user, logout, demoLogin } = useAuth();

  const navLinks = [
    { to: '/colony', label: 'Colony Station', icon: Cpu, badge: '5 Agents' },
    { to: '/lab', label: 'Quantum Lab', icon: Terminal, badge: '3D Studio' },
    { to: '/learning', label: 'Learning Hub', icon: BookOpen },
    { to: '/challenges', label: 'Challenges', icon: Trophy, badge: 'Auto-Graded' },
  ];

  if (user && (user.role === 'instructor' || user.role === 'admin')) {
    navLinks.push({ to: '/instructor', label: 'Instructor Deck', icon: ShieldCheck, badge: 'Analytics' });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <header className="border-b border-quantum-border/60 bg-quantum-dark/95 backdrop-blur sticky top-0 z-50 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-500/40 group-hover:border-cyan-400 transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Atom className="w-6 h-6 text-cyan-400 group-hover:rotate-180 transition-transform duration-700" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold tracking-wider text-base lg:text-lg">
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 bg-clip-text text-transparent">
                QUANTUM AI
              </span>
              <span className="text-white text-xs font-semibold px-2 py-0.5 rounded bg-purple-900/60 border border-purple-500/40">
                COLONY
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className={`w-1.5 h-1.5 rounded-full ${wsConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
              <span>{wsConnected ? 'Message Bus: ONLINE' : 'Bus: Reconnecting...'}</span>
            </div>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-quantum-surface/80 p-1 rounded-xl border border-quantum-border">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{link.label}</span>
                {link.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    active ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Account & Quick Demo Buttons */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-quantum-surface rounded-lg border border-quantum-border text-xs">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span className="text-slate-200 font-medium">{user.name}</span>
                <span className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-cyan-900/40 text-cyan-300 border border-cyan-500/30">
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 mr-1">
                <span>Demo:</span>
                <button
                  onClick={() => demoLogin('student')}
                  className="px-2 py-1 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/60 rounded text-[11px] font-mono transition-colors"
                >
                  Student
                </button>
                <button
                  onClick={() => demoLogin('instructor')}
                  className="px-2 py-1 bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-800/60 rounded text-[11px] font-mono transition-colors"
                >
                  Instructor
                </button>
              </div>
              <Link
                to="/auth"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs rounded-lg transition-all shadow-[0_0_12px_rgba(0,240,255,0.3)]"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Nav */}
      <div className="flex md:hidden items-center justify-around pt-3 border-t border-quantum-border/40 mt-3 text-xs">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded ${
                active ? 'text-cyan-400 font-semibold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
