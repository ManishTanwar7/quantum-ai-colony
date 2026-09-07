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
    <header className="border-b border-gray-200 bg-gray-100 sticky top-0 z-50 px-4 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-gray-900 text-gray-900 shadow-xs">
            <Atom className="w-5 h-5 text-gray-900" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold tracking-tight text-gray-900 text-base">
              <span>QUANTUM AI</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white border border-gray-300 text-gray-800">
                COLONY
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-600 font-mono">
              <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-emerald-600' : 'bg-gray-400'}`}></span>
              <span>{wsConnected ? 'System Online' : 'Connecting...'}</span>
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-300">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  active
                    ? 'bg-gray-100 text-gray-900 font-semibold border border-gray-400'
                    : 'text-gray-700 hover:text-black hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-gray-900' : 'text-gray-600'}`} />
                <span>{link.label}</span>
                {link.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    active ? 'bg-white border border-gray-300 text-gray-900' : 'bg-gray-100 text-gray-600'
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
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded border border-gray-300 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span className="text-gray-900 font-medium">{user.name}</span>
                <span className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-gray-300 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-600">
                <span>Demo:</span>
                <button
                  onClick={() => demoLogin('student')}
                  className="px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-900 border border-gray-900 rounded text-xs font-medium transition-colors"
                >
                  Student
                </button>
                <button
                  onClick={() => demoLogin('instructor')}
                  className="px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-900 border border-gray-900 rounded text-xs font-medium transition-colors"
                >
                  Instructor
                </button>
              </div>
              <Link
                to="/auth"
                className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-gray-100 text-gray-900 border border-gray-900 rounded text-xs font-medium transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Nav */}
      <div className="flex md:hidden items-center justify-around pt-2 border-t border-gray-300 mt-2 text-xs">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded ${
                active ? 'text-gray-900 font-bold underline' : 'text-gray-700 hover:text-black'
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
