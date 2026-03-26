import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

/**
 * Intelligent router function to determine which agent should handle the request.
 * @param {Array} messages - Conversation history messages
 * @param {Object} userState - User context and state
 * @returns {Promise<string>} - The classified agent type
 */
export async function routeRequest(messages, userState) {
  // If user profile is not complete, send to PROFILER
  if (!userState || !userState.isProfileComplete) {
    return 'PROFILER';
  }

  // Get the latest user message
  const userMessages = messages.filter(m => m.role === 'user');
  const latestMessage = userMessages.length > 0 ? userMessages[userMessages.length - 1].content : '';

  if (!latestMessage) {
    return 'PROFILER';
  }

  // Use OpenAI to classify intent
  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    system: `You are an intent classification engine for a financial app.
Classify the user's latest message into EXACTLY ONE of the following three categories.
Respond ONLY with the category name, nothing else.

CATEGORIES:
RECOMMENDATION - If they ask about portfolio, market trends, financial gaps, or news.
ACTION - If they ask for specific services, credit cards, loans, or partner offers.
MONETIZATION - If they are asking about ET premium features or event tickets.`,
    prompt: `User message: "${latestMessage}"`,
    maxTokens: 10,
    temperature: 0,
  });

  const category = text.trim().toUpperCase();
  
  // Fallback map
  if (['RECOMMENDATION', 'ACTION', 'MONETIZATION'].includes(category)) {
    return category;
  }
  
  return 'RECOMMENDATION'; // Default fallback
}
