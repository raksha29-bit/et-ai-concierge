"use client";

import { useState } from "react";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { TrendingUp, Scale, Bookmark, ExternalLink, Lightbulb, PlayCircle, BarChart3, Plus, ArrowRight } from "lucide-react";

// --- Mock Data ---

const ALL_MOCK_CARDS = [
  { id: 1, title: "Start small SIP", amount: "₹500/month", description: "Consistent small investments build long-term wealth.", reason: "Based on your recent savings rate", icon: TrendingUp, colorClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
  { id: 2, title: "Compare student loans", amount: "Save up to 2% Interest", description: "You could be paying less by switching lenders.", reason: "Based on your current debt profile", icon: Scale, colorClass: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
  { id: 3, title: "Crypto trend rising", amount: "Bitcoin +5%", description: "Consider allocating a small high-risk portfolio.", reason: "Based on your recent article views", icon: BarChart3, colorClass: "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400" },
  { id: 4, title: "Learn investing basics", amount: "5 Min Read", description: "Master the fundamentals before taking bigger risks.", reason: "Trending for beginners", icon: Lightbulb, colorClass: "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400" },
  { id: 5, title: "Build Emergency Fund", amount: "₹1 Lakh Goal", description: "Set aside 3-6 months of expenses for a rainy day.", reason: "Crucial first step in planning", icon: Bookmark, colorClass: "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400" },
  { id: 6, title: "Review Health Insurance", amount: "Cover up to ₹5L", description: "Ensure you and your family are protected against emergencies.", reason: "Important for working pros", icon: Plus, colorClass: "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400" },
  { id: 7, title: "Top Growth MFs", amount: "15% Avg Return", description: "Explore the top rated growth funds recommended by experts.", reason: "Based on your investment interest", icon: TrendingUp, colorClass: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" },
  { id: 8, title: "Ethereum staking", amount: `ETH +3% APY`, description: "Earn passive income by staking your Ethereum.", reason: "You've shown interest in digital assets", icon: BarChart3, colorClass: "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400" },
];

const MOCK_CARDS = [...ALL_MOCK_CARDS].sort(() => 0.5 - Math.random());

const GRAPH_DATA = [
  { name: "Marketplace", points: [10, 20, 15, 30, 25, 40, 35], emoji: "📉 😢", stroke: "stroke-orange-500", fill: "fill-orange-500", bg: "bg-orange-500" },
  { name: "Navigator", points: [20, 30, 40, 50, 60, 70, 80], emoji: "📈 😊", stroke: "stroke-emerald-500", fill: "fill-emerald-500", bg: "bg-emerald-500" },
  { name: "Cross-sell", points: [5, 10, 15, 12, 18, 20, 25], emoji: "😊", stroke: "stroke-purple-500", fill: "fill-purple-500", bg: "bg-purple-500" },
  { name: "Investing", points: [50, 45, 55, 50, 60, 55, 65], emoji: "📈 😊", stroke: "stroke-blue-500", fill: "fill-blue-500", bg: "bg-blue-500" },
  { name: "News", points: [80, 70, 60, 50, 45, 40, 30], emoji: "📉 😴", stroke: "stroke-gray-400", fill: "fill-gray-400", bg: "bg-gray-400" },
];

// --- Components ---

function SwipeableCard({ card, onSwipeLeft, onSwipeRight, onSwipeUp, style }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Rotate based on x drag (Tinder effect)
  const rotate = useTransform(x, [-200, 200], [-10, 10]);

  // Opacity for action hints
  const opacityLeft = useTransform(x, [-100, -20], [1, 0]);
  const opacityRight = useTransform(x, [20, 100], [0, 1]);
  const opacityUp = useTransform(y, [-100, -20], [1, 0]);

  const handleDragEnd = (event, info) => {
    const threshold = 100;
    if (info.offset.x < -threshold) {
      onSwipeLeft(card.id);
    } else if (info.offset.x > threshold) {
      onSwipeRight(card.id);
    } else if (info.offset.y < -threshold) {
      onSwipeUp(card.id);
    }
  };

  const Icon = card.icon;

  return (
    <motion.div
      style={{ x, y, rotate, ...style }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.95 }}
      whileDrag={{ scale: 1.05 }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="absolute inset-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xl flex flex-col cursor-grab active:cursor-grabbing"
    >
      <div className="absolute top-4 right-4 bg-gray-100 dark:bg-gray-800 text-xs px-2 py-1 rounded-md text-gray-500 font-medium">
        Suggestion
      </div>

      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 mt-4 ${card.colorClass}`}>
        <Icon size={28} />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {card.title}
      </h3>
      <p className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4">
        {card.amount}
      </p>
      
      <p className="text-gray-600 dark:text-gray-400 mb-auto">
        {card.description}
      </p>

      <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800/60 mt-4 flex items-center gap-2">
        <Lightbulb size={16} className="text-yellow-500" />
        <span className="text-xs text-gray-500 dark:text-gray-400">{card.reason}</span>
      </div>

      {/* Swipe Overlay Hints */}
      <motion.div style={{ opacity: opacityLeft }} className="absolute top-8 right-8 border-2 border-red-500 text-red-500 px-4 py-1 rounded-xl font-bold uppercase tracking-widest bg-red-50 dark:bg-red-900/20 rotate-15 pointer-events-none">
        Dismiss
      </motion.div>
      <motion.div style={{ opacity: opacityRight }} className="absolute top-8 left-8 border-2 border-green-500 text-green-500 px-4 py-1 rounded-xl font-bold uppercase tracking-widest bg-green-50 dark:bg-green-900/20 -rotate-15 pointer-events-none">
        Save
      </motion.div>
      <motion.div style={{ opacity: opacityUp }} className="absolute bottom-8 left-1/2 -translate-x-1/2 border-2 border-blue-500 text-blue-500 px-4 py-1 rounded-xl font-bold uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 pointer-events-none">
        Action
      </motion.div>

      {/* Manual Action Buttons (Mobile fallback) */}
      <div className="flex gap-4 mt-6">
        <button onClick={(e) => { e.stopPropagation(); onSwipeLeft(card.id); }} className="flex-1 py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium text-sm hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors">
          Dismiss
        </button>
        <button onClick={(e) => { e.stopPropagation(); onSwipeRight(card.id); }} className="flex-1 py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium text-sm hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-colors">
          Save
        </button>
      </div>
    </motion.div>
  );
}

function AnimatedLineChart({ data }) {
  // SVG coordinates and setup
  const viewBox = "0 0 100 50";
  const numPoints = data[0].points.length;
  
  // X values are evenly spaced from 0 to 100
  const getX = (index) => (index / (numPoints - 1)) * 100;
  
  // Normalize Y values (assuming 0 to 100 range)
  const getY = (value) => 50 - (value / 100) * 50;

  return (
    <div className="w-full space-y-4">
      <div className="relative w-full aspect-video bg-gray-50 dark:bg-gray-800/30 rounded-2xl p-4 border border-gray-100 dark:border-gray-800/50">
        <svg viewBox={viewBox} className="w-full h-full overflow-visible">
          {data.map((series, i) => {
            const pathData = series.points
              .map((point, index) => `${index === 0 ? "M" : "L"} ${getX(index)} ${getY(point)}`)
              .join(" ");

            return (
              <g key={series.name}>
                <motion.path
                  d={pathData}
                  fill="none"
                  className={`${series.stroke} stroke-2 opacity-80`}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: i * 0.2, ease: "easeInOut" }}
                />
                {/* Endpoint dot */}
                <motion.circle
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5 + (i * 0.2) }}
                  cx={getX(numPoints - 1)}
                  cy={getY(series.points[numPoints - 1])}
                  r="1.5"
                  className={`${series.fill}`}
                />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {data.map((series) => (
          <div key={series.name} className="flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-2 rounded-xl text-xs md:text-sm shadow-sm">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${series.bg}`}></div>
              <span className="text-gray-600 dark:text-gray-400">{series.name}</span>
            </div>
            <span>{series.emoji}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FinanceNavigator() {
  const [cards, setCards] = useState(MOCK_CARDS);
  const [savedCards, setSavedCards] = useState([]);

  // Swipe handlers
  const handleRemoveCard = (id) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSwipeLeft = (id) => {
    handleRemoveCard(id); // Dismiss
  };

  const handleSwipeRight = (id) => {
    const card = cards.find(c => c.id === id);
    if (card) setSavedCards(prev => [...prev, card]);
    handleRemoveCard(id);
  };

  const handleSwipeUp = (id) => {
    // Action trigger (e.g., redirect)
    handleRemoveCard(id);
    alert(`Action triggered for card ${id}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-12 py-8 px-4 sm:px-6">
      
      {/* 1. FOR YOU TODAY */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold bg-linear-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
          For You Today
        </h2>
        
        <div className="relative w-full max-w-sm mx-auto h-[480px] perspective-1000">
          {cards.length > 0 ? (
            // Render from back to front
            [...cards].reverse().map((card, index) => {
              // Calculate stack effect offset
              const isFront = index === cards.length - 1;
              const zIndex = index;
              const scale = 1 - (cards.length - 1 - index) * 0.05;
              const yOffset = (cards.length - 1 - index) * -15;

              return (
                <div key={card.id} className="absolute inset-0 z-10" style={{ zIndex }}>
                  <SwipeableCard
                    card={card}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                    onSwipeUp={handleSwipeUp}
                    style={{
                      scale: isFront ? 1 : scale,
                      y: isFront ? 0 : yOffset,
                      pointerEvents: isFront ? "auto" : "none",
                    }}
                  />
                </div>
              );
            })
          ) : (
             <div className="absolute inset-0 bg-gray-50 dark:bg-gray-800/20 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl flex flex-col items-center justify-center p-6 text-center">
              <span className="text-4xl mb-4">🎉</span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">All caught up!</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">You have swiped through all your daily insights. Check back tomorrow.</p>
              
              <button 
                onClick={() => setCards(MOCK_CARDS)}
                className="mt-6 px-6 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-semibold hover:bg-emerald-500/20 transition-colors"
               >
                 Reload Feed
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. FUTURE PREDICTION ENTRY */}
      <section className="flex flex-col gap-6 pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Simulate Your Future</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">Plot out your financial journey based on current steps. Reveal potential outcomes and risk ranges.</p>
          </div>
          <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-semibold hover:opacity-90 transition-opacity">
            Where this can go <ArrowRight size={18} />
          </button>
        </div>

        <button className="md:hidden flex justify-center items-center gap-2 w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-semibold">
           Where this can go <ArrowRight size={18} />
        </button>
      </section>

      {/* 2. WEEKLY SUMMARY */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Weekly Summary</h2>
          <span className="text-xs font-semibold px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-lg">Last 7 Days</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-900 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-5 shadow-sm">
            <h3 className="text-emerald-600 dark:text-emerald-400 font-semibold mb-2 flex items-center gap-2">
              <TrendingUp size={18} /> Deep Dive
            </h3>
            <p className="text-gray-800 dark:text-gray-200">You explored investments more <span className="font-bold text-emerald-500">(+40%)</span></p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-gray-500 font-semibold mb-2 flex items-center gap-2">
               <span className="transform rotate-180 block"><TrendingUp size={18} /></span> Cooling off
            </h3>
            <p className="text-gray-800 dark:text-gray-200">You used marketplace less <span className="font-bold text-gray-400">(-20%)</span></p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div>
            <span className="text-blue-500 font-bold uppercase text-xs tracking-wider mb-1 block">Contextual Insight</span>
            <p className="text-lg text-gray-800 dark:text-gray-200">
               "You are rapidly moving from the exploring phase to the decision phase in Equities."
            </p>
          </div>
          <button className="shrink-0 whitespace-nowrap px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold shadow-md transition-colors shadow-blue-500/20">
            What should I do next?
          </button>
        </div>
      </section>

      {/* 3. YOUR ACTIVITY GRAPH */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Activity Graph</h2>
        <AnimatedLineChart data={GRAPH_DATA} />
      </section>

    </div>
  );
}
