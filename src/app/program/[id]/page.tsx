"use client";

import { use, useState, useEffect } from "react";
import { programs } from "@/data/dummy";
import { notFound, redirect } from "next/navigation";
import FilmCard from "@/components/FilmCard";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
  ChevronRight,
  Ticket,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import { nonPemutaranEvents } from "@/data/non-pemutaran";
import ProgramBookingModal from "@/components/ProgramBookingModal";

export default function ProgramDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  if (["director-talks", "heritage-talks", "workshop-stop-motion"].includes(id)) {
    redirect(`/program/non-pemutaran/${id}`);
  }
  
  // Tab States
  const [activeKompetisiTab, setActiveKompetisiTab] = useState("purwaseswa");
  const [activeNonKompetisiTab, setActiveNonKompetisiTab] = useState("khff-panorama");

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingEventId, setBookingEventId] = useState<string | undefined>(undefined);

  const openBooking = (eventId?: string) => {
    setBookingEventId(eventId);
    setBookingModalOpen(true);
  };

  useEffect(() => {
    const syncTabFromUrl = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const tabParam = searchParams.get("tab");
      if (tabParam) {
        if (["purwaseswa", "karyanagri", "mahaditya"].includes(tabParam)) {
          setActiveKompetisiTab(tabParam);
        } else if (["khff-panorama", "heritage-in-indonesian-cinema", "heritage-in-experimental-cinema"].includes(tabParam)) {
          setActiveNonKompetisiTab(tabParam);
        }
      }
    };

    window.addEventListener("popstate", syncTabFromUrl);
    const timer = setTimeout(syncTabFromUrl, 0);

    return () => {
      window.removeEventListener("popstate", syncTabFromUrl);
      clearTimeout(timer);
    };
  }, []);

  const handleKompetisiTabChange = (tabId: string) => {
    setActiveKompetisiTab(tabId);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tabId);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const handleNonKompetisiTabChange = (tabId: string) => {
    setActiveNonKompetisiTab(tabId);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tabId);
      window.history.replaceState({}, "", url.toString());
    }
  };

  // 1. PROGRAM KOMPETISI
  if (id === "kompetisi") {
    const tabs = [
      { id: "purwaseswa", label: "Purwaseswa", desc: "Purwaseswa berarti tingkat dasar dalam struktur pendidikan (pelajar). Kata “purwa” berarti awal, sementara “seswa” berarti murid/pelajar. Program ini adalah program kompetisi yang berfokus pada karya-karya film bermuatan warisan budaya yang dibuat oleh pelajar di Indonesia." },
      { id: "karyanagri", label: "Karyanagri", desc: "Karyanagri berarti karya pemerintah/negara. Program ini adalah program kompetisi yang mewadahi berbagai karya film bermuatan warisan budaya di Indonesia yang didukung oleh pemerintah pusat dan merepresentasikan sudut pandang nasional." },
      { id: "mahaditya", label: "Mahaditya", desc: "Mahaditya berarti yang paling terang. Program ini adalah program kompetisi yang berkonsentrasi kepada suara independen untuk menyajikan narasi warisan budaya secara sinematik. Mahaditya membawa semangat demokratisasi sudut pandang, menggarisbawahi keunikan, kesegaran, dan kedaulatan." },
    ];
    const currentProgram = programs.find((p) => p.id === activeKompetisiTab);
    const activeTabInfo = tabs.find((t) => t.id === activeKompetisiTab);

    return (
      <main className="min-h-screen bg-khff-navy text-khff-cream font-sans relative overflow-hidden">
        
        {/* HEADER AREA (CINEMATIC GREEN-TO-YELLOW GRADIENT) */}
        <section className="pt-36 pb-24 px-6 bg-gradient-to-b from-khff-navy via-[#23585a] to-khff-yellow text-khff-cream relative z-10 w-full">
          <div className="container mx-auto max-w-7xl">
            <Link href="/program" className="inline-flex items-center gap-2 bg-khff-navy/80 border border-khff-cream/20 px-5 py-2 rounded-full text-khff-cream hover:bg-khff-yellow hover:text-khff-navy font-mono mb-8 transition-all text-sm font-black shadow-lg">
              <ArrowLeft size={16} /> KEMBALI KE DAFTAR PROGRAM
            </Link>
            <div className="max-w-4xl relative">
              <div className="inline-block bg-khff-yellow text-khff-navy px-4 py-1.5 rounded-full mb-6 font-mono font-black text-xs uppercase tracking-[0.2em] shadow-xl">
                Festival Competition 2026
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black text-khff-cream mb-6 tracking-tight drop-shadow-lg">
                Program Kompetisi
              </h1>
              <p className="text-xl md:text-2xl text-khff-cream/95 font-medium leading-relaxed drop-shadow">
                Pemutaran film hasil submisi terbuka yang telah melalui proses kurasi, sekaligus menjadi ruang kompetisi bagi sineas untuk memperebutkan penghargaan dalam berbagai kategori.
              </p>
            </div>
          </div>
        </section>

        {/* CONTENT AREA (NAVY GREEN THEATER BACKGROUND) */}
        <section className="bg-khff-navy text-khff-cream p-5 sm:p-8 md:p-20 shadow-2xl border-t-8 border-khff-pink relative z-20 overflow-hidden -mt-12">
          {/* Floating Background Assets */}
          <div className="absolute bottom-0 left-0 w-full pointer-events-none z-0 overflow-hidden">
            <img src="/assets/illustrations/geni.png" alt="Geni" className="w-full h-auto object-cover object-bottom opacity-15 mix-blend-screen translate-y-1/4 scale-110" />
          </div>
          
          <div className="container mx-auto max-w-7xl relative z-10">
            {/* TAB BUTTONS */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-10 sm:mb-12 border-b border-khff-cream/10 pb-6 sm:pb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleKompetisiTabChange(tab.id)}
                  className={`px-5 sm:px-8 py-3 sm:py-4 rounded-2xl font-serif font-black text-lg sm:text-xl md:text-2xl transition-all duration-300 shadow-lg cursor-pointer ${
                    activeKompetisiTab === tab.id
                      ? "bg-khff-yellow text-khff-navy scale-105 shadow-[0_0_25px_rgba(236,172,45,0.4)]"
                      : "bg-white/5 text-khff-cream/60 hover:bg-white/10 hover:text-khff-cream"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ACTIVE TAB DESCRIPTION */}
            {activeTabInfo && (
              <div className="bg-white/5 border-l-4 border-khff-yellow p-5 sm:p-8 rounded-2xl sm:rounded-r-3xl mb-10 sm:mb-12 backdrop-blur-sm max-w-5xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-khff-yellow/20 text-khff-yellow font-mono text-xs font-black uppercase tracking-wider mb-2 border border-khff-yellow/30">
                    <span className="w-2 h-2 rounded-full bg-green-400" /> Sesi Kompetisi • Kuota 30 Slot
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-khff-yellow mb-2">Program {activeTabInfo.label}</h2>
                  <p className="text-khff-cream/90 text-base sm:text-lg font-medium leading-relaxed">{activeTabInfo.desc}</p>
                </div>
                <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
                  <button
                    onClick={() => openBooking(`kompetisi-${activeKompetisiTab}`)}
                    className="px-7 py-3.5 rounded-full bg-khff-yellow text-khff-navy font-mono font-black text-xs uppercase tracking-wider hover:bg-white hover:scale-105 transition-all shadow-xl inline-flex items-center gap-2.5 cursor-pointer"
                  >
                    <Ticket size={16} />
                    <span>Registrasi di Sini</span>
                  </button>
                  <span className="text-[11px] font-mono text-khff-cream/60">
                    Kapasitas: 30 Kursi per Sesi
                  </span>
                </div>
              </div>
            )}

            {/* FILM LIST GRID */}
            <div>
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-2xl font-serif font-black text-white">Daftar Karya Seleksi ({currentProgram?.films.length || 0} Film)</h3>
              </div>
              
              {currentProgram && currentProgram.films.length > 0 ? (
                 <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-12">
                   {currentProgram.films.map((film) => (
                     <FilmCard key={film.id} film={film} programId={activeKompetisiTab} />
                   ))}
                 </div>
              ) : (
                 <div className="py-24 text-center bg-white/5 rounded-3xl border border-khff-cream/10">
                   <p className="text-khff-cream/50 text-lg font-mono">Daftar film untuk program ini akan segera diumumkan.</p>
                 </div>
              )}
            </div>
          </div>
        </section>

        <ProgramBookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          initialEventId={bookingEventId}
        />
      </main>
    );
  }

  // 2. PROGRAM NON-KOMPETISI
  if (id === "non-kompetisi") {
    const tabs = [
      {
        id: "khff-panorama",
        label: "KHFF Panorama",
        badge: "Curated Selection",
        desc: "Program pemutaran kuratorial yang merayakan spektrum luas sinema dengan ragam narasi, kekayaan perspektif kultural, dan kebaruan estetika sinematik."
      },
      {
        id: "heritage-in-indonesian-cinema",
        label: "Heritage in Indonesian Cinema",
        badge: "National Showcase",
        desc: "Sorotan kuratorial pada khazanah karya sinema Indonesia yang merefleksikan nilai-nilai luhur, dinamika sosio-kultural, serta memori kolektif bangsa."
      },
      {
        id: "heritage-in-experimental-cinema",
        label: "Heritage in Experimental Cinema",
        badge: "Experimental Showcase",
        desc: "Eksplorasi sinema non-konvensional dan bahasa audiovisual eksperimental dalam merespons, merekonstruksi, serta merayakan warisan tradisi."
      },
    ];
    const activeTabInfo = tabs.find((t) => t.id === activeNonKompetisiTab) || tabs[0];
    const currentProgram = programs.find((p) => p.id === activeNonKompetisiTab);

    return (
      <main className="min-h-screen bg-khff-navy text-khff-cream font-sans relative overflow-hidden">
        
        {/* HEADER AREA (CINEMATIC GREEN-TO-YELLOW GRADIENT) */}
        <section className="pt-36 pb-24 px-6 bg-gradient-to-b from-khff-navy via-[#23585a] to-khff-yellow text-khff-cream relative z-10 w-full">
          <div className="container mx-auto max-w-7xl">
            <Link href="/program" className="inline-flex items-center gap-2 bg-khff-navy/80 border border-khff-cream/20 px-5 py-2 rounded-full text-khff-cream hover:bg-khff-yellow hover:text-khff-navy font-mono mb-8 transition-all text-sm font-black shadow-lg">
              <ArrowLeft size={16} /> KEMBALI KE DAFTAR PROGRAM
            </Link>
            
            <div className="max-w-4xl relative">
              <div className="inline-block bg-khff-pink text-white px-4 py-1.5 rounded-full mb-6 font-mono font-black text-xs uppercase tracking-[0.2em] shadow-xl">
                Heritage & Special Screenings
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black text-khff-cream mb-6 tracking-tight drop-shadow-lg">
                Program Non-Kompetisi
              </h1>
              <p className="text-xl md:text-2xl text-khff-cream/95 font-medium leading-relaxed drop-shadow">
                Pemutaran film pilihan yang mengeksplorasi cerita, tradisi, dan kehidupan yang membentuk warisan budaya.
              </p>
            </div>
          </div>
        </section>

        {/* CONTENT AREA (NAVY GREEN THEATER BACKGROUND) */}
        <section className="bg-khff-navy text-khff-cream p-5 sm:p-8 md:p-20 shadow-2xl border-t-8 border-khff-pink relative z-20 overflow-hidden -mt-12">
          {/* Floating Background Assets */}
          <div className="absolute bottom-0 left-0 w-full pointer-events-none z-0 overflow-hidden">
            <img src="/assets/illustrations/geni.png" alt="Geni" className="w-full h-auto object-cover object-bottom opacity-15 mix-blend-screen translate-y-1/4 scale-110" />
          </div>
          
          <div className="container mx-auto max-w-7xl relative z-10">
            
            {/* TAB BUTTONS */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-10 sm:mb-12 border-b border-khff-cream/10 pb-6 sm:pb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleNonKompetisiTabChange(tab.id)}
                  className={`px-5 sm:px-7 py-3 sm:py-4 rounded-2xl text-left transition-all duration-300 shadow-lg cursor-pointer ${
                    activeNonKompetisiTab === tab.id
                      ? "bg-khff-pink text-white scale-105 shadow-[0_0_25px_rgba(235,93,121,0.4)]"
                      : "bg-white/5 text-khff-cream/60 hover:bg-white/10 hover:text-khff-cream"
                  }`}
                >
                  <span className="block text-[10px] sm:text-xs font-mono uppercase opacity-80 mb-1 font-black">{tab.badge}</span>
                  <span className="font-serif font-black text-lg sm:text-xl md:text-2xl block">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* ACTIVE TAB DESCRIPTION */}
            <div className="bg-white/5 border-l-4 border-khff-pink p-5 sm:p-8 rounded-2xl sm:rounded-r-3xl mb-10 sm:mb-12 backdrop-blur-sm max-w-4xl shadow-xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[11px] font-mono uppercase font-black px-3 py-1 rounded-full bg-khff-pink/20 text-khff-pink border border-khff-pink/40">
                  {activeTabInfo.badge}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-white mb-3">{activeTabInfo.label}</h2>
              <p className="text-khff-cream/90 text-base sm:text-lg md:text-xl font-medium leading-relaxed">{activeTabInfo.desc}</p>
            </div>

            {/* FILM LIST PER SESSION OR STANDARD GRID OR COMING SOON */}
            {currentProgram?.sessions && currentProgram.sessions.length > 0 ? (
              <div className="space-y-12 sm:space-y-16">
                {currentProgram.sessions.map((session, sIdx) => (
                  <div
                    key={session.id}
                    className="bg-white/[0.03] border border-khff-cream/15 rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl backdrop-blur-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 sm:mb-10 border-b border-khff-cream/10">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-khff-pink/20 text-khff-pink font-mono font-black text-xs uppercase tracking-wider mb-2.5 border border-khff-pink/30">
                          <span className="w-2 h-2 rounded-full bg-green-400" /> Sesi {sIdx + 1} • Kuota 30 Slot
                        </div>
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-white">
                          {session.title}
                        </h3>
                        {session.subtitle && (
                          <p className="text-khff-yellow font-mono text-sm sm:text-base font-bold mt-1.5 tracking-wide">
                            {session.subtitle}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <span className="text-xs sm:text-sm font-mono text-khff-cream/60">
                          <span className="font-bold text-khff-cream">{session.films?.length || 0} Film Terpilih</span>
                        </span>
                        <button
                          onClick={() => {
                            const eventMap: Record<string, string> = {
                              "heritage-in-indonesian-cinema-1": "nonkomp-indonesian-cinema-1",
                              "heritage-in-indonesian-cinema-2": "nonkomp-indonesian-cinema-2",
                              "heritage-in-experimental-cinema-1": "nonkomp-experimental-cinema-1",
                              "heritage-in-experimental-cinema-2": "nonkomp-experimental-cinema-2",
                            };
                            openBooking(eventMap[session.id] || "nonkomp-panorama");
                          }}
                          className="px-5 py-2.5 rounded-full bg-khff-yellow text-khff-navy font-mono font-black text-xs uppercase tracking-wider hover:bg-white hover:scale-105 transition-all shadow-lg inline-flex items-center gap-2 cursor-pointer shrink-0"
                        >
                          <Ticket size={15} />
                          <span>Registrasi di Sini</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-12">
                      {session.films?.map((film) => (
                        <FilmCard key={film.id} film={film} programId={activeNonKompetisiTab} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : currentProgram && currentProgram.films.length > 0 ? (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <h3 className="text-2xl sm:text-3xl font-serif font-black text-white">
                    Daftar Karya Seleksi ({currentProgram.films.length} Film)
                  </h3>
                  <button
                    onClick={() => openBooking("nonkomp-panorama")}
                    className="px-6 py-3 rounded-full bg-khff-yellow text-khff-navy font-mono font-black text-xs uppercase tracking-wider hover:bg-white hover:scale-105 transition-all shadow-lg inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Ticket size={16} />
                    <span>Registrasi di Sini</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-12">
                  {currentProgram.films.map((film) => (
                    <FilmCard key={film.id} film={film} programId={activeNonKompetisiTab} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="relative rounded-3xl overflow-hidden border-2 border-khff-pink/30 bg-gradient-to-br from-khff-pink/15 via-white/[0.03] to-khff-yellow/10 p-6 sm:p-8 md:p-16 backdrop-blur-md shadow-2xl">
                <div className="max-w-3xl mx-auto text-center relative z-10">
                  <h3 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black text-white mb-6 leading-tight">
                    Kurasi Film Sesi {activeTabInfo.label}
                  </h3>

                  <p className="text-khff-cream/85 text-base sm:text-lg md:text-xl font-medium leading-relaxed mb-8 sm:mb-12">
                    Daftar karya film pilihan dan jadwal penayangan untuk program ini sedang dalam tahap kurasi akhir oleh tim festival. Informasi penayangan lengkap akan segera diumumkan.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                    <Link
                      href="/program/kompetisi"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-khff-yellow text-khff-navy hover:bg-khff-yellow/90 font-mono font-black text-xs sm:text-sm uppercase tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl shadow-xl hover:scale-105 transition-all"
                    >
                      <span>Lihat Film Program Kompetisi</span>
                      <ArrowRight size={18} />
                    </Link>
                    <Link
                      href="/jadwal"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs sm:text-sm uppercase tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl border border-white/20 transition-all"
                    >
                      <span>Jadwal Festival</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <ProgramBookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          initialEventId={bookingEventId}
        />
      </main>
    );
  }

  // 3. PROGRAM NON-PEMUTARAN (Workshop, Director Talks, Heritage Talks)
  if (id === "non-pemutaran") {
    return (
      <main className="min-h-screen bg-khff-navy text-khff-cream font-sans relative overflow-hidden">
        {/* HEADER AREA (CINEMATIC GREEN-TO-YELLOW GRADIENT) */}
        <section className="pt-36 pb-24 px-6 bg-gradient-to-b from-khff-navy via-[#23585a] to-khff-yellow text-khff-cream relative z-10 w-full">
          <div className="container mx-auto max-w-7xl">
            <Link
              href="/program"
              className="inline-flex items-center gap-2 bg-khff-navy/80 border border-khff-cream/20 px-5 py-2 rounded-full text-khff-cream hover:bg-khff-yellow hover:text-khff-navy font-mono mb-8 transition-all text-sm font-black shadow-lg"
            >
              <ArrowLeft size={16} /> KEMBALI KE DAFTAR PROGRAM
            </Link>

            <div className="max-w-4xl relative">
              <div className="inline-block bg-khff-yellow text-khff-navy px-4 py-1.5 rounded-full mb-6 font-mono font-black text-xs uppercase tracking-[0.2em] shadow-xl">
                Forum, Edukasi & Kolaborasi
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black text-khff-cream mb-6 tracking-tight drop-shadow-lg">
                Program Non-Pemutaran
              </h1>
              <p className="text-xl md:text-2xl text-khff-cream/95 font-medium leading-relaxed drop-shadow">
                Ruang dialog kritis, lokakarya kreatif, dan bincang sineas yang mempertemukan pengetahuan, tradisi, dan eksplorasi sinema.
              </p>
            </div>
          </div>
        </section>

        {/* CONTENT AREA (NAVY GREEN THEATER BACKGROUND) */}
        <section className="bg-khff-navy text-khff-cream p-5 sm:p-8 md:p-16 lg:p-20 shadow-2xl border-t-8 border-khff-pink relative z-20 overflow-hidden -mt-12">
          {/* Floating Background Assets */}
          <div className="absolute bottom-0 left-0 w-full pointer-events-none z-0 overflow-hidden">
            <img
              src="/assets/illustrations/geni.png"
              alt="Geni"
              className="w-full h-auto object-cover object-bottom opacity-15 mix-blend-screen translate-y-1/4 scale-110"
            />
          </div>

          <div className="container mx-auto max-w-7xl relative z-10 w-full">
            {/* Header info bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 sm:mb-12 border-b border-khff-cream/15 pb-6">
              <div>
                <span className="text-khff-yellow font-mono text-xs font-black tracking-widest uppercase block mb-1">
                  PILIHAN AGENDA
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-white">
                  3 Program Utama
                </h2>
              </div>
              <p className="text-khff-cream/75 text-sm font-medium max-w-md">
                Klik kartu program untuk membuka <strong className="text-khff-yellow">Halaman Khusus & Catatan Program</strong> lengkap.
              </p>
            </div>

            {/* MOBILE SWIPER (Snap & Scale) */}
            <div className="block md:hidden relative mb-12">
              <Swiper
                modules={[Navigation, Scrollbar, Mousewheel]}
                navigation={{
                  nextEl: ".swiper-button-next-mobile",
                  prevEl: ".swiper-button-prev-mobile",
                }}
                scrollbar={{ draggable: true, hide: false }}
                mousewheel={{ forceToAxis: true }}
                grabCursor={true}
                centeredSlides={true}
                slideToClickedSlide={true}
                spaceBetween={20}
                slidesPerView="auto"
                className="w-full py-4 !overflow-visible"
                style={
                  {
                    "--swiper-scrollbar-drag-bg-color": "rgba(255, 255, 255, 0.4)",
                    "--swiper-scrollbar-bg-color": "transparent",
                    "--swiper-scrollbar-bottom": "-20px",
                    "--swiper-scrollbar-size": "5px",
                  } as React.CSSProperties
                }
              >
                {nonPemutaranEvents.map((event, idx) => (
                  <SwiperSlide key={`mobile-${event.id}`} className="!w-auto !h-auto">
                    <Link
                      href={`/program/non-pemutaran/${event.slug}`}
                      className="block w-[300px] h-[520px] rounded-3xl overflow-hidden relative shadow-2xl bg-khff-navy border-4 border-white/20 transition-all duration-500 transform-gpu active:scale-95 group [.swiper-slide:not(.swiper-slide-active)_&]:scale-[0.9] [.swiper-slide:not(.swiper-slide-active)_&]:opacity-60 [.swiper-slide-active_&]:scale-100 [.swiper-slide-active_&]:border-khff-yellow"
                    >
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        sizes="300px"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20 p-6 flex flex-col justify-between">
                        {/* Top badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-3 py-1 rounded-full font-mono text-[10px] font-black uppercase tracking-wider shadow-md ${event.badgeBg}`}>
                            {event.category}
                          </span>
                          <span className="bg-black/60 backdrop-blur-xs border border-white/20 text-white/90 text-[10px] font-mono px-2.5 py-1 rounded-full">
                            Program {idx + 1}
                          </span>
                        </div>

                        {/* Bottom Content */}
                        <div>
                          <p className="text-khff-yellow font-serif text-sm italic mb-1">
                            {event.theme}
                          </p>
                          <h3 className="text-white font-serif font-black text-2xl leading-tight drop-shadow-md mb-3">
                            {event.title}
                          </h3>

                          {/* Info chips */}
                          <div className="space-y-1.5 text-xs text-khff-cream/90 mb-4 bg-black/40 backdrop-blur-xs p-3 rounded-xl border border-white/10">
                            <div className="flex items-center gap-2">
                              <Calendar size={13} className="text-khff-yellow shrink-0" />
                              <span className="font-semibold truncate">{event.day}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={13} className="text-khff-yellow shrink-0" />
                              <span className="font-semibold truncate">{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={13} className="text-khff-yellow shrink-0" />
                              <span className="truncate">{event.venue}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User size={13} className="text-khff-yellow shrink-0" />
                              <span className="font-bold text-khff-yellow truncate">{event.speaker}</span>
                            </div>
                          </div>

                          {/* Interactive Buttons */}
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openBooking(`nonpemutaran-${event.id}`);
                              }}
                              className="py-2.5 px-3 rounded-xl bg-khff-yellow text-khff-navy font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg hover:bg-white transition-all cursor-pointer"
                            >
                              <Ticket size={13} />
                              <span>Registrasi di Sini</span>
                            </button>
                            <div className="py-2.5 px-3 rounded-xl bg-white/10 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 border border-white/20 transition-all">
                              <span>Detail</span>
                              <ChevronRight size={13} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* DESKTOP 3-CARD SHOWCASE (Grid View: Clear & Immersive) */}
            <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
              {nonPemutaranEvents.map((event, idx) => (
                <Link
                  key={`desktop-${event.id}`}
                  href={`/program/non-pemutaran/${event.slug}`}
                  className="rounded-3xl overflow-hidden relative group shadow-2xl bg-khff-navy border-4 border-white/20 hover:border-khff-yellow transition-all duration-500 transform-gpu flex flex-col justify-between h-[540px] lg:h-[580px] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                >
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="(max-width: 1200px) 33vw, 400px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 p-7 flex flex-col justify-between z-10">
                    {/* Top Row */}
                    <div className="flex justify-between items-start gap-2">
                      <span className={`px-3.5 py-1.5 rounded-full font-mono text-xs font-black uppercase tracking-wider shadow-lg ${event.badgeBg}`}>
                        {event.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="bg-green-500/20 text-green-300 border border-green-500/40 text-xs font-mono px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> 30 Slot
                        </span>
                        <span className="bg-black/60 backdrop-blur-xs border border-white/20 text-white/90 text-xs font-mono px-3 py-1 rounded-full">
                          #{idx + 1}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Row */}
                    <div>
                      <span className="inline-block text-khff-yellow/90 font-serif text-sm italic mb-1.5">
                        {event.theme}
                      </span>
                      <h3 className="text-white font-serif font-black text-2xl lg:text-3xl leading-snug drop-shadow-md mb-4 group-hover:text-khff-yellow transition-colors">
                        {event.title}
                      </h3>

                      {/* Info Pills */}
                      <div className="space-y-2 text-xs lg:text-sm text-khff-cream/90 mb-5 bg-black/50 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-2">
                          <Calendar size={15} className="text-khff-yellow shrink-0" />
                          <span className="font-semibold">{event.day}</span>
                          <span className="text-khff-cream/40">•</span>
                          <Clock size={15} className="text-khff-yellow shrink-0" />
                          <span className="font-semibold">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={15} className="text-khff-yellow shrink-0" />
                          <span className="truncate text-khff-cream/80">{event.venue}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-0.5 border-t border-white/10">
                          <User size={15} className="text-khff-yellow shrink-0" />
                          <span className="font-bold text-khff-yellow">{event.speaker}</span>
                          <span className="text-khff-cream/60 text-xs truncate">({event.speakerRole})</span>
                        </div>
                      </div>

                      {/* Interactive Buttons (Registrasi & Buka Halaman) */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openBooking(`nonpemutaran-${event.id}`);
                          }}
                          className="py-3 px-3 rounded-2xl bg-khff-yellow text-khff-navy font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg hover:bg-white hover:scale-105 transition-all cursor-pointer"
                        >
                          <Ticket size={14} />
                          <span>Registrasi di Sini</span>
                        </button>
                        <div className="py-3 px-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 border border-white/20 transition-all">
                          <BookOpen size={14} />
                          <span>Detail</span>
                          <ChevronRight size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <ProgramBookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          initialEventId={bookingEventId}
        />
      </main>
    );
  }

  // 4. FALLBACK: UNTUK ID LAIN
  const program = programs.find((p) => p.id === id);
  if (!program) notFound();

  return (
    <main className="min-h-screen bg-khff-navy text-khff-cream font-sans">
      <section className="pt-36 pb-24 px-6 bg-gradient-to-b from-khff-navy via-[#23585a] to-khff-yellow text-khff-cream relative z-10 w-full">
        <div className="container mx-auto max-w-7xl">
          <Link href="/program" className="inline-flex items-center gap-2 bg-khff-navy/80 border border-khff-cream/20 px-5 py-2 rounded-full text-khff-cream hover:bg-khff-yellow hover:text-khff-navy font-mono mb-8 transition-all text-sm font-black shadow-lg">
            <ArrowLeft size={16} /> KEMBALI KE DAFTAR PROGRAM
          </Link>
          
          <div className="max-w-4xl mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black text-khff-cream mb-6 drop-shadow">
              {program.name}
            </h1>
            <p className="text-xl md:text-2xl text-khff-cream/95 font-medium drop-shadow">
              {program.description}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-khff-navy text-khff-cream rounded-t-[3.5rem] p-8 md:p-20 shadow-2xl border-t-8 border-khff-pink relative z-20 overflow-hidden -mt-12">
        {/* Floating Background Assets */}
        <div className="absolute top-20 right-0 w-48 md:w-96 opacity-5 md:opacity-[0.07] pointer-events-none -scale-x-100">
          <img src="/assets/illustrations/gong.png" alt="" className="w-full h-auto" />
        </div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex justify-between items-end mb-10 border-b border-khff-cream/10 pb-6">
             <h2 className="text-3xl font-serif font-black text-white">Menampilkan {program.films.length} Karya</h2>
             <span className="text-khff-cream/60 text-sm font-mono font-bold">KHFF 2026 Selection</span>
          </div>
          
          {program.films.length > 0 ? (
             <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
               {program.films.map((film) => (
                 <FilmCard key={film.id} film={film} />
               ))}
             </div>
          ) : (
             <div className="py-20 text-center bg-white/5 rounded-3xl border border-khff-cream/10 p-8">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-khff-pink/20 text-khff-pink text-xs font-mono font-black uppercase tracking-widest mb-4">
                 <Sparkles size={14} /> SEGERA HADIR
               </div>
               <p className="text-khff-cream/80 text-lg font-serif mb-6">Daftar kurasi film untuk program ini sedang dipersiapkan.</p>
               <Link href="/program" className="inline-flex items-center gap-2 bg-khff-yellow text-khff-navy font-mono font-black text-xs uppercase tracking-wider px-6 py-3 rounded-full hover:scale-105 transition-all">
                 <ArrowLeft size={14} /> LIHAT PROGRAM LAINNYA
               </Link>
             </div>
          )}
        </div>
      </section>
    </main>
  );
}
