"use client";

import { useState, use, useEffect } from "react";
import { films } from "@/data/dummy";
import { Play, X, ArrowLeft, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function FilmDetail({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
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
    <main className="min-h-screen pt-24 pb-16 bg-black relative">
      <div className="absolute inset-0 z-0 opacity-10 bg-cover bg-center blur-3xl" style={{ backgroundImage: `url(${film.posterUrl})` }}></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-10 transition-colors">
          <ArrowLeft size={20} /> Kembali
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Poster Section */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl border border-white/10 group cursor-pointer" onClick={() => setIsVideoOpen(true)}>
              <img src={film.posterUrl} alt={film.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 hover:bg-white/40 transition-colors shadow-2xl">
                  <Play size={32} className="text-white ml-2" />
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="md:col-span-8 lg:col-span-9">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 leading-tight">
              {film.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-400 font-mono text-sm mb-8">
              <span className="flex items-center gap-2 border border-white/20 px-3 py-1 rounded-full"><Calendar size={16} /> {film.year}</span>
              <span className="flex items-center gap-2 border border-white/20 px-3 py-1 rounded-full"><Clock size={16} /> {film.duration} Menit</span>
              <span className="uppercase tracking-widest text-white/70">Sutradara: {film.director}</span>
            </div>

            <div className="prose prose-invert max-w-3xl">
              <h3 className="text-xl text-white font-serif mb-4 flex items-center gap-4">
                <span className="w-6 h-[1px] bg-white"></span> Sinopsis
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-10">
                {film.synopsis}
              </p>
            </div>

            <button 
              onClick={() => setIsVideoOpen(true)}
              className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105"
            >
              <Play size={20} fill="currentColor" /> Putar Trailer
            </button>
          </div>
        </div>
      </div>

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
