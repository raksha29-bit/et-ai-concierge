import { google } from '@ai-sdk/google';
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
    return {
      module: 'PROFILER',
      confidence: 1.0,
      reason: 'User profile is incomplete. Onboarding required.'
    };
  }

  // Get the latest user message
  const userMessages = messages.filter(m => m.role === 'user');
  const latestMessage = userMessages.length > 0 ? userMessages[userMessages.length - 1].content : '';

  if (!latestMessage) {
    return {
      module: 'Service Marketplace',
      confidence: 1.0,
      reason: 'No explicit message provided. Defaulting to discovery.'
    };
  }

  const stringifiedProfile = JSON.stringify({
    age: userState.age_group || 'unknown',
    interests: userState.interests || [],
    recentActions: userState.last_actions || [],
    activityCount: userState.activity_log?.length || 0
  });

  // Use OpenAI to classify intent
  const { text } = await generateText({
    model: google('gemini-1.5-flash'),
    system: `You are a core routing engine for a Financial Concierge system.
Your job is to classify user queries into one of three core modules, taking their user profile into heavily weighted consideration:

USER PROFILE CONTEXT:
${stringifiedProfile}

1. Finance Navigator
- Purpose: Help users track, manage, and understand behavior.
- Trigger: User wants to monitor/analyze behavior.
- RULE: If user profile activity is HIGH (activityCount > 10), strongly bias towards "Finance Navigator" as they have data to look at.

2. Service Marketplace
- Purpose: Explore, compare, and learn about financial products.
- Trigger: Discovery or learning mode.
- RULE: Default fallback if intent is fuzzy or user activity is LOw.

3. Cross-Sell Engine
- Purpose: Recommend purchase paths and roadmaps.
- Trigger: Buyer intent ("apply", "roadmap", "buy", "plan future").
- RULE: Age group "student" limits high-risk cross-sells. Bias towards "Service Marketplace" learning if student explicitly asks for risks.

OUTPUT EXPECTATION:
You MUST return ONLY a valid JSON object matching exactly this structure (no markdown tags):
{
  "module": "Finance Navigator" | "Service Marketplace" | "Cross-Sell Engine",
  "confidence": <0-1>,
  "reason": "<short explanation linking to profile traits>"
}`,
    prompt: `User message: "${latestMessage}"`,
    maxTokens: 150,
    temperature: 0,
  });

  try {
    const jsonStr = text.replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (err) {
    return {
      module: 'Service Marketplace',
      confidence: 0.1,
      reason: 'JSON parsing fallback.'
    };
  }
}
