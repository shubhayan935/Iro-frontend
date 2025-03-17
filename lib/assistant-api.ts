// lib/assistant-api.ts

import { type OnboardingStep } from "./api";

/**
 * Interface for the assistant response
 */
export interface AssistantMessage {
  role: 'assistant' | 'user';
  content: string;
  timestamp: number;
}

/**
 * Interface for the session state
 */
export interface SessionState {
  agentId: string;
  currentStepIndex: number;
  completedSteps: string[];
  messages: AssistantMessage[];
}

/**
 * Send a message to the AI assistant
 * @param message The user's message
 * @param context The current context including agent ID, step, etc.
 * @returns The assistant's response
 */
export async function sendAssistantMessage(
  message: string,
  context: {
    agentId: string;
    currentStep: OnboardingStep;
    currentStepIndex: number;
    previousMessages: AssistantMessage[];
  }
): Promise<AssistantMessage> {
  // In a real implementation, this would call an API endpoint that interfaces with an LLM
  // For the demo, we're simulating the response with basic logic
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { currentStep, currentStepIndex } = context;
    let responseContent = "";
    
    // Simple response logic based on query keywords
    const query = message.toLowerCase();
    
    if (query.includes('next step') || query.includes('what now')) {
      responseContent = `For the current step "${currentStep?.title}", you should ${currentStep?.description}. Let me know when you're ready to move on.`;
    } 
    else if (query.includes('help') || query.includes('confused')) {
      responseContent = `I see you need some help with "${currentStep?.title}". This step involves ${currentStep?.description}. Try looking for the relevant section in your interface.`;
    }
    else if (query.includes('complete') || query.includes('done')) {
      responseContent = "Great job! Let's mark this step as complete and move on to the next one.";
    }
    else if (query.includes('hi') || query.includes('hello') || query.includes('hey')) {
      responseContent = `Hello! I'm your onboarding assistant. I'm here to help you with your onboarding process. Currently, we're working on step ${currentStepIndex + 1}: ${currentStep?.title}. How can I help you?`;
    }
    else if (query.includes('thank')) {
      responseContent = "You're welcome! I'm here to help. Let me know if you need anything else.";
    }
    else {
      responseContent = `I understand you're asking about "${message}". Let me help with that. Based on the current step, you should focus on ${currentStep?.description}.`;
    }
    
    // Return the assistant message
    return {
      role: 'assistant',
      content: responseContent,
      timestamp: Date.now()
    };
    
  } catch (error) {
    console.error('Error getting assistant response:', error);
    
    // Return a fallback message
    return {
      role: 'assistant',
      content: "I'm sorry, I'm having trouble responding right now. Please try again later.",
      timestamp: Date.now()
    };
  }
}

/**
 * Save session state to localStorage
 * @param state The current session state
 */
export function saveSessionState(state: SessionState): void {
  try {
    localStorage.setItem(`onboarding-session-${state.agentId}`, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving session state:', error);
  }
}

/**
 * Load session state from localStorage
 * @param agentId The agent ID for the session
 * @returns The session state or null if not found
 */
export function loadSessionState(agentId: string): SessionState | null {
  try {
    const savedState = localStorage.getItem(`onboarding-session-${agentId}`);
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Error loading session state:', error);
  }
  
  return null;
}

/**
 * Clear session state from localStorage
 * @param agentId The agent ID for the session
 */
export function clearSessionState(agentId: string): void {
  try {
    localStorage.removeItem(`onboarding-session-${agentId}`);
  } catch (error) {
    console.error('Error clearing session state:', error);
  }
}