"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Check, AlertCircle, ArrowLeft } from "lucide-react";

import { useUserProfile } from "./UserProfileContext";

export default function ServiceMarketplace({ onClose }) {
  const { userProfile } = useUserProfile();
  const [activeView, setActiveView] = useState("ASK"); // 'ASK', 'COMPARE', 'ANALYZE'
  
  // ASK View State
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  
  // COMPARE / ANALYZE State
  const [compareQueue, setCompareQueue] = useState([]);
  const [finalSelection, setFinalSelection] = useState(null);

  const [isTyping, setIsTyping] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleAsk = async (query) => {
    setMessages([...messages, { role: "user", content: query }]);
    setIsTyping(true);
    
    try {
      const res = await fetch('/api/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, userProfile })
      });
      const data = await res.json();
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.analysis?.msg || "Here are the top options based on your request. Feel free to compare them.",
          options: data.options
        }
      ]);
    } catch (error) {
       console.error("Marketplace fetch error:", error);
       setMessages((prev) => [
        ...prev,
        {
          role: "error",
          content: "Couldn’t load data right now",
          retryQuery: query
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSelectCompare = (opt) => {
    if (compareQueue.find(c => c.id === opt.id)) return; // prevent dupes
    const newQueue = [...compareQueue, opt].slice(-2); // Keep max 2
    setCompareQueue(newQueue);
    
    if (newQueue.length === 2) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleGoToCompare = () => {
    if (compareQueue.length > 0) setActiveView("COMPARE");
  };

  const handleSelectFinal = (opt) => {
    setFinalSelection(opt);
    setActiveView("ANALYZE");
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden h-full min-h-[600px] lg:col-span-3 relative">
      <div className="absolute inset-0 bg-linear-to-tr from-emerald-500/5 to-purple-500/5 pointer-events-none" />

      {/* Top Header / Nav */}
      <div className="relative flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-black/20 z-10">
        <button onClick={onClose} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex items-center gap-1 sm:gap-2 bg-gray-200/50 dark:bg-gray-800/50 p-1 rounded-lg">
          {["ASK", "COMPARE", "ANALYZE"].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                activeView === view 
                  ? "bg-white dark:bg-gray-700 text-black dark:text-white shadow-xs" 
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {view === "ASK" ? "Ask Your AI" : view === "COMPARE" ? "Compare Options" : "Analyze Risk"}
            </button>
          ))}
        </div>
        <div className="w-16" /> {/* spacer for center alignment */}
      </div>

      <div className="flex-1 overflow-y-auto relative p-4 sm:p-6 z-10">
        <AnimatePresence mode="wait">
          
          {/* 1. ASK VIEW */}
          {activeView === "ASK" && (
            <motion.div 
              key="ASK"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="w-full max-w-3xl mx-auto flex flex-col h-full"
            >
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Bot size={32} />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">Start by asking something simple</h2>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button onClick={() => handleAsk("Get a Loan")} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium hover:border-emerald-500 hover:text-emerald-500 transition-colors shadow-sm">
                      Get a Loan
                    </button>
                    <button onClick={() => handleAsk("Start Investing")} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium hover:border-emerald-500 hover:text-emerald-500 transition-colors shadow-sm">
                      Start Investing
                    </button>
                    <button onClick={() => handleAsk("Explore Options")} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium hover:border-emerald-500 hover:text-emerald-500 transition-colors shadow-sm">
                      Explore Options
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 space-y-6 pb-20">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      {msg.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                          <Bot size={16} className="text-white" />
                        </div>
                      )}
                      {msg.role === "error" && (
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center shrink-0">
                          <AlertCircle size={16} className="text-red-500" />
                        </div>
                      )}
                      <div className="flex flex-col gap-3 max-w-[90%]">
                        <div className={`p-4 rounded-2xl shadow-sm text-sm ${
                          msg.role === "user" ? "bg-emerald-500 text-white rounded-br-none" 
                          : msg.role === "error" ? "bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-800 rounded-bl-none text-red-600 dark:text-red-400"
                          : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-bl-none text-gray-900 dark:text-gray-100"
                        }`}>
                          {msg.content}
                          {msg.role === "error" && (
                            <button 
                              onClick={() => handleAsk(msg.retryQuery)}
                              className="block mt-2 px-3 py-1 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-lg text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors"
                            >
                              Retry
                            </button>
                          )}
                        </div>
                        
                        {msg.options && (
                          <div className="flex gap-4 overflow-x-auto pb-4 pt-2 snap-x text-sm scrollbar-hide">
                            {msg.options.map((opt) => (
                              <div key={opt.id} className="min-w-[220px] shrink-0 bg-white dark:bg-gray-800 border-2 border-transparent hover:border-emerald-500/50 shadow-md rounded-2xl p-4 flex flex-col gap-3 snap-start relative overflow-hidden transition-all group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-emerald-500 to-blue-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                                <h4 className="font-semibold text-gray-900 dark:text-white">Option: {opt.name || opt.title}</h4>
                                <ul className="text-xs space-y-2 text-gray-600 dark:text-gray-400 flex-1 my-2">
                                  {opt.pros.map((pro, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <Check size={14} className="text-emerald-500 shrink-0" /> {pro}
                                    </li>
                                  ))}
                                </ul>
                                <div className="flex gap-2 border-t border-gray-100 dark:border-gray-700/50 pt-3">
                                  <button onClick={() => handleSelectCompare(opt)} className={`flex-1 py-2 rounded-lg border text-xs font-semibold transition-colors ${compareQueue.find(c=>c.id === opt.id) ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-emerald-500'}`}>
                                    {compareQueue.find(c=>c.id === opt.id) ? 'Added' : 'Compare'}
                                  </button>
                                  <button onClick={() => handleSelectFinal(opt)} className="flex-1 py-2 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-500/20">
                                    Select
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {compareQueue.length > 0 && idx === messages.length -1 && (
                          <button onClick={handleGoToCompare} className="self-end px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 flex items-center gap-1 transition-colors">
                            Go to comparison ({compareQueue.length}) <ArrowLeft size={12} className="rotate-180" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                        <Bot size={16} className="text-white" />
                      </div>
                      <div className="p-4 rounded-2xl shadow-sm bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-bl-none flex items-center gap-2">
                         <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                         <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                         <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                         <span className="ml-2 text-xs text-gray-500 font-medium">Fetching insights...</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Input Box */}
              <div className="mt-auto relative w-full pt-4 border-t border-gray-100 dark:border-gray-800/50">
                <input 
                  type="text" 
                  autoFocus
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if(e.key === 'Enter' && input.trim()) { handleAsk(input); setInput(''); } }}
                  placeholder="Ask anything about finance..." 
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm"
                />
                <button onClick={() => { if(input.trim()) { handleAsk(input); setInput(''); } }} className="absolute right-3 top-1/2 -translate-y-1/2 mt-2 text-emerald-500 hover:text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20 p-2 rounded-lg transition-colors">
                  <Send size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* 2. COMPARE VIEW */}
          {activeView === "COMPARE" && (
            <motion.div 
              key="COMPARE"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="w-full max-w-4xl mx-auto h-full flex flex-col"
            >
              {compareQueue.length < 2 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-500 dark:text-gray-400">
                  <AlertCircle size={40} className="text-gray-300 dark:text-gray-700" />
                  <p className="font-medium">Select at least 2 options in the Ask AI tab to compare them.</p>
                  {compareQueue.length === 1 && (
                    <button onClick={() => setActiveView("ASK")} className="px-6 py-2 mt-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:bg-emerald-100 transition-colors">
                      Back to auto-suggest
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col gap-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4">Compare Options</h3>
                  <div className="grid grid-cols-3 gap-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl overflow-hidden shadow-xl">
                    
                    {/* Headers */}
                    <div className="p-5 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 font-semibold text-sm text-gray-500 uppercase tracking-wide">Criteria</div>
                    <div className="p-5 bg-gray-50 dark:bg-gray-900 border-b border-l border-gray-200 dark:border-gray-700 font-bold text-lg text-gray-900 dark:text-white text-center">Option A: {compareQueue[0].name || compareQueue[0].title}</div>
                    <div className="p-5 bg-gray-50 dark:bg-gray-900 border-b border-l border-gray-200 dark:border-gray-700 font-bold text-lg text-gray-900 dark:text-white text-center">Option B: {compareQueue[1].name || compareQueue[1].title}</div>
                    
                    {/* Rows */}
                    <div className="p-5 border-b border-gray-100 dark:border-gray-700/50 text-sm font-medium text-gray-600 dark:text-gray-300">Rate / Interest</div>
                    <div className="p-5 border-b border-l border-gray-100 dark:border-gray-700/50 text-base font-bold text-center text-gray-900 dark:text-white">{compareQueue[0].interest || compareQueue[0].rate}</div>
                    <div className="p-5 border-b border-l border-gray-100 dark:border-gray-700/50 text-base font-bold text-center text-gray-900 dark:text-white">{compareQueue[1].interest || compareQueue[1].rate}</div>

                    <div className="p-5 border-b border-gray-100 dark:border-gray-700/50 text-sm font-medium text-gray-600 dark:text-gray-300">Risk</div>
                    <div className={`p-5 border-b border-l border-gray-100 dark:border-gray-700/50 text-base font-bold text-center ${compareQueue[0].riskColor}`}>{compareQueue[0].risk}</div>
                    <div className={`p-5 border-b border-l border-gray-100 dark:border-gray-700/50 text-base font-bold text-center ${compareQueue[1].riskColor}`}>{compareQueue[1].risk}</div>

                    <div className="p-5 border-b border-gray-100 dark:border-gray-700/50 text-sm font-medium text-gray-600 dark:text-gray-300">Flexibility</div>
                    <div className="p-5 border-b border-l border-gray-100 dark:border-gray-700/50 text-sm text-center text-gray-800 dark:text-gray-200">{compareQueue[0].flexibility}</div>
                    <div className="p-5 border-b border-l border-gray-100 dark:border-gray-700/50 text-sm text-center text-gray-800 dark:text-gray-200">{compareQueue[1].flexibility}</div>

                    <div className="p-5 text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">Best For</div>
                    <div className="p-5 border-l border-gray-100 dark:border-gray-700/50 text-sm text-center bg-gray-50/50 dark:bg-gray-800/50 flex flex-col justify-between gap-4">
                      <span className="font-medium text-gray-900 dark:text-gray-100">{compareQueue[0].bestFor}</span>
                      <button onClick={() => handleSelectFinal(compareQueue[0])} className="w-full py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">Select Option A</button>
                    </div>
                    <div className="p-5 border-l border-gray-100 dark:border-gray-700/50 text-sm text-center bg-gray-50/50 dark:bg-gray-800/50 flex flex-col justify-between gap-4">
                      <span className="font-medium text-gray-900 dark:text-gray-100">{compareQueue[1].bestFor}</span>
                      <button onClick={() => handleSelectFinal(compareQueue[1])} className="w-full py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">Select Option B</button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* 3. ANALYZE VIEW */}
          {activeView === "ANALYZE" && (
            <motion.div 
              key="ANALYZE"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="w-full max-w-2xl mx-auto h-[80%] flex flex-col justify-center"
            >
              {!finalSelection ? (
                 <div className="flex flex-col items-center justify-center gap-4 text-gray-500 dark:text-gray-400">
                 <AlertCircle size={40} className="text-gray-300 dark:text-gray-700" />
                 <p className="font-medium">Select an option to view its deep risk analysis.</p>
               </div>
              ) : (
                <div className="p-8 sm:p-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl flex flex-col gap-8 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 dark:bg-emerald-500/10 blur-3xl rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-700" />
                  
                  <div>
                    <h4 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Selected Option</h4>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{finalSelection.name || finalSelection.title}</h2>
                  </div>

                  <div className="flex items-center gap-4 py-5 border-y border-gray-100 dark:border-gray-700/50 w-full relative z-10">
                    <span className="font-bold text-gray-700 dark:text-gray-300 text-lg">Risk Assessment:</span>
                    <div className={`px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wider bg-white dark:bg-gray-900 border-2 border-current ${finalSelection.riskColor} flex items-center gap-2 shadow-sm`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${finalSelection.riskColor.replace('text-', 'bg-')} shadow-sm`}></span>
                      {finalSelection.risk}
                    </div>
                  </div>

                  <div className="relative z-10">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                       <AlertCircle size={18} className="text-gray-400" /> Reasons Context:
                    </h4>
                    <ul className="space-y-3 pl-1">
                      {finalSelection.reasons.map((r, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300 font-medium">
                          <span className="text-gray-300 dark:text-gray-600 mt-1.5 text-[10px]">■</span> {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-emerald-50 dark:bg-emerald-500/10 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 mt-4 relative z-10 shadow-inner">
                    <h4 className="text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-2">Concierge Suggestion</h4>
                    <p className="text-base font-semibold text-emerald-900 dark:text-emerald-200 leading-snug">
                      "{finalSelection.suggestion}"
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-2 z-50 text-sm"
          >
            <Check size={16} /> Comparison ready
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
