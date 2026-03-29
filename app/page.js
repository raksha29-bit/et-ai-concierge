"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import ConciergeGreeting from "@/components/ConciergeGreeting";
import { Compass, ShoppingBag, DollarSign, Send, ArrowLeft } from "lucide-react";
import ServiceMarketplace from "@/components/ServiceMarketplace";

// Dynamically import components with Suspense
const ChatUI = dynamic(() => import("@/components/ChatUI"), { ssr: false });
const DailyFeed = dynamic(() => import("@/components/DailyFeed"), { suspense: true });
const FinanceNavigator = dynamic(() => import("@/components/FinanceNavigator"), { suspense: true });
const CrossSellEngine = dynamic(() => import("@/components/CrossSellEngine"), { suspense: true });

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

function ServiceCard({ icon: Icon, title, description, colorClass, onClick, active }) {
  return (
    <div onClick={onClick} className={`p-5 rounded-2xl bg-white dark:bg-gray-900 border ${active ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20' : 'border-gray-200 dark:border-gray-800'} shadow-sm flex flex-col gap-3 group hover:border-emerald-500/30 transition-all cursor-pointer`}>
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
  const [activeModule, setActiveModule] = useState('HOME');

  // Load from persistence
  useEffect(() => {
    const savedModule = localStorage.getItem('et_concierge_active_module');
    if (savedModule) {
      setActiveModule(savedModule);
    }
  }, []);

  // Save to persistence on change
  const setAndSaveModule = (moduleName) => {
    setActiveModule(moduleName);
    localStorage.setItem('et_concierge_active_module', moduleName);
  };

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

      {/* Global Back Navigation */}
      {activeModule !== 'HOME' && (
        <div className="max-w-[1600px] mx-auto w-full mb-4">
          <button 
            onClick={() => setAndSaveModule('HOME')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm transition-all hover:-translate-x-1"
          >
            <ArrowLeft size={16} /> Back to Home
          </button>
        </div>
      )}

      {/* 3-Column Responsive Grid Layout */}
      <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[calc(100vh-12rem)]">
        
        {/* Left Column (1fr): Service Cards */}
        <section className="flex flex-col gap-4" aria-label="Services List">
          <ServiceCard 
            onClick={() => setAndSaveModule('NAVIGATOR')}
            active={activeModule === 'NAVIGATOR'}
            icon={Compass} 
            title="Finance Navigator" 
            description="Intelligent portfolio analysis and gap identification." 
            colorClass="bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" 
          />
          <ServiceCard 
            onClick={() => setAndSaveModule('MARKETPLACE')}
            active={activeModule === 'MARKETPLACE'}
            icon={ShoppingBag} 
            title="Service Marketplace" 
            description="Discover vetted ET partner services directly." 
            colorClass="bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400" 
          />
          <ServiceCard 
            onClick={() => setAndSaveModule('CROSS_SELL')}
            active={activeModule === 'CROSS_SELL'}
            icon={DollarSign} 
            title="Cross-Sell Engine" 
            description="Premium features and event ticketing." 
            colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" 
          />
        </section>

        {activeModule === 'MARKETPLACE' ? (
          <section className="lg:col-span-3 flex flex-col h-full min-h-[600px]">
            <Suspense fallback={<SectionSkeleton heightClass="h-full" />}>
              <ServiceMarketplace onClose={() => setAndSaveModule('HOME')} />
            </Suspense>
          </section>
        ) : activeModule === 'CROSS_SELL' ? (
          <section className="lg:col-span-3 flex flex-col h-full min-h-[600px]">
             <Suspense fallback={<SectionSkeleton heightClass="h-full" />}>
               <CrossSellEngine onClose={() => setAndSaveModule('HOME')} />
             </Suspense>
          </section>
        ) : activeModule === 'NAVIGATOR' ? (
          <section className="lg:col-span-3 flex flex-col h-full min-h-[600px]">
             <Suspense fallback={<SectionSkeleton heightClass="h-full" />}>
               <FinanceNavigator />
             </Suspense>
          </section>
        ) : (
          <>
            {/* Center Column (2fr): Main Interaction Area */}
            <section className="lg:col-span-2 flex flex-col gap-6" aria-label="Main Interaction">
              <ConciergeGreeting 
                onProceed={handleStartChat} 
                isChatActive={!!activeChatContext} 
              />

          {activeChatContext && (
            <div className="w-full flex-1 min-h-[500px] flex flex-col relative">
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Navigator Quick Access</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Jump directly into the full Finance Navigator dashboard.</p>
            
            <button 
              onClick={() => setAndSaveModule('NAVIGATOR')}
              className="mt-4 w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Compass size={18} /> Open Full Navigator
            </button>
          </div>
        </section>
          </>
        )}

      </div>
    </div>
  );
}
