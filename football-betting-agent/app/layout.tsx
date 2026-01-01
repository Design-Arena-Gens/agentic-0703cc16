import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Football Betting Agent - AI Match Analysis",
  description: "AI-powered football match analysis and betting recommendations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
