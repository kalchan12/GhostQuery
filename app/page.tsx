import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24
                     bg-gray-900 text-white font-mono">
      <h1 className="text-3xl font-bold mb-8 tracking-wide text-purple-500">
        Ghost Query
      </h1>

      <div className="flex w-full max-w-lg space-x-2">
        <Input 
          type="text" 
          placeholder="Search..." 
          className="rounded-r-none bg-gray-800 text-white placeholder-gray-400 border-gray-700"
        />
        <Button className="rounded-l-none bg-purple-600 hover:bg-purple-700 text-white">
          Search
        </Button>
      </div>
    </main>
  )
}
