import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function EarthWebGlobe({ onComplete }) {
  const canvasRef = useRef(null);
  const [countdown, setCountdown] = useState(3);
  const [isExpanding, setIsExpanding] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const numNodes = 65;
    const nodes = [];
    for (let i = 0; i < numNodes; i++) {
      const phi = Math.acos(-1 + (2 * i) / numNodes);
      const theta = Math.sqrt(numNodes * Math.PI) * phi;
      nodes.push({
        x: Math.cos(theta) * Math.sin(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(phi),
        baseSize: Math.random() * 1.8 + 1.2,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    let rotY = 0;
    let rotX = 0.22;
    let scaleMultiplier = 1;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(width, height) * 0.32 * scaleMultiplier;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      rotY += 0.0018;

      const project = (node) => {
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const x1 = node.x * cosY + node.z * sinY;
        const z1 = -node.x * sinY + node.z * cosY;

        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const y2 = node.y * cosX - z1 * sinX;
        const z2 = node.y * sinX + z1 * cosX;

        return {
          px: centerX + x1 * baseRadius,
          py: centerY + y2 * baseRadius,
          pz: z2,
          visible: z2 > -0.6,
        };
      };

      const projected = nodes.map((node) => ({
        ...project(node),
        node,
      }));

      // Subtle atmospheric halo
      const grad = ctx.createRadialGradient(
        centerX,
        centerY,
        baseRadius * 0.6,
        centerX,
        centerY,
        baseRadius * 1.2
      );
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.8, '#f8fafc');
      grad.addColorStop(1, '#f1f5f9');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Earth rings in muted violet
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.2)';
      ctx.lineWidth = 1;

      // Equator
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2; a += 0.1) {
        const x = Math.cos(a);
        const z = Math.sin(a);
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;
        const y2 = -z1 * Math.sin(rotX);
        const px = centerX + x1 * baseRadius;
        const py = centerY + y2 * baseRadius;
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Web connections
      ctx.lineWidth = 0.7;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        if (!p1.visible) continue;

        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          if (!p2.visible) continue;

          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < baseRadius * 0.42) {
            const alpha = (1 - dist / (baseRadius * 0.42)) * 0.35;
            ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }
      }

      // Nodes
      projected.forEach((p, idx) => {
        if (!p.visible) return;
        const depthAlpha = (p.pz + 1) / 2;
        p.node.pulse += 0.03;
        const pulseSize = p.node.baseSize + Math.sin(p.node.pulse) * 0.6;
        const isAmber = idx % 4 === 0;

        ctx.save();
        ctx.fillStyle = isAmber 
          ? `rgba(217, 119, 6, ${Math.max(0.4, depthAlpha)})`
          : `rgba(124, 58, 237, ${Math.max(0.4, depthAlpha)})`;
        ctx.beginPath();
        ctx.arc(p.px, p.py, pulseSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.px, p.py, pulseSize * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          triggerExpansion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(interval);
    };
  }, []);

  const triggerExpansion = () => {
    setIsExpanding(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.25 }}
      transition={{ duration: 0.8 }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f8fafc] transition-all duration-700 ${
        isExpanding ? 'scale-125 opacity-0 pointer-events-none' : ''
      }`}
    >
      {/* Header HUD Status */}
      <div className="relative z-10 text-center space-y-2 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-mono font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>GLOBAL QUANTUM SYNAPSE INITIALIZATION</span>
        </div>
        <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-slate-900 font-mono">
          QUANTUM AI COLONY
        </h1>
        <p className="text-xs text-slate-500 font-mono">
          Calibrating planetary quantum mesh • Synchronizing 5 AI agent nodes
        </p>
      </div>

      {/* 3D Canvas Earth Web */}
      <div className="relative flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={560}
          height={480}
          className="w-[320px] sm:w-[480px] lg:w-[560px] aspect-[7/6] rounded-2xl border border-slate-200 shadow-xs"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-[11px] font-mono text-purple-700 uppercase tracking-widest font-semibold">
            SYNAPSE MESH
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5">
            {countdown > 0 ? `0${countdown}` : 'SYNC'}
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 mt-6 flex flex-col items-center gap-3">
        <button
          onClick={triggerExpansion}
          className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-semibold shadow-xs transition-colors"
        >
          <span>Enter Command Deck</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-[10px] font-mono text-slate-500">
          Auto-revealing command deck in {countdown}s...
        </div>
      </div>
    </motion.div>
  );
}
