"use client";
import { useState, useEffect } from "react";

export default function GhostQuery() {
  const [status, setStatus] = useState<string[]>([
    "SYSTEM READY",
    "AWAITING USER INPUT...",
    "PRESS ENTER OR CLICK EXECUTE TO SEARCH",
  ]);
  const [query, setQuery] = useState("");
  const [processing, setProcessing] = useState(false);
  const [title, setTitle] = useState("");

  // Typing + glitch effect
 useEffect(() => {
  const text = "GHOSTQUERY"; 
  let index = 0;
  const glitchEffect = setInterval(() => {
    let glitchText = "";
    for (let i = 0; i < index; i++) {
      if (text[i] === " ") {
        glitchText += " ";
      } else {
        glitchText += Math.random() > 0.8 ? String.fromCharCode(33 + Math.random() * 94) : text[i];
      }
    }
    setTitle(glitchText);
    index++;
    if (index > text.length) clearInterval(glitchEffect);
  }, 120);
  return () => clearInterval(glitchEffect);
}, []);

  const executeSearch = (q: string) => {
    setProcessing(true);
    setStatus([
      "INITIALIZING SEARCH PROTOCOL...",
      `QUERY: ${q.toUpperCase()}`,
      "SCANNING DATABASES...",
    ]);

    setTimeout(() => {
      setStatus([
        "SEARCH COMPLETED SUCCESSFULLY",
        `RESULTS FOUND FOR: ${q.toUpperCase()}`,
        "READY FOR NEW QUERY",
      ]);
      setProcessing(false);
      setQuery("");

      setTimeout(() => {
        setStatus([
          "SYSTEM READY",
          "AWAITING USER INPUT...",
          "PRESS ENTER OR CLICK EXECUTE TO SEARCH",
        ]);
      }, 3000);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) executeSearch(query.trim());
    else
      setStatus([
        "ERROR: NO SEARCH PARAMETERS",
        "PLEASE ENTER A VALID QUERY",
        "SYSTEM READY",
      ]);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-[#00ff00] font-mono relative">
      {/* Scanline overlay */}
      <div className="pointer-events-none fixed inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,0,0.05)_2px,rgba(0,255,0,0.05)_4px)]" />

      <div className="w-[90%] max-w-[800px] relative z-10">
        {/* Header with glitch */}
        <div className="text-center mb-12 relative">
          <div className="text-5xl md:text-6xl tracking-wider mb-2 relative inline-block">
            <span className="absolute inset-0 text-[#ff00ff] mix-blend-screen animate-[glitch_1s_infinite]">{title}</span>
            <span className="relative">{title}</span>
          </div>
          <div className="text-lg text-[#008000] mb-2">SEARCH TERMINAL v2.1</div>
          <div className="text-sm text-[#008000]">LINUX TERMINAL MODE</div>
        </div>

        {/* Prompt */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-center text-lg mb-4 group">
            <span className="mr-2 drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]">
              kal@psycho:~$
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ENTER SEARCH QUERY"
              className="flex-1 bg-transparent outline-none text-[#00ff00] placeholder:text-[#008000]/70 placeholder:italic drop-shadow-[0_0_3px_rgba(0,255,0,0.5)] transition-all duration-200 group-hover:scale-105 group-hover:drop-shadow-[0_0_10px_rgba(0,255,0,0.8)]"
            />
            <div className="w-3 h-5 ml-1 bg-[#00ff00] animate-pulse shadow-[0_0_5px_rgba(0,255,0,0.5)]" />
          </div>
        </form>

        {/* Execute button */}
        <div className="text-center mb-8">
          <button
            onClick={(e) => {
              e.preventDefault();
              if (!processing) handleSubmit(e as any);
            }}
            disabled={processing}
            className={`px-6 py-2 uppercase tracking-wider border border-[#00ff00] shadow-[0_0_10px_rgba(0,255,0,0.3)] transition ${
              processing
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#00ff00] hover:text-black hover:shadow-[0_0_20px_rgba(0,255,0,0.7)]"
            }`}
          >
            {processing ? "PROCESSING..." : "EXECUTE"}
          </button>
        </div>

        {/* Status section */}
        <div className="border border-[#00ff00]/30 p-4 bg-[#00ff00]/5 shadow-[0_0_15px_rgba(0,255,0,0.3)]">
          {status.map((line, i) => (
            <div
              key={i}
              className={`mb-1 ${
                processing
                  ? "text-[#00ff00] drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]"
                  : "text-[#008000]"
              }`}
            >
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* Glitch animation keyframes */}
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
