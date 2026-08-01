"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, MapPin, PlayCircle, Play, Calendar, X, ExternalLink } from "lucide-react";
import { programs, specialPrograms } from "@/data/dummy";
import { useState, useEffect } from "react";
import Image from "next/image";

const homepageSchedule = [
  {
    day: "Day 1 — Opening",
    date: "Kamis, 17 September 2026",
    events: [
      { time: "16.00", name: "Aktivasi Tenant & Kuliner", location: "Area Tenant" },
      { time: "17.30", name: "Registrasi & Becak Drive-In", location: "Halaman Pasar Terban" },
      { time: "19.15", name: "Opening Ceremony", location: "Hall Tengah Pasar" },
      { time: "20.30", name: "Opening Film", location: "Halaman Pasar Terban" }
    ]
  },
  {
    day: "Day 2 — Public Screening & Festival",
    date: "Jumat, 18 September 2026",
    events: [
      { time: "13.15", name: "Mahaditya Awards & Shorts #1", location: "PDIN" },
      { time: "16.00", name: "Aktivasi Tenant & Kuliner", location: "Pasar Terban" },
      { time: "19.15", name: "Karyanagri Awards", location: "PDIN" },
      { time: "20.30", name: "Public Screening", location: "Pasar Terban" }
    ]
  },
  {
    day: "Day 3 — Festival & Closing",
    date: "Sabtu, 19 September 2026",
    events: [
      { time: "13.15", name: "Layar Kobar", location: "PDIN" },
      { time: "15.15", name: "Jogja Heritage Shorts #2", location: "PDIN" },
      { time: "19.15", name: "Closing Awarding Ceremony", location: "Hall PDIN" },
      { time: "20.00", name: "Closing Film", location: "Hall PDIN" }
    ]
  }
];

