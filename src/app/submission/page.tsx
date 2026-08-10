"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function SubmissionPage() {
  const router = useRouter();
  const gFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSe5QTD0-Anc64hxcO5rcslJgYxc2HlhjGOUbXmv6Jig_PNQSA/viewform?usp=publish-editor";

  return (
    <main className="min-h-screen bg-khff-navy text-khff-cream font-sans relative overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="pt-36 pb-32 px-6 bg-gradient-to-b from-khff-navy via-[#284f52] to-khff-navy relative z-10 w-full min-h-[85vh] flex items-center justify-center">
        
        {/* Floating Decorative Characters */}
        <div className="absolute right-8 bottom-10 opacity-35 w-72 pointer-events-none hidden md:block mix-blend-screen animate-pulse">
          <img src="/assets/karakter/genigeni.png" alt="Geni" className="w-full h-auto drop-shadow-xl" />
        </div>
        <div className="absolute left-6 top-1/3 opacity-20 w-60 pointer-events-none hidden lg:block">
          <img src="/assets/karakter/buto2.png" alt="Buto" className="w-full h-auto" />
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-20">
          <button 
            onClick={() => router.back()} 
            className="inline-flex items-center gap-2 bg-khff-yellow text-khff-navy font-mono text-sm font-black px-6 py-2.5 rounded-full hover:bg-white transition-all shadow-xl mb-12 cursor-pointer uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> KEMBALI
          </button>

          <span className="block text-xs md:text-sm font-mono font-black uppercase tracking-[0.3em] text-khff-pink mb-4">
            Call for Entries 2026
          </span>

          <h1 className="text-5xl md:text-8xl font-serif font-black text-white mb-8 tracking-tight drop-shadow-lg">
            Film Submission
          </h1>

          <div className="bg-white/5 border-2 border-khff-cream/20 p-8 md:p-14 rounded-3xl backdrop-blur-md shadow-2xl relative mb-12">
            <h3 className="text-2xl md:text-4xl font-serif font-black text-white mb-6">
              Ajang Apresiasi Sinema Pendek Nusantara
            </h3>
            <p className="text-khff-cream/95 text-lg md:text-2xl font-medium leading-relaxed mb-8">
              Jadilah bagian dari perayaan persilangan sinema dan warisan budaya. Kirimkan karya film fiksi, dokumenter, atau eksperimental terbaikmu untuk berkompetisi di KHFF 2026.
            </p>
            
            <a
              href={gFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-khff-yellow text-khff-navy font-black text-lg px-10 py-5 rounded-2xl hover:bg-white transition-all shadow-2xl hover:scale-105"
            >
              Daftarkan Karya Sekarang <ArrowRight size={22} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
