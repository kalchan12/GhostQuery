interface OllamaResponse {
  response: string;
  done: boolean;
  model: string;
}

interface SearchResult {
  title: string;
  snippet: string;
  url?: string;
  relevance_score: number;
  source: string;
}

export interface AISearchResponse {
  results: SearchResult[];
  summary: string;
  query: string;
  total_results: number;
  processing_time_ms: number;
}

class AIService {
  private baseUrl: string;
  private model: string;
  private timeout: number;

  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'llama3.2:3b';
    this.timeout = parseInt(process.env.SEARCH_TIMEOUT || '30000');
  }

  async generateSearch(query: string, limit: number = 10): Promise<AISearchResponse> {
    const startTime = Date.now();
    
    try {
      const prompt = this.buildSearchPrompt(query, limit);
      const response = await this.callOllama(prompt);
      
      const results = this.parseSearchResults(response, query);
      const processingTime = Date.now() - startTime;

      return {
        results: results.slice(0, limit),
        summary: this.generateSummary(query, results.length),
        query,
        total_results: results.length,
        processing_time_ms: processingTime
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to process search request');
    }
  }

  private buildSearchPrompt(query: string, limit: number): string {
    return `You are a search engine AI that helps find information about open data sources. 
    
User Query: "${query}"

Please provide relevant information and resources related to this query. Format your response as a structured list of search results in JSON format:

{
  "results": [
    {
      "title": "Result Title",
      "snippet": "Brief description or summary of the content",
      "url": "https://example.com (if applicable)",
      "relevance_score": 0.95,
      "source": "Source name or type"
    }
  ]
}

Focus on:
- Open data sources (government databases, academic repositories, public APIs)
- Factual and educational content
- Publicly available information
- Relevant datasets and research

Provide up to ${limit} high-quality results. If no specific data sources exist, provide educational information about the topic.

Response:`;
  }

  private async callOllama(prompt: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 2000,
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data: OllamaResponse = await response.json();
      return data.response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - AI model took too long to respond');
        }
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  }

  private parseSearchResults(response: string, query: string): SearchResult[] {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.results && Array.isArray(parsed.results)) {
          return parsed.results.map((result: Record<string, unknown>) => ({
            title: result.title || 'Untitled',
            snippet: result.snippet || 'No description available',
            url: result.url || undefined,
            relevance_score: result.relevance_score || 0.5,
            source: result.source || 'AI Generated'
          }));
        }
      }
    } catch (_error) {
      console.warn('Failed to parse JSON response, using fallback');
    }

    // Fallback: generate results from plain text response
    return this.generateFallbackResults(response, query);
  }

  private generateFallbackResults(response: string, _query: string): SearchResult[] {
    // Split response into paragraphs and create results
    const paragraphs = response.split('\n\n').filter(p => p.trim().length > 0);
    
    return paragraphs.slice(0, 5).map((paragraph, index) => {
      const lines = paragraph.trim().split('\n');
      const title = lines[0].replace(/^[\d\.\-\*\s]+/, '').trim() || `Result ${index + 1}`;
      const snippet = lines.slice(1).join(' ').trim() || paragraph.slice(0, 150) + '...';
      
      return {
        title,
        snippet,
        url: undefined,
        relevance_score: Math.max(0.9 - (index * 0.1), 0.3),
        source: 'AI Generated'
      };
    });
  }

  private generateSummary(query: string, resultCount: number): string {
    return `Found ${resultCount} result${resultCount !== 1 ? 's' : ''} for "${query}". Results include information from open data sources and educational content.`;
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch (_error) {
      return false;
    }
  }
}

export const aiService = new AIService();
