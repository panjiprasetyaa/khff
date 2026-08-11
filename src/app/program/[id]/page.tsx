"use client";

import { use, useState } from "react";
import { programs, specialPrograms, IS_CURATION_ONGOING } from "@/data/dummy";
import { notFound } from "next/navigation";
import FilmCard from "@/components/FilmCard";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Filter, CalendarDays, Clock, MapPin, User, ArrowRight, Sparkles, Trophy, BookOpen, ExternalLink } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";

export default function ProgramDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  // Tab States
  const [activeKompetisiTab, setActiveKompetisiTab] = useState("mahaditya");
  const [activeNonKompetisiTab, setActiveNonKompetisiTab] = useState("opening-film");
  const [activeNonPemutaranTab, setActiveNonPemutaranTab] = useState("workshop");

  const gFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSe5QTD0-Anc64hxcO5rcslJgYxc2HlhjGOUbXmv6Jig_PNQSA/viewform?usp=publish-editor";

  // 1. PROGRAM KOMPETISI
  if (id === "kompetisi") {
    const tabs = [
      { id: "mahaditya", label: "Mahaditya Awards", desc: "Mahaditya berarti yang paling terang. Program ini adalah program kompetisi yang berkonsentrasi kepada suara independen untuk menyajikan narasi warisan budaya secara sinematik. Mahaditya membawa semangat demokratisasi sudut pandang, menggarisbawahi keunikan, kesegaran, dan kedaulatan." },
      { id: "purwaseswa", label: "Purwaseswa Awards", desc: "Purwaseswa berarti tingkat dasar dalam struktur pendidikan (pelajar). Kata “purwa” berarti awal, sementara “seswa” berarti murid/pelajar. Program ini adalah program kompetisi yang berfokus pada karya-karya film bermuatan warisan budaya yang dibuat oleh pelajar di Indonesia." },
      { id: "karyanagri", label: "Karyanagri Awards", desc: "Karyanagri berarti karya pemerintah/negara. Program ini adalah program kompetisi yang mewadahi berbagai karya film bermuatan warisan budaya di Indonesia yang didukung oleh pemerintah pusat dan merepresentasikan sudut pandang nasional." },
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
        <section className="bg-khff-navy text-khff-cream p-8 md:p-20 shadow-2xl border-t-8 border-khff-pink relative z-20 overflow-hidden -mt-12">
          {/* Floating Background Assets */}
          <div className="absolute bottom-0 left-0 w-full pointer-events-none z-0 overflow-hidden">
            <img src="/assets/illustrations/geni.png" alt="Geni" className="w-full h-auto object-cover object-bottom opacity-15 mix-blend-screen translate-y-1/4 scale-110" />
          </div>
          
          <div className="container mx-auto max-w-7xl relative z-10">
            {/* TAB BUTTONS */}
            <div className="flex flex-wrap gap-4 mb-12 border-b border-khff-cream/10 pb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveKompetisiTab(tab.id)}
                  className={`px-8 py-4 rounded-2xl font-serif font-black text-xl md:text-2xl transition-all duration-300 shadow-lg ${
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
              <div className="bg-white/5 border-l-4 border-khff-yellow p-8 rounded-r-3xl mb-12 backdrop-blur-sm max-w-4xl shadow-xl">
                <h2 className="text-3xl font-serif font-black text-khff-yellow mb-3">Program {activeTabInfo.label}</h2>
                <p className="text-khff-cream/90 text-lg md:text-xl font-medium leading-relaxed">{activeTabInfo.desc}</p>
              </div>
            )}

            {/* FILM LIST GRID */}
            <div>
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-2xl font-serif font-black text-white">Daftar Karya Seleksi ({currentProgram?.films.slice(0, 1).length || 0} Film)</h3>
              </div>
              
              {currentProgram && currentProgram.films.length > 0 ? (
                 <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                   {currentProgram.films.slice(0, 1).map((film) => (
                     <FilmCard key={film.id} film={film} overrideTitle={activeTabInfo?.label} programId={activeKompetisiTab} />
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
      </main>
    );
  }

  // 2. PROGRAM NON-KOMPETISI
  if (id === "non-kompetisi") {
    const tabs = [
      { id: "opening-film", label: "Opening Film", badge: "Special Screening" },
      { id: "international-heritage", label: "International Heritage", badge: "Curated Selection" },
      { id: "national-heritage", label: "National Heritage", badge: "Curated Selection" },
      { id: "closing-film", label: "Closing Film", badge: "Special Screening" },
    ];
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
        <section className="bg-khff-navy text-khff-cream p-8 md:p-20 shadow-2xl border-t-8 border-khff-pink relative z-20 overflow-hidden -mt-12">
          {/* Floating Background Assets */}
          <div className="absolute bottom-0 left-0 w-full pointer-events-none z-0 overflow-hidden">
            <img src="/assets/illustrations/geni.png" alt="Geni" className="w-full h-auto object-cover object-bottom opacity-15 mix-blend-screen translate-y-1/4 scale-110" />
          </div>
          
          <div className="container mx-auto max-w-7xl relative z-10">
            
            {/* TAB BUTTONS */}
            <div className="flex flex-wrap gap-4 mb-12 border-b border-khff-cream/10 pb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveNonKompetisiTab(tab.id)}
                  className={`px-7 py-4 rounded-2xl text-left transition-all duration-300 shadow-lg ${
                    activeNonKompetisiTab === tab.id
                      ? "bg-khff-pink text-white scale-105 shadow-[0_0_25px_rgba(235,93,121,0.4)]"
                      : "bg-white/5 text-khff-cream/60 hover:bg-white/10 hover:text-khff-cream"
                  }`}
                >
                  <span className="block text-xs font-mono uppercase opacity-80 mb-1 font-black">{tab.badge}</span>
                  <span className="font-serif font-black text-xl md:text-2xl block">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* FILM LIST FOR SELECTED TAB */}
            <div>
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-2xl font-serif font-black text-white">
                   Penayangan Sesi {tabs.find(t => t.id === activeNonKompetisiTab)?.label}
                 </h3>
              </div>
              
              {currentProgram && currentProgram.films.length > 0 ? (
                 <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                   {currentProgram.films.slice(0, 1).map((film) => (
                     <FilmCard key={film.id} film={film} overrideTitle={tabs.find(t => t.id === activeNonKompetisiTab)?.label} programId={activeNonKompetisiTab} />
                   ))}
                 </div>
              ) : (
                 <div className="py-24 text-center bg-white/5 rounded-3xl border border-khff-cream/10">
                   <p className="text-khff-cream/50 text-lg font-mono">Informasi penayangan film untuk sesi ini segera diumumkan.</p>
                 </div>
              )}
            </div>
          </div>
        </section>
      </main>
    );
  }

  // 3. PROGRAM NON-PEMUTARAN (Workshop & Public Lecture dll)
  if (id === "non-pemutaran") {
    const nonPemutaranEvents = [
      {
        id: "drive-in",
        title: "Drive In Cinema",
        desc: "Menghadirkan cara baru menikmati film lokal dari atas becak kayuh, memadukan pengalaman sinema dengan transportasi tradisional Yogyakarta yang ramah lingkungan.",
        image: "/assets/sponsors/becakk.jpg",
      },
      {
        id: "public-lecture",
        title: "Public Lecture",
        desc: "Sesi pengetahuan dan diskusi yang mengajak peserta melihat film dan warisan budaya dari berbagai perspektif.",
        image: "/assets/gallery/2025/Day 2 Public Lecture-4.jpg",
      },
      {
        id: "pasar-kobar",
        title: "Pasar Kobar",
        desc: "Temukan beragam produk lokal, kuliner, dan karya kreatif di Pasar Kobar selama festival berlangsung.",
        image: "/assets/gallery/2025/Pasar Sepakbola-1.jpg",
      }
    ];

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
                Forum & Educational Programs
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black text-khff-cream mb-6 tracking-tight drop-shadow-lg">
                Program Non-Pemutaran
              </h1>
              <p className="text-xl md:text-2xl text-khff-cream/95 font-medium leading-relaxed drop-shadow">
                Ruang interaksi yang menghadirkan berbagai kegiatan untuk belajar, berdiskusi, dan merayakan keberagaman budaya melalui film.
              </p>
            </div>
          </div>
        </section>

        {/* CONTENT AREA (NAVY GREEN THEATER BACKGROUND) */}
        <section className="bg-khff-navy text-khff-cream p-8 md:p-20 shadow-2xl border-t-8 border-khff-pink relative z-20 overflow-hidden -mt-12">
          {/* Floating Background Assets */}
          <div className="absolute bottom-0 left-0 w-full pointer-events-none z-0 overflow-hidden">
            <img src="/assets/illustrations/geni.png" alt="Geni" className="w-full h-auto object-cover object-bottom opacity-15 mix-blend-screen translate-y-1/4 scale-110" />
          </div>
          
          <div className="container mx-auto max-w-7xl relative z-10 w-full group/slider overflow-visible">
             <Swiper
                modules={[Navigation, Scrollbar, FreeMode, Mousewheel]}
                navigation={{
                  nextEl: ".swiper-button-next-custom",
                  prevEl: ".swiper-button-prev-custom",
                }}
                scrollbar={{ draggable: true, hide: false }}
                freeMode={true}
                mousewheel={{ forceToAxis: true }}
                grabCursor={true}
                spaceBetween={24}
                slidesPerView="auto"
                className="w-full py-4 !overflow-visible"
                style={{
                  "--swiper-scrollbar-drag-bg-color": "rgba(255, 255, 255, 0.4)",
                  "--swiper-scrollbar-bg-color": "transparent",
                  "--swiper-scrollbar-bottom": "-20px",
                  "--swiper-scrollbar-size": "5px",
                } as React.CSSProperties}
              >
                {nonPemutaranEvents.map((event, idx) => (
                  <SwiperSlide key={event.id} className="!w-auto !h-auto">
                    <div className="w-[300px] h-[450px] md:w-[350px] md:h-[500px] rounded-3xl overflow-hidden relative group shadow-2xl bg-khff-navy border-4 border-white/20 hover:border-khff-pink hover:-translate-y-3 hover:scale-[1.03] transition-all duration-500 transform-gpu cursor-pointer">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 300px, 350px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 md:p-8 flex flex-col justify-end">
                        <p className="text-khff-yellow font-black font-mono text-xs uppercase tracking-widest mb-2 drop-shadow-md">
                          Program {idx + 1}
                        </p>
                        <h3 className="text-white font-serif font-black text-2xl md:text-3xl leading-snug drop-shadow-md mb-3">
                          {event.title}
                        </h3>
                        <p className="text-white/80 font-medium text-sm md:text-base drop-shadow-md line-clamp-4">
                          {event.desc}
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Left Navigation Overlay */}
              <div className="swiper-button-prev-custom absolute top-0 bottom-0 left-0 z-20 w-16 lg:w-24 bg-gradient-to-r from-khff-navy/80 to-transparent hidden md:flex items-center justify-start pl-2 cursor-pointer opacity-100 transition-opacity duration-300 [&.swiper-button-disabled]:opacity-0">
                <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 hover:scale-110 transition-all shadow-xl">
                  <ArrowLeft size={24} />
                </div>
              </div>

              {/* Right Navigation Overlay */}
              <div className="swiper-button-next-custom absolute top-0 bottom-0 right-0 z-20 w-16 lg:w-24 bg-gradient-to-l from-khff-navy/80 to-transparent hidden md:flex items-center justify-end pr-2 cursor-pointer opacity-100 transition-opacity duration-300 [&.swiper-button-disabled]:opacity-0">
                <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 hover:scale-110 transition-all shadow-xl">
                  <ArrowRight size={24} />
                </div>
              </div>
          </div>
        </section>
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
             <div className="py-20 text-center">
               <p className="text-khff-cream/50 font-mono">Belum ada film di program ini.</p>
             </div>
          )}
        </div>
      </section>
    </main>
  );
}
