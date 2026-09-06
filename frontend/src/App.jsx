import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ColonyStation from './pages/ColonyStation';
import QuantumLab from './pages/QuantumLab';
import LearningHub from './pages/LearningHub';
import ChallengeCenter from './pages/ChallengeCenter';
import InstructorDashboard from './pages/InstructorDashboard';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { Atom } from 'lucide-react';

export default function App() {
  const [wsConnected, setWsConnected] = useState(true);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#050814] text-slate-100 font-['Inter',sans-serif]">
          <Navbar wsConnected={wsConnected} />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/colony" element={<ColonyStation />} />
              <Route path="/lab" element={<QuantumLab />} />
              <Route path="/learning" element={<LearningHub />} />
              <Route path="/challenges" element={<ChallengeCenter />} />
              <Route 
                path="/instructor" 
                element={
                  <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                    <InstructorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="/auth" element={<AuthPage />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="border-t border-quantum-border/60 bg-quantum-dark/80 py-8 px-4 lg:px-8 mt-16 text-xs text-slate-500 font-mono">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Atom className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-slate-200">QUANTUM AI COLONY</span>
                <span>• v1.0.0 Production Edition</span>
              </div>

              <div className="flex items-center gap-4 text-[11px]">
                <span>FastAPI + Aer Statevector Engine</span>
                <span>•</span>
                <span>React + Framer Motion</span>
                <span>•</span>
                <span className="text-emerald-400">Deployable on Render</span>
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
