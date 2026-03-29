"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserProfile } from "@/components/UserProfileContext";
import { 
  ArrowRight, 
  Map, 
  TrendingUp, 
  ShieldAlert, 
  ShieldCheck, 
  Lightbulb, 
  Target, 
  Loader2,
  ChevronLeft
} from "lucide-react";

// --- Mock Feed Data for State 2 ---
const ALL_DISCOVERY_PLANS = [
  { id: "plan-1", title: "Start SIP ₹500/month", description: "Consistent small investments to build long-term wealth securely.", difficulty: "Easy", timeEstimate: "6 months", intent: "sip_500", tags: ['Save', 'Invest'] },
  { id: "plan-2", title: "Learn investing basics", description: "Master the fundamentals before taking bigger market risks.", difficulty: "Beginner", timeEstimate: "1 month", intent: "learn_basics", tags: ['Learn'] },
  { id: "plan-3", title: "Build long-term wealth plan", description: "A structured approach to balancing risk and maximizing returns.", difficulty: "Medium", timeEstimate: "1 yr", intent: "wealth_plan", tags: ['Invest'] },
  { id: "plan-4", title: "Explore Tech Stocks", description: "Start investing in high-growth companies pushing innovation.", difficulty: "Advanced", timeEstimate: "2 yrs", intent: "tech_stocks", tags: ['Invest', 'Explore'] },
  { id: "plan-5", title: "Create an Emergency Fund", description: "Save effectively to cover 6 months of living expenses.", difficulty: "Medium", timeEstimate: "6 months", intent: "emergency_fund", tags: ['Save'] },
  { id: "plan-6", title: "Understand Crypto Risk", description: "A balanced guide to navigating volatile digital assets.", difficulty: "Beginner", timeEstimate: "2 weeks", intent: "crypto_basic", tags: ['Learn', 'Explore'] },
  { id: "plan-7", title: "Aggressive Growth Plan", description: "Maximum exposure to emerging markets and high-yield vehicles.", difficulty: "Advanced", timeEstimate: "5 yrs", intent: "aggressive_growth", tags: ['Invest'] },
  { id: "plan-8", title: "Secure Parent Health Coverage", description: "Find the best safety net for unplanned medical overheads.", difficulty: "Medium", timeEstimate: "1 week", intent: "insurance", tags: ['Save', 'Explore'] }
];

