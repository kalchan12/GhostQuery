"use client";
import { colors } from "@/lib/colors";

interface SearchResult {
  title: string;
  snippet: string;
  url?: string;
  relevance_score: number;
  source: string;
  organization?: string;
  last_updated?: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  summary: string;
  totalResults: number;
  processingTime: number;
  isLoading?: boolean;
  error?: string;
}

export default function SearchResults({
  results,
  query,
  summary,
  totalResults,
  processingTime,
  isLoading = false,
  error
}: SearchResultsProps) {
  if (error) {
    return (
      <div className="mt-8 border p-6" style={{ borderColor: colors.status.error, backgroundColor: 'rgba(255, 68, 68, 0.1)' }}>
        <div className="font-mono">
          <div className="text-lg mb-2" style={{ color: colors.status.error }}>ERROR OCCURRED</div>
          <div className="text-sm" style={{ color: colors.status.error }}>{error}</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div 
        className="mt-8 border p-6" 
        style={{ 
          borderColor: colors.border.standard, 
          backgroundColor: colors.background.card 
        }}
      >
        <div className="font-mono">
          <div className="animate-pulse">
            <div className="text-lg mb-4" style={{ color: colors.primary.bright }}>PROCESSING SEARCH REQUEST...</div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div 
                    className="w-2 h-2 animate-ping" 
                    style={{ backgroundColor: colors.primary.bright }}
                  ></div>
                  <div className="text-sm" style={{ color: colors.text.secondary }}>Analyzing data sources...</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div 
        className="mt-8 border p-6" 
        style={{ 
          borderColor: colors.border.standard, 
          backgroundColor: colors.background.card 
        }}
      >
        <div className="font-mono">
          <div className="text-lg mb-2" style={{ color: colors.primary.bright }}>NO RESULTS FOUND</div>
          <div className="text-sm" style={{ color: colors.text.secondary }}>
            No data sources found for query: &ldquo;{query}&rdquo;
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Search Summary */}
      <div 
        className="border p-4" 
        style={{ 
          borderColor: colors.border.standard, 
          backgroundColor: colors.background.card 
        }}
      >
        <div className="font-mono">
          <div className="text-sm mb-2" style={{ color: colors.primary.bright }}>SEARCH SUMMARY</div>
          <div className="text-xs space-y-1" style={{ color: colors.text.tertiary }}>
            <div>Query: &ldquo;{query}&rdquo;</div>
            <div>Results: {totalResults}</div>
            <div>Processing Time: {processingTime}ms</div>
            <div className="mt-2" style={{ color: colors.text.secondary }}>{summary}</div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="font-mono text-lg mb-4" style={{ color: colors.primary.bright }}>
          SEARCH RESULTS
        </div>
        
        {results.map((result, index) => (
          <div
            key={index}
            className="border p-4 transition-all duration-200 hover:shadow-lg"
            style={{
              borderColor: colors.border.subtle,
              backgroundColor: colors.background.card
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.border.bright;
              e.currentTarget.style.backgroundColor = colors.background.hover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.border.subtle;
              e.currentTarget.style.backgroundColor = colors.background.card;
            }}
          >
            <div className="font-mono">
              {/* Result Header */}
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold flex-1" style={{ color: colors.primary.bright }}>
                  {result.url ? (
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-all duration-200"
                      style={{ color: colors.primary.bright }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = colors.primary.glow;
                        e.currentTarget.style.textShadow = colors.effects.glow;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = colors.primary.bright;
                        e.currentTarget.style.textShadow = 'none';
                      }}
                    >
                      {result.title}
                      <span className="ml-2 text-xs">↗</span>
                    </a>
                  ) : (
                    result.title
                  )}
                </h3>
                <div className="text-xs ml-4" style={{ color: colors.text.tertiary }}>
                  {Math.round(result.relevance_score * 100)}% match
                </div>
              </div>

              {/* Result Content */}
              <p className="text-sm mb-3 leading-relaxed" style={{ color: colors.text.secondary }}>
                {result.snippet}
              </p>

              {/* Result Footer */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-4" style={{ color: colors.text.tertiary }}>
                  <span>Source: {result.source}</span>
                  {result.organization && (
                    <span>• Org: {result.organization}</span>
                  )}
                  {result.url && (
                    <span style={{ color: colors.text.muted }}>
                      • {new URL(result.url).hostname}
                    </span>
                  )}
                </div>
                <div style={{ color: colors.text.muted }}>
                  Result #{index + 1}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-4 text-center" style={{ borderTop: `1px solid ${colors.border.subtle}` }}>
        <div className="text-xs font-mono" style={{ color: colors.text.muted }}>
          End of search results • GhostQuery AI Search Portal
        </div>
      </div>
    </div>
  );
}
