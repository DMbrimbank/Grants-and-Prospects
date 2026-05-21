import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "BTS Grant & Partnerships Hub",
  description: "Discover, track, and manage grants and partnerships for Brimbank Tech School",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main className="min-h-screen pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
