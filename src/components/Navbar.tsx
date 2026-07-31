"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/70 backdrop-blur-md py-4 shadow-lg"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-serif font-bold tracking-wider text-white">
          KHFF.
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-sm font-medium tracking-wide items-center">
          <Link href="/" className="text-gray-300 hover:text-white transition-colors">
            HOME
          </Link>
          <Link href="/program" className="text-gray-300 hover:text-white transition-colors">
            PROGRAMS
          </Link>
          <a href="/festival-guide.pdf" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
            FESTIVAL GUIDE
          </a>
          <Link href="/galeri" className="text-gray-300 hover:text-white transition-colors">
            GALERI
          </Link>
          <Link
            href="/jadwal"
            className="text-white border border-white/30 px-4 py-2 rounded-full hover:bg-white hover:text-black transition-colors"
          >
            JADWAL
          </Link>
          <Link href="/registrasi" className="text-gray-300 hover:text-white transition-colors flex items-center">
            REGISTRASI
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 flex flex-col p-6 space-y-6 text-center h-screen">
          <Link
            href="/"
            className="text-lg text-gray-300 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            HOME
          </Link>
          <Link
            href="/program"
            className="text-lg text-gray-300 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            PROGRAMS
          </Link>
          <a
            href="/festival-guide.pdf"
            target="_blank" rel="noopener noreferrer"
            className="text-lg text-gray-300 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            FESTIVAL GUIDE
          </a>
          <Link
            href="/galeri"
            className="text-lg text-gray-300 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            GALERI
          </Link>
          <Link
            href="/jadwal"
            className="text-lg text-gray-300 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            JADWAL
          </Link>
          <Link
            href="/registrasi"
            className="text-lg text-black bg-white px-6 py-3 rounded-full hover:bg-gray-200 transition-colors mx-auto inline-block mt-4"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            REGISTRASI
          </Link>
        </div>
      )}
    </nav>
  );
}
