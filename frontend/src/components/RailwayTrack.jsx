import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Cpu, Bug, Zap, Eye, CheckCircle2, Loader2 } from 'lucide-react';

const STATIONS = [
  { id: 'theory', name: 'Theory Depot', agentId: 'professor', agentName: 'Prof. Vance', icon: BookOpen, color: '#06b6d4', ring: 'ring-cyan-400' },
  { id: 'foundry', name: 'Circuit Foundry', agentId: 'engineer', agentName: 'Devin Matrix', icon: Cpu, color: '#10b981', ring: 'ring-emerald-400' },
  { id: 'debug', name: 'Debug Siding', agentId: 'debugger', agentName: 'Agent BugHunter', icon: Bug, color: '#ef4444', ring: 'ring-rose-400' },
  { id: 'optimizer', name: 'Optimizer Junction', agentId: 'optimizer', agentName: 'OptiPrime', icon: Zap, color: '#f59e0b', ring: 'ring-amber-400' },
  { id: 'visualizer', name: 'Visualizer Terminal', agentId: 'visualizer', agentName: 'Iris Quantum', icon: Eye, color: '#8b5cf6', ring: 'ring-purple-400' },
];

export default function RailwayTrack({ activeAgentId, activeStation, isSimulating = false }) {
  // Determine current active station index
  const activeStationIndex = STATIONS.findIndex(s => s.id === activeStation || s.agentId === activeAgentId);
  const currentIndex = activeStationIndex >= 0 ? activeStationIndex : (isSimulating ? 0 : -1);

  return (
    <div className="w-full bg-gradient-to-r from-quantum-surface via-[#0d1538] to-quantum-surface border border-quantum-border/80 rounded-2xl p-4 lg:p-6 shadow-2xl relative overflow-hidden">
      
      {/* Background ambient rail glow */}
      <div className="absolute inset-0 bg-radial-gradient from-cyan-500/5 to-transparent pointer-events-none" />

      {/* Header info */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <h3 className="text-sm font-semibold tracking-wider text-slate-200 uppercase font-mono">
            COLONY RAILWAY TRANSIT & SYNAPSE BUS
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-mono">Pipeline Status:</span>
          {isSimulating ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 rounded-full font-mono text-[11px] animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>SYNAPSE ACTIVE — CONCURRENCY COLLABORATION</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-slate-800/80 border border-slate-700 text-slate-400 rounded-full font-mono text-[11px]">
              STATIONARY / READY
            </span>
          )}
        </div>
      </div>

      {/* Railway Track Graphic */}
      <div className="relative py-6 px-2 lg:px-8">
        
        {/* The Dual Railway Tracks (Parallel Neon Rails) */}
        <div className="absolute top-[52px] left-8 right-8 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          {/* Animated Laser Pulse traveling along rail */}
          {isSimulating && (
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-48 shadow-[0_0_12px_#00f0ff]"
              animate={{ x: ['-100%', '600%'] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
            />
          )}
        </div>
        <div className="absolute top-[60px] left-8 right-8 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          {isSimulating && (
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-purple-400 to-transparent w-48 shadow-[0_0_12px_#9d4edd]"
              animate={{ x: ['-100%', '600%'] }}
              transition={{ repeat: Infinity, duration: 2.2, delay: 0.3, ease: "linear" }}
            />
          )}
        </div>

        {/* Railway Stations Grid */}
        <div className="grid grid-cols-5 gap-2 relative z-10">
          {STATIONS.map((station, index) => {
            const Icon = station.icon;
            const isCurrent = currentIndex === index;
            const isCompleted = currentIndex > index;
            const isPending = currentIndex < index;

            return (
              <div key={station.id} className="flex flex-col items-center text-center">
                
                {/* Station Node / Pod */}
                <motion.div
                  className={`relative flex items-center justify-center w-14 h-14 rounded-2xl border-2 transition-all duration-300 ${
                    isCurrent
                      ? 'bg-slate-900 border-cyan-400 ring-4 ring-cyan-500/30 scale-110 z-20'
                      : isCompleted
                      ? 'bg-slate-900/90 border-emerald-500/80 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                      : 'bg-slate-950/80 border-slate-800 text-slate-500 opacity-70'
                  }`}
                  style={isCurrent ? { boxShadow: `0 0 25px ${station.color}` } : {}}
                  animate={isCurrent ? { y: [0, -4, 0] } : {}}
                  transition={isCurrent ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" } : {}}
                >
                  {/* Glowing station icon */}
                  <Icon
                    className="w-6 h-6"
                    style={{ color: isCurrent ? station.color : isCompleted ? '#10b981' : '#64748b' }}
                  />

                  {/* Checkmark badge when completed */}
                  {isCompleted && (
                    <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-black rounded-full p-0.5">
                      <CheckCircle2 className="w-3 h-3 text-black" />
                    </span>
                  )}

                  {/* Pulsing beacon if active */}
                  {isCurrent && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
                    </span>
                  )}
                </motion.div>

                {/* Station Details */}
                <div className="mt-3">
                  <div className={`text-[11px] font-bold tracking-wide font-mono uppercase ${
                    isCurrent ? 'text-cyan-300' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    {station.name}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: station.color }} />
                    <span>{station.agentName}</span>
                  </div>

                  {/* Active Status Badge */}
                  {isCurrent && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-1.5 px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[9px] font-mono rounded-full inline-block"
                    >
                      DELIBERATING
                    </motion.div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Railway Ties Graphic at bottom */}
      <div className="flex justify-between px-12 pt-2 opacity-30 text-[9px] font-mono text-slate-500">
        <span>DEPOT_01</span>
        <span>FOUNDRY_02</span>
        <span>AUDIT_03</span>
        <span>COMPILER_04</span>
        <span>HILBERT_05</span>
      </div>

    </div>
  );
}
