// Mock Data for API Fallbacks & Empty Logic

const randomPlusMinus = (min, max) => (Math.random() * (max - min) + min).toFixed(1);

export const getMockNavigatorCards = () => [
  { id: "sip-001", title: "Start small SIP", amount: "₹500/month", description: "Consistent small investments build long-term wealth.", reason: "Based on your recent savings rate", icon: "TrendingUp", tags: ["investment", "learning", "student", "working"], riskLevel: "Low", colorClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
  { id: "loan-002", title: "Compare student loans", amount: "Save up to 2% Interest", description: "You could be paying less by switching lenders.", reason: "Based on your current debt profile", icon: "Scale", tags: ["loans", "student"], riskLevel: "Low", colorClass: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
  { id: "crypto-003", title: "Crypto trend rising", amount: `Bitcoin +${randomPlusMinus(2.0, 5.5)}%`, description: "Consider allocating a small high-risk portfolio.", reason: "Trending in your age group", icon: "BarChart3", tags: ["crypto", "trending", "working"], riskLevel: "High", colorClass: "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400" },
  { id: "learn-004", title: "Learn investing basics", amount: "5 Min Read", description: "Master the fundamentals before taking bigger risks.", reason: "Based on your low activity", icon: "Lightbulb", tags: ["learning", "exploration", "student"], riskLevel: "None", colorClass: "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400" },
  { id: "insure-005", title: "Review Health Insurance", amount: "Cover up to ₹5L", description: "Ensure you and your family are protected against medical emergencies.", reason: "Important for working professionals", icon: "Shield", tags: ["insurance", "working", "parent"], riskLevel: "Low", colorClass: "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400" },
  { id: "save-006", title: "Build Emergency Fund", amount: "Goal: ₹1 Lakh", description: "Set aside 3-6 months of expenses for a rainy day.", reason: "Crucial first step in financial planning", icon: "PiggyBank", tags: ["save", "learning", "student", "working"], riskLevel: "None", colorClass: "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400" },
  { id: "market-007", title: "Top performing Mutual Funds", amount: "15% Avg Return", description: "Explore the top rated growth funds recommended by experts.", reason: "Based on your interest in investing", icon: "TrendingUp", tags: ["investment", "explore", "working"], riskLevel: "Medium", colorClass: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" },
  { id: "crypto-008", title: "Ethereum staking", amount: `ETH +${randomPlusMinus(1.0, 3.5)}%`, description: "Earn passive income by staking your Ethereum.", reason: "You've shown interest in digital assets", icon: "BarChart3", tags: ["crypto", "explore"], riskLevel: "High", colorClass: "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400" },
];

export const MOCK_MARKETPLACE_OPTIONS = [
  { id: "product-1", provider: "ET Finance Bank", name: "Student Flexi-Loan", rate: "8.5%", risk: "Low", riskColor: "text-emerald-500", flexibility: "High", bestFor: "Students", pros: ["No pre-payment penalty", "100% Digital Process"], reasons: ["Requires co-signer", "Fixed interest only"], suggestion: "Best overall for students with a co-signer.", tags: ["loans", "student"] },
  { id: "product-1b", provider: "FutureEd Capital", name: "Global Ed-Loan", rate: "9.2%", risk: "Medium", riskColor: "text-yellow-500", flexibility: "Medium", bestFor: "Foreign Students", pros: ["Covers living expenses", "No collateral up to ₹40L"], reasons: ["Higher interest rate", "Longer processing time"], suggestion: "Top choice if you're studying abroad.", tags: ["loans", "student"] },
  { id: "product-1c", provider: "Campus Finance", name: "Micro Student Loan", rate: "11%", risk: "High", riskColor: "text-red-500", flexibility: "High", bestFor: "Short-term Needs", pros: ["Instant 5-minute approval", "No co-signer required"], reasons: ["Very high interest", "Late fees apply"], suggestion: "Only use for absolute short-term emergencies.", tags: ["loans", "student"] },
  { id: "product-2", provider: "Apex Capital", name: "Growth Mutual Fund", rate: "12% Exp.", risk: "Medium", riskColor: "text-yellow-500", flexibility: "Medium", bestFor: "Salaried", pros: ["SIP starting at ₹500", "Instant withdrawal"], reasons: ["Market dependent", "1% exit load < 1yr"], suggestion: "Great for long-term wealth creation.", tags: ["investment", "working"] },
  { id: "product-3", provider: "Crypto Desk", name: "Index Coin Basket", rate: "Volatile", risk: "High", riskColor: "text-red-500", flexibility: "High", bestFor: "Risk Takers", pros: ["Top 10 coins", "Automated rebalancing"], reasons: ["Highly volatile", "Unregulated market"], suggestion: "Only invest what you can afford to lose.", tags: ["crypto", "high-risk", "explore"] },
  { id: "product-4", provider: "SecureLife", name: "Term Life Coverage", rate: "₹800/mo", risk: "Low", riskColor: "text-emerald-500", flexibility: "Low", bestFor: "Parents", pros: ["High coverage amount", "Tax benefits"], reasons: ["No maturity benefit", "Strict medical check"], suggestion: "Essential if you have dependents.", tags: ["insurance", "parent", "working"] },
  { id: "product-5", provider: "GlobalBank", name: "Premium Credit Card", rate: "3.5% mo.", risk: "Medium", riskColor: "text-yellow-500", flexibility: "High", bestFor: "Travelers", pros: ["Lounge access", "Reward points multiplier"], reasons: ["High annual fee", "High interest rate"], suggestion: "Make sure to clear dues completely every month.", tags: ["credit", "explore", "working"] },
  { id: "product-6", provider: "Govt Bonds", name: "Sovereign Gold Bonds", rate: "2.5% fixed", risk: "Low", riskColor: "text-emerald-500", flexibility: "Low", bestFor: "Conservative", pros: ["Govt backed", "Capital appreciation"], reasons: ["8 year lock-in", "Not highly liquid"], suggestion: "Safest way to invest in gold without storage hassle.", tags: ["investment", "save"] },
];

export const getMockCrossSellRoadmap = (intent, userProfile) => {
  const isStudent = userProfile?.age_group === 'student';
  const risk = isStudent ? "Low" : "Medium";
  return {
    steps: ["Educate Yourself", "Set a Budget", "Start SIP / Small Investment", "Review in 6 months"],
    outcomeRange: isStudent ? "₹20k - ₹40k" : "₹1L - ₹3L",
    riskLevel: risk,
    confidence: "82%",
    fromFallback: true
  };
};

export const EMPTY_GRAPH_DATA = [
  { name: "Marketplace", points: [0, 0, 0, 0, 0, 0, 0], emoji: "😴", stroke: "stroke-orange-500", fill: "fill-orange-500", bg: "bg-orange-500" },
  { name: "Navigator", points: [0, 0, 0, 0, 0, 0, 0], emoji: "😴", stroke: "stroke-emerald-500", fill: "fill-emerald-500", bg: "bg-emerald-500" },
  { name: "Cross-sell", points: [0, 0, 0, 0, 0, 0, 0], emoji: "😴", stroke: "stroke-purple-500", fill: "fill-purple-500", bg: "bg-purple-500" },
  { name: "Investing", points: [0, 0, 0, 0, 0, 0, 0], emoji: "😴", stroke: "stroke-blue-500", fill: "fill-blue-500", bg: "bg-blue-500" },
  { name: "News", points: [0, 0, 0, 0, 0, 0, 0], emoji: "😴", stroke: "stroke-gray-400", fill: "fill-gray-400", bg: "bg-gray-400" },
];
