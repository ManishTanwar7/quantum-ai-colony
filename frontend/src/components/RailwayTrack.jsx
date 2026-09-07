import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Cpu, Bug, Zap, Eye, CheckCircle2, Loader2 } from 'lucide-react';

const STATIONS = [
  { id: 'theory', name: 'Theory Depot', agentId: 'professor', agentName: 'Prof. Vance', icon: BookOpen, color: '#38bdf8' },
  { id: 'foundry', name: 'Circuit Foundry', agentId: 'engineer', agentName: 'Devin Matrix', icon: Cpu, color: '#34d399' },
  { id: 'debug', name: 'Debug Siding', agentId: 'debugger', agentName: 'Agent BugHunter', icon: Bug, color: '#f43f5e' },
  { id: 'optimizer', name: 'Optimizer Junction', agentId: 'optimizer', agentName: 'OptiPrime', icon: Zap, color: '#fbbf24' },
  { id: 'visualizer', name: 'Visualizer Terminal', agentId: 'visualizer', agentName: 'Iris Quantum', icon: Eye, color: '#c084fc' },
];

export default function RailwayTrack({ activeAgentId, activeStation, isSimulating = false }) {
  const activeStationIndex = STATIONS.findIndex(s => s.id === activeStation || s.agentId === activeAgentId);
  const currentIndex = activeStationIndex >= 0 ? activeStationIndex : (isSimulating ? 0 : -1);

  return (
    <div className="w-full bg-gradient-to-r from-slate-900/90 via-[#0d1538]/90 to-slate-900/90 border border-purple-500/30 rounded-2xl p-4 lg:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      
      {/* Background ambient rail glow */}
      <div className="absolute inset-0 bg-radial-gradient from-purple-500/5 to-transparent pointer-events-none" />

      {/* Header info */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <h3 className="text-xs font-bold tracking-wider text-slate-200 uppercase font-mono">
            COLONY RAILWAY TRANSIT & SYNAPSE BUS
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-mono">Pipeline Status:</span>
          {isSimulating ? (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 rounded-full font-mono text-[11px] shadow-[0_0_15px_rgba(56,189,248,0.25)]">
              <Loader2 className="w-3 h-3 animate-spin text-cyan-300" />
              <span>SYNAPSE ACTIVE — CONCURRENCY COLLABORATION</span>
            </span>
          ) : (
            <span className="px-3 py-1 bg-slate-800/80 border border-slate-700 text-slate-400 rounded-full font-mono text-[11px]">
              STATIONARY / READY
            </span>
          )}
        </div>
      </div>

      {/* Railway Track Graphic */}
      <div className="relative py-6 px-2 lg:px-8">
        
        {/* The Dual Railway Tracks (Parallel Glowing Rails) */}
        <div className="absolute top-[52px] left-8 right-8 h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
          {isSimulating && (
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-48 shadow-[0_0_12px_#38bdf8]"
              animate={{ x: ['-100%', '600%'] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
            />
          )}
        </div>
        <div className="absolute top-[60px] left-8 right-8 h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
          {isSimulating && (
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-purple-400 to-transparent w-48 shadow-[0_0_12px_#a855f7]"
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

            return (
              <div key={station.id} className="flex flex-col items-center text-center">
                
                {/* Station Node / Pod */}
                <motion.div
                  className={`relative flex items-center justify-center w-14 h-14 rounded-2xl border-2 transition-all duration-300 ${
                    isCurrent
                      ? 'bg-slate-900 border-cyan-400 ring-4 ring-cyan-500/30 scale-110 z-20 shadow-[0_0_25px_rgba(56,189,248,0.4)]'
                      : isCompleted
                      ? 'bg-slate-900/90 border-emerald-500/80 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.2)]'
                      : 'bg-slate-950/80 border-slate-800 text-slate-500'
                  }`}
                  animate={isCurrent ? { y: [0, -4, 0] } : {}}
                  transition={isCurrent ? { repeat: Infinity, duration: 1.6, ease: "easeInOut" } : {}}
                >
                  <Icon
                    className="w-6 h-6"
                    style={{ color: isCurrent ? station.color : isCompleted ? '#34d399' : '#64748b' }}
                  />

                  {isCompleted && (
                    <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-black rounded-full p-0.5 shadow-md">
                      <CheckCircle2 className="w-3 h-3 text-black" />
                    </span>
                  )}

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
                    isCurrent ? 'text-cyan-300' : isCompleted ? 'text-slate-200' : 'text-slate-400'
                  }`}>
                    {station.name}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: station.color }} />
                    <span>{station.agentName}</span>
                  </div>

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

      {/* Railway Track Identifiers */}
      <div className="flex justify-between px-10 pt-2 opacity-40 text-[9px] font-mono text-slate-400 border-t border-slate-800/80 mt-2">
        <span>DEPOT_01</span>
        <span>FOUNDRY_02</span>
        <span>AUDIT_03</span>
        <span>COMPILER_04</span>
        <span>HILBERT_05</span>
      </div>

    </div>
  );
}
