import React, { useRef, useEffect, useState } from 'react';
import { RotateCw, Compass, Info } from 'lucide-react';

export default function BlochSphere3D({ blochVectors = [], selectedQubit = 0, onSelectQubit }) {
  const canvasRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotX, setRotX] = useState(0.4);
  const [rotY, setRotY] = useState(0.5);
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  const activeVector = blochVectors[selectedQubit] || { x: 0, y: 0, z: 1, theta: 0, phi: 0 };

  useEffect(() => {
    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.38;

      ctx.clearRect(0, 0, width, height);

      // Auto rotation
      if (autoRotate && !isDraggingRef.current) {
        setRotY((prev) => prev + 0.005);
      }

      // Projection helper: 3D (x, y, z) -> 2D (px, py)
      // Standard Bloch sphere: z is UP, x is forward-right, y is into page
      const project = (x, y, z) => {
        // Rotate around Y axis
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const x1 = x * cosY + y * sinY;
        const y1 = -x * sinY + y * cosY;

        // Rotate around X axis
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const y2 = y1 * cosX - z * sinX;
        const z2 = y1 * sinX + z * cosX;

        return {
          px: centerX + x1 * radius,
          py: centerY - z2 * radius,
          depth: y2
        };
      };

      // 1. Draw outer sphere glow
      const grad = ctx.createRadialGradient(centerX, centerY, radius * 0.2, centerX, centerY, radius);
      grad.addColorStop(0, 'rgba(0, 240, 255, 0.08)');
      grad.addColorStop(0.8, 'rgba(11, 17, 44, 0.6)');
      grad.addColorStop(1, 'rgba(0, 240, 255, 0.25)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Outer boundary ring
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 2. Draw Equator Ring (z = 0)
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(157, 78, 221, 0.45)';
      ctx.setLineDash([4, 4]);
      for (let angle = 0; angle <= Math.PI * 2; angle += 0.05) {
        const p = project(Math.cos(angle), Math.sin(angle), 0);
        if (angle === 0) ctx.moveTo(p.px, p.py);
        else ctx.lineTo(p.px, p.py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Draw Coordinate Axes: X, Y, Z
      const drawAxis = (x, y, z, label, color) => {
        const start = project(-x * 1.15, -y * 1.15, -z * 1.15);
        const end = project(x * 1.15, y * 1.15, z * 1.15);

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.moveTo(start.px, start.py);
        ctx.lineTo(end.px, end.py);
        ctx.stroke();

        // Label
        ctx.fillStyle = color;
        ctx.font = 'bold 11px monospace';
        ctx.fillText(label, end.px + 6, end.py + 4);
      };

      drawAxis(0, 0, 1, '|0⟩ (+Z)', '#06b6d4');  // North
      drawAxis(1, 0, 0, '|+⟩ (+X)', '#10b981');  // X
      drawAxis(0, 1, 0, '|+i⟩ (+Y)', '#f59e0b'); // Y

      // South pole label
      const south = project(0, 0, -1.15);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('|1⟩ (-Z)', south.px + 6, south.py + 4);

      // 4. Draw State Vector Arrow
      const vx = activeVector.x || 0;
      const vy = activeVector.y || 0;
      const vz = activeVector.z !== undefined ? activeVector.z : 1;

      const origin = project(0, 0, 0);
      const tip = project(vx, vy, vz);

      // Vector line with neon glow
      ctx.save();
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 3.5;
      ctx.moveTo(origin.px, origin.py);
      ctx.lineTo(tip.px, tip.py);
      ctx.stroke();

      // Vector tip sphere
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(tip.px, tip.py, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Projection point on equator (dashed line to show theta/phi)
      const equatorProj = project(vx, vy, 0);
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.setLineDash([2, 2]);
      ctx.moveTo(tip.px, tip.py);
      ctx.lineTo(equatorProj.px, equatorProj.py);
      ctx.lineTo(origin.px, origin.py);
      ctx.stroke();
      ctx.setLineDash([]);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [rotX, rotY, autoRotate, activeVector]);

  // Mouse drag handlers for rotating sphere
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };

    setRotY((prev) => prev + dx * 0.01);
    setRotX((prev) => Math.max(-1.5, Math.min(1.5, prev + dy * 0.01)));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="flex flex-col bg-quantum-surface border border-quantum-border rounded-2xl p-4 shadow-xl">
      
      {/* Header & Qubit Selection */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold font-mono uppercase text-slate-200">
            3D Bloch Sphere Visualizer
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {/* Qubit Selector */}
          {blochVectors.length > 1 && (
            <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-xs font-mono">
              <span className="text-slate-400 text-[10px]">Qubit:</span>
              {blochVectors.map((_, i) => (
                <button
                  key={i}
                  onClick={() => onSelectQubit && onSelectQubit(i)}
                  className={`px-1.5 py-0.5 rounded text-[11px] ${
                    selectedQubit === i ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  q{i}
                </button>
              ))}
            </div>
          )}

          {/* Auto rotate toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              autoRotate ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
            title="Toggle Auto-Rotation"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div 
        className="relative flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          width={320}
          height={260}
          className="rounded-xl w-full max-w-[320px] aspect-[4/3]"
        />
        <div className="absolute bottom-2 left-2 text-[10px] text-slate-500 font-mono pointer-events-none">
          Drag to rotate 3D sphere
        </div>
      </div>

      {/* Numerical State Vector Coordinates */}
      <div className="mt-3 pt-3 border-t border-quantum-border/60 grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
          <div className="text-slate-400 text-[10px]">X Component</div>
          <div className="font-bold text-emerald-400">{activeVector.x?.toFixed(3) || '0.000'}</div>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
          <div className="text-slate-400 text-[10px]">Y Component</div>
          <div className="font-bold text-amber-400">{activeVector.y?.toFixed(3) || '0.000'}</div>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
          <div className="text-slate-400 text-[10px]">Z Component</div>
          <div className="font-bold text-cyan-400">{activeVector.z?.toFixed(3) || '1.000'}</div>
        </div>
      </div>

      <div className="mt-2 text-[10px] text-slate-400 text-center font-mono">
        θ = {((activeVector.theta || 0) * (180 / Math.PI)).toFixed(1)}° | φ = {((activeVector.phi || 0) * (180 / Math.PI)).toFixed(1)}°
      </div>

    </div>
  );
}
