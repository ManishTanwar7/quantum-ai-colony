import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Atom, Sparkles } from 'lucide-react';

const ROUTE_LABELS = {
  '/': 'Command Deck & Colony Core',
  '/colony': 'Colony Station • Multi-Agent Transit',
  '/lab': 'Quantum Circuit Studio',
  '/learning': 'Quantum Learning Hub',
  '/challenges': 'Challenge Arena',
  '/instructor': 'Instructor Portal',
  '/auth': 'Colony Access Gate',
};

export default function QuantumTransition() {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [destinationLabel, setDestinationLabel] = useState('');
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      setDestinationLabel(ROUTE_LABELS[location.pathname] || 'Quantum Station');
      setIsTransitioning(true);

      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 360);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key="unique-quantum-transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-slate-900/10 backdrop-blur-[2px]"
        >
          {/* Top Quantum Waveform Beam */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0.8 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-purple-600 origin-left shadow-sm"
          />

          {/* Unique Morphing Quantum Orb Pill */}
          <motion.div
            initial={{ scale: 0.85, y: 12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 1.05, y: -8, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-xl text-slate-800"
          >
            {/* Pulsing Quantum Core */}
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 text-purple-600">
              <Atom className="w-5 h-5 animate-spin text-purple-600" style={{ animationDuration: '4s' }} />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            <div className="font-mono">
              <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-purple-700">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Quantum State Translation</span>
              </div>
              <div className="text-xs font-bold text-slate-900 tracking-tight">
                {destinationLabel}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
