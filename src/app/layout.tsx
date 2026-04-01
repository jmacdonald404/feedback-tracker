import type { Metadata } from "next";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Feedback Tracker",
  description: "Submit, track, and vote on feedback and feature requests",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
