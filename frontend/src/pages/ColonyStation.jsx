import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Cpu, Sparkles, Play, CheckCircle2, ArrowRight, 
  Terminal
} from 'lucide-react';
import RailwayTrack from '../components/RailwayTrack';
import AgentChatModal from '../components/AgentChatModal';
import { api } from '../services/api';

const PRESETS = [
  { id: 'grover', title: "Design Grover's Algorithm", prompt: "Colony, synthesize a minimal 2-qubit Grover search circuit targeting state |11> with oracle and diffusion operators." },
  { id: 'teleport', title: "Quantum Teleportation Relay", prompt: "Colony, build a 3-qubit quantum teleportation protocol with Bell EPR pair distribution and Alice-Bob feed-forward corrections." },
  { id: 'bell', title: "Maximally Entangled Bell Pair", prompt: "Colony, formulate the EPR Bell state (|00> + |11>)/sqrt(2) and verify measurement correlations." },
  { id: 'qft', title: "Quantum Fourier Transform (QFT)", prompt: "Colony, assemble a 3-qubit Quantum Fourier Transform circuit using Hadamard cascades and controlled phase rotations." },
];

export default function ColonyStation() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeAgentId, setActiveAgentId] = useState(null);
  const [activeStation, setActiveStation] = useState(null);
  const [missionTitle, setMissionTitle] = useState("Autonomous Mission");
  const [consensusData, setConsensusData] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef(null);

  // Setup WebSocket connection to Colony Bus
  useEffect(() => {
    let ws;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/colony/ws`;

    const connectWebSocket = () => {
      try {
        ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          setWsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.type === 'colony_init') {
              if (data.messages && data.messages.length > 0) {
                setMessages(data.messages);
              }
            } else if (data.type === 'agent_moving') {
              setIsSimulating(true);
              setActiveAgentId(data.agent_id);
              setActiveStation(data.station);
            } else if (data.type === 'agent_thinking') {
              setIsSimulating(true);
              setActiveAgentId(data.agent_id);
              setActiveStation(data.station);
            } else if (data.type === 'agent_message') {
              setMessages((prev) => [...prev, data.message]);
            } else if (data.type === 'mission_completed') {
              setIsSimulating(false);
              setActiveAgentId(null);
              setActiveStation(null);
              setConsensusData(data.data);
            }
          } catch (err) {
            console.error("Error parsing WebSocket payload:", err);
          }
        };

        ws.onclose = () => {
          setWsConnected(false);
          setTimeout(connectWebSocket, 3000);
        };

        ws.onerror = () => {
          setWsConnected(false);
        };
      } catch (e) {
        console.warn("WebSocket fallback:", e);
      }
    };

    connectWebSocket();

    // Fallback message load
    api.getColonyMessages().then((hist) => {
      if (hist && hist.length > 0) {
        setMessages(hist);
      }
    }).catch(() => {});

    // Check for preloaded prompt from Home
    const prePrompt = sessionStorage.getItem('colony_launch_prompt');
    const preTitle = sessionStorage.getItem('colony_launch_title');
    if (prePrompt) {
      sessionStorage.removeItem('colony_launch_prompt');
      sessionStorage.removeItem('colony_launch_title');
      setTimeout(() => {
        handleLaunchMission(preTitle || "Gamified Mission", prePrompt);
      }, 500);
    }

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const handleLaunchMission = async (title, prompt) => {
    if (isSimulating) return;
    setIsSimulating(true);
    setMissionTitle(title);
    setConsensusData(null);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'trigger_mission',
        title,
        prompt
      }));
    } else {
      try {
        const res = await api.dispatchMission(title, prompt);
        setMessages((prev) => [...prev, ...res.messages]);
        setConsensusData(res);
      } catch (err) {
        console.error("Mission dispatch error:", err);
      } finally {
        setIsSimulating(false);
        setActiveAgentId(null);
        setActiveStation(null);
      }
    }
  };

  const handleOpenInLab = () => {
    if (consensusData?.final_circuit) {
      sessionStorage.setItem('colony_transfer_circuit', JSON.stringify(consensusData.final_circuit));
      sessionStorage.setItem('colony_transfer_qiskit', consensusData.qiskit_code || '');
      navigate('/lab');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 bg-white min-h-screen">
      
      {/* Station Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-gray-100 border border-gray-300 text-gray-700 text-xs font-mono">
            <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-emerald-600' : 'bg-gray-400'}`} />
            <span>Colony Bus: {wsConnected ? 'ONLINE' : 'STANDBY'}</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mt-1">
            Colony Station Command Deck
          </h1>
          <p className="text-xs text-gray-600">
            Real-time multi-agent quantum architecture deliberation, railway transit & state consensus
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-white rounded border border-gray-300 text-xs font-mono text-gray-700 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-gray-800" />
            <span>5 Specialized Agents</span>
          </div>
        </div>
      </div>

      {/* 1. Animated Railway Track Dashboard */}
      <RailwayTrack
        activeAgentId={activeAgentId}
        activeStation={activeStation}
        isSimulating={isSimulating}
      />

      {/* 2. Main Workspace: Mission Launcher & Live Agent Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Mission Presets & Directives */}
        <div className="space-y-6">
          
          {/* Mission Presets Card */}
          <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-mono uppercase text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gray-800" />
                <span>Quick Mission Dispatch</span>
              </h3>
              <span className="text-[10px] text-gray-500 font-mono">1-Click Dispatch</span>
            </div>

            <div className="space-y-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  disabled={isSimulating}
                  onClick={() => handleLaunchMission(p.title, p.prompt)}
                  className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-white border border-gray-200 hover:border-gray-900 transition-colors disabled:opacity-50 group"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-gray-900 group-hover:underline">
                    <span>{p.title}</span>
                    <Play className="w-3 h-3 fill-gray-900" />
                  </div>
                  <p className="text-[11px] text-gray-600 mt-1 line-clamp-2 leading-normal">
                    {p.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Consensus Result Card */}
          {consensusData && (
            <div className="p-5 rounded-xl bg-white border border-gray-900 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>MISSION CONSENSUS ACHIEVED</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900">{consensusData.title}</h4>
                <p className="text-xs text-gray-700 mt-1 leading-relaxed">{consensusData.summary}</p>
              </div>

              {consensusData.final_circuit && (
                <div className="p-3 bg-gray-50 rounded border border-gray-200 text-xs font-mono space-y-1">
                  <div className="text-gray-900 font-semibold">Synthesized Circuit:</div>
                  <div className="text-gray-600 text-[11px]">
                    {consensusData.final_circuit.num_qubits} Qubits • {consensusData.final_circuit.gates?.length || 0} Gates (Optimized)
                  </div>
                </div>
              )}

              <button
                onClick={handleOpenInLab}
                className="w-full py-2 px-3 bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs rounded border border-gray-900 transition-colors flex items-center justify-center gap-2"
              >
                <Terminal className="w-4 h-4" />
                <span>Open in Quantum Circuit Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Agent Pipeline Overview */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono space-y-2">
            <span className="text-gray-500 uppercase text-[10px] tracking-wider">Bus Transit Pipeline:</span>
            <div className="text-[11px] text-gray-700 space-y-1">
              <div>1. <strong className="text-gray-900">Professor Vance:</strong> Theoretical derivation</div>
              <div>2. <strong className="text-gray-900">Devin Matrix:</strong> Gate synthesis</div>
              <div>3. <strong className="text-gray-900">Agent BugHunter:</strong> Error & coherence audit</div>
              <div>4. <strong className="text-gray-900">OptiPrime:</strong> Depth optimization</div>
              <div>5. <strong className="text-gray-900">Iris Quantum:</strong> 3D Hilbert state projection</div>
            </div>
          </div>

        </div>

        {/* Right 2 Columns: Live Agent Dialogue Feed */}
        <div className="lg:col-span-2 h-[660px]">
          <AgentChatModal
            messages={messages}
            onSendPrompt={(prompt) => handleLaunchMission("Custom User Directive", prompt)}
            isThinking={isSimulating}
            activeAgentId={activeAgentId}
          />
        </div>

      </div>

    </div>
  );
}