export default function Home() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [activeVideoTrailer, setActiveVideoTrailer] = useState("");

  const openVideo = (url: string) => {
    setActiveVideoTrailer(url);
    setIsVideoOpen(true);
  };

  useEffect(() => {
    if (isVideoOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isVideoOpen]);

  return (
    <div className="bg-khff-yellow text-khff-navy min-h-screen font-sans overflow-x-hidden w-full relative">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[95vh] w-full flex items-center justify-center overflow-hidden bg-khff-yellow pt-24 pb-12">
        
        {/* Floating Assets */}
        <div className="absolute top-12 right-12 w-48 h-48 opacity-40 animate-pulse pointer-events-none z-0">
          <img src="/assets/karakter/cahaya.png" alt="" className="w-full h-full object-contain" />
        </div>
        <div className="absolute top-32 left-10 w-36 md:w-64 h-auto opacity-90 pointer-events-none z-10 hover:-translate-y-4 transition-transform duration-700">
          <img src="/assets/karakter/SINGA.png" alt="Singa" className="w-full h-auto drop-shadow-2xl" />
        </div>
        <div className="absolute bottom-8 right-10 w-44 md:w-72 h-auto opacity-90 pointer-events-none z-10 hover:-translate-y-4 transition-transform duration-700">
          <img src="/assets/karakter/JATHILANwarna.png" alt="Jathilan" className="w-full h-auto drop-shadow-2xl" />
        </div>
        <div className="absolute bottom-20 left-20 w-32 md:w-56 h-auto opacity-30 pointer-events-none z-0 -rotate-12">
          <img src="/assets/karakter/gong.png" alt="Gong" className="w-full h-auto" />
        </div>

        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
          <span className="inline-block px-5 py-2 rounded-full bg-khff-navy text-khff-yellow text-xs md:text-sm uppercase tracking-[0.3em] mb-8 font-mono font-black shadow-lg">
            Kine Klub UMY Presents
          </span>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-black text-khff-navy mb-6 leading-[0.9] tracking-tight drop-shadow-sm">
            KHFF <br /> 2026.
          </h1>
          <p className="text-xl md:text-3xl text-khff-navy font-mono mb-6 tracking-widest font-black py-2 inline-block">
            <span className="text-khff-pink drop-shadow">17-19 SEPTEMBER 2026</span> | YOGYAKARTA
          </p>
          <p className="text-lg md:text-2xl text-khff-navy/90 mb-10 max-w-3xl mx-auto font-medium leading-relaxed">
            Kotabaru Heritage Film Festival. Merayakan persilangan sinema, arsitektur masa lampau, dan pengarsipan sejarah di jantung Yogyakarta.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/program" className="bg-khff-navy text-khff-yellow px-10 py-5 rounded-2xl text-lg md:text-xl font-mono font-black hover:bg-khff-pink hover:text-white transition-all shadow-2xl hover:scale-105 inline-flex items-center gap-3">
              <span>JELAJAHI PROGRAM</span>
              <ArrowRight size={22} />
            </Link>
            <Link href="/jadwal" className="bg-white/40 backdrop-blur-md border-2 border-khff-navy/30 text-khff-navy px-8 py-5 rounded-2xl text-lg md:text-xl font-mono font-bold hover:bg-khff-navy hover:text-white hover:border-transparent transition-all shadow-lg inline-flex items-center gap-2">
              <span>JADWAL ACARA</span>
              <CalendarDays size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. PRA-EVENT PANORAMA */}
      <section className="py-20 bg-khff-yellow border-t border-khff-navy/10 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 mb-12 text-center">
           <span className="text-xs uppercase font-mono tracking-[0.25em] font-black text-khff-navy/60 block mb-2">Road To KHFF</span>
           <h2 className="text-4xl md:text-6xl font-serif font-black text-khff-navy mb-4">
            Pra-Event Panorama.
          </h2>
          <p className="text-khff-navy text-lg md:text-xl font-mono font-bold">
            Periode Penayangan: 1 September - 15 September 2026
          </p>
          <a href="https://youtube.com/@KineKlubUMY" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-6 text-khff-pink hover:text-khff-navy font-mono font-black text-base transition-colors bg-white/50 px-6 py-2 rounded-full shadow-sm">
            <span>Tonton seluruh arsip di YouTube</span> <PlayCircle size={20} />
          </a>
        </div>

        {/* Horizontal Scroll Posters */}
        <div className="flex overflow-x-auto gap-8 px-6 lg:px-12 pb-10 snap-x hide-scrollbar">
          {[1,2,3,4,5,6,7,8,9,10].map((num) => (
            <div key={num} className="snap-center shrink-0 w-[280px] h-[400px] md:w-[300px] md:h-[440px] rounded-3xl overflow-hidden relative group shadow-xl bg-khff-navy text-khff-cream border-4 border-white/20 hover:border-khff-pink hover:-translate-y-2 transition-all duration-500">
              <div className="absolute inset-0 bg-khff-navy flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-khff-cream/20 m-4 rounded-2xl group-hover:bg-khff-navy/90 transition-all">
                <span className="text-5xl mb-6 transform group-hover:scale-110 transition-transform">🎥</span>
                <p className="text-khff-yellow font-black font-mono text-xl">Poster #{num}</p>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-khff-cream/50 mt-3 px-3 py-1 bg-white/5 rounded-full">Coming Soon / Placeholder</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PROGRAM UTAMA (3 KOLOM - TRANSISI KE HIJAU TUA) */}
      <section className="py-28 bg-khff-navy text-khff-cream rounded-t-[3.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.3)] relative z-20 border-t-8 border-khff-pink -mt-8 overflow-hidden">
        {/* Floating Asset */}
        <div className="absolute top-0 right-0 w-80 h-auto opacity-10 pointer-events-none z-0 rotate-12">
          <img src="/assets/karakter/gong.png" alt="Gong" className="w-full h-auto" />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-[0.3em] font-bold text-khff-yellow block mb-3">Festival Pillars</span>
            <h2 className="text-5xl md:text-7xl font-serif font-black text-white mb-6 tracking-tight">
              Tiga Pilar Utama.
            </h2>
            <p className="text-khff-cream/80 text-lg md:text-xl font-medium leading-relaxed">
              Jelajahi kompetisi sineas nusantara, kurasi penayangan warisan budaya, dan lokakarya edukatif dalam satu nafas perayaan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Kolom 1: Program Kompetisi */}
            <Link href="/program/kompetisi" className="block group">
              <div className="bg-khff-yellow rounded-3xl p-8 shadow-xl text-khff-navy flex flex-col justify-between h-full min-h-[380px] group-hover:-translate-y-3 transition-all duration-300 relative overflow-hidden border-2 border-transparent group-hover:border-white/40">
                 <div className="absolute -right-6 -bottom-6 opacity-30 w-52 group-hover:scale-110 transition-transform duration-500">
                   <img src="/assets/karakter/terompet.png" alt="" className="w-full" />
                 </div>
                 <div className="relative z-10">
                   <span className="text-xs font-bold font-mono uppercase tracking-widest px-3 py-1 bg-khff-navy text-khff-yellow rounded-full inline-block mb-6">Competition</span>
                   <h3 className="text-4xl font-serif font-black mb-4 leading-tight">Program<br/>Kompetisi</h3>
                   <p className="text-khff-navy/80 font-medium text-lg max-w-sm">
                     Ajang apresiasi sinema pendek pilihan dari seluruh Nusantara: Mahaditya, Purwaseswa, dan Karyanagri.
                   </p>
                 </div>
                 <div className="mt-12 pt-6 border-t border-khff-navy/20 font-black font-mono text-base flex items-center justify-between group-hover:translate-x-2 transition-transform">
                   <span>LIHAT DAFTAR KARYA</span>
                   <span className="text-2xl">→</span>
                 </div>
              </div>
            </Link>

            {/* Kolom 2: Program Non Kompetisi */}
            <Link href="/program/non-kompetisi" className="block group">
              <div className="bg-khff-pink rounded-3xl p-8 shadow-xl text-white flex flex-col justify-between h-full min-h-[380px] group-hover:-translate-y-3 transition-all duration-300 relative overflow-hidden border-2 border-transparent group-hover:border-white/40">
                 <div className="absolute top-10 right-6 opacity-30 w-36 mix-blend-screen group-hover:scale-110 transition-transform duration-500">
                   <img src="/assets/karakter/genigeni.png" alt="" className="w-full" />
                 </div>
                 <div className="relative z-10">
                   <span className="text-xs font-bold font-mono uppercase tracking-widest px-3 py-1 bg-white text-khff-pink rounded-full inline-block mb-6">Screenings</span>
                   <h3 className="text-4xl font-serif font-black mb-4 leading-tight">Program Non<br/>Kompetisi</h3>
                   <p className="text-white/90 font-medium text-lg max-w-sm">
                     Kurasi penayangan istimewa mulai dari Opening Film, International & National Heritage, hingga Closing Film.
                   </p>
                 </div>
                 <div className="mt-12 pt-6 border-t border-white/30 font-black font-mono text-base flex items-center justify-between group-hover:translate-x-2 transition-transform">
                   <span>JELAJAHI PENAYANGAN</span>
                   <span className="text-2xl">→</span>
                 </div>
              </div>
            </Link>

            {/* Kolom 3: Program Non Pemutaran (Workshop & Lecture) */}
            <Link href="/program/non-pemutaran" className="block group">
              <div className="bg-white rounded-3xl p-8 shadow-xl text-khff-navy flex flex-col justify-between h-full min-h-[380px] group-hover:-translate-y-3 transition-all duration-300 relative overflow-hidden border-2 border-transparent group-hover:border-khff-pink/40">
                 <div className="absolute -bottom-10 -left-6 opacity-15 w-44 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                   <img src="/assets/karakter/kendhang.png" alt="" className="w-full" />
                 </div>
                 <div className="relative z-10">
                   <span className="text-xs font-bold font-mono uppercase tracking-widest px-3 py-1 bg-khff-pink text-white rounded-full inline-block mb-6">Education & Forum</span>
                   <h3 className="text-4xl font-serif font-black mb-4 leading-tight">Program Non<br/>Pemutaran</h3>
                   <p className="text-khff-navy/80 font-medium text-lg max-w-sm">
                     Ruang lokakarya edukatif dan kuliah terbuka (Workshop & Public Lecture) bersama praktisi film nusantara.
                   </p>
                 </div>
                 <div className="mt-12 pt-6 border-t border-khff-navy/20 font-black font-mono text-base flex items-center justify-between group-hover:translate-x-2 transition-transform">
                   <span>DETAIL & PENDAFTARAN</span>
                   <span className="text-2xl">→</span>
                 </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* 4. VIDEO TEASER */}
      <section className="py-24 bg-[#143638] relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-black text-khff-yellow mb-12">
              Teaser KHFF 2026
            </h2>
            <div className="max-w-6xl mx-auto group cursor-pointer relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-khff-yellow/20 bg-khff-navy" onClick={() => openVideo("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1")}>
              <div className="w-full h-full flex flex-col items-center justify-center">
                <span className="text-4xl mb-4">🎬</span>
                <p className="text-khff-cream font-mono">Teaser Video Area (Dummy)</p>
              </div>
              <div className="absolute inset-0 bg-khff-navy/40 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="w-24 h-24 bg-khff-yellow text-khff-navy rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(236,172,45,0.5)] group-hover:scale-110 transition-transform">
                  <Play size={40} className="ml-2" />
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* 5. DRIVE IN CINEMA (SPECIAL PROGRAM) */}
      <section className="py-24 bg-khff-navy border-t border-khff-cream/10 relative">
        <div className="container mx-auto px-6 lg:px-12">
          
          <div className="relative w-full h-[60vh] md:h-[70vh] rounded-3xl overflow-hidden group border-4 border-khff-pink shadow-2xl bg-black">
            {/* Foto Becak Memanjang */}
            <div className="w-full h-full opacity-30 flex items-center justify-center bg-khff-navy">
              <span className="text-xl font-mono text-khff-cream">Gambar Becak (Dummy)</span>
            </div>
            
            <div className="absolute top-10 left-10 opacity-30 pointer-events-none w-32 mix-blend-screen">
              <img src="/assets/karakter/bendera.png" alt="Bendera" className="w-full h-auto" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-khff-navy via-khff-navy/80 to-transparent flex flex-col justify-center p-8 md:p-20">
              <span className="text-khff-pink font-bold tracking-[0.3em] uppercase mb-4 font-mono">Special Program</span>
              <h3 className="text-5xl md:text-7xl font-serif font-black text-white mb-6 drop-shadow-lg leading-none">Drive In<br/>Cinema</h3>
              <p className="text-khff-cream text-lg md:text-2xl mb-8 max-w-2xl drop-shadow font-medium">
                Special program drive in cinema by Mayora. Keliling Kota Baru naik becak sambil menikmati sinema. Film pembuka: Paraprashub.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-white font-mono text-sm font-bold">
                <span className="flex items-center gap-2 bg-khff-pink px-5 py-3 rounded-xl shadow-lg"><CalendarDays size={18}/> 16 September 2026</span>
                <span className="flex items-center gap-2 bg-khff-yellow text-khff-navy px-5 py-3 rounded-xl shadow-lg"><Clock size={18}/> 12.00 - 16.00 WIB</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. JADWAL SELEKSI */}
      <section className="py-24 bg-[#143638] border-t border-khff-cream/10 relative overflow-hidden">
        <div className="absolute top-20 right-0 opacity-20 pointer-events-none w-64 translate-x-1/4">
          <img src="/assets/karakter/buto2.png" alt="Buto" className="w-full h-auto" />
        </div>
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl relative z-10">
          <h2 className="text-4xl md:text-6xl font-serif font-black text-khff-cream mb-16 text-center">
            Jadwal Festival
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-4">
            {homepageSchedule.map((day, idx) => (
              <div key={idx} className="bg-white/5 border-2 border-khff-cream/10 rounded-3xl p-8 hover:border-khff-yellow hover:-translate-y-2 transition-all shadow-xl backdrop-blur-sm">
                
                <div className="mb-8 border-b border-khff-cream/10 pb-6 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold tracking-widest uppercase text-khff-pink">{day.day}</span>
                    <h4 className="text-xl font-serif font-bold text-white mt-2">{day.date}</h4>
                  </div>
                  <Calendar className="text-khff-yellow opacity-50" size={32} />
                </div>
                
                <div className="space-y-6">
                  {day.events.map((ev, i) => (
                    <div key={i} className="flex flex-col gap-2 relative">
                      <div className="absolute -left-12 top-0 bottom-0 border-l border-khff-cream/20 hidden md:block">
                        <div className="w-3 h-3 rounded-full bg-khff-yellow absolute -left-[6px] top-1" />
                      </div>
                      <span className="text-khff-cream/50 font-mono text-sm shrink-0 font-bold">{ev.time}</span>
                      <div>
                        <p className="text-white font-bold text-lg leading-snug mb-1">{ev.name}</p>
                        <p className="text-khff-cream/60 text-sm flex items-center gap-2">
                          <MapPin size={14} /> {ev.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-16">
             <Link href="/jadwal" className="inline-flex items-center gap-3 bg-khff-yellow text-khff-navy px-8 py-4 rounded-xl font-black hover:bg-white transition-all text-lg shadow-xl hover:scale-105">
                Lihat Jadwal Keseluruhan <ArrowRight size={20} />
             </Link>
          </div>
        </div>
      </section>
      
      {/* 7. GALERI DOKUMENTASI (Direct to GDrive) */}
      <section className="py-24 bg-khff-navy border-t border-khff-cream/10 relative">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-black text-white mb-6">
            Galeri Dokumentasi
          </h2>
          <p className="text-khff-cream/80 max-w-2xl mx-auto mb-16 text-lg">Akses seluruh arsip visual kegiatan Kotabaru Heritage Film Festival di Google Drive resmi kami.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {["Day 1", "Day 2", "Day 3"].map((day, i) => (
              <a href="https://drive.google.com" target="_blank" rel="noopener noreferrer" key={i} className="group block relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden border-2 border-white/10 hover:border-khff-pink transition-all shadow-xl bg-black">
                <div className="w-full h-full opacity-30 flex items-center justify-center bg-khff-navy group-hover:scale-110 transition-transform duration-700">
                  <span className="text-xl font-mono text-khff-cream">Foto Dummy {day}</span>
                </div>
                <div className="absolute inset-0 bg-khff-navy/50 group-hover:bg-khff-navy/20 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <h3 className="text-4xl font-serif font-black text-white drop-shadow-md">{day}</h3>
                  <span className="mt-4 flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                    Buka Folder <ExternalLink size={16} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 8. REGISTRASI G-FORM */}
      <section className="py-32 bg-khff-pink text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 opacity-20 rotate-180 pointer-events-none">
          <img src="/assets/karakter/gedang.png" alt="" className="w-full" />
        </div>
        <div className="absolute bottom-0 left-0 w-48 opacity-20 pointer-events-none">
          <img src="/assets/karakter/kendhang.png" alt="" className="w-full" />
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-8xl font-serif font-black mb-6 drop-shadow-xl text-khff-navy">
            Registrasi
          </h2>
          <p className="text-white font-medium max-w-2xl mx-auto mb-12 text-xl md:text-2xl drop-shadow-sm">
            Amankan kursimu secara gratis. Akses seluruh penayangan film dan pameran karya via Google Form.
          </p>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSe5QTD0-Anc64hxcO5rcslJgYxc2HlhjGOUbXmv6Jig_PNQSA/viewform?usp=publish-editor"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 bg-khff-navy text-khff-cream px-10 py-5 rounded-2xl text-xl font-black hover:bg-white hover:text-khff-navy hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            Isi Formulir Pendaftaran <ArrowRight size={24} />
          </a>
        </div>
      </section>

      {/* Video Modal Popup */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-khff-navy/95 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <button 
            onClick={() => setIsVideoOpen(false)}
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-3 bg-white/10 rounded-full hover:bg-khff-pink"
          >
            <X size={28} />
          </button>
          <div className="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/20 relative scale-in-95 duration-300">
            {activeVideoTrailer.includes("youtube") ? (
              <iframe 
                className="w-full h-full"
                src={activeVideoTrailer} 
                title="Trailer" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            ) : (
              <video 
                className="w-full h-full" 
                src={activeVideoTrailer} 
                autoPlay 
                controls 
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
