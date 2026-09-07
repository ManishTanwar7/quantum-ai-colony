import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, Terminal, BookOpen, Cpu, Bug, Zap, Eye, 
  Send, Sparkles, Copy, Check 
} from 'lucide-react';

const AGENT_META = {
  professor: { icon: BookOpen, color: '#7c3aed', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800' },
  engineer: { icon: Cpu, color: '#059669', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800' },
  debugger: { icon: Bug, color: '#e11d48', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800' },
  optimizer: { icon: Zap, color: '#d97706', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800' },
  visualizer: { icon: Eye, color: '#4f46e5', bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-800' },
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
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      
      {/* Dialogue Header & Filter Controls */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-700">
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-mono uppercase text-slate-900 tracking-wide flex items-center gap-2">
              <span>Colony Synapse Transmission</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-semibold">
                {messages.length} Dispatches
              </span>
            </h4>
            <p className="text-[11px] text-slate-500">Autonomous multi-agent consensus bus & circuit deliberation</p>
          </div>
        </div>

        {/* Agent Filter Buttons */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-mono shadow-xs">
          <button
            onClick={() => setFilterAgent('all')}
            className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] font-medium ${
              filterAgent === 'all' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
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
                  active ? `${meta.bg} ${meta.text} border ${meta.border} font-semibold` : 'text-slate-400 hover:text-slate-700'
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
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <Bot className="w-12 h-12 mb-3 text-slate-300" />
            <p className="text-sm font-medium text-slate-700">Colony Synapse Bus is Ready</p>
            <p className="text-xs max-w-sm mt-1 text-slate-500">Assign a mission or enter a directive below to initiate multi-agent collaboration.</p>
          </div>
        ) : (
          filteredMessages.map((msg, i) => {
            const meta = AGENT_META[msg.agent] || AGENT_META.professor;
            const Icon = meta.icon;

            return (
              <motion.div 
                key={msg.id || i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-3.5"
              >
                {/* Agent Avatar Badge */}
                <div 
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${meta.border} ${meta.bg} shadow-xs`}
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
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-600 font-mono">
                      {msg.role}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-auto font-mono">
                      {msg.timestamp}
                    </span>
                  </div>

                  <div className={`p-3.5 rounded-2xl rounded-tl-sm border text-xs leading-relaxed text-slate-800 ${meta.bg} ${meta.border} shadow-xs`}>
                    <p className="whitespace-pre-line">{msg.content}</p>

                    {/* Inline Code Snippet */}
                    {msg.circuit_snippet && (
                      <div className="mt-3 bg-white rounded-xl border border-slate-200 overflow-hidden font-mono shadow-xs">
                        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border-b border-slate-200 text-[10px] text-slate-600">
                          <span className="flex items-center gap-1.5 text-purple-700 font-medium">
                            <Terminal className="w-3 h-3" />
                            <span>Qiskit Circuit Assembly</span>
                          </span>
                          <button
                            onClick={() => handleCopyCode(msg.id, msg.circuit_snippet)}
                            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <pre className="p-3 text-[11px] text-slate-900 overflow-x-auto max-h-48 leading-normal">
                          {msg.circuit_snippet}
                        </pre>
                      </div>
                    )}

                    {/* State preview tag */}
                    {msg.bloch_data && (
                      <div className="mt-2.5 p-2 bg-purple-50 rounded-lg border border-purple-200 flex items-center justify-between text-[11px]">
                        <span className="text-purple-800 font-mono">Geometric projection mapped to 3D Bloch Canvas</span>
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-semibold text-[10px]">
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
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-xl"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-purple-200 flex items-center justify-center text-purple-600 shadow-xs">
              <Sparkles className="w-4 h-4 animate-spin text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-purple-900 font-mono">
                {activeAgentId ? `${activeAgentId.toUpperCase()} DELIBERATING` : 'COLONY SYNAPSE PROCESSING...'}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-[10px] text-slate-500 ml-2 font-mono">Formulating quantum consensus</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* User Input Dispatcher */}
      <form onSubmit={handleSend} className="p-3 lg:p-4 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center gap-2 bg-white border border-slate-300 focus-within:border-slate-800 rounded-xl p-1.5 transition-colors shadow-xs">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Assign directive to Colony (e.g. 'Synthesize Grover search on 2 qubits')..."
            className="flex-1 bg-transparent px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
            disabled={isThinking}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
          >
            <span>Transmit</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

    </div>
  );
}
