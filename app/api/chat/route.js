import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { routeRequest } from '@/lib/orchestrator';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req) {
  try {
    const { messages, userState } = await req.json();
    console.log('--- Chat API Incoming ---');
    console.log('Messages Count:', messages?.length);
    console.log('Latest User Message:', messages?.[messages.length - 1]?.content);

    // 1. Route the request to the appropriate agent
    const routingInfo = await routeRequest(messages, userState);
    console.log('Routing Decision:', routingInfo.module);
    const agentType = routingInfo.module;

    // 2. Define the system prompt based on the chosen agent
    // 2. Define the base system prompt with the robust 11-step rules engine
    const baseSystemRules = `
You are the ET AI Financial Concierge, an intelligent, context-aware, non-repetitive, and helpful assistant.
You MUST STRICTLY follow these 11 rules for every response:

1. INTENT DETECTION: Identify if the query is about Investment, Loans, Learning, Market trends, UPI/Payments, or General.
2. STRICT CONTEXT MATCHING: If the user asks about investments, do NOT suggest loans. If they ask about loans, do NOT suggest investments. Stay exactly in context.
3. RESPONSE FILTERING: Ensure your answer matches the user profile, risk level, and query relevance. 
4. ANTI-REPETITION (VARIATION SYSTEM): Analyze the chat history. NEVER repeat the same greeting. NEVER repeat suggestions you have already shown. Rotate your tone and wording dynamically.
5. RESPONSE STRUCTURE: Always reply in this format:
   - Acknowledge their input (Friendly, conversational tone)
   - Short explanation (Keep it simple)
   - 2-3 tailored suggestions (Bullet points)
   - 1 Contextual Follow-up Question (Do NOT say "How can I help you?", ask a specific question like "Want me to go deeper into this?")
6. FALLBACK (LOW CONFIDENCE): If you do not know the answer or are uncertain, DO NOT HALLUCINATE. Say: "I’m not fully sure about that, but I can guide you with some safer options."
7. RISK-AWARE: If the user is a beginner or student, strictly avoid high-risk or complex strategies.
8. TONE CONTROL: Guide, do not push. Suggest, do not sell. Be friendly and conversational. Do not use over-formal scripts. 
9. MEMORY AWARENESS: Track previous queries. If they asked about crypto earlier, don't suddenly shift to loans.
10. HARD BLOCK RULES: No irrelevant category suggestions. No repeating the exact same phrase. No unrealistic promises or guarantees on returns.
11. DYNAMIC GREETING: If it's the first message or they say "hi/hello", use dynamic varied greetings like "Hey! What's on your mind today?" or "Hi! Looking to explore something?"

Contextual Module Routing: `;

    let modulePrompt = '';
    switch (agentType) {
      case 'PROFILER':
        modulePrompt = 'You are in the Profiler module. Ask the user gently about their goals to complete their profile.';
        break;
      case 'Finance Navigator':
        modulePrompt = 'You are in the Finance Navigator module. Focus on tracking behavior, expenses, and insights.';
        break;
      case 'Service Marketplace':
        modulePrompt = 'You are in the Service Marketplace module. Help compare specific financial products, loans, and credit cards safely.';
        break;
      case 'Cross-Sell Engine':
        modulePrompt = 'You are in the Cross-Sell Engine module. Focus on visual future planning and steps to achieve their intent.';
        break;
      default:
        modulePrompt = 'You are currently acting as the general ET AI Concierge entry point.';
        break;
    }

    const finalSystemPrompt = baseSystemRules + modulePrompt + `\n\nUser State: ${JSON.stringify(userState || {})}`;

    // 3. Generate a streaming response using Vercel AI SDK
    const result = streamText({
      model: google('gemini-1.5-pro'),
      system: finalSystemPrompt,
      messages,
    });

    // 4. Return the stream to the client
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
