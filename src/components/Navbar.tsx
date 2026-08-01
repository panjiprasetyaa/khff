"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ExternalLink } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const gFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSe5QTD0-Anc64hxcO5rcslJgYxc2HlhjGOUbXmv6Jig_PNQSA/viewform?usp=publish-editor";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-sans ${
        isScrolled
          ? "bg-khff-navy/95 backdrop-blur-md py-4 shadow-2xl border-b border-khff-cream/20 text-khff-cream"
          : "bg-transparent py-6 text-khff-cream"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-3xl font-serif font-black tracking-tight transition-transform group-hover:scale-105">
            KHFF<span className="text-khff-pink">.</span>
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono font-bold leading-tight tracking-widest uppercase opacity-80 pl-2 border-l border-current">
            Kotabaru Heritage<br/>Film Festival
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-sm font-mono font-bold tracking-wider items-center">
          <Link href="/" className="hover:text-khff-yellow transition-colors">
            HOME
          </Link>
          <Link href="/program" className="hover:text-khff-yellow transition-colors">
            PROGRAMS
          </Link>
          <a href="/festival-guide.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-khff-yellow transition-colors">
            FESTIVAL GUIDE
          </a>
          <Link href="/galeri" className="hover:text-khff-yellow transition-colors">
            GALERI
          </Link>
          <Link href="/jadwal" className="hover:text-khff-yellow transition-colors">
            JADWAL
          </Link>
          <a 
            href={gFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 bg-khff-yellow text-khff-navy font-black hover:bg-white"
          >
            <span>REGISTRASI</span>
            <ExternalLink size={14} />
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden focus:outline-none p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-khff-navy/95 text-khff-cream backdrop-blur-xl border-b border-khff-cream/20 flex flex-col p-8 space-y-6 text-center shadow-2xl min-h-screen">
          <Link
            href="/"
            className="text-2xl font-serif font-bold hover:text-khff-yellow transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            HOME
          </Link>
          <Link
            href="/program"
            className="text-2xl font-serif font-bold hover:text-khff-yellow transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            PROGRAMS
          </Link>
          <a
            href="/festival-guide.pdf"
            target="_blank" rel="noopener noreferrer"
            className="text-2xl font-serif font-bold hover:text-khff-yellow transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            FESTIVAL GUIDE
          </a>
          <Link
            href="/galeri"
            className="text-2xl font-serif font-bold hover:text-khff-yellow transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            GALERI
          </Link>
          <Link
            href="/jadwal"
            className="text-2xl font-serif font-bold hover:text-khff-yellow transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            JADWAL
          </Link>
          <a
            href={gFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-mono font-black text-khff-navy bg-khff-yellow px-8 py-4 rounded-full hover:bg-white transition-colors mx-auto inline-flex items-center gap-2 mt-4 shadow-xl"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span>REGISTRASI</span>
            <ExternalLink size={18} />
          </a>
        </div>
      )}
    </nav>
  );
}
