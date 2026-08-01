"use client";

import { use, useState } from "react";
import { programs, specialPrograms } from "@/data/dummy";
import { notFound } from "next/navigation";
import FilmCard from "@/components/FilmCard";
import Link from "next/link";
import { ArrowLeft, Filter, CalendarDays, Clock, MapPin, User, ArrowRight, Sparkles, Trophy, BookOpen, ExternalLink } from "lucide-react";

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
      { id: "mahaditya", label: "Mahaditya", desc: "Kompetisi utama untuk film pendek dengan penceritaan kuat dan penyutradaraan matang." },
      { id: "purwaseswa", label: "Purwaseswa", desc: "Menyoroti inovasi visual, eksperimen gaya naratif, dan keberanian sutradara baru." },
      { id: "karyanagri", label: "Karyanagri", desc: "Mengangkat kearifan lokal, sejarah, serta refleksi mendalam atas isu sosial Nusantara." },
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
            
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-khff-yellow text-khff-navy px-4 py-1.5 rounded-full mb-6 font-mono font-black text-xs uppercase tracking-[0.2em] shadow-xl">
                <Trophy size={16} />
                <span>Festival Competition 2026</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-serif font-black text-khff-cream mb-6 tracking-tight drop-shadow-lg">
                Program Kompetisi.
              </h1>
              <p className="text-xl md:text-2xl text-khff-cream/95 font-medium leading-relaxed drop-shadow">
                Menampilkan karya terbaik dari sineas muda nusantara. Pilih kategori program di bawah untuk menjelajahi daftar karya terkurasi.
              </p>
            </div>
          </div>
        </section>

        {/* CONTENT AREA (NAVY GREEN THEATER BACKGROUND) */}
        <section className="bg-khff-navy text-khff-cream rounded-t-[3.5rem] p-8 md:p-20 shadow-2xl border-t-8 border-khff-pink relative z-20 overflow-hidden -mt-12">
          <div className="container mx-auto max-w-7xl">
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
                 <h3 className="text-2xl font-serif font-black text-white">Daftar Karya Seleksi ({currentProgram?.films.length || 0} Film)</h3>
              </div>
              
              {currentProgram && currentProgram.films.length > 0 ? (
                 <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                   {currentProgram.films.map((film) => (
                     <FilmCard key={film.id} film={film} />
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
            
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-khff-pink text-white px-4 py-1.5 rounded-full mb-6 font-mono font-black text-xs uppercase tracking-[0.2em] shadow-xl">
                <Sparkles size={16} />
                <span>Heritage & Special Screenings</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-serif font-black text-khff-cream mb-6 tracking-tight drop-shadow-lg">
                Program Non-Kompetisi.
              </h1>
              <p className="text-xl md:text-2xl text-khff-cream/95 font-medium leading-relaxed drop-shadow">
                Kurasi penayangan eksklusif yang merayakan persilangan sinema dan sejarah. Dari opening hingga pemutaran restorasi arsip budaya lokal dan global.
              </p>
            </div>
          </div>
        </section>

        {/* CONTENT AREA (NAVY GREEN THEATER BACKGROUND) */}
        <section className="bg-khff-navy text-khff-cream rounded-t-[3.5rem] p-8 md:p-20 shadow-2xl border-t-8 border-khff-pink relative z-20 overflow-hidden -mt-12">
          <div className="container mx-auto max-w-7xl">
            
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
                   {currentProgram.films.map((film) => (
                     <FilmCard key={film.id} film={film} />
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

  // 3. PROGRAM NON-PEMUTARAN (Workshop & Public Lecture)
  if (id === "non-pemutaran") {
    const events = [
      {
        id: "workshop",
        type: "Workshop",
        title: "Penulisan Naskah Film Pendek & Eksperimental",
        speaker: "Wregas Bhanuteja",
        role: "Sutradara & Penulis Skenario (Budi Pekerti, Penyalin Cahaya)",
        date: "Minggu, 13 September 2026",
        time: "13:00 - 16:00 WIB",
        location: "Ruang Seminar 2, PDIN",
        desc: "Lokakarya intensif yang membedah anatomi struktur cerita film pendek, teknik eksplorasi ide lokal yang berdaya saing global, serta kiat-kiat pitching naskah di festival film internasional.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600"
      },
      {
        id: "lecture",
        type: "Public Lecture",
        title: "Masa Depan Sinema Independen & Pengarsipan Sejarah",
        speaker: "Garin Nugroho",
        role: "Sutradara Senior & Budayawan Nusantara",
        date: "Sabtu, 12 September 2026",
        time: "10:00 - 12:00 WIB",
        location: "Aula Kotabaru / Balkon PDIN",
        desc: "Kuliah terbuka dan forum pemikiran tentang peran sinema independen dalam melaburi ruang arsip sejarah kota, revitalisasi kebudayaan, serta navigasi ekosistem perfilman modern.",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600"
      }
    ];

    const currentEvent = events.find((e) => e.id === activeNonPemutaranTab) || events[0];

    return (
      <main className="min-h-screen bg-khff-navy text-khff-cream font-sans relative overflow-hidden">
        
        {/* HEADER AREA (CINEMATIC GREEN-TO-YELLOW GRADIENT) */}
        <section className="pt-36 pb-24 px-6 bg-gradient-to-b from-khff-navy via-[#23585a] to-khff-yellow text-khff-cream relative z-10 w-full">
          <div className="container mx-auto max-w-7xl">
            <Link href="/program" className="inline-flex items-center gap-2 bg-khff-navy/80 border border-khff-cream/20 px-5 py-2 rounded-full text-khff-cream hover:bg-khff-yellow hover:text-khff-navy font-mono mb-8 transition-all text-sm font-black shadow-lg">
              <ArrowLeft size={16} /> KEMBALI KE DAFTAR PROGRAM
            </Link>
            
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-khff-yellow text-khff-navy px-4 py-1.5 rounded-full mb-6 font-mono font-black text-xs uppercase tracking-[0.2em] shadow-xl">
                <BookOpen size={16} />
                <span>Forum & Educational Programs</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-serif font-black text-khff-cream mb-6 tracking-tight drop-shadow-lg">
                Program Non-Pemutaran.
              </h1>
              <p className="text-xl md:text-2xl text-khff-cream/95 font-medium leading-relaxed drop-shadow">
                Ruang temu, lokakarya edukatif, dan kuliah terbuka bersama praktisi film terkemuka. Wadah pertukaran wawasan, diskusi kerajinan sinema, serta jejaring kolaborasi.
              </p>
            </div>
          </div>
        </section>

        {/* CONTENT AREA (NAVY GREEN THEATER BACKGROUND) */}
        <section className="bg-khff-navy text-khff-cream rounded-t-[3.5rem] p-8 md:p-20 shadow-2xl border-t-8 border-khff-pink relative z-20 overflow-hidden -mt-12">
          <div className="container mx-auto max-w-7xl">
            
            {/* TAB SELECTOR: WORKSHOP vs PUBLIC LECTURE */}
            <div className="flex gap-4 mb-12">
              {events.map((ev) => (
                <button
                  key={ev.id}
                  onClick={() => setActiveNonPemutaranTab(ev.id)}
                  className={`px-10 py-5 rounded-2xl font-serif font-black text-2xl transition-all duration-300 shadow-xl ${
                    activeNonPemutaranTab === ev.id
                      ? "bg-white text-khff-navy scale-105 shadow-[0_0_30px_rgba(255,255,255,0.25)]"
                      : "bg-white/5 text-khff-cream/60 hover:bg-white/10 hover:text-khff-cream"
                  }`}
                >
                  {ev.type}
                </button>
              ))}
            </div>

            {/* DETAIL CARD */}
            <div className="bg-white/5 border-2 border-khff-cream/20 rounded-3xl p-8 md:p-16 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Foto Narasumber */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div className="w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-khff-yellow relative group">
                    <img 
                      src={currentEvent.image} 
                      alt={currentEvent.speaker} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-khff-navy via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="text-xs font-mono uppercase font-black bg-khff-pink text-white px-3 py-1 rounded-full mb-2 inline-block shadow">
                        Narasumber
                      </span>
                      <h3 className="text-2xl font-serif font-black text-white">{currentEvent.speaker}</h3>
                    </div>
                  </div>
                </div>

                {/* Detail Jadwal & Materi */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <span className="text-sm font-mono uppercase font-black text-khff-yellow tracking-widest block mb-3">
                      {currentEvent.type} Session
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif font-black text-white mb-4 leading-tight">
                      {currentEvent.title}
                    </h2>
                    <p className="text-khff-pink font-bold text-lg mb-6">
                      {currentEvent.role}
                    </p>
                    <p className="text-khff-cream/90 text-lg md:text-xl font-medium leading-relaxed mb-8">
                      {currentEvent.desc}
                    </p>

                    <div className="flex flex-wrap gap-4 font-mono font-bold text-base mb-10">
                      <span className="flex items-center gap-2 bg-khff-navy/80 border border-khff-cream/20 px-5 py-3 rounded-xl text-white shadow-md">
                        <CalendarDays size={20} className="text-khff-yellow"/> {currentEvent.date}
                      </span>
                      <span className="flex items-center gap-2 bg-khff-navy/80 border border-khff-cream/20 px-5 py-3 rounded-xl text-white shadow-md">
                        <Clock size={20} className="text-khff-pink"/> {currentEvent.time}
                      </span>
                      <span className="flex items-center gap-2 bg-khff-navy/80 border border-khff-cream/20 px-5 py-3 rounded-xl text-white shadow-md">
                        <MapPin size={20} className="text-white"/> {currentEvent.location}
                      </span>
                    </div>
                  </div>

                  {/* TOMBOL DAFTAR SEKARANG -> LINK GOOGLE FORM */}
                  <div className="pt-8 border-t border-khff-cream/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                      <span className="text-sm text-khff-cream/70 font-mono block">Biaya pendaftaran: <strong className="text-white uppercase font-bold">Gratis (Tempat Terbatas)</strong></span>
                      <span className="text-xs text-khff-cream/50 font-mono">Registrasi dibuka melalui platform Google Form</span>
                    </div>
                    <a
                      href={gFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-3 bg-khff-pink text-white px-10 py-5 rounded-2xl text-xl font-black font-mono hover:bg-khff-yellow hover:text-khff-navy hover:scale-105 transition-all duration-300 shadow-2xl shrink-0"
                    >
                      Daftar Sekarang <ExternalLink size={24} />
                    </a>
                  </div>
                </div>

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
            <h1 className="text-5xl md:text-7xl font-serif font-black text-khff-cream mb-6 drop-shadow">
              {program.name}
            </h1>
            <p className="text-xl md:text-2xl text-khff-cream/95 font-medium drop-shadow">
              {program.description}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-khff-navy text-khff-cream rounded-t-[3.5rem] p-8 md:p-20 shadow-2xl border-t-8 border-khff-pink relative z-20 -mt-12">
        <div className="container mx-auto max-w-7xl">
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
