import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react";

export default function Home() {
  return (
    <main 
      className="flex min-h-screen flex-col items-center justify-start p-24 
                 bg-gray-900 text-white font-mono relative overflow-hidden"
      style={{
        backgroundImage: "url('/Globebg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay to make it less bright */}
      <div className="absolute inset-0 bg-black/90"></div>

      {/* Content above overlay */}
  {/* To move the input and button higher, add a negative margin-top here, e.g. mt-[-40px] */}
  <div className="relative z-10 flex flex-col items-center mt-[220px]">
        <h1 className="text-3xl font-bold mb-5 tracking-wide text-purple-500 ml-1">
        Ghost Query
      </h1>

      {/*
        The input and button are wrapped in a flex container with group and focus-within classes.
        This ensures that when either the input or button is focused, the entire wrapper glows (unified focus ring),
        making the UI feel visually connected and accessible.
        The input and button have matching border colors and no double border between them (input: border-r-0, button: border-l-0).
        The input has a dim white border by default, which brightens slightly on hover/focus.
        The button only glows on focus/click, not on hover, for a subtle and unified effect.
      */}
  <div className="flex w-full max-w-lg group focus-within:ring-2 focus-within:ring-white/30 rounded">
    <Input
      type="text"
      placeholder="Search..."
      className="w-80 rounded-r-none bg-transparent text-white placeholder-gray-400 border border-white/40 border-r-0 focus:ring-2 focus:ring-white/30 focus:border-white/60 hover:border-white/40 transition-colors"
    />
    <Button
      className="rounded-l-none bg-transparent border border-l-0 border-white/40 text-white hover:bg-gray-800/80 focus:border-white/60 focus:ring-2 focus:ring-white/30 hover:border-white/40 transition-colors"
      type="submit"
    >
      <Search className="w-5 h-5" />
    </Button>
</div>
      </div>
    </main>
  )
}
