"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, MapPin, PlayCircle, Play, Calendar, X } from "lucide-react";
import ProgramCarousel from "@/components/ProgramCarousel";
import { programs, specialPrograms, schedule } from "@/data/dummy";
import { useState, useEffect } from "react";

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
    <>
      {/* BARIS 2: Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="object-cover w-full h-full opacity-40 grayscale">
            <source src="https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
        </div>
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-32 md:mt-24">
          <h2 className="text-sm md:text-base uppercase tracking-[0.3em] text-gray-300 mb-4 font-mono">
            Kine Klub UMY Presents
          </h2>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-2xl">
            Banner Utama <br className="hidden md:block" /> KHFF 2026
          </h1>
          <p className="text-lg md:text-xl text-white font-mono mb-6 tracking-widest drop-shadow-md border-y border-white/30 py-2 inline-block">
            17-19 September 2026 | Yogyakarta
          </p>
          <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto drop-shadow-md">
            Kotabaru Heritage Film Festival. Merayakan persilangan sinema dan sejarah di jantung Yogyakarta.
          </p>
        </div>
      </section>

      {/* BARIS 3: Tiga Menu Utama (Program & Pendaftaran) */}
      <section className="py-24 bg-black border-t border-white/10 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Grid 3 Kolom - Kolom pertama (Submission) lebih menonjol */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            
            {/* 1. Film Submission - Lebih mencolok */}
            <Link href="/submission" className="group block md:col-span-1 border border-white/30 rounded-xl overflow-hidden relative shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:-translate-y-2 transition-transform duration-300 bg-gradient-to-br from-white/10 to-transparent">
              <div className="absolute -right-8 -top-8 text-white/10 group-hover:text-white/20 transition-colors duration-500">
                <PlayCircle size={150} />
              </div>
              <div className="p-10 flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-4xl font-serif font-bold text-white mb-4 relative z-10 flex items-center gap-3">
                    <ArrowRight size={28} className="text-white group-hover:translate-x-2 transition-all" /> 
                    Film <br/> Submission
                  </h3>
                  <p className="text-gray-300 relative z-10 text-base mb-8 font-medium">
                    Panggilan untuk para sineas muda! Kirimkan karya terbaikmu.
                  </p>
                </div>
                <div className="inline-block border border-white/50 text-white font-mono text-sm px-4 py-2 rounded-full w-fit group-hover:bg-white group-hover:text-black transition-colors">
                  &lt; 5 Tim Terpilih
                </div>
              </div>
            </Link>

            {/* 2 & 3. Program Lainnya */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Program Kompetisi */}
              <Link href={`/program/${programs[0]?.id || ''}`} className="group block">
                <div className="h-full bg-white/5 border border-white/10 rounded-xl p-8 flex flex-col justify-center items-start transition-all duration-300 hover:bg-white/10 hover:-translate-y-2 relative overflow-hidden">
                  <h3 className="text-3xl font-serif font-bold text-white mb-4 relative z-10">Program Kompetisi</h3>
                  <p className="text-gray-400 relative z-10 text-sm mb-6">Mahaditya, Purwaseswa, dan Karyanagri. Menampilkan karya terbaik dari sineas berbakat.</p>
                  <div className="text-sm font-bold text-white/50 uppercase tracking-widest mt-auto group-hover:text-white/80 transition-colors">
                    15 Films Selected →
                  </div>
                </div>
              </Link>

              {/* Pameran Karya */}
              <Link href="/pameran" className="group block">
                <div className="h-full bg-white/5 border border-white/10 rounded-xl p-8 flex flex-col justify-center items-start transition-all duration-300 hover:bg-white/10 hover:-translate-y-2 relative overflow-hidden">
                  <h3 className="text-3xl font-serif font-bold text-white mb-4 relative z-10 w-full">
                    Pameran Karya
                  </h3>
                  <p className="text-gray-400 relative z-10 text-sm mb-6">Pameran instalasi seni dan karya visual di ruang publik Kotabaru.</p>
                  <div className="text-sm font-bold text-white/50 uppercase tracking-widest mt-auto group-hover:text-white/80 transition-colors flex items-center gap-2">
                    5 Tim Eksibisi <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Judul Seksi: Nama Program / Karyanya */}
          <div className="mb-8">
            <h2 className="text-3xl font-serif font-bold text-white">Program Mahaditya</h2>
          </div>
        </div>

        {/* Carousel 15 Film */}
        <div className="w-full pl-6 lg:pl-12 mb-12">
          <ProgramCarousel films={programs[0].films} programId={programs[0].id} />
        </div>
      </section>

      {/* Video Teaser (x3) */}
      <section className="py-24 bg-black border-t border-white/10 relative">
        <div className="container mx-auto px-6 lg:px-12">
           <h2 className="text-3xl font-serif font-bold text-white mb-12">
              Video Teaser
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Teaser 1 */}
              <div className="group cursor-pointer" onClick={() => openVideo("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1")}>
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-white/10 shadow-lg bg-white/5">
                  <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800" alt="Teaser 1" className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 shadow-2xl">
                      <Play size={24} className="text-white ml-1" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-serif group-hover:text-gray-300">Teaser KHFF 2026</h3>
                <p className="text-gray-500 text-sm">Cuplikan persiapan dan di balik layar festival film tahun ini.</p>
              </div>
              
              {/* Teaser 2 */}
              <div className="group cursor-pointer" onClick={() => openVideo("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4")}>
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-white/10 shadow-lg bg-white/5">
                  <img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800" alt="Teaser 2" className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 shadow-2xl">
                      <Play size={24} className="text-white ml-1" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-serif group-hover:text-gray-300">BTS: Pameran Karya</h3>
                <p className="text-gray-500 text-sm">Mengintip proses instalasi pameran seni di ruang publik Kotabaru.</p>
              </div>

              {/* Teaser 3 */}
              <div className="group cursor-pointer" onClick={() => openVideo("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4")}>
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-white/10 shadow-lg bg-white/5">
                  <img src="https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=800" alt="Teaser 3" className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 shadow-2xl">
                      <Play size={24} className="text-white ml-1" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-serif group-hover:text-gray-300">Highlight Film Purwaka</h3>
                <p className="text-gray-500 text-sm">Kompilasi adegan memukau dari film-film pilihan di program Purwaka.</p>
              </div>
            </div>
        </div>
      </section>

      {/* BARIS 4: Special Program (Full Width) */}
      <section className="py-24 bg-[#050505] border-t border-white/10 relative">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-3xl font-serif font-bold text-white mb-12">
            Special Program
          </h2>
          {specialPrograms.map((sp, idx) => (
            <div key={idx} className="relative w-full h-[50vh] md:h-[60vh] rounded-2xl overflow-hidden group border border-white/10 shadow-2xl mb-12 last:mb-0">
              {/* Besar foto memanjang */}
              <img src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=1600" alt={sp.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-50 group-hover:opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-8 md:p-16">
                <h3 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 drop-shadow-lg">{sp.title}</h3>
                <p className="text-gray-300 text-lg md:text-xl mb-6 max-w-3xl drop-shadow">
                  Public Lecture eksklusif bersama {sp.speaker} membicarakan sinema dan sejarah.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-white/80 font-mono text-xs md:text-sm">
                  <span className="flex items-center gap-2 border border-white/30 px-3 md:px-4 py-2 rounded-full backdrop-blur-md"><CalendarDays size={14}/> {sp.date}</span>
                  <span className="flex items-center gap-2 border border-white/30 px-3 md:px-4 py-2 rounded-full backdrop-blur-md"><Clock size={14}/> {sp.time}</span>
                  <span className="flex items-center gap-2 border border-white/30 px-3 md:px-4 py-2 rounded-full backdrop-blur-md"><MapPin size={14}/> {sp.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BARIS 5: Jadwal Seleksi (Timeline Vertikal) */}
      <section className="py-24 bg-black border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-16 text-center">
            Jadwal Seleksi / Klasifikasi
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-4">
            {schedule.map((day, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
                
                <div className="mb-8 border-b border-white/10 pb-6">
                  <span className="text-xs font-bold tracking-widest uppercase text-gray-500">{day.day}</span>
                  <h4 className="text-2xl font-serif font-bold text-white mt-2">{day.date}</h4>
                </div>
                
                <div className="space-y-6">
                  {day.events.map((ev, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <span className="text-gray-400 font-mono text-base shrink-0 font-light">{ev.time}</span>
                      <div>
                        <p className="text-gray-200 font-bold text-lg leading-snug mb-1">{ev.name}</p>
                        <p className="text-gray-500 text-sm flex items-center gap-2">
                          <MapPin size={14} /> {ev.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
             <Link href="/jadwal" className="inline-flex items-center gap-2 text-white font-bold border-b-2 border-white pb-1 hover:text-gray-300 hover:border-gray-300 transition-all text-lg">
                Lihat Jadwal Lengkap Keseluruhan <ArrowRight size={20} />
             </Link>
          </div>
        </div>
      </section>

      {/* BARIS 6: Registrasi (G-Form) */}
      <section className="py-32 bg-[#050505] border-t border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-black to-black z-0 pointer-events-none"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 drop-shadow-lg">
            Registrasi
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-12 text-xl">
            G-Form <br/>
            Amankan kursimu secara gratis. Akses seluruh penayangan film dan pameran karya.
          </p>
          <a
            href="https://forms.google.com" // Link G-Form
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full text-base font-semibold hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)]"
          >
            Isi Google Form Pendaftaran <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* Video Modal Popup */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <button 
            onClick={() => setIsVideoOpen(false)}
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2 bg-white/10 rounded-full hover:bg-white/20"
          >
            <X size={28} />
          </button>
          <div className="w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 relative scale-in-95 duration-300">
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
    </>
  );
}
