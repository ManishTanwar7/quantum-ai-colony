import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, Terminal, BookOpen, Cpu, Bug, Zap, Eye, 
  Send, Sparkles, Copy, Check 
} from 'lucide-react';

const AGENT_META = {
  professor: { icon: BookOpen, label: 'Theory', border: 'border-blue-200', bg: 'bg-blue-50', text: 'text-blue-900' },
  engineer: { icon: Cpu, label: 'Foundry', border: 'border-emerald-200', bg: 'bg-emerald-50', text: 'text-emerald-900' },
  debugger: { icon: Bug, label: 'Audit', border: 'border-rose-200', bg: 'bg-rose-50', text: 'text-rose-900' },
  optimizer: { icon: Zap, label: 'Optimizer', border: 'border-amber-200', bg: 'bg-amber-50', text: 'text-amber-900' },
  visualizer: { icon: Eye, label: 'Visualizer', border: 'border-purple-200', bg: 'bg-purple-50', text: 'text-purple-900' },
};

export default function AgentChatModal({ 
  messages = [], 
  onSendPrompt, 
  isThinking = false, 
  activeAgentId = null 
}) {
  const [filterAgent, setFilterAgent] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleCopyCode = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    if (onSendPrompt) {
      onSendPrompt(inputText.trim());
    }
    setInputText('');
  };

  const filteredMessages = filterAgent === 'all' 
    ? messages 
    : messages.filter(m => m.agent === filterAgent);

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
      
      {/* Dialogue Header & Filter Controls */}
      <div className="p-3.5 border-b border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-white border border-gray-300 text-gray-900">
            <Sparkles className="w-4 h-4 text-gray-800" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-mono text-gray-900 uppercase flex items-center gap-2">
              <span>Colony Synapse Transmission</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white border border-gray-300 text-gray-700">
                {messages.length} Dispatches
              </span>
            </h4>
            <p className="text-[11px] text-gray-600">Autonomous multi-agent consensus bus & circuit deliberation</p>
          </div>
        </div>

        {/* Agent Filter Buttons (Flat Style) */}
        <div className="flex items-center gap-1 bg-white p-0.5 rounded border border-gray-300 text-xs font-mono">
          <button
            onClick={() => setFilterAgent('all')}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
              filterAgent === 'all' ? 'bg-gray-100 text-gray-900 font-bold border border-gray-400' : 'text-gray-600 hover:text-black'
            }`}
          >
            All
          </button>
          {Object.entries(AGENT_META).map(([key, meta]) => {
            const Icon = meta.icon;
            const active = filterAgent === key;
            return (
              <button
                key={key}
                onClick={() => setFilterAgent(key)}
                className={`p-1 rounded transition-colors flex items-center gap-1 text-[11px] ${
                  active ? `${meta.bg} ${meta.text} font-bold border ${meta.border}` : 'text-gray-500 hover:text-black'
                }`}
                title={`Filter by ${key}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-4 bg-white">
        {filteredMessages.length === 0 && !isThinking ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-gray-500">
            <Bot className="w-10 h-10 mb-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-800">Colony Synapse Bus is Ready</p>
            <p className="text-xs max-w-sm mt-1 text-gray-600">Assign a mission or enter a prompt below to initiate multi-agent collaboration.</p>
          </div>
        ) : (
          filteredMessages.map((msg, i) => {
            const meta = AGENT_META[msg.agent] || AGENT_META.professor;
            const Icon = meta.icon;

            return (
              <div key={msg.id || i} className="flex items-start gap-3">
                {/* Agent Avatar Badge */}
                <div className={`w-8 h-8 rounded border flex items-center justify-center shrink-0 ${meta.border} ${meta.bg} ${meta.text}`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Chat Bubble */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold font-mono ${meta.text}`}>
                      {msg.agent_name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-100 border border-gray-200 text-gray-600 font-mono">
                      {msg.role}
                    </span>
                    <span className="text-[10px] text-gray-400 ml-auto font-mono">
                      {msg.timestamp}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-lg border border-gray-200 bg-gray-50 text-xs leading-relaxed text-gray-900">
                    <p className="whitespace-pre-line">{msg.content}</p>

                    {/* Inline Code Snippet */}
                    {msg.circuit_snippet && (
                      <div className="mt-3 bg-white rounded border border-gray-300 overflow-hidden font-mono">
                        <div className="flex items-center justify-between px-3 py-1.5 bg-gray-100 border-b border-gray-200 text-[10px] text-gray-700">
                          <span className="flex items-center gap-1.5 font-bold text-gray-900">
                            <Terminal className="w-3 h-3" />
                            <span>Qiskit Circuit Assembly</span>
                          </span>
                          <button
                            onClick={() => handleCopyCode(msg.id, msg.circuit_snippet)}
                            className="flex items-center gap-1 text-gray-600 hover:text-black transition-colors"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <pre className="p-3 text-[11px] text-gray-900 overflow-x-auto max-h-48 leading-normal">
                          {msg.circuit_snippet}
                        </pre>
                      </div>
                    )}

                    {/* State preview tag */}
                    {msg.bloch_data && (
                      <div className="mt-2.5 p-2 bg-white rounded border border-gray-200 flex items-center justify-between text-[11px]">
                        <span className="text-gray-700 font-mono">Geometric projection mapped to 3D Bloch Canvas</span>
                        <span className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 text-gray-900 rounded font-semibold text-[10px]">
                          Bloch Vectors Updated
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Live Deliberation / Indicator */}
        {isThinking && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg">
            <div className="w-7 h-7 rounded bg-white border border-gray-900 flex items-center justify-center text-gray-900">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-900 font-mono">
                {activeAgentId ? `${activeAgentId.toUpperCase()} DELIBERATING` : 'COLONY SYNAPSE PROCESSING...'}
              </p>
              <span className="text-[10px] text-gray-600 font-mono">Formulating quantum consensus</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* User Input / Directive Dispatcher (Flat Style) */}
      <form onSubmit={handleSend} className="p-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center gap-2 bg-white border border-gray-300 focus-within:border-gray-900 rounded p-1 transition-colors">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Assign directive to Colony (e.g. 'Synthesize Grover search on 2 qubits')..."
            className="flex-1 bg-transparent px-2.5 py-1 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none"
            disabled={isThinking}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-100 disabled:opacity-40 text-gray-900 font-medium text-xs rounded border border-gray-900 transition-colors"
          >
            <span>Transmit</span>
            <Send className="w-3 h-3" />
          </button>
        </div>
      </form>

    </div>
  );
}
