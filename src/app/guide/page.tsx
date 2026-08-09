"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function GuidePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-khff-navy text-khff-cream font-sans relative overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="pt-36 pb-32 px-6 bg-gradient-to-b from-khff-navy via-[#1f4a4d] to-khff-pink/20 relative z-10 w-full min-h-[85vh] flex items-center justify-center">
        
        {/* Floating Decorative Characters */}
        <div className="absolute right-10 top-1/4 opacity-30 w-64 pointer-events-none hidden md:block mix-blend-screen animate-pulse">
          <img src="/assets/karakter/cahaya.png" alt="Cahaya KHFF" className="w-full h-auto" />
        </div>
        <div className="absolute left-8 bottom-12 opacity-20 w-52 pointer-events-none hidden md:block rotate-12">
          <img src="/assets/karakter/tebu.png" alt="Tebu" className="w-full h-auto" />
        </div>



        <div className="container mx-auto max-w-4xl relative z-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-8xl font-serif font-black text-white mb-8 tracking-tight drop-shadow-lg">
              Festival Guide
            </h1>

            <div className="bg-white/5 border-2 border-khff-cream/20 p-8 md:p-14 rounded-3xl backdrop-blur-md shadow-2xl relative mb-12">
              <h3 className="text-2xl md:text-4xl font-serif font-black text-khff-yellow mb-6">
                Panduan Menjelajahi Sinema & Warisan
              </h3>
              <p className="text-khff-cream/95 text-lg md:text-2xl font-medium leading-relaxed mb-8">
                Buku panduan digital resmi Kotabaru Heritage Film Festival 2026 berisi direktori venue, peta rute becak Drive-In, jadwal penayangan lengkap, dan catatan kurator festival.
              </p>
              <div className="inline-block bg-khff-pink text-white px-8 py-4 rounded-2xl font-mono text-sm md:text-base font-black tracking-widest uppercase shadow-xl">
                [ e-Book PDF Segera Tersedia ]
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
