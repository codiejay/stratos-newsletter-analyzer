import { load } from 'cheerio';

export class HTMLParser {
  private static readonly htmlEntities: Record<string, string> = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#39;': "'",
    '&#47;': '/',
  };

  static decodeHtmlEntities(text: string): string {
    return text.replace(/&[^;]+;/g, match => this.htmlEntities[match] || match);
  }

  static decodeUnicodeEscapes(text: string): string {
    return text.replace(/\\x([0-9A-Fa-f]{2})/g, (_, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    });
  }

  static cleanupText(text: string): string {
    return text
      .replace(/\\[rnt]/g, ' ') // Replace \r \n \t with space
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/[^\S\r\n]+/g, ' ') // Replace multiple whitespace (except newlines) with single space
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Replace multiple newlines with double newline
      .trim();
  }

  static extractText(html: string): string {
    try {
      // First decode unicode escapes in the HTML
      html = this.decodeUnicodeEscapes(html);

      const $ = load(html);
      
      // Remove unwanted elements
      $('script, style, iframe, noscript, head').remove();
      
      // Get text content from body or the entire document if no body
      let text = $('body').length ? $('body').text() : $.root().text();
      
      // Decode HTML entities
      text = this.decodeHtmlEntities(text);
      
      // Clean up the text
      text = this.cleanupText(text);
      
      return text;
    } catch (error) {
      console.error('Error parsing HTML:', error);
      return '';
    }
  }
} 