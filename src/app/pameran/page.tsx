"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function PameranPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-khff-navy text-khff-cream font-sans relative overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="pt-36 pb-32 px-6 bg-gradient-to-b from-khff-navy via-[#23585a] to-khff-navy relative z-10 w-full min-h-[85vh] flex items-center justify-center">
        
        {/* Floating Decorative Characters */}
        <div className="absolute right-6 top-1/4 opacity-25 w-72 pointer-events-none hidden md:block animate-pulse">
          <img src="/assets/karakter/SINGA.png" alt="Singa" className="w-full h-auto drop-shadow-2xl" />
        </div>
        <div className="absolute left-6 -bottom-10 opacity-15 w-80 pointer-events-none hidden lg:block">
          <img src="/assets/karakter/butotumpuk.png" alt="Buto Tumpuk" className="w-full h-auto" />
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-20">
          <button 
            onClick={() => router.back()} 
            className="inline-flex items-center gap-2 bg-khff-yellow text-khff-navy font-mono text-sm font-black px-6 py-2.5 rounded-full hover:bg-white transition-all shadow-xl mb-12 cursor-pointer uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> KEMBALI
          </button>

          <span className="block text-xs md:text-sm font-mono font-black uppercase tracking-[0.3em] text-khff-yellow mb-4">
            Exhibition & Art Installations
          </span>

          <h1 className="text-5xl md:text-8xl font-serif font-black text-white mb-8 tracking-tight drop-shadow-lg">
            Pameran Karya.
          </h1>

          <div className="bg-white/5 border-2 border-khff-cream/20 p-8 md:p-12 rounded-3xl backdrop-blur-md shadow-2xl relative mb-12">
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-khff-pink mb-4">
              Eksibisi Kolaboratif Kotabaru 2026
            </h3>
            <p className="text-khff-cream/95 text-lg md:text-2xl font-medium leading-relaxed mb-6">
              Mengungkap dialog ruang antara masa lalu dan era kontemporer melalui instalasi seni digital, maket arsitektur warisan, dan pameran fotografi yang terintegrasi di seluruh penjuru kawasan Kotabaru.
            </p>
            <div className="inline-block bg-khff-navy/80 border border-khff-yellow/50 text-khff-yellow px-6 py-3 rounded-2xl font-mono text-sm font-black tracking-wider uppercase shadow">
              Daftar 5 Tim Eksibisi Akan Segera Diumumkan
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
