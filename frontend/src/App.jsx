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
import QuantumTransition from './components/QuantumTransition';
import { AuthProvider } from './context/AuthContext';
import { Atom } from 'lucide-react';

export default function App() {
  const [wsConnected, setWsConnected] = useState(true);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 font-sans relative">
          
          {/* Unique Lag-Free Quantum Route Transition */}
          <QuantumTransition />

          {/* Navigation Header */}
          <Navbar wsConnected={wsConnected} />

          {/* Main Page Content */}
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

          {/* Simple Clean Footer */}
          <footer className="border-t border-slate-200 bg-white py-6 px-4 lg:px-8 mt-16 text-xs text-slate-500 font-mono">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-700">
                <div className="w-6 h-6 rounded-md bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
                  <Atom className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-900 tracking-wide">QUANTUM AI COLONY</span>
                <span className="text-slate-400">• v1.0 Production Edition</span>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Aer Statevector Engine</span>
                </span>
                <span>•</span>
                <span>3D Hilbert Studio</span>
                <span>•</span>
                <span className="text-slate-900 font-medium">Render Ready</span>
              </div>
            </div>
          </footer>

        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
