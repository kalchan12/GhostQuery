import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-full max-w-lg p-2 border border-gray-300 rounded-l-md text-black"
        />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md">
          Search
        </button>
      </div>
    </main>
  );
}