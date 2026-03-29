import { NextResponse } from 'next/server';
import { applyRules, calculateConfidence, withFallback } from '@/lib/core-engine';
import { getMockNavigatorCards, EMPTY_GRAPH_DATA } from '@/lib/mock-data';

export async function POST(req) {
  try {
    const { action, userProfile } = await req.json();

    if (!userProfile) {
      return NextResponse.json({ error: "No user profile provided" }, { status: 400 });
    }

    if (action === 'generate_cards') {
      const allCards = getMockNavigatorCards();
      
      // Pass through Core Engine to filter / score / sort based on userProfile
      const personalizedCards = applyRules(allCards, userProfile);

      return NextResponse.json({
         cards: personalizedCards,
         confidence: calculateConfidence(personalizedCards[0]?.score || 0)
      });
    }

    if (action === 'weekly_summary') {
      const { activity_log } = userProfile;
      
      if (!activity_log || activity_log.length === 0) {
        return NextResponse.json({
          hasActivity: false,
          summaryCards: [],
          insight: "Complete some activities to see your behavioral insights here!"
        });
      }

      // Simulate a generative response using fallback mock (we wrap actual AI if needed here)
      const mockSummary = {
        hasActivity: true,
        summaryCards: [
           { title: "Deep Dive", metric: "+40%", direction: "up", text: "You explored investments more" },
           { title: "Cooling off", metric: "-20%", direction: "down", text: "You used marketplace less" }
        ],
        insight: "You are rapidly moving from the exploring phase to the decision phase in Equities."
      };
      
      return NextResponse.json(mockSummary);
    }

    if (action === 'activity_graph') {
      // Return EMPTY_GRAPH_DATA if no activity, else return mocked random activity graph
      const { activity_log } = userProfile;
      if (!activity_log || activity_log.length === 0) {
         return NextResponse.json({ data: EMPTY_GRAPH_DATA });
      }

      // Simulate real data by modifying empty graph values slightly
      const simulatedData = EMPTY_GRAPH_DATA.map(series => ({
         ...series,
         points: Array.from({length: 7}, () => Math.floor(Math.random() * 80) + 10),
         emoji: Math.random() > 0.5 ? "📈 😊" : "📉 😢"
      }));

      return NextResponse.json({ data: simulatedData });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });

  } catch (error) {
    console.error('[Navigator API Error]', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
