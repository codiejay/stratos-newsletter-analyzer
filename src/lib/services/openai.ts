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

    const prompt = `Create a detailed synopsis of this newsletter content, focusing on specific details, companies, and key information. Format the response as JSON with the following structure:

{
  "tags": {
    "classification": ["NEWSLETTER" | "MARKET_UPDATE" | "RESEARCH" | "ANNOUNCEMENT"],
    "sentiment": ["BULLISH" | "BEARISH" | "NEUTRAL" | "MIXED"],
    "action": ["ACTION_REQUIRED" | "INFORMATIONAL" | "OPPORTUNITY" | "RISK_ALERT"],
    "technical_depth": "BASIC" | "INTERMEDIATE" | "ADVANCED" | "EXPERT",
    "credibility": ["VERIFIED_SOURCE" | "SPECULATIVE" | "OPINION" | "DATA_BACKED"]
  },
  "synopsis": {
    "brief": "A 2-3 sentence recreation of the core content, emphasizing specific company names and quantifiable impacts",
    "key_points": [
      "REQUIREMENTS FOR EACH KEY POINT:",
      "1. Must include at least one company/organization name",
      "2. Must include at least one specific metric, percentage, or dollar amount",
      "3. Should highlight direct business relationships or market impacts",
      "4. Focus on specific names, numbers, and facts",
      "5. Include direct references to companies, products, or legislation",
      "6. Maintain the original context but rewrite to avoid copyright issues"
    ],
    "interesting_facts": [
      "REQUIREMENTS FOR EACH FACT:",
      "1. Must be tied to a specific company or organization",
      "2. Must include a quantifiable metric or specific detail",
      "3. Should reveal unique business relationships or capabilities",
      "4. Focus on surprising or noteworthy business achievements"
    ],
    "action_items": ["Specific actions readers should consider"] // if applicable
  },
  "metadata": {
    "analyzed_at": "current_timestamp",
    "word_count": number,
    "topics": {
      "business_names": ["Specific company names mentioned - PRIORITIZE EXTRACTING ALL BUSINESS NAMES"],
      "technologies": ["Specific technologies, platforms, or products - Include version numbers when mentioned"],
      "legislation": ["Specific laws, acts, or regulations - Include bill numbers or formal names"],
      "general": ["Other relevant topics"]
    }
  }
}

SENTIMENT CLASSIFICATION RULES:
- Must be classified as "BULLISH" if ANY of:
  * Stock price increases or positive market movement
  * Significant investment or funding announcements
  * Expansion of market share or capabilities
  * Positive VC investment trends
  * Multiple companies adopting or supporting a technology
- Must be classified as "BEARISH" if ANY of:
  * Stock price decreases or negative market movement
  * Market share losses
  * Company downsizing or project cancellations
  * Negative regulatory impact
- Must be classified as "MIXED" if:
  * Both positive and negative indicators present
  * Regulatory changes with unclear market impact
- Default to "NEUTRAL" only if no clear market sentiment indicators

GENERAL TOPICS CLASSIFICATION:
- Must extract high-level themes including:
  * Industry trends (e.g., "AI governance", "Enterprise AI adoption")
  * Technology domains (e.g., "AI safety", "Cloud computing")
  * Market segments (e.g., "Enterprise software", "Cloud services")
  * Business processes (e.g., "Digital transformation", "Compliance")
  * Regulatory themes (e.g., "Tech regulation", "Industry standards")
- Each general topic should be a broad category, not a specific technology or company
- Must include at least 3 general topics if content discusses multiple aspects
- Topics should capture overarching themes that connect multiple elements in the content

For technical_depth, use these STRICT criteria:
- BASIC: General news without technical details
- INTERMEDIATE: Basic technical terms without implementation details
- ADVANCED: Must be classified as ADVANCED if content includes ANY of:
  * Technical implementation specifications
  * Enterprise architecture details
  * Specific technical protocols or standards
  * Detailed integration processes
  * Technical performance metrics
- EXPERT: Deep technical specifications or academic research

STRICT REQUIREMENTS FOR EACH SECTION:

1. SYNOPSIS:
   - Must mention at least 3 company names
   - Must include at least 2 specific metrics
   - Must cover: main announcement, market impact, AND industry response

2. KEY POINTS (Minimum 5 points):
   - EACH point MUST include:
     * At least one company name with stock symbol if public
     * At least one specific metric (%, $, or quantity)
     * Role-specific names where mentioned (e.g., "CEO Thomas Kurian")
   - Points must cover:
     * Main business transaction/announcement
     * Financial/market impact
     * Technical implementation details
     * Competitive response
     * Regulatory/compliance aspects

3. INTERESTING FACTS:
   - EACH fact MUST include:
     * Primary company name
     * Related company names (e.g., "DeepMind, a Google/Alphabet company")
     * Specific metric or quantifiable detail
     * Competitive context or market significance

4. METADATA:
   - Business names: Include parent companies and subsidiaries
   - Technologies: Must include version numbers if mentioned
   - Legislation: Must include bill sponsors and timeline

Important guidelines:
1. BUSINESS FOCUS:
   - Every key point must name at least one business entity
   - Prioritize extracting and highlighting business relationships
   - Include stock symbols when mentioned (e.g., "ServiceNow (NYSE: NOW)")

2. METRICS AND NUMBERS:
   - Each key point must include at least one quantifiable metric
   - Extract all percentages, dollar amounts, and specific numbers
   - Include market impacts, financial details, and performance metrics

3. SPECIFIC DETAILS:
   - Focus on recreating content details rather than categorizing
   - Extract specific product names, versions, and technical specifications
   - Include exact names of people and their roles when mentioned

4. INTERESTING FACTS:
   - Each fact must be tied to a specific company
   - Include unique business achievements or capabilities
   - Focus on surprising or noteworthy quantifiable details
   - Highlight competitive advantages or market positions

Newsletter text:
${text}

Ensure all tags are from the predefined options and the response is valid JSON. Focus on extracting and highlighting specific entities, metrics, and business relationships.`;

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