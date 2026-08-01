"use client";

import { useState, use, useEffect } from "react";
import { films } from "@/data/dummy";
import { Play, X, ArrowLeft } from "lucide-react";
import { notFound, useRouter } from "next/navigation";

export default function FilmDetail({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const film = films[unwrappedParams.id];
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    if (isVideoOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isVideoOpen]);

  if (!film) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-36 pb-28 bg-khff-navy text-khff-cream relative font-sans overflow-hidden">
      {/* Background ambient lighting and poster blur */}
      <div className="absolute inset-0 z-0 opacity-15 bg-cover bg-center blur-3xl mix-blend-screen" style={{ backgroundImage: `url(${film.posterUrl})` }}></div>
      
      {/* Decorative Character Artworks */}
      <div className="absolute top-20 right-10 opacity-30 w-48 pointer-events-none z-0 mix-blend-screen">
        <img src="/assets/karakter/geni2.png" alt="Geni" className="w-full h-auto" />
      </div>
      <div className="absolute bottom-10 right-20 opacity-25 w-72 pointer-events-none z-0">
        <img src="/assets/karakter/cahaya.png" alt="Cahaya" className="w-full h-auto" />
      </div>
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* Smart Navigation Back Button */}
        <button 
          onClick={() => router.back()} 
          className="inline-flex items-center gap-3 bg-white/10 border border-khff-cream/20 px-6 py-2.5 rounded-full text-khff-cream hover:bg-khff-yellow hover:text-khff-navy font-mono mb-12 transition-all text-sm font-black shadow-xl cursor-pointer"
        >
          <ArrowLeft size={18} /> KEMBALI
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Poster Section */}
          <div className="md:col-span-5 lg:col-span-4">
            <div className="relative aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-khff-yellow/40 group cursor-pointer" onClick={() => setIsVideoOpen(true)}>
              <img src={film.posterUrl} alt={film.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-khff-navy/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-20 h-20 bg-khff-yellow text-khff-navy rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(236,172,45,0.6)] group-hover:scale-110 transition-transform">
                  <Play size={32} fill="currentColor" className="ml-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Info & Editorial Section */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono tracking-[0.25em] uppercase font-black text-khff-pink block mb-3">
                Official Festival Selection
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black text-white mb-8 leading-tight drop-shadow-lg">
                {film.title}
              </h1>

              {/* Editorial Ticket-Style Spec Box */}
              <div className="grid grid-cols-3 gap-4 border-y border-khff-cream/20 py-6 mb-10 font-mono text-sm bg-white/5 px-6 rounded-2xl shadow-inner">
                <div>
                  <span className="block text-xs uppercase text-khff-cream/50 font-black mb-1">Tahun Rilis</span>
                  <span className="text-khff-yellow font-bold text-lg">{film.year}</span>
                </div>
                <div className="border-l border-khff-cream/20 pl-4">
                  <span className="block text-xs uppercase text-khff-cream/50 font-black mb-1">Durasi Film</span>
                  <span className="text-white font-bold text-lg">{film.duration} Menit</span>
                </div>
                <div className="border-l border-khff-cream/20 pl-4">
                  <span className="block text-xs uppercase text-khff-cream/50 font-black mb-1">Sutradara</span>
                  <span className="text-khff-pink font-bold text-lg truncate block">{film.director}</span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <h3 className="text-xl font-serif font-black text-khff-yellow mb-4 flex items-center gap-4">
                  <span className="w-8 h-1 bg-khff-pink rounded-full"></span> Sinopsis Cerita
                </h3>
                <p className="text-khff-cream/95 text-lg md:text-xl font-medium leading-relaxed mb-12">
                  {film.synopsis}
                </p>
              </div>
            </div>

            <button 
              onClick={() => setIsVideoOpen(true)}
              className="w-full sm:w-auto self-start inline-flex items-center justify-center gap-4 bg-khff-yellow text-khff-navy px-10 py-5 rounded-2xl text-xl font-black font-mono hover:bg-white transition-all shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:scale-105 cursor-pointer"
            >
              <Play size={24} fill="currentColor" /> PUTAR TRAILER
            </button>
          </div>
        </div>
      </div>

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
            <iframe 
              className="w-full h-full"
              src={`${film.trailerUrl}?autoplay=1`} 
              title="Trailer" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </main>
  );
}
