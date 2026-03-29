"use client";

import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Info, TrendingUp, HandHeart } from "lucide-react";

export default function ConciergeGreeting({ onProceed, isChatActive }) {
  const chips = [
    { label: "Start Investing", icon: Briefcase },
    { label: "Compare Loans", icon: HandHeart },
    { label: "Learn Basics", icon: Info },
    { label: "What's Trending", icon: TrendingUp },
  ];

  return (
    <motion.div 
      layout
      className="w-full rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-xl relative overflow-hidden transition-colors"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-emerald-500 to-blue-500" />
      
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">
            👋 Hey, I'm your AI Concierge.
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg transition-colors">
            I hope you are doing good, how can I help you?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {chips.map((chip, idx) => {
            const Icon = chip.icon;
            return (
              <button 
                key={idx}
                onClick={() => onProceed(chip.label)}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-emerald-50 dark:hover:bg-gray-800 border border-transparent dark:border-gray-700/50 hover:border-emerald-500/30 transition-all text-left group"
              >
                <div className="p-2 rounded-lg bg-white dark:bg-gray-900 group-hover:bg-emerald-500/10 text-gray-400 group-hover:text-emerald-500 transition-colors">
                  <Icon size={18} />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white transition-colors">
                  {chip.label}
                </span>
              </button>
            );
          })}
        </div>

        {!isChatActive && (
          <div className="flex flex-wrap gap-4 mt-2">
            <button 
              onClick={() => onProceed("Start standard onboarding")}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
            >
              Proceed with Chat
              <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => {}}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
            >
              Stop
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
