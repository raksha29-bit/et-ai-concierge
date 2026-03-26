"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import ConciergeGreeting from "@/components/ConciergeGreeting";
import { Compass, ShoppingBag, DollarSign, Send } from "lucide-react";

// Dynamically import components with Suspense
const ChatUI = dynamic(() => import("@/components/ChatUI"), { suspense: true });
const DailyFeed = dynamic(() => import("@/components/DailyFeed"), { suspense: true });

// Custom Tailwind Shimmer Loading Skeleton
function SectionSkeleton({ heightClass = "h-64" }) {
  return (
    <div className={`w-full ${heightClass} bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col gap-4 overflow-hidden relative`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-gray-100 dark:via-white/5 to-transparent" />
      <div className="w-1/3 h-6 bg-gray-200 dark:bg-gray-800 rounded-md" />
      <div className="w-full h-20 bg-gray-200 dark:bg-gray-800 rounded-xl" />
      <div className="w-2/3 h-4 bg-gray-200 dark:bg-gray-800 rounded-md" />
    </div>
  );
}

function ServiceCard({ icon: Icon, title, description, colorClass }) {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col gap-3 group hover:border-emerald-500/30 transition-colors">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
        <Icon size={20} />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeChatContext, setActiveChatContext] = useState(null);

  const handleStartChat = (contextMessage) => {
    setActiveChatContext(contextMessage);
  };

  return (
    <div className="w-full flex-1 relative px-4 sm:px-6 py-8">
      
      {/* Background ambient effects */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 dark:bg-emerald-900/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-[-10%] w-[50%] h-[50%] bg-blue-500/5 dark:bg-blue-900/10 blur-[150px] rounded-full" />
      </div>

      {/* 3-Column Responsive Grid Layout */}
      <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[calc(100vh-12rem)]">
        
        {/* Left Column (1fr): Service Cards */}
        <section className="flex flex-col gap-4" aria-label="Services List">
          <ServiceCard 
            icon={Compass} 
            title="Finance Navigator" 
            description="Intelligent portfolio analysis and gap identification." 
            colorClass="bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" 
          />
          <ServiceCard 
            icon={ShoppingBag} 
            title="Service Marketplace" 
            description="Discover vetted ET partner services directly." 
            colorClass="bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400" 
          />
          <ServiceCard 
            icon={DollarSign} 
            title="Cross-Sell Engine" 
            description="Premium features and event ticketing." 
            colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" 
          />
        </section>

        {/* Center Column (2fr): Main Interaction Area */}
        <section className="lg:col-span-2 flex flex-col gap-6" aria-label="Main Interaction">
          {!activeChatContext ? (
            <ConciergeGreeting onProceed={handleStartChat} />
          ) : (
            <div className="w-full h-[600px] md:h-[700px] flex flex-col relative">
              <div className="absolute -inset-4 bg-linear-to-tr from-emerald-500/5 to-blue-500/5 rounded-3xl blur-2xl -z-10" />
              <Suspense fallback={<SectionSkeleton heightClass="h-full" />}>
                <ChatUI 
                  initialMessage={activeChatContext} 
                  onBack={() => setActiveChatContext(null)} 
                />
              </Suspense>
            </div>
          )}
          
          <Suspense fallback={<SectionSkeleton heightClass="h-48" />}>
            <DailyFeed />
          </Suspense>
        </section>

        {/* Right Column (1fr): Navigator Box */}
        <section className="flex flex-col" aria-label="Navigator Box">
          <div className="w-full p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col gap-4 sticky top-24 min-h-[400px]">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Navigator</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Quickly access portfolio analysis, market trends, and tailored insights.</p>
            
            <div className="mt-2 flex flex-wrap gap-2">
              <button className="rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm px-4 py-2 transition-colors text-gray-700 dark:text-gray-300">
                Help me invest
              </button>
              <button className="rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm px-4 py-2 transition-colors text-gray-700 dark:text-gray-300">
                Compare loans
              </button>
              <button className="rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm px-4 py-2 transition-colors text-gray-700 dark:text-gray-300">
                Analyze risk
              </button>
            </div>

            <div className="mt-auto pt-4 relative flex items-center">
               <input 
                 type="text" 
                 placeholder="Type your message..." 
                 className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-gray-900 dark:text-white placeholder-gray-400"
               />
               <button className="absolute right-3 text-gray-400 hover:text-emerald-500 transition-colors bg-transparent border-none p-1">
                 <Send size={16} />
               </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
