import type { Metadata } from "next";
import { Outfit, Bricolage_Grotesque, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RefreshRedirect from "@/components/RefreshRedirect";

const fontOutfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const fontBricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const fontMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {

  title: {
    template: '%s - Kotabaru Heritage Film Festival 2026',
    default: 'Kotabaru Heritage Film Festival 2026', // a default title for pages that don't have a title
  },
  description: "Kotabaru Heritage Film Festival. Merayakan sinema, arsitektur masa lampau, dan pengarsipan sejarah di jantung Yogyakarta.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "any" },
      { url: "/assets/logo-orange.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontOutfit.variable} ${fontBricolage.variable} ${fontMono.variable} antialiased dark`}
    >
      <body className="min-h-screen flex flex-col bg-khff-yellow text-khff-navy overflow-x-hidden w-full relative font-sans">
        <RefreshRedirect />
        <Navbar />
        <main className="flex-grow overflow-x-hidden w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
