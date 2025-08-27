import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
        <h1 className="text-3xl font-bold mb-8 tracking-wide text-purple-500">
          Ghost Query
        </h1>

        <div className="flex w-full max-w-lg space-x-2">
      
      <Input
        type="text"
        placeholder="Search..."
        className="w-80 rounded-r-none bg-transparent text-white placeholder-gray-400 border-gray-700" // Increased width
      />
          <Button className="rounded-l-none  bg-purple-600 hover:bg-purple-700 text-white">
            Search
          </Button>
        </div>
      </div>
    </main>
  )
}
