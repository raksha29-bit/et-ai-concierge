"use client";

import { motion } from "framer-motion";
import { Send, Bot, User, ArrowLeft } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from "react";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function ChatUI({ initialMessage, onBack }) {
  // Manual state for the input field to prevent "undefined" errors
  const [input, setInput] = useState("");
  
  // Using useChat from @ai-sdk/react with local state for input stability
  const { messages, isLoading, append, handleSubmit } = useChat({
    api: '/api/chat',
    body: {
      userState: { isProfileComplete: true }
    },
    onFinish: (message) => {
      console.log('--- AI Response Finished ---', message);
    },
    onError: (error) => {
      console.error('--- Chat AI Error ---', error);
    }
  });

  const messagesEndRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0 && append && !initialized.current) {
      initialized.current = true;
      if (initialMessage) {
        console.log('Appending initial message from parent:', initialMessage);
        append({ role: "user", content: initialMessage });
      } else {
        append({ role: "assistant", content: "I'm ready when you are! Are you looking to invest, compare services, or just learn the basics today?" });
      }
    }
  }, [initialMessage, messages.length, append]);

  const handleManualInputChange = (e) => {
    const val = e.target.value || "";
    setInput(val);
  };

  const triggerSubmit = () => {
    console.log('--- TRIGGER SUBMIT ---', { input, isLoading });
    
    if (!input || typeof input !== "string") return;

    const trimmed = input.trim();
    if (!trimmed || isLoading) {
      console.warn('Input empty or already loading, skipping');
      return;
    }
    
    try {
      if (typeof append === 'function') {
        console.log('Calling append with:', trimmed);
        append({ role: "user", content: trimmed });
        setInput(""); // Success, clearing input
      } else if (typeof handleSubmit === 'function') {
        // Fallback to handleSubmit if append is missing for some reason
        console.log('Append missing, falling back to handleSubmit');
        handleSubmit();
      } else {
        console.error('Neither append nor handleSubmit are functions in useChat!');
      }
    } catch (err) {
      console.error('CRITICAL: Chat submission failed:', err);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      triggerSubmit();
    }
  };

  return (
    <div className="w-full h-full min-h-[500px] flex flex-col bg-black/40 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden shadow-2xl relative z-10">
      <div className="flex items-center p-4 border-b border-gray-800 bg-gray-900/80 justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer z-20"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-gray-600 font-mono italic">input_fix_applied_v6</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex items-start gap-4",
              m.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className={cn(
              "flex items-center justify-center pt-2 rounded-full",
              m.role === "assistant" ? "text-emerald-400" : "text-blue-400"
            )}>
              {m.role === "assistant" ? <Bot size={24} /> : <User size={24} />}
            </div>
            <div
              className={cn(
                "px-5 py-3 rounded-2xl text-sm leading-relaxed max-w-[85%]",
                m.role === "user"
                  ? "bg-blue-600/20 text-blue-100 border border-blue-500/30 rounded-tr-none"
                  : "bg-gray-800/50 text-gray-200 border border-gray-700 rounded-tl-none"
              )}
            >
              {m.content}
            </div>
          </motion.div>
        ))}
        {isLoading && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-4 flex-row">
             <div className="flex items-center justify-center pt-2 rounded-full text-emerald-400">
               <Bot size={24} />
             </div>
             <div className="px-5 py-3 rounded-2xl text-sm leading-relaxed max-w-[85%] bg-gray-800/50 text-gray-200 border border-gray-700 rounded-tl-none">
                <span className="text-xs text-gray-500 italic">Thinking...</span>
             </div>
           </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-800 bg-gray-900/50 mt-auto">
        <div className="flex items-center gap-2 bg-gray-800/80 rounded-full border border-gray-700 px-2 py-1 focus-within:ring-2 focus-within:ring-emerald-500/50 transition-all z-20">
          <input
            type="text"
            value={input}
            onChange={handleManualInputChange}
            onKeyDown={onKeyDown}
            placeholder="Type your message..."
            className="flex-1 bg-transparent text-gray-100 placeholder-gray-500 text-sm px-4 py-3 outline-none"
          />
          <button
            onClick={() => {
              console.log('Send clicked');
              triggerSubmit();
            }}
            disabled={isLoading || !input.trim()}
            className="p-2.5 rounded-full bg-emerald-500 text-black hover:bg-emerald-400 transition-colors shrink-0 cursor-pointer z-30 flex items-center justify-center disabled:opacity-50 disabled:grayscale"
            title="Send Message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
