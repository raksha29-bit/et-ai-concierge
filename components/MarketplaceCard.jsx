"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function MarketplaceCard({ title, description, badge, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full text-left group relative p-6 bg-linear-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-colors"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Sparkles size={48} className="text-emerald-500" />
      </div>
      
      {badge && (
        <span className="inline-block px-3 py-1 mb-4 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          {badge}
        </span>
      )}
      
      <h3 className="text-xl font-semibold text-gray-100 mb-2">{title}</h3>
      <p className="text-sm text-gray-400 mb-6 leading-relaxed">
        {description}
      </p>
      
      <div className="flex items-center gap-2 text-sm font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors">
        Explore Service
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.button>
  );
}
