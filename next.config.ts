import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    forceSwcTransforms: true
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
    OPENAI_MODEL: process.env.OPENAI_MODEL!,
    API_RATE_LIMIT: process.env.API_RATE_LIMIT!,
    MAX_TOKENS: process.env.MAX_TOKENS!,
    ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS!,
    DEBUG_MODE: process.env.DEBUG_MODE!
  }
};

export default nextConfig;
