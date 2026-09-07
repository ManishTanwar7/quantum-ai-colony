import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Atom, Cpu, Terminal, BookOpen, Trophy, ShieldCheck, LogOut, User as UserIcon } from 'lucide-react';
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
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40 px-4 lg:px-8 py-2.5 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 shadow-xs">
            <Atom className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold tracking-tight text-slate-900 text-base">
              <span>QUANTUM AI</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-700">
                COLONY
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
              <span className={`w-1.5 h-1.5 rounded-full ${wsConnected ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
              <span>{wsConnected ? 'Bus Online' : 'Connecting...'}</span>
            </div>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  active
                    ? 'bg-white text-slate-900 font-semibold border border-slate-300 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-purple-600' : 'text-slate-500'}`} />
                <span>{link.label}</span>
                {link.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    active ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Account & Quick Demo Buttons */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-slate-800 font-medium">{user.name}</span>
                <span className="uppercase text-[10px] px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200 font-mono font-semibold">
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 font-mono">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 mr-1">
                <span>Demo:</span>
                <button
                  onClick={() => demoLogin('student')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-md text-[11px] font-medium transition-colors shadow-xs"
                >
                  Student
                </button>
                <button
                  onClick={() => demoLogin('instructor')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-md text-[11px] font-medium transition-colors shadow-xs"
                >
                  Instructor
                </button>
              </div>
              <Link
                to="/auth"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors shadow-xs"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Nav */}
      <div className="flex md:hidden items-center justify-around pt-2 border-t border-slate-200 mt-2 text-xs">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded ${
                active ? 'text-purple-600 font-bold' : 'text-slate-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[11px]">{link.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
