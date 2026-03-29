import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { 
  getMockNavigatorCards, 
  MOCK_MARKETPLACE_OPTIONS, 
  getMockCrossSellRoadmap 
} from './mock-data';

/**
 * Calculates a match score for an item based on the user's profile.
 * Formula: score = relevance + safety + user_behavior
 * @param {Array<string>} itemTags - Tags associated with the item
 * @param {Object} userProfile - The Global User Profile
 * @param {string} riskLevel - "Low", "Medium", "High", "None"
 */
export function calculateScore(itemTags = [], riskLevel = "Medium", userProfile) {
  let score = 0;
  
  // 1. User Behavior (Base Activity)
  const activityLevel = userProfile?.activity_log?.length || 0;
  if (activityLevel === 0 && itemTags.includes("exploration")) {
    score += 30; // Boost exploration if no activity
  }

  // 2. Relevance (Interests & Age Group)
  const interests = userProfile?.interests || [];
  itemTags.forEach(tag => {
    if (interests.includes(tag)) score += 40;
  });

  if (userProfile?.age_group === "student" && itemTags.includes("student")) {
    score += 20;
  }
  if (userProfile?.age_group === "student" && itemTags.includes("learning")) {
    score += 20;
  }
  
  // 3. Safety (Risk Levels)
  if (userProfile?.age_group === "student" && riskLevel === "High") {
    score -= 50; // Heavily penalize high risk for students
  }
  if (riskLevel === "Low" || riskLevel === "None") {
    score += 10;
  }

  return score;
}

/**
 * Filters and sorts items based on core rules.
 */
export function applyRules(items, userProfile) {
  return items
    .map(item => ({
      ...item,
      score: calculateScore(item.tags, item.riskLevel, userProfile)
    }))
    .filter(item => item.score > 0) // Remove negative scored items
    .sort((a, b) => b.score - a.score); // Highest score first
}

/**
 * Ensures a confidence score is generated based on rule matching.
 */
export function calculateConfidence(finalScore) {
  if (finalScore >= 100) return "98%";
  if (finalScore >= 70) return "85%";
  if (finalScore >= 40) return "60%";
  return "30%"; // Low confidence
}

/**
 * API Wrapper that acts as a safe fallback mechanism.
 * Tries the primary AI logic. If it fails, silent catches and returns mock data.
 * @param {Function} aiLogicFn - The primary async function hitting an AI/external API.
 * @param {any} mockDataFallback - The data to return if `aiLogicFn` fails.
 */
export async function withFallback(aiLogicFn, mockDataFallback) {
  try {
    // Add a race condition to prevent AI hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('AI Request Timeout')), 5000)
    );
    const result = await Promise.race([aiLogicFn(), timeoutPromise]);
    
    // Inject confidence into AI result if missing
    if (typeof result === 'object' && !result.confidence) {
       result.confidence = "85%"; 
    }
    
    return result;
  } catch (error) {
    console.error(`[withFallback Engine] AI/API failed: ${error.message}. Returning mock data.`);
    return mockDataFallback;
  }
}
