const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  
  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is not defined`);
  }
  
  return value;
};

export const env = {
  openai: {
    apiKey: getEnvVar('OPENAI_API_KEY'),
    model: getEnvVar('OPENAI_MODEL', 'gpt-3.5-turbo'),
  },
  api: {
    rateLimit: parseInt(getEnvVar('API_RATE_LIMIT', '100')),
    maxTokens: parseInt(getEnvVar('MAX_TOKENS', '8000')),
  },
  features: {
    enableAnalytics: getEnvVar('ENABLE_ANALYTICS', 'false') === 'true',
    debugMode: getEnvVar('DEBUG_MODE', 'false') === 'true',
  },
} as const;

// Type for our env configuration
export type EnvConfig = typeof env; 