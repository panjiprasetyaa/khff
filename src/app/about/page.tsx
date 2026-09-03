import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  aboutDescription,
  prakataKadis,
  pengantarDirektur,
  catatanKuratorial
} from "@/data/about-data";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "Mengenal visi, sejarah, prakata, dan catatan kuratorial Kotabaru Heritage Film Festival 2026.",
};

export default function AboutUs() {
  return (
    <div className="bg-khff-navy text-khff-cream min-h-screen font-sans overflow-x-hidden w-full relative">
      
      {/* SECTION 1: HERO BANNER */}
      <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-khff-navy pt-20">
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="/assets/about/hero.webp"
            alt="KHFF Day 1-4"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-khff-navy/70 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-khff-navy via-transparent to-transparent z-10" />
        </div>
        
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center justify-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-black text-khff-cream mb-6 leading-tight drop-shadow-lg">
            Kotabaru Heritage <br className="hidden md:block" /> Film Festival
          </h1>
          <p className="text-lg md:text-2xl text-khff-cream font-semibold font-serif italic drop-shadow-[0_3px_15px_rgba(0,0,0,0.85)]">
            &ldquo;Menjaga Warisan, Merayakan Imajinasi&rdquo;
          </p>
        </div>
      </section>

      {/* SECTION 2: DESKRIPSI SEJARAH */}
      <section className="py-20 md:py-28 relative z-20">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl text-center">
          <p className="text-lg md:text-xl font-medium leading-relaxed text-khff-cream/90 whitespace-pre-wrap">
            {aboutDescription}
          </p>
        </div>
      </section>

      {/* SECTION 3: PRAKATA KEPALA DINAS */}
      <section className="py-24 md:py-32 relative border-t border-khff-cream/10">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="w-full md:w-5/12 shrink-0 relative">
              <div className="w-full rounded-[2rem] overflow-hidden border-2 border-khff-cream/20 shadow-2xl relative group">
                <img
                  src="/assets/about/kadis.webp"
                  alt="Yetti Martanti"
                  className="w-full h-auto object-cover object-center transition-all duration-700"
                />
              </div>
              {/* Decorative Accent */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-khff-yellow rounded-full mix-blend-multiply opacity-50 blur-2xl pointer-events-none" />
            </div>
            
            <div className="w-full md:w-7/12">
              <h2 className="text-4xl md:text-5xl font-serif font-black text-khff-cream mb-4">Prakata Kepala Dinas</h2>
              <h3 className="text-2xl font-bold font-serif text-white mb-8">Yetti Martanti, S.Sos., M.M.</h3>
              <div className="prose prose-invert prose-lg max-w-none text-khff-cream/80 font-medium leading-relaxed whitespace-pre-wrap">
                {prakataKadis}
              </div>
              {/* Deleted Salam Sinema */}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: PENGANTAR FESTIVAL */}
      <section className="py-24 md:py-32 bg-[#173e40] border-y border-khff-cream/10 relative">
        <div className="absolute top-20 right-10 opacity-5 w-48 pointer-events-none -rotate-12">
          <img src="/assets/illustrations/terompet.png" alt="" className="w-full" />
        </div>
        <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20">
            <div className="w-full md:w-5/12 shrink-0 relative">
              <div className="w-full rounded-[2rem] overflow-hidden border-2 border-khff-cream/20 shadow-2xl relative group">
                <img
                  src="/assets/about/direktur.webp"
                  alt="Siska Raharja"
                  className="w-full h-auto object-cover object-center transition-all duration-700"
                />
              </div>
              {/* Decorative Accent */}
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-khff-pink rounded-full mix-blend-multiply opacity-50 blur-2xl pointer-events-none" />
            </div>
            
            <div className="w-full md:w-7/12">
              <h2 className="text-4xl md:text-5xl font-serif font-black text-khff-cream mb-4">Pengantar Festival</h2>
              <h3 className="text-2xl font-bold font-serif text-white mb-8">Siska Raharja — <span className="text-khff-cream">Direktur Festival</span></h3>
              <div className="prose prose-invert prose-lg max-w-none text-khff-cream/80 font-medium leading-relaxed whitespace-pre-wrap">
                {pengantarDirektur}
              </div>
              {/* Deleted Selamat berfestival */}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: CATATAN KURATORIAL */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute bottom-10 left-0 opacity-5 w-96 pointer-events-none rotate-12">
          <img src="/assets/illustrations/bendera.png" alt="" className="w-full" />
        </div>
        <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-serif font-black text-khff-cream mb-4">Catatan Kuratorial</h2>
            <h3 className="text-xl md:text-2xl font-bold font-serif text-white">Suluh Pamuji — <span className="text-khff-pink">Kurator</span></h3>
          </div>
          
          <div className="flex flex-col md:flex-row gap-12 md:gap-16">
            <div className="w-full md:w-4/12 shrink-0">
              <div className="w-full rounded-[2rem] overflow-hidden border-2 border-khff-cream/20 shadow-2xl relative group sticky top-32">
                <img
                  src="/assets/about/kurator.webp"
                  alt="Suluh Pamuji"
                  className="w-full h-auto object-cover object-[center_top] transition-all duration-700"
                />
              </div>
            </div>
            
            <div className="w-full md:w-8/12">
              <div className="prose prose-invert prose-lg max-w-none text-khff-cream/80 font-medium leading-relaxed whitespace-pre-wrap columns-1">
                {catatanKuratorial}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6.5: DIRECT TO TIM FESTIVAL */}
      <section className="py-20 md:py-24 bg-khff-blue border-t border-khff-cream/10 relative overflow-hidden text-center">
        <div className="absolute top-10 right-10 opacity-5 w-64 pointer-events-none -rotate-12">
          <img src="/assets/illustrations/gong.png" alt="" className="w-full" />
        </div>
        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          <p className="text-khff-yellow font-mono text-xs md:text-sm uppercase tracking-widest font-bold mb-3">
            Di Balik Layar Festival
          </p>
          <h2 className="text-3xl md:text-5xl font-serif font-black mb-6 text-khff-cream">
            Segenap Tim & Kerabat Kerja
          </h2>
          <p className="text-khff-cream/80 text-base md:text-xl font-medium mb-10 max-w-2xl mx-auto">
            Temui dewan pengarah, kurator, dewan juri, programmer, dan seluruh kerabat kerja yang berkolaborasi mewujudkan KHFF 2026.
          </p>
          <Link
            href="/festival-team"
            className="inline-flex items-center gap-4 bg-khff-yellow text-khff-navy px-10 py-5 rounded-full font-black hover:bg-white transition-all duration-300 text-lg md:text-xl shadow-[0_10px_30px_rgba(238,173,47,0.3)] hover:scale-105 group"
          >
            <span>Kunjungi Halaman Tim Festival</span>
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>

      {/* SECTION 7: DIRECT TO GALERI */}
      <section className="py-32 bg-khff-yellow text-khff-navy text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           {/* Subtle pattern or noise can go here */}
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif font-black mb-10">
            Lihat Bagaimana Kami <br className="hidden md:block" /> Merayakan Imajinasi
          </h2>
          <Link
            href="/galeri"
            className="inline-flex items-center gap-4 bg-khff-navy text-white px-10 py-5 rounded-full font-black hover:bg-khff-pink transition-all duration-300 text-lg md:text-xl shadow-[0_10px_30px_rgba(29,77,79,0.4)] hover:scale-105 group"
          >
            <span>Arsip Visual Galeri KHFF</span>
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>
      
    </div>
  );
}
