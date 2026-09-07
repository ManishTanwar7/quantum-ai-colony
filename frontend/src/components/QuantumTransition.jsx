import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Atom, Sparkles } from 'lucide-react';

const ROUTE_LABELS = {
  '/': 'Command Deck & Colony Core',
  '/colony': 'Colony Station • Multi-Agent Transit',
  '/lab': 'Quantum Circuit Studio • 3D Lab',
  '/learning': 'Quantum Learning Hub • Axioms',
  '/challenges': 'Challenge Arena • Fidelity Grader',
  '/instructor': 'Instructor Portal & Analytics',
  '/auth': 'Colony Access Gate & Synapse Auth',
};

export default function QuantumTransition() {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [destinationLabel, setDestinationLabel] = useState('');
  const prevPathRef = useRef(location.pathname);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Only animate when path actually changes
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      setDestinationLabel(ROUTE_LABELS[location.pathname] || 'Quantum Station');
      setIsTransitioning(true);

      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 550);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  // Render revolving 3D quantum sphere during transition
  useEffect(() => {
    if (!isTransitioning) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let angle = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const r = 60;

      ctx.clearRect(0, 0, w, h);
      angle += 0.06;

      // Central glowing core
      const coreGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, r);
      coreGrad.addColorStop(0, 'rgba(168, 85, 247, 0.9)');
      coreGrad.addColorStop(0.4, 'rgba(56, 189, 248, 0.6)');
      coreGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Orbital Ring 1 (Latitude)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, r, r * 0.35, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Satellite node on ring 1
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(Math.cos(angle * 2) * r, Math.sin(angle * 2) * (r * 0.35), 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Orbital Ring 2 (Tilted Meridian)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-angle * 1.3 + Math.PI / 3);
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.9, r * 0.3, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.8)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Satellite node on ring 2
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(Math.cos(angle * 3) * (r * 0.9), Math.sin(angle * 3) * (r * 0.3), 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Outer quantum boundary pulse
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.1, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isTransitioning]);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key="quantum-route-transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-[#070b16]/75 backdrop-blur-md"
        >
          {/* Ambient quantum light aura */}
          <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Animated 3D Quantum Sphere Portal */}
          <div className="relative flex flex-col items-center">
            <canvas
              ref={canvasRef}
              width={220}
              height={220}
              className="w-[180px] h-[180px]"
            />

            {/* Telemetry Status Bar */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center space-y-1 mt-2"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-300 text-[11px] font-mono shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <Sparkles className="w-3 h-3 text-cyan-300 animate-spin" />
                <span>QUANTUM TUNNELING</span>
              </div>
              <div className="text-sm font-bold text-white tracking-wide font-mono mt-1">
                {destinationLabel}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Decoherence: 0.00% • Superposition State Synchronized
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
