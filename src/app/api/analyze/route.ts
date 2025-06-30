import { NextResponse } from 'next/server';
import { HTMLParser } from '@/lib/parser';
import { env } from '@/lib/env';
import { OpenAIService } from '@/lib/services/openai';

export interface AnalysisResponse {
  raw_text: string;
  tags: {
    classification: string[];
    sentiment: string[];
    action: string[];
    technical_depth: string;
    credibility: string[];
  };
  summary: {
    brief: string;
    key_points: string[];
    action_items?: string[];
  };
  metadata: {
    analyzed_at: string;
    word_count: number;
    topics: string[];
  };
}

export async function POST(request: Request) {
  try {
    const { html } = await request.json();

    if (!html) {
      return NextResponse.json(
        { error: 'HTML content is required' },
        { status: 400 }
      );
    }

    // Extract raw text from HTML
    const rawText = HTMLParser.extractText(html);

    if (!rawText) {
      return NextResponse.json(
        { error: 'Failed to extract text from HTML' },
        { status: 400 }
      );
    }

    if (env.features.debugMode) {
      console.log('Raw text extracted:', rawText.substring(0, 200) + '...');
    }

    // Get analysis from OpenAI
    const analysis = await OpenAIService.analyzeNewsletter(rawText);

    // Combine raw text with analysis
    const response: AnalysisResponse = {
      raw_text: rawText,
      ...analysis
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process HTML';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 