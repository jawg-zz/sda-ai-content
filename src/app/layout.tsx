import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SDA Content Generator",
  description: "AI-powered content for Seventh-day Adventist Churches",
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