export default function CrossSellEngine({ onClose }) {
  const { userProfile } = useUserProfile();
  
  // UI States: 'SETUP' -> 'FEED' -> 'FLOWCHART'
  const [step, setStep] = useState('SETUP');
  
  // Setup selections
  const [who, setWho] = useState("Me");
  const [stage, setStage] = useState(userProfile?.age_group === "student" ? "Student" : "Working");
  const [goal, setGoal] = useState("Invest");
  const [manualInput, setManualInput] = useState("");

  // API State
  const [isLoading, setIsLoading] = useState(false);
  const [flowData, setFlowData] = useState(null);
  
  // Dynamic Feed filtered by user Goal selection
  const activeFeed = ALL_DISCOVERY_PLANS
     .filter(p => p.tags.includes(goal) || goal === "Explore")
     .sort(() => 0.5 - Math.random())
     .slice(0, 3);

  // Handlers
  const handleProceedToFeed = () => {
    if (manualInput.trim().length > 0 || goal) {
      setStep('FEED');
    }
  };

  const handleVisualizePlan = async (intentStr) => {
    setIsLoading(true);
    setStep('FLOWCHART');
    
    try {
      const response = await fetch('/api/cross-sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          intent: intentStr, 
          userProfile 
        })
      });

      if (!response.ok) throw new Error("API Failure");
      
      const data = await response.json();
      setFlowData(data);
    } catch (error) {
       console.error("Failed to generate flowchart:", error);
       // Simple fallback locally if network drops totally
       setFlowData({
         steps: ["Understand Risks", "Start Saving", "Monitor Growth"],
         outcomeRange: "Varies",
         riskLevel: "Low",
         confidence: "70%",
         fromFallback: true
       });
    } finally {
      setIsLoading(false);
    }
  };

  const renderConfidenceBadge = (confidenceStr) => {
    const val = parseInt(confidenceStr) || 0;
    if (val >= 80) return <span className="text-emerald-500 font-bold">{confidenceStr} (High)</span>;
    if (val >= 50) return <span className="text-yellow-500 font-bold">{confidenceStr} (Medium)</span>;
    return <span className="text-red-500 font-bold">{confidenceStr} (Low)</span>;
  };

  // 1. SETUP UI
  const SetupView = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="flex flex-col gap-8 max-w-2xl mx-auto w-full pt-8"
    >
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Map size={32} />
        </div>
        <h2 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Map Your Financial Future
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Tell us where you are, and we'll visualize where you can go.
        </p>
      </div>

      <div className="space-y-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 sm:p-8 rounded-3xl shadow-sm">
        {/* Chips Area */}
        <div className="space-y-4">
          <div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Who is this for?</span>
            <div className="flex flex-wrap gap-2">
              {["Me", "Parent", "Other"].map(opt => (
                <button key={opt} onClick={() => setWho(opt)} className={"px-4 py-2 rounded-full text-sm font-medium transition-colors " + (who === opt ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200')}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Your stage:</span>
            <div className="flex flex-wrap gap-2">
              {["Student", "Working", "Business"].map(opt => (
                <button key={opt} onClick={() => setStage(opt)} className={"px-4 py-2 rounded-full text-sm font-medium transition-colors " + (stage === opt ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200')}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Goal:</span>
            <div className="flex flex-wrap gap-2">
              {["Save", "Invest", "Learn", "Explore"].map(opt => (
                <button key={opt} onClick={() => setGoal(opt)} className={"px-4 py-2 rounded-full text-sm font-medium transition-colors " + (goal === opt ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200')}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative pt-6 mt-2 z-50 pointer-events-auto before:absolute before:left-0 before:right-0 before:h-px before:top-0 before:bg-gray-100 dark:before:bg-gray-800">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block relative bg-white dark:bg-gray-900 w-fit pr-4 -mt-9">Or type specifically:</span>
          <input 
            type="text" 
            placeholder="e.g. I want to invest ₹2000/month"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
             className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-gray-900 dark:text-white placeholder-gray-400 relative z-50 cursor-text"
          />
        </div>

        <button 
          onClick={handleProceedToFeed}
          className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          Discover Plans <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );

  // 2. FEED UI
  const FeedView = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-6 max-w-4xl mx-auto w-full pt-4"
    >
      <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
        <button onClick={() => setStep('SETUP')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Curated For You</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Based on your selection: {stage} looking to {goal}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeFeed.map((plan, i) => (
          <motion.div 
            key={plan.id}
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col hover:border-blue-500/50 transition-all shadow-sm group"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{plan.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-1">{plan.description}</p>
            
            <div className="flex gap-2 mb-6">
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-semibold rounded-md">
                {plan.difficulty}
              </span>
              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-md">
                {plan.timeEstimate}
              </span>
            </div>

            <button 
              onClick={() => handleVisualizePlan(plan.intent)}
              className="w-full py-3 bg-gray-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-bold text-sm rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors flex justify-center items-center gap-2"
            >
              Visualize this plan <Target size={16} />
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  // 3. FLOWCHART UI
  const FlowchartView = () => {
    
    // Confidence Logic processing
    const confVal = flowData ? parseInt(flowData.confidence) : 0;
    const isMedium = confVal >= 50 && confVal < 80;
    const isLow = confVal < 50;
    
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="flex flex-col gap-8 max-w-3xl mx-auto w-full pt-4"
      >
        <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
          <button onClick={() => { setStep('FEED'); setFlowData(null); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Your Roadmap</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Step-by-step impact visualization</p>
          </div>
        </div>

        {isLoading ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-gray-500">
            <Loader2 className="animate-spin text-blue-500" size={32} />
            <p className="font-medium animate-pulse">Generating your future map...</p>
          </div>
        ) : flowData ? (
          <div className="space-y-8">
            
            {/* Warning Banners based on logic */}
            {isMedium && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-xl flex items-start gap-3 text-yellow-800 dark:text-yellow-500">
                <ShieldAlert className="shrink-0 mt-0.5" size={20} />
                <p className="text-sm font-medium">Confidence is moderate. Outcomes heavily depend on market conditions and consistent adherence to the plan over time.</p>
              </div>
            )}
            
            {isLow && (
              <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl flex items-start gap-3 text-red-800 dark:text-red-500">
                <ShieldAlert className="shrink-0 mt-0.5" size={20} />
                <div className="text-sm font-medium">
                  <p className="mb-2">Confidence is low for this trajectory based on your profile risk tolerance. We suggest a safer alternative.</p>
                  <button className="underline font-bold hover:text-red-900 dark:hover:text-red-300">View Safer Option</button>
                </div>
              </div>
            )}

            {/* Visual Node Flowchart */}
            <div className="relative py-12 px-4 sm:px-12 flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-4 overflow-hidden">
               {/* Connecting Line */}
               <div className="absolute top-0 bottom-0 left-1/2 md:left-12 md:right-12 md:top-1/2 w-0.5 md:w-auto md:h-0.5 bg-gray-200 dark:bg-gray-800 -z-10 -translate-x-1/2 md:translate-x-0 md:-translate-y-1/2 rounded-full" />
               
               <motion.div 
                 initial={{ height: 0, width: 0 }}
                 animate={{ height: "100%", width: "100%" }}
                 transition={{ duration: 1.5, ease: "easeInOut" }}
                 className="absolute top-0 bottom-auto left-1/2 md:left-12 md:right-auto md:top-1/2 w-0.5 md:w-auto md:h-0.5 bg-linear-to-b md:bg-linear-to-r from-blue-500 to-purple-500 -z-10 -translate-x-1/2 md:translate-x-0 md:-translate-y-1/2 shadow-[0_0_15px_rgba(59,130,246,0.5)] origin-top md:origin-left"
               />

               {flowData.steps.map((stepStr, idx) => (
                 <motion.div 
                   key={idx}
                   initial={{ opacity: 0, scale: 0.5 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: 0.5 + (idx * 0.4), type: "spring" }}
                   className="relative flex flex-col items-center text-center w-full md:w-1/3 group cursor-default"
                  >
                   <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-900 border-4 border-blue-500 flex items-center justify-center font-bold text-blue-500 mb-4 shadow-lg group-hover:scale-110 transition-transform bg-clip-padding">
                     {idx + 1}
                   </div>
                   <h4 className="font-bold text-gray-900 dark:text-white bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-2 rounded-md">{stepStr}</h4>
                 </motion.div>
               ))}
            </div>

            {/* Mandatory Output Summary Box */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.0 }}
              className="bg-gray-900 dark:bg-white text-white dark:text-black rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 justify-between items-center shadow-2xl relative overflow-hidden"
            >
               {/* Decorative bg element */}
               <div className="absolute right-[-10%] top-[-50%] w-64 h-64 bg-white/10 dark:bg-black/5 rounded-full blur-3xl pointer-events-none" />
               
               <div className="flex-1 w-full space-y-4 relative z-10">
                 <div className="flex items-center gap-2 mb-1">
                   <TrendingUp size={18} className="text-blue-400 dark:text-blue-600" />
                   <span className="font-semibold text-gray-300 dark:text-gray-600 uppercase tracking-widest text-xs">Projected Outcome</span>
                 </div>
                 <p className="text-3xl sm:text-4xl font-black tracking-tight">{flowData.outcomeRange}</p>
                 <p className="text-xs text-gray-400 dark:text-gray-500 italic flex items-center gap-1">
                   * Estimation based on general trends, not guaranteed.
                 </p>
               </div>

               <div className="flex w-full md:w-auto flex-col gap-4 border-t md:border-t-0 md:border-l border-white/20 dark:border-black/10 pt-4 md:pt-0 md:pl-6 relative z-10 shrink-0 min-w-[200px]">
                 <div>
                   <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">Risk Profile</span>
                   <div className="flex items-center gap-2">
                     <span className={"w-2.5 h-2.5 rounded-full " + (flowData.riskLevel === 'Low' ? 'bg-emerald-500' : flowData.riskLevel === 'High' ? 'bg-red-500' : 'bg-yellow-500')} />
                     <span className="font-bold">{flowData.riskLevel}</span>
                   </div>
                 </div>
                 <div>
                   <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">System Confidence</span>
                   <div>
                     {renderConfidenceBadge(flowData.confidence)}
                   </div>
                 </div>
               </div>
            </motion.div>

            {/* Optional action to continue */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="flex justify-center pt-4">
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                Back to Concierge
              </button>
            </motion.div>

          </div>
        ) : null}
      </motion.div>
    );
  };

  return (
    <div className="w-full flex-1 min-h-[500px] overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 'SETUP' && <SetupView key="setup" />}
        {step === 'FEED' && <FeedView key="feed" />}
        {step === 'FLOWCHART' && <FlowchartView key="flowchart" />}
      </AnimatePresence>
    </div>
  );
}
