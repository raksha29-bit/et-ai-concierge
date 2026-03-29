import { NextResponse } from 'next/server';
import { calculateConfidence, withFallback } from '@/lib/core-engine';
import { getMockCrossSellRoadmap } from '@/lib/mock-data';

export async function POST(req) {
  try {
    const { intent, userProfile } = await req.json();

    if (!userProfile) {
      return NextResponse.json({ error: "Missing required profile" }, { status: 400 });
    }

    // Wrap in fallback architecture
    const generateRoadmap = async () => {
       // Simulate dynamic generation delay
       await new Promise(r => setTimeout(r, 600));

       // Logic: Build flowchart based on saved cards + interests
       let steps = ["Learn Basics"];
       if (userProfile.interests.includes("crypto") && userProfile.age_group !== "minor") {
         steps.push("Explore Crypto Options");
       }
       if (userProfile.saved_cards.length > 0) {
         steps.push("Review Saved Suggestions");
       }
       steps.push("Start Investing", "Grow Wealth");

       const risk = userProfile.age_group === "student" ? "Low" : "Medium";
       const score = userProfile.activity_log.length > 5 ? 85 : 50;

       return {
         steps,
         outcomeRange: risk === "Low" ? "₹50k - ₹75k" : "₹100k - ₹300k",
         riskLevel: risk,
         confidence: calculateConfidence(score),
         fromFallback: false
       };
    };

    const result = await withFallback(generateRoadmap, getMockCrossSellRoadmap(intent, userProfile));

    return NextResponse.json(result);

  } catch (error) {
    console.error('[Cross-Sell API Error]', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
