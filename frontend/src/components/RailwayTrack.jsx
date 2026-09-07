import React from 'react';
import { BookOpen, Cpu, Bug, Zap, Eye, CheckCircle2, Loader2 } from 'lucide-react';

const STATIONS = [
  { id: 'theory', name: 'Theory Depot', agentId: 'professor', agentName: 'Prof. Vance', icon: BookOpen },
  { id: 'foundry', name: 'Circuit Foundry', agentId: 'engineer', agentName: 'Devin Matrix', icon: Cpu },
  { id: 'debug', name: 'Debug Siding', agentId: 'debugger', agentName: 'Agent BugHunter', icon: Bug },
  { id: 'optimizer', name: 'Optimizer Junction', agentId: 'optimizer', agentName: 'OptiPrime', icon: Zap },
  { id: 'visualizer', name: 'Visualizer Terminal', agentId: 'visualizer', agentName: 'Iris Quantum', icon: Eye },
];

export default function RailwayTrack({ activeAgentId, activeStation, isSimulating = false }) {
  const activeStationIndex = STATIONS.findIndex(s => s.id === activeStation || s.agentId === activeAgentId);
  const currentIndex = activeStationIndex >= 0 ? activeStationIndex : (isSimulating ? 0 : -1);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-4 lg:p-6 shadow-xs">
      
      {/* Header info */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />
          <h3 className="text-xs font-bold tracking-wider text-gray-900 uppercase font-mono">
            Colony Railway Pipeline & Synapse Transit
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500 font-mono">Status:</span>
          {isSimulating ? (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-gray-100 border border-gray-900 text-gray-900 rounded font-mono text-[11px] font-semibold">
              <Loader2 className="w-3 h-3 animate-spin text-gray-900" />
              <span>DELIBERATING</span>
            </span>
          ) : (
            <span className="px-2.5 py-0.5 bg-gray-50 border border-gray-300 text-gray-600 rounded font-mono text-[11px]">
              READY
            </span>
          )}
        </div>
      </div>

      {/* Railway Track Graphic */}
      <div className="relative py-4 px-2 lg:px-6">
        
        {/* The Parallel Railway Tracks */}
        <div className="absolute top-[44px] left-6 right-6 h-1 bg-gray-200 rounded" />
        <div className="absolute top-[52px] left-6 right-6 h-1 bg-gray-200 rounded" />

        {/* Stations Grid */}
        <div className="grid grid-cols-5 gap-2 relative z-10">
          {STATIONS.map((station, index) => {
            const Icon = station.icon;
            const isCurrent = currentIndex === index;
            const isCompleted = currentIndex > index;

            return (
              <div key={station.id} className="flex flex-col items-center text-center">
                
                {/* Station Node Box */}
                <div
                  className={`relative flex items-center justify-center w-12 h-12 rounded-lg border transition-all duration-200 ${
                    isCurrent
                      ? 'bg-white border-2 border-gray-900 shadow-sm scale-105 z-20'
                      : isCompleted
                      ? 'bg-emerald-50 border border-emerald-500 text-emerald-800'
                      : 'bg-gray-50 border-gray-300 text-gray-500'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isCurrent
                        ? 'text-gray-900'
                        : isCompleted
                        ? 'text-emerald-700'
                        : 'text-gray-400'
                    }`}
                  />

                  {isCompleted && (
                    <span className="absolute -top-1 -right-1 bg-white text-emerald-700 border border-emerald-500 rounded-full p-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                    </span>
                  )}

                  {isCurrent && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gray-900" />
                    </span>
                  )}
                </div>

                {/* Station Label */}
                <div className="mt-2.5">
                  <div className={`text-[11px] font-bold tracking-tight font-mono ${
                    isCurrent ? 'text-gray-900' : isCompleted ? 'text-gray-800' : 'text-gray-500'
                  }`}>
                    {station.name}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    {station.agentName}
                  </div>

                  {isCurrent && (
                    <div className="mt-1 px-1.5 py-0.2 bg-gray-100 border border-gray-800 text-gray-900 text-[9px] font-mono rounded font-semibold inline-block">
                      ACTIVE
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Track Footers */}
      <div className="flex justify-between px-6 pt-3 opacity-60 text-[9px] font-mono text-gray-500 border-t border-gray-100 mt-3">
        <span>TRACK 01: THEORY</span>
        <span>TRACK 02: FOUNDRY</span>
        <span>TRACK 03: AUDIT</span>
        <span>TRACK 04: OPTIMIZE</span>
        <span>TRACK 05: VISUALIZE</span>
      </div>

    </div>
  );
}
