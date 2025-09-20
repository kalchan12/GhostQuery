
// This is a React component for a cyberpunk-themed search terminal UI
// It uses React hooks for state and animation
"use client";
import { useState, useEffect } from "react";
import SearchResults from "@/components/SearchResults";
import { colors } from "@/lib/colors";

interface SearchResult {
  title: string;
  snippet: string;
  url?: string;
  relevance_score: number;
  source: string;
}

interface SearchResponse {
  results: SearchResult[];
  summary: string;
  query: string;
  total_results: number;
  processing_time_ms: number;
}

export default function GhostQuery() {
  // Stores the status messages shown below the search bar
  const [status, setStatus] = useState<string[]>([
    "SYSTEM READY",
    "AWAITING USER INPUT...",
    "PRESS ENTER OR CLICK EXECUTE TO SEARCH",
  ]);
  // Stores the user's search input
  const [query, setQuery] = useState("");
  // True when a search is running
  const [processing, setProcessing] = useState(false);
  // The animated title text
  const [title, setTitle] = useState("");
  // Search results state
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [searchError, setSearchError] = useState<string>("");
  // Search mode: 'data' for open data search, 'ai' for AI search, 'duckduckgo' for DuckDuckGo search
  const [searchMode, setSearchMode] = useState<'data' | 'ai' | 'duckduckgo'>('data');

  // Animates the title by revealing one letter at a time
  useEffect(() => {
    const text = "GHOST QUERY"; // The title to animate
    let index = 0;
    const glitchEffect = setInterval(() => {
      let glitchText = "";
      for (let i = 0; i < index; i++) {
        glitchText += text[i];
      }
      setTitle(glitchText);
      index++;
      if (index > text.length) clearInterval(glitchEffect);
    }, 120);
    return () => clearInterval(glitchEffect);
  }, []);

  // Performs search using the selected mode (Open Data or AI)
  const executeSearch = async (q: string) => {
    setProcessing(true);
    setSearchError("");
    setSearchResults(null);
    
    const isAIMode = searchMode === 'ai';
    const isDuckDuckGoMode = searchMode === 'duckduckgo';
    const apiEndpoint = isAIMode ? '/api/ai-search' : (isDuckDuckGoMode ? '/api/duckduckgo-search' : '/api/search');
    const serviceName = isAIMode ? 'GROK AI SERVICE' : (isDuckDuckGoMode ? 'DUCKDUCKGO SEARCH SERVICE' : 'OPEN DATA SERVICE');
    
    setStatus([
      "INITIALIZING SEARCH PROTOCOL...",
      `QUERY: ${q.toUpperCase()}`,
      `CONNECTING TO ${serviceName}...`,
    ]);

    try {
      setStatus([
        "SEARCH IN PROGRESS...",
        `ANALYZING: ${q.toUpperCase()}`,
        isAIMode ? "PROCESSING WITH AI MODEL..." : (isDuckDuckGoMode ? "QUERYING DUCKDUCKGO API..." : "SEARCHING DATA REPOSITORIES..."),
      ]);

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: q,
          limit: 10
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `${isAIMode ? 'AI' : (isDuckDuckGoMode ? 'DuckDuckGo' : 'Data')} search failed`);
      }

      if (data.success && data.data) {
        setSearchResults(data.data);
        setStatus([
          "SEARCH COMPLETED SUCCESSFULLY",
          `FOUND ${data.data.total_results} RESULTS FOR: ${q.toUpperCase()}`,
          `SOURCE: ${serviceName}`,
        ]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSearchError(errorMessage);
      setStatus([
        "SEARCH FAILED",
        `ERROR: ${errorMessage.toUpperCase()}`,
        "CHECK SYSTEM STATUS",
      ]);
    } finally {
      setProcessing(false);
      setQuery("");

      // Reset status after delay if no results to show
      setTimeout(() => {
        if (!searchResults && !searchError) {
          setStatus([
            "SYSTEM READY",
            "AWAITING USER INPUT...",
            "PRESS ENTER OR CLICK EXECUTE TO SEARCH",
          ]);
        }
      }, 5000);
    }
  };

  // Handles the form submission for searching
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      await executeSearch(query.trim());
    } else {
      setStatus([
        "ERROR: NO SEARCH PARAMETERS",
        "PLEASE ENTER A VALID QUERY",
        "SYSTEM READY",
      ]);
    }
  };

  return (
    // Main container for the whole page
    <div className="min-h-screen flex flex-col justify-center items-center bg-black font-mono relative" style={{ color: colors.text.primary }}>
      {/* Adds a scanline effect over the whole page for a retro look */}
      <div className="pointer-events-none fixed inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,65,0.05)_2px,rgba(0,255,65,0.05)_4px)]" />

      <div className="w-[90%] max-w-[800px] relative z-10">
        {/* Header with animated title */}
        <div className="text-center mb-12 relative">
          <div className="text-5xl md:text-6xl tracking-wider mb-2 relative inline-block">
            {/* Animated title text appears here */}
            <span className="absolute inset-0 text-[#ff00ff] mix-blend-screen animate-[glitch_1s_infinite]">{title}</span>
            <span className="relative">{title}</span>
          </div>
          {/* Subtitle below the title */}
          <div className="text-lg mb-2" style={{ color: colors.text.secondary }}>Search With Style</div>
        </div>

        {/* Search Mode Selection */}
        <div className="text-center mb-8">
          <div className="text-sm mb-4" style={{ color: colors.text.secondary }}>SELECT SEARCH MODE</div>
          <div className="flex justify-center space-x-3 flex-wrap">
            <button
              onClick={() => setSearchMode('data')}
              disabled={processing}
              className={`px-4 py-2 uppercase tracking-wider border transition-all duration-200 ${
                searchMode === 'data'
                  ? "text-black"
                  : "hover:text-black"
              } ${processing ? "opacity-50 cursor-not-allowed" : ""}`}
              style={{
                borderColor: colors.primary.bright,
                color: searchMode === 'data' ? '#000' : colors.primary.bright,
                backgroundColor: searchMode === 'data' ? colors.primary.bright : 'transparent',
                boxShadow: searchMode === 'data' ? colors.effects.glowBright : colors.effects.shadow
              }}
              onMouseEnter={(e) => {
                if (!processing && searchMode !== 'data') {
                  e.currentTarget.style.backgroundColor = colors.primary.bright;
                  e.currentTarget.style.color = '#000';
                  e.currentTarget.style.boxShadow = colors.effects.glowBright;
                }
              }}
              onMouseLeave={(e) => {
                if (!processing && searchMode !== 'data') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.primary.bright;
                  e.currentTarget.style.boxShadow = colors.effects.shadow;
                }
              }}
            >
              🗄️ Open Data
            </button>
            <button
              onClick={() => setSearchMode('ai')}
              disabled={processing}
              className={`px-4 py-2 uppercase tracking-wider border transition-all duration-200 ${
                searchMode === 'ai'
                  ? "text-black"
                  : "hover:text-black"
              } ${processing ? "opacity-50 cursor-not-allowed" : ""}`}
              style={{
                borderColor: '#ff0055',
                color: searchMode === 'ai' ? '#000' : '#ff0055',
                backgroundColor: searchMode === 'ai' ? '#ff0055' : 'transparent',
                boxShadow: searchMode === 'ai' ? '0 0 20px rgba(255, 0, 85, 0.5)' : '0 0 10px rgba(255, 0, 85, 0.2)'
              }}
              onMouseEnter={(e) => {
                if (!processing && searchMode !== 'ai') {
                  e.currentTarget.style.backgroundColor = '#ff0055';
                  e.currentTarget.style.color = '#000';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 0, 85, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!processing && searchMode !== 'ai') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#ff0055';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 0, 85, 0.2)';
                }
              }}
            >
              🤖 AI Search
            </button>
            <button
              onClick={() => setSearchMode('duckduckgo')}
              disabled={processing}
              className={`px-4 py-2 uppercase tracking-wider border transition-all duration-200 ${
                searchMode === 'duckduckgo'
                  ? "text-black"
                  : "hover:text-black"
              } ${processing ? "opacity-50 cursor-not-allowed" : ""}`}
              style={{
                borderColor: '#ff6600',
                color: searchMode === 'duckduckgo' ? '#000' : '#ff6600',
                backgroundColor: searchMode === 'duckduckgo' ? '#ff6600' : 'transparent',
                boxShadow: searchMode === 'duckduckgo' ? '0 0 20px rgba(255, 102, 0, 0.5)' : '0 0 10px rgba(255, 102, 0, 0.2)'
              }}
              onMouseEnter={(e) => {
                if (!processing && searchMode !== 'duckduckgo') {
                  e.currentTarget.style.backgroundColor = '#ff6600';
                  e.currentTarget.style.color = '#000';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 102, 0, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!processing && searchMode !== 'duckduckgo') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#ff6600';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 102, 0, 0.2)';
                }
              }}
            >
              🦆 DuckDuckGo
            </button>
          </div>
          <div className="text-xs mt-2" style={{ color: colors.text.muted }}>
            {searchMode === 'data' 
              ? 'Search government and public datasets from Data.gov and EU Open Data Portal'
              : searchMode === 'ai' 
                ? 'Get AI-powered insights and comprehensive analysis using Hugging Face AI'
                : 'Privacy-focused web search with instant answers from DuckDuckGo'}
          </div>
        </div>

        {/* Search prompt with terminal-style prefix and input */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-center text-lg mb-4 group">
            {/* Terminal prompt in cyberpunk color */}
            <span className="mr-5 text-[#ff0055] drop-shadow-[0_0_6px_rgba(255,0,85,0.7)]">
              kal@psycho:~$
            </span>
            {/* User input field */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ENTER SEARCH QUERY"
              className="flex-1 bg-transparent outline-none ghost-input placeholder:italic transition-all duration-200 group-hover:scale-105"
              style={{ 
                color: colors.primary.bright,
                textShadow: colors.effects.glow
              }}
            />
            {/* Blinking cursor effect */}
            <div 
              className="w-3 h-5 ml-1 animate-pulse" 
              style={{ 
                backgroundColor: colors.primary.bright,
                boxShadow: colors.effects.glow
              }}
            />
          </div>
        </form>

        {/* Execute button for submitting the search */}
        <div className="text-center mb-8">
          <button
            onClick={async (e) => {
              e.preventDefault();
              if (!processing) await handleSubmit(e as React.FormEvent);
            }}
            disabled={processing}
            className={`px-6 py-2 uppercase tracking-wider border transition-all duration-200 ${
              processing
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-black"
            }`}
            style={{
              borderColor: colors.primary.bright,
              color: colors.primary.bright,
              boxShadow: colors.effects.shadow,
              ...(processing ? {} : {
                ':hover': {
                  backgroundColor: colors.primary.bright,
                  boxShadow: colors.effects.glowBright
                }
              })
            }}
            onMouseEnter={(e) => {
              if (!processing) {
                e.currentTarget.style.backgroundColor = colors.primary.bright;
                e.currentTarget.style.boxShadow = colors.effects.glowBright;
              }
            }}
            onMouseLeave={(e) => {
              if (!processing) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.boxShadow = colors.effects.shadow;
              }
            }}
          >
            {processing ? "PROCESSING..." : "EXECUTE"}
          </button>
        </div>

        {/* Status messages below the search bar */}
        <div 
          className="border p-4" 
          style={{
            borderColor: colors.border.standard,
            backgroundColor: colors.background.card,
            boxShadow: colors.effects.shadow
          }}
        >
          {status.map((line, i) => (
            <div
              key={i}
              className="mb-1"
              style={{
                color: processing ? colors.primary.bright : colors.text.secondary,
                textShadow: processing ? colors.effects.glow : 'none'
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* Search Results */}
      {(searchResults || searchError) && (
        <SearchResults
          results={searchResults?.results || []}
          query={searchResults?.query || query}
          summary={searchResults?.summary || ""}
          totalResults={searchResults?.total_results || 0}
          processingTime={searchResults?.processing_time_ms || 0}
          isLoading={processing}
          error={searchError}
          searchMode={searchMode}
        />
      )}

      {/* CSS for the animated glitch effect on the title */}
      <style jsx>{`
        @keyframes glitch {
          0% {
            clip: rect(0, 9999px, 0, 0);
          }
          5% {
            clip: rect(5px, 9999px, 30px, 0);
            transform: translate(-2px, -2px);
          }
          10% {
            clip: rect(15px, 9999px, 25px, 0);
            transform: translate(2px, 2px);
          }
          15% {
            clip: rect(25px, 9999px, 40px, 0);
            transform: translate(-2px, 2px);
          }
          20% {
            clip: rect(0, 9999px, 40px, 0);
            transform: translate(2px, -2px);
          }
          100% {
            clip: rect(0, 9999px, 0, 0);
            transform: translate(0, 0);
          }
        }
        .animate-\[glitch_1s_infinite\] {
          animation: glitch 1s infinite;
        }
      `}</style>
    </div>
  );
}
