import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { routeRequest } from '@/lib/orchestrator';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req) {
  try {
    const { messages, userState } = await req.json();

    // 1. Route the request to the appropriate agent
    const agentType = await routeRequest(messages, userState);

    // 2. Define the system prompt based on the chosen agent
    let systemPrompt = '';
    switch (agentType) {
      case 'PROFILER':
        systemPrompt = 'You are the ET Welcome Concierge. Ask the user about their experience level and financial goals to complete their profile.';
        break;
      case 'RECOMMENDATION':
        systemPrompt = 'You are the ET Financial Navigator. Give a brief tip about analyzing portfolios, market trends, or financial gaps.';
        break;
      case 'ACTION':
        systemPrompt = 'You are the ET Marketplace Agent. Acknowledge their request for a financial service (like credit cards, loans, or partner offers) and explain how we can help.';
        break;
      case 'MONETIZATION':
        systemPrompt = 'You are the ET Cross-Sell Engine. Provide information about ET premium features or event tickets that match their interests.';
        break;
      default:
        systemPrompt = 'You are a helpful ET AI Concierge.';
        break;
    }

    // 3. Generate a streaming response using Vercel AI SDK
    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
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
