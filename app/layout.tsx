import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Scan",
  description: "AI-powered scanning application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
