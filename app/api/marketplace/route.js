import { NextResponse } from 'next/server';
import { applyRules, calculateConfidence, withFallback } from '@/lib/core-engine';
import { MOCK_MARKETPLACE_OPTIONS } from '@/lib/mock-data';

export async function POST(req) {
  try {
    const { query, userProfile } = await req.json();

    if (!userProfile || !query) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Simulate fetching real-time API (which would use AI to query systems)
    const marketplaceLogic = async () => {
       // Mocking an AI delay
       await new Promise(r => setTimeout(r, 800));
       
       const q = query.toLowerCase();
       // "Smart" mapping based on query terms
       let filteredOptions = MOCK_MARKETPLACE_OPTIONS;
       
       if (q.includes("loan") || q.includes("borrow")) {
         filteredOptions = MOCK_MARKETPLACE_OPTIONS.filter(opt => opt.tags.includes("loans"));
       } else if (q.includes("invest") || q.includes("fund") || q.includes("sip")) {
         filteredOptions = MOCK_MARKETPLACE_OPTIONS.filter(opt => opt.tags.includes("investment"));
       } else if (q.includes("crypto") || q.includes("bitcoin")) {
         filteredOptions = MOCK_MARKETPLACE_OPTIONS.filter(opt => opt.tags.includes("crypto"));
       } else if (q.includes("card") || q.includes("credit")) {
         filteredOptions = MOCK_MARKETPLACE_OPTIONS.filter(opt => opt.tags.includes("credit"));
       } else if (q.includes("insure") || q.includes("insurance") || q.includes("health") || q.includes("life")) {
         filteredOptions = MOCK_MARKETPLACE_OPTIONS.filter(opt => opt.tags.includes("insurance"));
       } else {
         // Irrelevant query!
         return [];
       }
       
       // Pass pseudo-db through rules engine
       return applyRules(filteredOptions, userProfile);
    };

    const results = await withFallback(marketplaceLogic, MOCK_MARKETPLACE_OPTIONS);

    if (results.length === 0) {
      return NextResponse.json({
         options: [],
         analysis: {
            confidence: "0%",
            msg: "I specialize in financial services like loans, investments, and insurance. I cannot help with that specific query. Please try searching for a financial product.",
            fromFallback: false
         }
      });
    }

    // Limit to top 3 options
    const finalOptions = results.slice(0, 3);
    const topScore = finalOptions[0]?.score || 50;

    return NextResponse.json({
       options: finalOptions,
       analysis: {
          confidence: calculateConfidence(topScore),
          msg: "Generated based on your request and curated profile matching.",
          fromFallback: results === MOCK_MARKETPLACE_OPTIONS
       }
    });

  } catch (error) {
    console.error('[Marketplace API Error]', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
