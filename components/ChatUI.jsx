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
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: '/api/chat',
    body: {
      userState: { isProfileComplete: true }
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
        append({ role: "user", content: initialMessage });
      } else {
        append({ role: "assistant", content: "I'm ready when you are! Are you looking to invest, compare services, or just learn the basics today?" });
      }
    }
  }, [initialMessage, messages.length, append]);

  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="flex items-center p-4 border-b border-gray-800 bg-gray-900/80">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-4 flex-row">
             <div className="flex items-center justify-center pt-2 rounded-full text-emerald-400">
               <Bot size={24} />
             </div>
             <div className="px-5 py-3 rounded-2xl text-sm leading-relaxed max-w-[85%] bg-gray-800/50 text-gray-200 border border-gray-700 rounded-tl-none">
               <span className="flex gap-1 items-center h-5">
                 <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                 <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                 <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
               </span>
             </div>
           </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-800 bg-gray-900/50">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 relative"
        >
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="w-full bg-gray-800/80 text-gray-100 placeholder-gray-500 text-sm rounded-full px-6 py-4 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all border border-gray-700"
          />
          <button
            type="submit"
            disabled={!input?.trim() || isLoading}
            className="absolute right-2 p-2 rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 hover:text-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
