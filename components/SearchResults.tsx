"use client";

interface SearchResult {
  title: string;
  snippet: string;
  url?: string;
  relevance_score: number;
  source: string;
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
      <div className="mt-8 border border-red-500/50 bg-red-900/10 p-6">
        <div className="text-red-400 font-mono">
          <div className="text-lg mb-2">ERROR OCCURRED</div>
          <div className="text-sm text-red-300">{error}</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-8 border border-[#00ff00]/30 bg-[#00ff00]/5 p-6">
        <div className="text-[#00ff00] font-mono">
          <div className="animate-pulse">
            <div className="text-lg mb-4">PROCESSING SEARCH REQUEST...</div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#00ff00] animate-ping"></div>
                  <div className="text-sm text-[#008000]">Analyzing data sources...</div>
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
      <div className="mt-8 border border-[#00ff00]/30 bg-[#00ff00]/5 p-6">
        <div className="text-[#00ff00] font-mono">
          <div className="text-lg mb-2">NO RESULTS FOUND</div>
          <div className="text-sm text-[#008000]">
            No data sources found for query: &ldquo;{query}&rdquo;
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Search Summary */}
      <div className="border border-[#00ff00]/30 bg-[#00ff00]/5 p-4">
        <div className="text-[#00ff00] font-mono">
          <div className="text-sm mb-2">SEARCH SUMMARY</div>
          <div className="text-xs text-[#008000] space-y-1">
            <div>Query: &ldquo;{query}&rdquo;</div>
            <div>Results: {totalResults}</div>
            <div>Processing Time: {processingTime}ms</div>
            <div className="mt-2">{summary}</div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="text-[#00ff00] font-mono text-lg mb-4">
          SEARCH RESULTS
        </div>
        
        {results.map((result, index) => (
          <div
            key={index}
            className="border border-[#00ff00]/20 bg-[#00ff00]/5 p-4 hover:border-[#00ff00]/40 hover:bg-[#00ff00]/10 transition-all duration-200"
          >
            <div className="font-mono">
              {/* Result Header */}
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-[#00ff00] text-lg font-bold flex-1">
                  {result.url ? (
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#00ff88] hover:drop-shadow-[0_0_5px_rgba(0,255,0,0.5)] transition-all duration-200"
                    >
                      {result.title}
                      <span className="ml-2 text-xs">↗</span>
                    </a>
                  ) : (
                    result.title
                  )}
                </h3>
                <div className="text-xs text-[#008000] ml-4">
                  {Math.round(result.relevance_score * 100)}% match
                </div>
              </div>

              {/* Result Content */}
              <p className="text-[#00dd00] text-sm mb-3 leading-relaxed">
                {result.snippet}
              </p>

              {/* Result Footer */}
              <div className="flex items-center justify-between text-xs text-[#008000]">
                <div className="flex items-center space-x-4">
                  <span>Source: {result.source}</span>
                  {result.url && (
                    <span className="text-[#006600]">
                      {new URL(result.url).hostname}
                    </span>
                  )}
                </div>
                <div className="text-[#004400]">
                  Result #{index + 1}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-[#00ff00]/20 pt-4 text-center">
        <div className="text-xs text-[#008000] font-mono">
          End of search results • GhostQuery AI Search Portal
        </div>
      </div>
    </div>
  );
}
