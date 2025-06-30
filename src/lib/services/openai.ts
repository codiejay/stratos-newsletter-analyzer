import OpenAI from 'openai';
import { env } from '@/lib/env';
import { AnalysisResponse } from '@/app/api/analyze/route';

const openai = new OpenAI({
  apiKey: env.openai.apiKey,
});

export class OpenAIService {
  private static async getCompletion(prompt: string): Promise<string> {
    try {
      if (env.features.debugMode) {
        console.log('OpenAI API Key:', env.openai.apiKey ? 'Present' : 'Missing');
        console.log('OpenAI Model:', env.openai.model);
        console.log('Max Tokens:', env.api.maxTokens);
      }

      const completion = await openai.chat.completions.create({
        model: env.openai.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: env.api.maxTokens,
      });

      if (!completion.choices?.[0]?.message?.content) {
        throw new Error('No completion content received from OpenAI');
      }

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      if (error instanceof Error) {
        throw new Error(`OpenAI API Error: ${error.message}`);
      }
      throw new Error('Failed to get completion from OpenAI');
    }
  }

  static async analyzeNewsletter(text: string): Promise<Omit<AnalysisResponse, 'raw_text'>> {
    if (!text.trim()) {
      throw new Error('Empty text provided for analysis');
    }

    const prompt = `Analyze the following newsletter text and provide a structured analysis. Format the response as JSON with the following structure:
{
  "tags": {
    "classification": ["NEWSLETTER" | "MARKET_UPDATE" | "RESEARCH" | "ANNOUNCEMENT"],
    "sentiment": ["BULLISH" | "BEARISH" | "NEUTRAL" | "MIXED"],
    "action": ["ACTION_REQUIRED" | "INFORMATIONAL" | "OPPORTUNITY" | "RISK_ALERT"],
    "technical_depth": "BASIC" | "INTERMEDIATE" | "ADVANCED" | "EXPERT",
    "credibility": ["VERIFIED_SOURCE" | "SPECULATIVE" | "OPINION" | "DATA_BACKED"]
  },
  "summary": {
    "brief": "2-3 sentence summary",
    "key_points": ["main point 1", "main point 2", "etc"],
    "action_items": ["action 1", "action 2"] // if applicable
  },
  "metadata": {
    "analyzed_at": "current_timestamp",
    "word_count": number,
    "topics": ["topic1", "topic2"]
  }
}

For technical_depth, use these criteria:
- BASIC: General news, broad market updates, simple announcements
- INTERMEDIATE: Industry-specific analysis, technical updates, market trends
- ADVANCED: Detailed technical analysis, in-depth research, complex market dynamics
- EXPERT: Academic/research level content, technical specifications, complex financial instruments

Newsletter text:
${text}

Ensure all tags are from the predefined options and the response is valid JSON. Pay special attention to accurately assessing the technical depth based on the criteria provided.`;

    try {
      if (env.features.debugMode) {
        console.log('Analyzing text length:', text.length);
      }

      const completion = await this.getCompletion(prompt);
      
      try {
        const analysis = JSON.parse(completion);
        
        return {
          ...analysis,
          metadata: {
            ...analysis.metadata,
            analyzed_at: new Date().toISOString(),
            word_count: text.split(/\s+/).length
          }
        };
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Raw completion:', completion);
        throw new Error('Failed to parse OpenAI response as JSON');
      }
    } catch (error) {
      console.error('Analysis Error:', error);
      throw error instanceof Error ? error : new Error('Failed to analyze newsletter');
    }
  }
} 