import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Property Exchange | Build confidence for your next exchange",
  description: "Explore exchange-related real estate strategies, investment access, education, and full-cycle examples from Property Exchange.",
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
      <body>{children}</body>
    </html>
  );
}
