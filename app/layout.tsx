import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const interTight = localFont({
  src: "../public/fonts/InterTight.ttf",
  variable: "--font-inter-tight",
  weight: "100 900",
  style: "normal",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

const patung = localFont({
  src: "../public/fonts/Patung.ttf",
  variable: "--font-patung",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fachrul & Tasya",
  description: "Share a moment from our wedding.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#152a16",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${interTight.variable} ${patung.variable}`}>
      <body className={interTight.className}>{children}</body>
    </html>
  );
}
