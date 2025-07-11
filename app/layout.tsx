import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Word Cloud Generator",
  description: "Generate beautiful word clouds from your text",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
