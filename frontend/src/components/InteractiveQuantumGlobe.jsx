import React, { useRef, useEffect, useState } from 'react';
import { Globe, Zap } from 'lucide-react';

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

    // Planetary repeater nodes
    const numNodes = 48;
    const nodes = [];
    for (let i = 0; i < numNodes; i++) {
      const phi = Math.acos(-1 + (2 * i) / numNodes);
      const theta = Math.sqrt(numNodes * Math.PI) * phi;
      nodes.push({
        x: Math.cos(theta) * Math.sin(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(phi),
        baseSize: Math.random() * 1.6 + 1.4,
        pulse: Math.random() * Math.PI * 2,
        isMajorHub: i % 4 === 0,
      });
    }

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.38;

      ctx.clearRect(0, 0, width, height);

      // Clean, light canvas background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Controlled rotation
      if (!isDraggingRef.current) {
        rotYRef.current += 0.002 * speedMultiplier;
      }

      // Handle pulse wave expansion
      if (pulseActive) {
        pulseWaveRef.current += 0.05;
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
          visible: y2 > -0.25
        };
      };

      // 1. Subtle soft spherical gradient
      const grad = ctx.createRadialGradient(centerX, centerY, radius * 0.1, centerX, centerY, radius * 1.1);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.85, '#f8fafc');
      grad.addColorStop(1, '#f1f5f9');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Outer delicate boundary
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 2. Rings (Soft Slate / Violet, no harsh neon)
      const ringColor = mode === 'earth' ? 'rgba(100, 116, 139, 0.35)' : 'rgba(139, 92, 246, 0.35)';
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

          if (dist < radius * 0.46) {
            const alpha = (1 - dist / (radius * 0.46)) * 0.35;
            ctx.strokeStyle = mode === 'earth'
              ? `rgba(71, 85, 105, ${alpha})`
              : `rgba(124, 58, 237, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }
      }

      // 5. Draw Nodes (Warm Amber & Sage Green hubs)
      projected.forEach((p) => {
        if (!p.visible) return;
        const depthAlpha = Math.max(0.3, (p.depth + 1) / 2);
        p.node.pulse += 0.04;
        
        let extraSize = 0;
        if (pulseActive) {
          extraSize = Math.sin(pulseWaveRef.current) * 2;
        }

        const size = p.node.baseSize + Math.sin(p.node.pulse) * 0.4 + extraSize;

        ctx.save();
        ctx.fillStyle = p.node.isMajorHub 
          ? `rgba(245, 158, 11, ${depthAlpha})` 
          : `rgba(16, 185, 129, ${depthAlpha})`;
        ctx.beginPath();
        ctx.arc(p.px, p.py, size, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.px, p.py, size * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Pulse wave ripple
      if (pulseActive) {
        const waveR = radius * (pulseWaveRef.current / Math.PI) * 1.25;
        ctx.save();
        ctx.strokeStyle = `rgba(245, 158, 11, ${Math.sin(pulseWaveRef.current) * 0.6})`;
        ctx.lineWidth = 2.0;
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
    <div className="relative rounded-2xl bg-white border border-slate-200 p-4 lg:p-5 shadow-sm flex flex-col items-center">
      
      {/* Widget Header */}
      <div className="w-full flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-mono uppercase text-slate-900 tracking-tight">
              Quantum Sphere Grid
            </h4>
            <p className="text-[10px] text-slate-500 font-mono">Planetary Repeater Mesh</p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-mono">
          <button
            onClick={() => setMode('earth')}
            className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
              mode === 'earth' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-black'
            }`}
          >
            Earth Web
          </button>
          <button
            onClick={() => setMode('hilbert')}
            className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
              mode === 'hilbert' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-black'
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
          width={340}
          height={280}
          className="w-full max-w-[340px] aspect-[6/5] rounded-xl border border-slate-100"
        />

        <div className="absolute bottom-1 right-2 text-[9px] text-slate-400 font-mono pointer-events-none">
          Drag to spin
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="w-full mt-2 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={triggerEntanglementPulse}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg text-xs font-mono font-medium transition-colors shadow-xs"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Pulse Entanglement</span>
        </button>

        <div className="flex items-center gap-1 text-xs font-mono">
          <span className="text-slate-500 text-[10px]">Speed:</span>
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
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
