"use client";

import { motion } from "framer-motion";
import { Home, Compass, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "navigator", label: "Navigator", icon: Compass },
];

export default function BottomNav() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-20 bg-black/90 backdrop-blur-lg border-t border-gray-800 px-6 pb-safe">
      <div className="max-w-md mx-auto h-full flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center gap-1 w-16 h-full text-xs font-medium"
            >
              <div
                className={cn(
                  "p-2 rounded-full transition-colors",
                  isActive ? "bg-emerald-500/20 text-emerald-400" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                )}
              >
                <Icon size={20} />
              </div>
              <span className={cn(
                "transition-colors",
                isActive ? "text-emerald-400" : "text-gray-500"
              )}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
