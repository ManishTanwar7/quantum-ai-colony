import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, Globe, Zap, RotateCw, Compass } from 'lucide-react';

export default function InteractiveQuantumGlobe() {
  const canvasRef = useRef(null);
  const [mode, setMode] = useState('earth'); // 'earth' | 'hilbert'
  const [pulseActive, setPulseActive] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(0.8);
  
  const rotYRef = useRef(0);
  const rotXRef = useRef(0.2);
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const pulseWaveRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    // Generate nodes on the sphere (representing planetary quantum repeaters)
    const numNodes = 52;
    const nodes = [];
    for (let i = 0; i < numNodes; i++) {
      const phi = Math.acos(-1 + (2 * i) / numNodes);
      const theta = Math.sqrt(numNodes * Math.PI) * phi;
      nodes.push({
        x: Math.cos(theta) * Math.sin(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(phi),
        baseSize: Math.random() * 2 + 1.5,
        pulse: Math.random() * Math.PI * 2,
        isMajorHub: i % 5 === 0,
      });
    }

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.38;

      ctx.clearRect(0, 0, width, height);

      // Controlled rotation
      if (!isDraggingRef.current) {
        rotYRef.current += 0.003 * speedMultiplier;
      }

      // Handle pulse wave expansion
      if (pulseActive) {
        pulseWaveRef.current += 0.04;
        if (pulseWaveRef.current > Math.PI) {
          setPulseActive(false);
          pulseWaveRef.current = 0;
        }
      }

      const rotX = rotXRef.current;
      const rotY = rotYRef.current;

      const project = (x, y, z) => {
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const x1 = x * cosY + y * sinY;
        const y1 = -x * sinY + y * cosY;

        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const y2 = y1 * cosX - z * sinX;
        const z2 = y1 * sinX + z * cosX;

        return {
          px: centerX + x1 * radius,
          py: centerY - z2 * radius,
          depth: y2,
          visible: y2 > -0.2
        };
      };

      // 1. Glowing Sphere Background Atmosphere
      const grad = ctx.createRadialGradient(centerX, centerY, radius * 0.2, centerX, centerY, radius * 1.15);
      grad.addColorStop(0, 'rgba(147, 51, 234, 0.12)');
      grad.addColorStop(0.6, 'rgba(56, 189, 248, 0.08)');
      grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // Outer delicate boundary
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // 2. Latitudinal & Longitudinal Orbital Rings
      const ringColor = mode === 'earth' ? 'rgba(56, 189, 248, 0.22)' : 'rgba(168, 85, 247, 0.25)';
      ctx.strokeStyle = ringColor;
      ctx.lineWidth = 1;

      // Equator
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2; a += 0.08) {
        const p = project(Math.cos(a), Math.sin(a), 0);
        if (a === 0) ctx.moveTo(p.px, p.py);
        else ctx.lineTo(p.px, p.py);
      }
      ctx.stroke();

      // Latitude Tropics
      [-0.5, 0.5].forEach((latZ) => {
        const rLat = Math.sqrt(1 - latZ * latZ);
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.08) {
          const p = project(Math.cos(a) * rLat, Math.sin(a) * rLat, latZ);
          if (a === 0) ctx.moveTo(p.px, p.py);
          else ctx.lineTo(p.px, p.py);
        }
        ctx.stroke();
      });

      // 3. Projected Nodes
      const projected = nodes.map(n => ({
        ...project(n.x, n.y, n.z),
        node: n
      }));

      // 4. Entanglement Network Mesh Lines
      ctx.lineWidth = 0.8;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        if (!p1.visible) continue;

        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          if (!p2.visible) continue;

          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < radius * 0.48) {
            const alpha = (1 - dist / (radius * 0.48)) * (mode === 'earth' ? 0.35 : 0.45);
            ctx.strokeStyle = mode === 'earth' 
              ? `rgba(56, 189, 248, ${alpha})` 
              : `rgba(168, 85, 247, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }
      }

      // 5. Draw Glowing Nodes
      projected.forEach((p) => {
        if (!p.visible) return;
        const depthAlpha = Math.max(0.2, (p.depth + 1) / 2);
        p.node.pulse += 0.04;
        
        // Pulse wave effect expansion
        let extraSize = 0;
        if (pulseActive) {
          extraSize = Math.sin(pulseWaveRef.current) * 2.5;
        }

        const size = p.node.baseSize + Math.sin(p.node.pulse) * 0.6 + extraSize;

        ctx.save();
        ctx.shadowColor = p.node.isMajorHub ? '#38bdf8' : '#c084fc';
        ctx.shadowBlur = p.node.isMajorHub ? 10 : 6;
        ctx.fillStyle = p.node.isMajorHub 
          ? `rgba(56, 189, 248, ${depthAlpha})` 
          : `rgba(192, 132, 252, ${depthAlpha})`;
        ctx.beginPath();
        ctx.arc(p.px, p.py, size, 0, Math.PI * 2);
        ctx.fill();

        // Core star point
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.px, p.py, size * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Pulse wave ripple on canvas
      if (pulseActive) {
        const waveR = radius * (pulseWaveRef.current / Math.PI) * 1.3;
        ctx.save();
        ctx.strokeStyle = `rgba(56, 189, 248, ${Math.sin(pulseWaveRef.current) * 0.7})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, waveR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [mode, pulseActive, speedMultiplier]);

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };

    rotYRef.current += dx * 0.008;
    rotXRef.current = Math.max(-1.5, Math.min(1.5, rotXRef.current + dy * 0.008));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const triggerEntanglementPulse = () => {
    setPulseActive(true);
    pulseWaveRef.current = 0.1;
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 via-[#0a0f24]/90 to-slate-900/90 border border-purple-500/30 p-4 lg:p-6 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col items-center">
      
      {/* Background ambient light */}
      <div className="absolute -top-16 -left-16 w-56 h-56 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Widget Header & Switcher */}
      <div className="w-full flex items-center justify-between gap-2 mb-2 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-950 border border-purple-500/40 text-purple-400">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-mono uppercase text-white tracking-wide">
              Holographic Quantum Globe
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">Planetary Synapse Mesh & Entanglement Grid</p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setMode('earth')}
            className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
              mode === 'earth' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Earth Web
          </button>
          <button
            onClick={() => setMode('hilbert')}
            className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
              mode === 'hilbert' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Hilbert Mesh
          </button>
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div
        className="relative flex items-center justify-center cursor-grab active:cursor-grabbing select-none my-1"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          width={360}
          height={300}
          className="w-full max-w-[360px] aspect-[6/5] rounded-xl"
        />

        <div className="absolute bottom-1 right-2 text-[9px] text-slate-500 font-mono pointer-events-none">
          Drag to spin in 3D
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="w-full mt-2 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 relative z-10">
        <div className="flex items-center gap-1.5">
          <button
            onClick={triggerEntanglementPulse}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600/30 to-cyan-500/30 hover:from-purple-600/50 hover:to-cyan-500/50 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-mono font-medium transition-all shadow-[0_0_10px_rgba(56,189,248,0.2)]"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Pulse Entanglement</span>
          </button>
        </div>

        <div className="flex items-center gap-1 text-xs font-mono">
          <span className="text-slate-400 text-[10px]">Speed:</span>
          {[
            { label: '0.5x', val: 0.5 },
            { label: '1x', val: 1.0 },
            { label: '2x', val: 2.0 },
          ].map((s) => (
            <button
              key={s.label}
              onClick={() => setSpeedMultiplier(s.val)}
              className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                speedMultiplier === s.val
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
