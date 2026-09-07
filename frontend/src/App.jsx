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
import { AuthProvider } from './context/AuthContext';
import { Atom } from 'lucide-react';

export default function App() {
  const [wsConnected, setWsConnected] = useState(true);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
          <Navbar wsConnected={wsConnected} />

          <main className="flex-1 bg-white">
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

          {/* Clean Office Footer */}
          <footer className="border-t border-gray-200 bg-gray-100 py-6 px-4 lg:px-8 mt-12 text-xs text-gray-600 font-mono">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Atom className="w-4 h-4 text-gray-900" />
                <span className="font-bold text-gray-900 tracking-wide">QUANTUM AI COLONY</span>
                <span>• Professional Edition</span>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-gray-600">
                <span>FastAPI + Aer Statevector Engine</span>
                <span>•</span>
                <span>React + Vite</span>
                <span>•</span>
                <span className="text-gray-800 font-medium">Render Ready</span>
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
