/**
 * API Configuration Module
 * Handles secure API key management and client initialization
 */

// Environment variable validation
const validateEnvironmentVariables = () => {
  const requiredVars = {
    VITE_GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
    // Add other required environment variables here
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
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
      const envVars = validateEnvironmentVariables();
      this.geminiApiKey = envVars.VITE_GEMINI_API_KEY;
      this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    } catch (error) {
      console.error('Failed to initialize API configuration:', error);
      throw error;
    }
  }

  public static getInstance(): APIConfig {
    if (!APIConfig.instance) {
      APIConfig.instance = new APIConfig();
    }
    return APIConfig.instance;
  }

  public getGeminiApiKey(): string {
    if (!this.geminiApiKey) {
      throw new Error('Gemini API key is not configured. Please check your environment variables.');
    }
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
  console.log('- Gemini API:', config.isGeminiConfigured() ? '✅ Configured' : '❌ Missing');
  console.log('- OpenAI API:', config.isOpenAIConfigured() ? '✅ Configured' : '❌ Missing');
  
  if (import.meta.env.DEV) {
    console.log('Environment:', import.meta.env.MODE);
  }
};