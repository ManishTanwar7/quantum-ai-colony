import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, Terminal, BookOpen, Cpu, Bug, Zap, Eye, 
  Send, Sparkles, Copy, Check 
} from 'lucide-react';

const AGENT_META = {
  professor: { icon: BookOpen, color: '#38bdf8', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
  engineer: { icon: Cpu, color: '#34d399', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  debugger: { icon: Bug, color: '#f43f5e', bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400' },
  optimizer: { icon: Zap, color: '#fbbf24', bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
  visualizer: { icon: Eye, color: '#c084fc', bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
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
    <div className="flex flex-col h-full bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
      
      {/* Dialogue Header & Filter Controls */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-950 border border-purple-500/40 text-purple-400">
            <Sparkles className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-mono uppercase text-white tracking-wide flex items-center gap-2">
              <span>Colony Synapse Transmission</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 border border-purple-800 text-purple-300">
                {messages.length} Dispatches
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">Autonomous multi-agent consensus bus & circuit deliberation</p>
          </div>
        </div>

        {/* Agent Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setFilterAgent('all')}
            className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] ${
              filterAgent === 'all' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
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
                className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-[11px] ${
                  active ? `${meta.bg} ${meta.text} border ${meta.border} font-semibold` : 'text-slate-500 hover:text-white'
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
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-4">
        {filteredMessages.length === 0 && !isThinking ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <Bot className="w-12 h-12 mb-3 text-slate-600 animate-pulse" />
            <p className="text-sm font-medium text-slate-400">Colony Synapse Bus is Idle</p>
            <p className="text-xs max-w-sm mt-1 text-slate-500">Assign a mission or enter a prompt below to initiate multi-agent collaboration.</p>
          </div>
        ) : (
          filteredMessages.map((msg, i) => {
            const meta = AGENT_META[msg.agent] || AGENT_META.professor;
            const Icon = meta.icon;

            return (
              <motion.div 
                key={msg.id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-start gap-3.5"
              >
                {/* Agent Avatar Badge */}
                <div 
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${meta.border} ${meta.bg} shadow-md`}
                  style={{ color: meta.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Chat Bubble */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold font-mono ${meta.text}`}>
                      {msg.agent_name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-950 border border-slate-800 text-slate-400 font-mono">
                      {msg.role}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-auto font-mono">
                      {msg.timestamp}
                    </span>
                  </div>

                  <div className={`p-3.5 rounded-2xl rounded-tl-sm border text-xs leading-relaxed text-slate-200 ${meta.bg} ${meta.border} shadow-sm`}>
                    <p className="whitespace-pre-line">{msg.content}</p>

                    {/* Inline Code Snippet */}
                    {msg.circuit_snippet && (
                      <div className="mt-3 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden font-mono">
                        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/80 border-b border-slate-800 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1.5 text-cyan-400">
                            <Terminal className="w-3 h-3" />
                            <span>Qiskit Circuit Assembly</span>
                          </span>
                          <button
                            onClick={() => handleCopyCode(msg.id, msg.circuit_snippet)}
                            className="flex items-center gap-1 hover:text-cyan-300 transition-colors"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <pre className="p-3 text-[11px] text-cyan-200 overflow-x-auto max-h-48 leading-normal">
                          {msg.circuit_snippet}
                        </pre>
                      </div>
                    )}

                    {/* State preview tag */}
                    {msg.bloch_data && (
                      <div className="mt-2.5 p-2 bg-purple-950/40 rounded-lg border border-purple-800/40 flex items-center justify-between text-[11px]">
                        <span className="text-purple-300 font-mono">Geometric projection mapped to 3D Bloch Canvas</span>
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded font-semibold text-[10px]">
                          Bloch Vectors Updated
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}

        {/* Live Deliberation Indicator */}
        {isThinking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-3 bg-cyan-950/40 border border-cyan-800/60 rounded-xl"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-cyan-300 font-mono">
                {activeAgentId ? `${activeAgentId.toUpperCase()} DELIBERATING` : 'COLONY SYNAPSE PROCESSING...'}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-[10px] text-slate-400 ml-2 font-mono">Formulating quantum consensus</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* User Input Dispatcher */}
      <form onSubmit={handleSend} className="p-3 lg:p-4 bg-slate-950/80 border-t border-slate-800">
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 focus-within:border-purple-500 rounded-xl p-1.5 transition-colors">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Assign directive to Colony (e.g. 'Synthesize Grover search on 2 qubits')..."
            className="flex-1 bg-transparent px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
            disabled={isThinking}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-lg transition-all shadow-[0_0_10px_rgba(168,85,247,0.3)]"
          >
            <span>Transmit</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

    </div>
  );
}
