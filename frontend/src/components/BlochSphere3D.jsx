import React, { useRef, useEffect, useState } from 'react';
import { Compass, Play, Pause, RotateCcw, Gauge } from 'lucide-react';

export default function BlochSphere3D({ blochVectors = [], selectedQubit = 0, onSelectQubit }) {
  const canvasRef = useRef(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(0.25); // Calm, pleasant default speed
  const [isRotating, setIsRotating] = useState(true);
  
  const rotXRef = useRef(0.35);
  const rotYRef = useRef(0.4);
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

      // Controlled, gentle rotation
      if (isRotating && speedMultiplier > 0 && !isDraggingRef.current) {
        rotYRef.current += 0.001 * speedMultiplier;
      }

      const rotX = rotXRef.current;
      const rotY = rotYRef.current;

      // 3D -> 2D projection
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
          depth: y2
        };
      };

      // 1. Cosmic Sphere radial gradient (deep obsidian with soft violet rim)
      const grad = ctx.createRadialGradient(centerX, centerY, radius * 0.15, centerX, centerY, radius);
      grad.addColorStop(0, 'rgba(168, 85, 247, 0.08)');
      grad.addColorStop(0.75, 'rgba(15, 23, 42, 0.88)');
      grad.addColorStop(1, 'rgba(168, 85, 247, 0.25)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Outer boundary ring (soft violet)
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // 2. Equator Ring (z = 0)
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(147, 51, 234, 0.45)';
      ctx.lineWidth = 1.0;
      ctx.setLineDash([4, 4]);
      for (let angle = 0; angle <= Math.PI * 2; angle += 0.05) {
        const p = project(Math.cos(angle), Math.sin(angle), 0);
        if (angle === 0) ctx.moveTo(p.px, p.py);
        else ctx.lineTo(p.px, p.py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Coordinate Axes
      const drawAxis = (x, y, z, label, color) => {
        const start = project(-x * 1.15, -y * 1.15, -z * 1.15);
        const end = project(x * 1.15, y * 1.15, z * 1.15);

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.moveTo(start.px, start.py);
        ctx.lineTo(end.px, end.py);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.font = 'bold 11px monospace';
        ctx.fillText(label, end.px + 6, end.py + 4);
      };

      drawAxis(0, 0, 1, '|0⟩ (+Z)', '#c084fc');  // North: Soft Violet
      drawAxis(1, 0, 0, '|+⟩ (+X)', '#34d399');  // X: Emerald
      drawAxis(0, 1, 0, '|+i⟩ (+Y)', '#fbbf24'); // Y: Amber

      // South pole label
      const south = project(0, 0, -1.15);
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('|1⟩ (-Z)', south.px + 6, south.py + 4);

      // 4. State Vector Arrow (Warm Amber / Gold Glow)
      const vx = activeVector.x || 0;
      const vy = activeVector.y || 0;
      const vz = activeVector.z !== undefined ? activeVector.z : 1;

      const origin = project(0, 0, 0);
      const tip = project(vx, vy, vz);

      // Equator projection dashed line
      const equatorProj = project(vx, vy, 0);
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.0;
      ctx.setLineDash([2, 2]);
      ctx.moveTo(tip.px, tip.py);
      ctx.lineTo(equatorProj.px, equatorProj.py);
      ctx.lineTo(origin.px, origin.py);
      ctx.stroke();
      ctx.setLineDash([]);

      // Vector Arrow with glowing amber shadow
      ctx.save();
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3.0;
      ctx.moveTo(origin.px, origin.py);
      ctx.lineTo(tip.px, tip.py);
      ctx.stroke();

      // Vector tip sphere
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(tip.px, tip.py, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isRotating, speedMultiplier, activeVector]);

  // Drag rotation handlers
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

  const resetView = () => {
    rotXRef.current = 0.35;
    rotYRef.current = 0.4;
  };

  return (
    <div className="flex flex-col bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
      
      {/* Header & Qubit Selection */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-purple-400" />
          <h4 className="text-xs font-bold font-mono uppercase text-slate-200">
            3D Bloch Sphere Visualizer
          </h4>
        </div>

        {/* Qubit Selector */}
        {blochVectors.length > 1 && (
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs font-mono">
            <span className="text-slate-400 text-[10px]">Qubit:</span>
            {blochVectors.map((_, i) => (
              <button
                key={i}
                onClick={() => onSelectQubit && onSelectQubit(i)}
                className={`px-1.5 py-0.5 rounded text-[11px] transition-colors ${
                  selectedQubit === i ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                q{i}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Speed & Rotation Control Bar */}
      <div className="flex items-center justify-between bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono mb-2.5">
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
          <Gauge className="w-3.5 h-3.5 text-amber-400" />
          <span>Rotation:</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-2 py-0.5 rounded text-[10px] flex items-center gap-1 transition-colors ${
              !isRotating ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Pause / Resume Rotation"
          >
            {isRotating ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5 fill-rose-300" />}
            <span>{isRotating ? 'Pause' : 'Paused'}</span>
          </button>

          {[
            { label: '0.25x', val: 0.25 },
            { label: '0.5x', val: 0.5 },
            { label: '1.0x', val: 1.0 },
          ].map((s) => (
            <button
              key={s.label}
              onClick={() => { setSpeedMultiplier(s.val); setIsRotating(true); }}
              className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                isRotating && speedMultiplier === s.val
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}

          <button
            onClick={resetView}
            className="p-1 text-slate-400 hover:text-white rounded transition-colors"
            title="Reset Orientation"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 3D Canvas Area */}
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
          Click & drag to manually rotate
        </div>
      </div>

      {/* Numerical State Vector Coordinates */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
        <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
          <div className="text-slate-400 text-[10px]">X Component</div>
          <div className="font-bold text-emerald-400">{activeVector.x?.toFixed(3) || '0.000'}</div>
        </div>
        <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
          <div className="text-slate-400 text-[10px]">Y Component</div>
          <div className="font-bold text-amber-400">{activeVector.y?.toFixed(3) || '0.000'}</div>
        </div>
        <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
          <div className="text-slate-400 text-[10px]">Z Component</div>
          <div className="font-bold text-purple-300">{activeVector.z?.toFixed(3) || '1.000'}</div>
        </div>
      </div>

      <div className="mt-2 text-[10px] text-slate-400 text-center font-mono">
        θ = {((activeVector.theta || 0) * (180 / Math.PI)).toFixed(1)}° | φ = {((activeVector.phi || 0) * (180 / Math.PI)).toFixed(1)}°
      </div>

    </div>
  );
}
