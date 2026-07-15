import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Property Exchange | Baker 1031",
  description: "Explore 1031 exchange strategies, investment opportunities, education, and the Baker 1031 employee workspace.",
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
