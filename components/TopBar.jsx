"use client";

import { Moon, Sun, Settings, User, LockKeyhole, Shield, MessageSquare } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TopBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-black shadow-lg shadow-emerald-500/20">
          ET
        </div>
        <span className="font-semibold text-lg text-gray-900 dark:text-white tracking-tight">AI Concierge</span>
      </div>
      
      <div className="flex flex-row items-center gap-2 sm:gap-4 text-gray-600 dark:text-gray-400 relative">
        {mounted ? (
          <button 
            onClick={toggleTheme}
            className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        ) : (
          <div className="w-9 h-9 p-2" />
        )}
        


        <div className="relative">
          <button 
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
          >
            <Settings size={20} />
          </button>

          <AnimatePresence>
            {settingsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSettingsOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden z-50"
                >
                  <div className="flex flex-col py-2">
                    <button className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left w-full">
                      <LockKeyhole size={16} />
                      App Lock
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left w-full border-t border-gray-100 dark:border-gray-800/50">
                      <User size={16} />
                      Profile
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left w-full border-t border-gray-100 dark:border-gray-800/50">
                      <Shield size={16} />
                      Privacy
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left w-full border-t border-gray-100 dark:border-gray-800/50">
                      <MessageSquare size={16} />
                      Feedback
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
