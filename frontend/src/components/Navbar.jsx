import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Atom, Cpu, Terminal, BookOpen, Trophy, ShieldCheck, LogOut, User as UserIcon, Sparkles } from 'lucide-react';
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
    <header className="border-b border-slate-800/80 bg-[#070b16]/85 backdrop-blur-xl sticky top-0 z-40 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo with Glowing Atom */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/40 group-hover:border-purple-400 transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.25)]">
            <Atom className="w-5 h-5 text-purple-400 group-hover:rotate-180 transition-transform duration-700" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold tracking-wider text-base lg:text-lg">
              <span className="bg-gradient-to-r from-slate-100 via-purple-200 to-cyan-300 bg-clip-text text-transparent font-extrabold">
                QUANTUM AI
              </span>
              <span className="text-white text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-900/60 border border-purple-500/40 font-semibold tracking-wider">
                COLONY
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span className={`w-1.5 h-1.5 rounded-full ${wsConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
              <span>{wsConnected ? 'Colony Bus: ONLINE' : 'Bus: Reconnecting...'}</span>
            </div>
          </div>
        </Link>

        {/* Navigation Tabs with Glass Hover */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/70 p-1.5 rounded-xl border border-slate-800 backdrop-blur-md">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? 'bg-purple-950/70 text-purple-200 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)] font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-purple-300' : 'text-slate-400'}`} />
                <span>{link.label}</span>
                {link.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    active ? 'bg-purple-900/80 text-purple-200 border border-purple-500/30' : 'bg-slate-800 text-slate-400'
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
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="text-slate-200 font-medium">{user.name}</span>
                <span className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-semibold">
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 text-slate-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors border border-transparent hover:border-rose-800/60"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 mr-1 font-mono">
                <span>Demo:</span>
                <button
                  onClick={() => demoLogin('student')}
                  className="px-2.5 py-1 bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 rounded-lg text-[11px] font-semibold transition-all hover:scale-105"
                >
                  Student
                </button>
                <button
                  onClick={() => demoLogin('instructor')}
                  className="px-2.5 py-1 bg-purple-950/60 hover:bg-purple-900 text-purple-300 border border-purple-700/60 rounded-lg text-[11px] font-semibold transition-all hover:scale-105"
                >
                  Instructor
                </button>
              </div>
              <Link
                to="/auth"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all hover:scale-105"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Nav */}
      <div className="flex md:hidden items-center justify-around pt-3 border-t border-slate-800/60 mt-3 text-xs">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded ${
                active ? 'text-purple-300 font-semibold' : 'text-slate-400'
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
