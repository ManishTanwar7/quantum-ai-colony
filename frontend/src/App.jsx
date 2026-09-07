import React, { useState } from 'react';
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
import QuantumParticleField from './components/QuantumParticleField';
import QuantumTransition from './components/QuantumTransition';
import { AuthProvider } from './context/AuthContext';
import { Atom, Sparkles } from 'lucide-react';

export default function App() {
  const [wsConnected, setWsConnected] = useState(true);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#070b16] text-slate-100 font-sans relative selection:bg-purple-500/30 selection:text-white">
          
          {/* 1. Interactive Ambient Quantum Particle Field in Background */}
          <QuantumParticleField />

          {/* 2. Quantum Sphere Route Transition Overlay */}
          <QuantumTransition />

          {/* 3. Sleek Navigation Header */}
          <Navbar wsConnected={wsConnected} />

          {/* 4. Main Page Content */}
          <main className="flex-1 relative z-10">
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

          {/* 5. Modern Futuristic Footer */}
          <footer className="border-t border-slate-800/80 bg-[#070b16]/90 backdrop-blur-md py-8 px-4 lg:px-8 mt-16 text-xs text-slate-400 font-mono relative z-10">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 text-slate-300">
                <div className="w-6 h-6 rounded-lg bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                  <Atom className="w-4 h-4 animate-spin-slow" />
                </div>
                <span className="font-bold tracking-wider text-white">QUANTUM AI COLONY</span>
                <span className="text-slate-500">• Production Edition</span>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>FastAPI + Aer Statevector Engine</span>
                </span>
                <span>•</span>
                <span>Interactive 3D Hilbert Studio</span>
                <span>•</span>
                <span className="text-purple-300">Render Deployable</span>
              </div>
            </div>
          </footer>

        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
