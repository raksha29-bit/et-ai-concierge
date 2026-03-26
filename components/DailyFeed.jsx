"use client";

import { motion } from "framer-motion";
import { TrendingUp, Newspaper } from "lucide-react";

export default function DailyFeed() {
  const trendingItems = [
    { title: "NIFTY 50 Hits New High", category: "Market", time: "2h ago" },
    { title: "Top 5 AI Stocks to Watch", category: "Investing", time: "4h ago" },
    { title: "RBI Announces Rate Cut", category: "Economy", time: "5h ago" },
    { title: "Tech Startups Boom in Q2", category: "Business", time: "1d ago" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-gray-900 dark:text-white transition-colors">
        <TrendingUp className="text-emerald-500" size={24} />
        <h2 className="text-xl font-bold">Trending Today</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {trendingItems.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4 }}
            className="p-5 rounded-2xl bg-gray-900 border border-gray-800 hover:border-emerald-500/40 transition-colors cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-800 text-gray-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-colors">
                  {item.category}
                </span>
                <Newspaper size={14} className="text-gray-500" />
              </div>
              <h3 className="text-sm font-medium text-gray-200 leading-snug group-hover:text-white">
                {item.title}
              </h3>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              {item.time}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
