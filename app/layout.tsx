import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HomeRelay · A little help, right on time",
  description: "Shared tasks, clear handoffs, and a calmer home.",
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
