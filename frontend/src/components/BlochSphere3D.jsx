import React, { useRef, useEffect, useState } from 'react';
import { Compass, Play, Pause, RotateCcw, Gauge } from 'lucide-react';

export default function BlochSphere3D({ blochVectors = [], selectedQubit = 0, onSelectQubit }) {
  const canvasRef = useRef(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(0.2); // Calm, slow default speed
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

      // Clean white canvas background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Slow, controlled rotation
      if (isRotating && speedMultiplier > 0 && !isDraggingRef.current) {
        rotYRef.current += 0.0006 * speedMultiplier;
      }

      const rotX = rotXRef.current;
      const rotY = rotYRef.current;

      // 3D to 2D projection
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

      // 1. Outer sphere fill with subtle light neutral tint
      const grad = ctx.createRadialGradient(centerX, centerY, radius * 0.1, centerX, centerY, radius);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.85, '#f9fafb');
      grad.addColorStop(1, '#f3f4f6');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Outer boundary ring (clean neutral gray)
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 2. Equator Ring (z = 0)
      ctx.beginPath();
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 1.0;
      ctx.setLineDash([4, 4]);
      for (let angle = 0; angle <= Math.PI * 2; angle += 0.05) {
        const p = project(Math.cos(angle), Math.sin(angle), 0);
        if (angle === 0) ctx.moveTo(p.px, p.py);
        else ctx.lineTo(p.px, p.py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Coordinate Axes (Crisp Dark Gray / Slate, highly legible)
      const drawAxis = (x, y, z, label, color) => {
        const start = project(-x * 1.15, -y * 1.15, -z * 1.15);
        const end = project(x * 1.15, y * 1.15, z * 1.15);

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.moveTo(start.px, start.py);
        ctx.lineTo(end.px, end.py);
        ctx.stroke();

        ctx.fillStyle = '#111827';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(label, end.px + 5, end.py + 4);
      };

      drawAxis(0, 0, 1, '|0⟩ (+Z)', '#374151');
      drawAxis(1, 0, 0, '|+⟩ (+X)', '#4b5563');
      drawAxis(0, 1, 0, '|+i⟩ (+Y)', '#6b7280');

      // South pole label
      const south = project(0, 0, -1.15);
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('|1⟩ (-Z)', south.px + 5, south.py + 4);

      // 4. State Vector Arrow (Solid Charcoal / Black, crisp and high-contrast)
      const vx = activeVector.x || 0;
      const vy = activeVector.y || 0;
      const vz = activeVector.z !== undefined ? activeVector.z : 1;

      const origin = project(0, 0, 0);
      const tip = project(vx, vy, vz);

      // Equator projection dashed line
      const equatorProj = project(vx, vy, 0);
      ctx.beginPath();
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 1.0;
      ctx.setLineDash([2, 2]);
      ctx.moveTo(tip.px, tip.py);
      ctx.lineTo(equatorProj.px, equatorProj.py);
      ctx.lineTo(origin.px, origin.py);
      ctx.stroke();
      ctx.setLineDash([]);

      // State vector arrow line
      ctx.beginPath();
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 2.5;
      ctx.moveTo(origin.px, origin.py);
      ctx.lineTo(tip.px, tip.py);
      ctx.stroke();

      // Vector tip sphere
      ctx.fillStyle = '#111827';
      ctx.beginPath();
      ctx.arc(tip.px, tip.py, 4, 0, Math.PI * 2);
      ctx.fill();

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
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      
      {/* Header & Qubit Selection */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-gray-800" />
          <h4 className="text-xs font-bold font-mono uppercase text-gray-900">
            Bloch Sphere Visualizer
          </h4>
        </div>

        {/* Qubit Selector */}
        {blochVectors.length > 1 && (
          <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 text-xs font-mono">
            <span className="text-gray-500 text-[10px]">Qubit:</span>
            {blochVectors.map((_, i) => (
              <button
                key={i}
                onClick={() => onSelectQubit && onSelectQubit(i)}
                className={`px-1.5 py-0.5 rounded text-[11px] transition-colors ${
                  selectedQubit === i 
                    ? 'bg-white border border-gray-900 text-gray-900 font-bold shadow-xs' 
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                q{i}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Speed & Rotation Control Bar (Flat Style) */}
      <div className="flex items-center justify-between bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-mono mb-2.5">
        <div className="flex items-center gap-1.5 text-gray-700 text-[11px]">
          <Gauge className="w-3.5 h-3.5 text-gray-600" />
          <span>Rotation:</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="px-2 py-0.5 rounded text-[11px] bg-white border border-gray-900 text-gray-900 hover:bg-gray-100 flex items-center gap-1 font-medium transition-colors"
            title="Pause / Resume Rotation"
          >
            {isRotating ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5 fill-gray-900" />}
            <span>{isRotating ? 'Pause' : 'Play'}</span>
          </button>

          {[
            { label: '0.2x', val: 0.2 },
            { label: '0.5x', val: 0.5 },
            { label: '1.0x', val: 1.0 },
          ].map((s) => (
            <button
              key={s.label}
              onClick={() => { setSpeedMultiplier(s.val); setIsRotating(true); }}
              className={`px-1.5 py-0.5 rounded text-[11px] transition-colors ${
                isRotating && speedMultiplier === s.val
                  ? 'bg-gray-200 border border-gray-900 text-gray-900 font-bold'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {s.label}
            </button>
          ))}

          <button
            onClick={resetView}
            className="p-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Reset Orientation"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 3D Canvas on Clean White Card */}
      <div 
        className="relative flex items-center justify-center cursor-grab active:cursor-grabbing select-none border border-gray-100 rounded-lg p-1 bg-white"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          width={320}
          height={250}
          className="w-full max-w-[320px] aspect-[4/3] rounded"
        />
        <div className="absolute bottom-2 left-2 text-[10px] text-gray-500 font-mono pointer-events-none">
          Drag to rotate view
        </div>
      </div>

      {/* Numerical State Vector Coordinates in Neutral Cards */}
      <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
        <div className="bg-gray-50 p-2 rounded border border-gray-200">
          <div className="text-gray-500 text-[10px]">X Component</div>
          <div className="font-bold text-gray-900">{activeVector.x?.toFixed(3) || '0.000'}</div>
        </div>
        <div className="bg-gray-50 p-2 rounded border border-gray-200">
          <div className="text-gray-500 text-[10px]">Y Component</div>
          <div className="font-bold text-gray-900">{activeVector.y?.toFixed(3) || '0.000'}</div>
        </div>
        <div className="bg-gray-50 p-2 rounded border border-gray-200">
          <div className="text-gray-500 text-[10px]">Z Component</div>
          <div className="font-bold text-gray-900">{activeVector.z?.toFixed(3) || '1.000'}</div>
        </div>
      </div>

      <div className="mt-2 text-[10px] text-gray-600 text-center font-mono">
        θ = {((activeVector.theta || 0) * (180 / Math.PI)).toFixed(1)}° | φ = {((activeVector.phi || 0) * (180 / Math.PI)).toFixed(1)}°
      </div>

    </div>
  );
}
