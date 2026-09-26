import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coding Dolphin",
  description: "Build technical interview fluency one concept at a time.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
