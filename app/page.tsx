import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex items-center w-full max-w-lg">
        <Input 
          type="text" 
          placeholder="Search..." 
          className="rounded-r-none"
        />
        <Button className="rounded-l-none">
          Search
        </Button>
      </div>
    </main>
  )
}
