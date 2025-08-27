// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GhostQuery",
  description: "Search the open web with style",
    icons: {
    icon: "/ghost.png", // your new favicon
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative min-h-screen text-white">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src="/images/bg.png"
            alt="Background"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay to tone down brightness */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content goes here */}
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
