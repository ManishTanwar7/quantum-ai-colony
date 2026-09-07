import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Cpu, Bug, Zap, Eye, CheckCircle2, Loader2 } from 'lucide-react';

const STATIONS = [
  { id: 'theory', name: 'Theory Depot', agentId: 'professor', agentName: 'Prof. Vance', icon: BookOpen, color: '#7c3aed' },
  { id: 'foundry', name: 'Circuit Foundry', agentId: 'engineer', agentName: 'Devin Matrix', icon: Cpu, color: '#059669' },
  { id: 'debug', name: 'Debug Siding', agentId: 'debugger', agentName: 'Agent BugHunter', icon: Bug, color: '#e11d48' },
  { id: 'optimizer', name: 'Optimizer Junction', agentId: 'optimizer', agentName: 'OptiPrime', icon: Zap, color: '#d97706' },
  { id: 'visualizer', name: 'Visualizer Terminal', agentId: 'visualizer', agentName: 'Iris Quantum', icon: Eye, color: '#4f46e5' },
];

export default function RailwayTrack({ activeAgentId, activeStation, isSimulating = false }) {
  const activeStationIndex = STATIONS.findIndex(s => s.id === activeStation || s.agentId === activeAgentId);
  const currentIndex = activeStationIndex >= 0 ? activeStationIndex : (isSimulating ? 0 : -1);

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 lg:p-6 shadow-xs relative overflow-hidden">
      
      {/* Header info */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
          <h3 className="text-xs font-bold tracking-wider text-slate-800 uppercase font-mono">
            COLONY RAILWAY TRANSIT & SYNAPSE BUS
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-mono">Pipeline Status:</span>
          {isSimulating ? (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-200 text-purple-700 rounded-full font-mono text-[11px] font-semibold">
              <Loader2 className="w-3 h-3 animate-spin text-purple-600" />
              <span>SYNAPSE ACTIVE — MULTI-AGENT TRANSIT</span>
            </span>
          ) : (
            <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-full font-mono text-[11px]">
              READY / STATIONARY
            </span>
          )}
        </div>
      </div>

      {/* Railway Track Graphic */}
      <div className="relative py-6 px-2 lg:px-8">
        
        {/* Dual Rails in Light Slate */}
        <div className="absolute top-[52px] left-8 right-8 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          {isSimulating && (
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-purple-600 to-transparent w-48 shadow-xs"
              animate={{ x: ['-100%', '600%'] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
            />
          )}
        </div>
        <div className="absolute top-[60px] left-8 right-8 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          {isSimulating && (
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent w-48 shadow-xs"
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
                <div
                  className={`relative flex items-center justify-center w-14 h-14 rounded-2xl border-2 transition-all duration-200 ${
                    isCurrent
                      ? 'bg-purple-50 border-purple-600 ring-4 ring-purple-100 scale-110 z-20 shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <Icon
                    className="w-6 h-6"
                    style={{ color: isCurrent ? station.color : isCompleted ? '#059669' : '#94a3b8' }}
                  />

                  {isCompleted && (
                    <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white rounded-full p-0.5 shadow-xs">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </span>
                  )}

                  {isCurrent && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-600" />
                    </span>
                  )}
                </div>

                {/* Station Details */}
                <div className="mt-3">
                  <div className={`text-[11px] font-bold tracking-wide font-mono uppercase ${
                    isCurrent ? 'text-purple-700' : isCompleted ? 'text-slate-800' : 'text-slate-500'
                  }`}>
                    {station.name}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: station.color }} />
                    <span>{station.agentName}</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
