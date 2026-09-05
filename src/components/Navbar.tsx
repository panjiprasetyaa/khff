"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dropdown states
  const [activeDesktopDropdown, setActiveDesktopDropdown] = useState<"tentang" | "arsip" | null>(null);
  const [mobileAboutOpen, setMobileAboutOpen] = useState<boolean | null>(null);
  const [mobileArsipOpen, setMobileArsipOpen] = useState<boolean | null>(null);

  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  // Active state helpers
  const isHomeActive = pathname === "/";
  const isAboutActive = pathname === "/about" || pathname === "/festival-team";
  const isProgramActive = pathname.startsWith("/program");
  const isArsipActive = pathname === "/galeri" || pathname === "/katalog";

  // Derived mobile open state (defaults to true if user is on that route, or follows user toggle)
  const isMobileAboutOpen = mobileAboutOpen !== null ? mobileAboutOpen : isAboutActive;
  const isMobileArsipOpen = mobileArsipOpen !== null ? mobileArsipOpen : isArsipActive;

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
    setActiveDesktopDropdown(null);
  };

  // const gFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSe5QTD0-Anc64hxcO5rcslJgYxc2HlhjGOUbXmv6Jig_PNQSA/viewform?usp=publish-editor";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside detection to dismiss desktop dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDesktopDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveDesktopDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Hover handlers with debounce
  const handleMouseEnter = (menu: "tentang" | "arsip") => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDesktopDropdown(menu);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDesktopDropdown(null);
    }, 150);
  };

  const toggleDesktopDropdown = (menu: "tentang" | "arsip") => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDesktopDropdown((prev) => (prev === menu ? null : menu));
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-sans ${
        isScrolled
          ? "bg-khff-navy/95 backdrop-blur-md py-4 shadow-2xl border-b border-khff-cream/20 text-khff-cream"
          : "bg-transparent py-6 text-khff-cream"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center max-w-7xl">
        {/* Logo */}
        <Link href="/" onClick={handleNavClick} className="flex items-center group">
          <img
            src="/assets/logo-orange.png"
            alt="Kotabaru Heritage Film Festival Logo"
            className="h-12 sm:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-5 lg:space-x-8 text-sm font-mono font-bold tracking-wider items-center">
          {/* BERANDA */}
          <Link
            href="/"
            onClick={handleNavClick}
            className={`hover:text-khff-yellow transition-colors ${
              isHomeActive ? "text-khff-yellow" : ""
            }`}
          >
            BERANDA
          </Link>

          {/* PROGRAM */}
          <Link
            href="/program"
            onClick={handleNavClick}
            className={`hover:text-khff-yellow transition-colors ${
              isProgramActive ? "text-khff-yellow" : ""
            }`}
          >
            PROGRAM
          </Link>

          {/* TENTANG KAMI DROPDOWN */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("tentang")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => toggleDesktopDropdown("tentang")}
              className={`flex items-center gap-1.5 hover:text-khff-yellow transition-colors py-1 cursor-pointer font-mono font-bold tracking-wider ${
                isAboutActive ? "text-khff-yellow" : ""
              }`}
              aria-expanded={activeDesktopDropdown === "tentang"}
            >
              <span>TENTANG KAMI</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  activeDesktopDropdown === "tentang" ? "rotate-180 text-khff-yellow" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            <div
              className={`absolute top-full left-0 pt-2 min-w-[200px] transition-all duration-200 z-50 ${
                activeDesktopDropdown === "tentang"
                  ? "opacity-100 visible translate-y-0 pointer-events-auto"
                  : "opacity-0 invisible -translate-y-2 pointer-events-none"
              }`}
            >
              <div className="bg-khff-navy/95 backdrop-blur-md border border-khff-cream/20 shadow-2xl rounded-xl p-2 flex flex-col gap-1">
                <Link
                  href="/about"
                  onClick={handleNavClick}
                  className={`px-4 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-colors flex items-center justify-between ${
                    pathname === "/about"
                      ? "bg-khff-teal/50 text-khff-yellow"
                      : "hover:bg-khff-teal/30 hover:text-khff-yellow text-khff-cream"
                  }`}
                >
                  <span>TENTANG KAMI</span>
                </Link>
                <Link
                  href="/festival-team"
                  onClick={handleNavClick}
                  className={`px-4 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-colors flex items-center justify-between ${
                    pathname === "/festival-team"
                      ? "bg-khff-teal/50 text-khff-yellow"
                      : "hover:bg-khff-teal/30 hover:text-khff-yellow text-khff-cream"
                  }`}
                >
                  <span>TIM FESTIVAL</span>
                </Link>
              </div>
            </div>
          </div>

          {/* ARSIP DROPDOWN (GALERI & KATALOG) */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("arsip")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => toggleDesktopDropdown("arsip")}
              className={`flex items-center gap-1.5 hover:text-khff-yellow transition-colors py-1 cursor-pointer font-mono font-bold tracking-wider ${
                isArsipActive ? "text-khff-yellow" : ""
              }`}
              aria-expanded={activeDesktopDropdown === "arsip"}
            >
              <span>ARSIP</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  activeDesktopDropdown === "arsip" ? "rotate-180 text-khff-yellow" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            <div
              className={`absolute top-full left-0 pt-2 min-w-[190px] transition-all duration-200 z-50 ${
                activeDesktopDropdown === "arsip"
                  ? "opacity-100 visible translate-y-0 pointer-events-auto"
                  : "opacity-0 invisible -translate-y-2 pointer-events-none"
              }`}
            >
              <div className="bg-khff-navy/95 backdrop-blur-md border border-khff-cream/20 shadow-2xl rounded-xl p-2 flex flex-col gap-1">
                <Link
                  href="/galeri"
                  onClick={handleNavClick}
                  className={`px-4 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-colors flex items-center justify-between ${
                    pathname === "/galeri"
                      ? "bg-khff-teal/50 text-khff-yellow"
                      : "hover:bg-khff-teal/30 hover:text-khff-yellow text-khff-cream"
                  }`}
                >
                  <span>GALERI</span>
                </Link>
                <Link
                  href="/katalog"
                  onClick={handleNavClick}
                  className={`px-4 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-colors flex items-center justify-between ${
                    pathname === "/katalog"
                      ? "bg-khff-teal/50 text-khff-yellow"
                      : "hover:bg-khff-teal/30 hover:text-khff-yellow text-khff-cream"
                  }`}
                >
                  <span>KATALOG</span>
                </Link>
              </div>
            </div>
          </div>

          {/*
          <Link href="/jadwal" className="hover:text-khff-yellow transition-colors">
            JADWAL
          </Link>
          */}
          {/* 
          <a href="/festival-guide.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-khff-yellow transition-colors">
            FESTIVAL GUIDE
          </a> 
          */}
          {/* 
          <a 
            href={gFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 bg-khff-yellow text-khff-navy font-black hover:bg-white"
          >
            <span>REGISTRASI</span>
            <ExternalLink size={14} />
          </a>
          */}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden focus:outline-none p-2 cursor-pointer"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-khff-navy text-khff-cream flex flex-col p-8 text-center shadow-2xl min-h-screen overflow-y-auto animate-in fade-in duration-200">
          <div className="flex flex-col divide-y divide-khff-cream/10 border-b border-khff-cream/10">
            {/* BERANDA */}
            <Link
              href="/"
              className={`text-2xl font-serif font-bold hover:text-khff-yellow transition-colors py-5 ${
                isHomeActive ? "text-khff-yellow" : ""
              }`}
              onClick={handleNavClick}
            >
              BERANDA
            </Link>

            {/* PROGRAM */}
            <Link
              href="/program"
              className={`text-2xl font-serif font-bold hover:text-khff-yellow transition-colors py-5 ${
                isProgramActive ? "text-khff-yellow" : ""
              }`}
              onClick={handleNavClick}
            >
              PROGRAM
            </Link>

            {/* TENTANG KAMI ACCORDION */}
            <div className="flex flex-col py-3">
              <button
                onClick={() => setMobileAboutOpen(!isMobileAboutOpen)}
                className="flex items-center justify-center gap-2 text-2xl font-serif font-bold hover:text-khff-yellow transition-colors py-2 cursor-pointer"
              >
                <span className={isAboutActive ? "text-khff-yellow" : ""}>TENTANG KAMI</span>
                <ChevronDown
                  size={20}
                  className={`transition-transform duration-300 ${
                    isMobileAboutOpen ? "rotate-180 text-khff-yellow" : ""
                  }`}
                />
              </button>
              {isMobileAboutOpen && (
                <div className="flex flex-col gap-2 py-3 bg-khff-navy/60 rounded-xl my-2 border border-khff-cream/10 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    href="/about"
                    className={`text-base font-mono font-bold uppercase tracking-wider py-2.5 hover:text-khff-yellow transition-colors ${
                      pathname === "/about" ? "text-khff-yellow font-black" : "text-khff-cream/80"
                    }`}
                    onClick={handleNavClick}
                  >
                    TENTANG KAMI
                  </Link>
                  <Link
                    href="/festival-team"
                    className={`text-base font-mono font-bold uppercase tracking-wider py-2.5 hover:text-khff-yellow transition-colors ${
                      pathname === "/festival-team" ? "text-khff-yellow font-black" : "text-khff-cream/80"
                    }`}
                    onClick={handleNavClick}
                  >
                    TIM FESTIVAL
                  </Link>
                </div>
              )}
            </div>

            {/* ARSIP ACCORDION (GALERI & KATALOG) */}
            <div className="flex flex-col py-3">
              <button
                onClick={() => setMobileArsipOpen(!isMobileArsipOpen)}
                className="flex items-center justify-center gap-2 text-2xl font-serif font-bold hover:text-khff-yellow transition-colors py-2 cursor-pointer"
              >
                <span className={isArsipActive ? "text-khff-yellow" : ""}>ARSIP</span>
                <ChevronDown
                  size={20}
                  className={`transition-transform duration-300 ${
                    isMobileArsipOpen ? "rotate-180 text-khff-yellow" : ""
                  }`}
                />
              </button>
              {isMobileArsipOpen && (
                <div className="flex flex-col gap-2 py-3 bg-khff-navy/60 rounded-xl my-2 border border-khff-cream/10 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    href="/galeri"
                    className={`text-base font-mono font-bold uppercase tracking-wider py-2.5 hover:text-khff-yellow transition-colors ${
                      pathname === "/galeri" ? "text-khff-yellow font-black" : "text-khff-cream/80"
                    }`}
                    onClick={handleNavClick}
                  >
                    GALERI
                  </Link>
                  <Link
                    href="/katalog"
                    className={`text-base font-mono font-bold uppercase tracking-wider py-2.5 hover:text-khff-yellow transition-colors ${
                      pathname === "/katalog" ? "text-khff-yellow font-black" : "text-khff-cream/80"
                    }`}
                    onClick={handleNavClick}
                  >
                    KATALOG
                  </Link>
                </div>
              )}
            </div>

            {/*
            <Link
              href="/jadwal"
              className="text-2xl font-serif font-bold hover:text-khff-yellow transition-colors py-5"
              onClick={handleNavClick}
            >
              JADWAL
            </Link>
            */}
            {/*
            <a
              href="/festival-guide.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-serif font-bold hover:text-khff-yellow transition-colors py-5"
              onClick={handleNavClick}
            >
              FESTIVAL GUIDE
            </a>
            */}
          </div>
          {/*
          <a
            href={gFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-mono font-black text-khff-navy bg-khff-yellow px-8 py-4 rounded-full hover:bg-white transition-colors mx-auto inline-flex items-center gap-2 mt-8 shadow-xl"
            onClick={handleNavClick}
          >
            <span>REGISTRASI</span>
            <ExternalLink size={18} />
          </a>
          */}
        </div>
      )}
    </nav>
  );
}
