/**
 * API Configuration Module
 * Handles secure API key management and client initialization
 */

// Global API key constant
const API_KEY = "AIzaSyAUrqooYmPBUXLcY6scct1Aj4bwRDlcryc";

// Environment variable validation (excluding Gemini API key)
const validateEnvironmentVariables = () => {
  const requiredVars = {
    // Add other required environment variables here (excluding VITE_GEMINI_API_KEY)
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.warn('Missing optional environment variables:', missingVars);
  }

  return requiredVars;
};

// API Configuration class
export class APIConfig {
  private static instance: APIConfig;
  private geminiApiKey: string;
  private openaiApiKey: string;

  private constructor() {
    try {
      validateEnvironmentVariables();
      // Use hardcoded API key for Gemini
      this.geminiApiKey = API_KEY;
      this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    } catch (error) {
      console.error('Failed to initialize API configuration:', error);
      // Still use hardcoded API key even if validation fails
      this.geminiApiKey = API_KEY;
      this.openaiApiKey = '';
    }
  }

  public static getInstance(): APIConfig {
    if (!APIConfig.instance) {
      APIConfig.instance = new APIConfig();
    }
    return APIConfig.instance;
  }

  public getGeminiApiKey(): string {
    return this.geminiApiKey;
  }

  public getOpenAIApiKey(): string {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key is not configured. Please check your environment variables.');
    }
    return this.openaiApiKey;
  }

  public isGeminiConfigured(): boolean {
    return !!this.geminiApiKey;
  }

  public isOpenAIConfigured(): boolean {
    return !!this.openaiApiKey;
  }
}

// Export singleton instance
export const apiConfig = APIConfig.getInstance();

// Export the global API key constant
export { API_KEY };

// Utility functions for API key validation
export const validateApiKey = (apiKey: string, provider: 'gemini' | 'openai'): boolean => {
  if (!apiKey || typeof apiKey !== 'string') {
    return false;
  }

  // Basic validation patterns
  const patterns = {
    gemini: /^AIza[0-9A-Za-z-_]{35}$/, // Gemini API key pattern
    openai: /^sk-[a-zA-Z0-9]{48}$/ // OpenAI API key pattern
  };

  return patterns[provider].test(apiKey);
};

// Error handling for API configuration
export class APIConfigError extends Error {
  constructor(message: string, public provider?: string) {
    super(message);
    this.name = 'APIConfigError';
  }
}

// Development helper to check configuration
export const checkAPIConfiguration = () => {
  const config = APIConfig.getInstance();
  
  console.log('API Configuration Status:');
  console.log('- Gemini API:', config.isGeminiConfigured() ? '✅ Configured (Hardcoded)' : '❌ Missing');
  console.log('- OpenAI API:', config.isOpenAIConfigured() ? '✅ Configured' : '❌ Missing');
  
  if (import.meta.env.DEV) {
    console.log('Environment:', import.meta.env.MODE);
  }
};