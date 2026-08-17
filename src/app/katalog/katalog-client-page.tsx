"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function KatalogClientPage() {
  const router = useRouter();

  const catalogArchives = [
    {
      year: "2024",
      title: "E-Katalog KHFF 2024",
      edition: "Edisi Kedua - Arsip Lengkap",
      desc: "Dokumentasi kuratorial program festival, kurasi sinema nusantara, forum kuliah terbuka, dan catatan penghargaan karya tahun 2024.",
      pdfUrl: "/assets/catalog/e-katalog-khff-2024.pdf",
      fileSize: "15 MB",
      bg: "bg-khff-yellow text-khff-navy border-khff-yellow",
      tag: "bg-khff-navy text-khff-yellow",
      asset: "/assets/illustrations/cahaya.png"
    },
    {
      year: "2023",
      title: "E-Katalog KHFF 2023",
      edition: "Edisi Perdana - Arsip Lengkap",
      desc: "Rekam jejak edisi perdana Kotabaru Heritage Film Festival. Catatan kurator, daftar seleksi karya film pendek, dan jejak langkah pengarsipan sejarah.",
      pdfUrl: "/assets/catalog/e-katalog-khff-2023.pdf",
      fileSize: "4.8 MB",
      bg: "bg-khff-pink text-white border-khff-pink",
      tag: "bg-white text-khff-pink",
      asset: "/assets/illustrations/buto2.png"
    }
  ];

  return (
    <main className="min-h-screen bg-khff-navy text-khff-cream font-sans relative overflow-hidden">
      
      {/* HEADER SECTION (CINEMATIC GREEN TO YELLOW GRADIENT) */}
      <section className="pt-36 pb-28 px-6 bg-gradient-to-b from-khff-navy via-[#23585a] to-khff-yellow text-khff-cream relative z-10 w-full">
        <div className="container mx-auto max-w-6xl">
          <button 
            onClick={() => router.back()} 
            className="inline-flex items-center gap-2 bg-khff-navy/80 border border-khff-cream/20 px-5 py-2 rounded-full text-khff-cream hover:bg-khff-yellow hover:text-khff-navy font-mono mb-8 transition-all text-sm font-black shadow-lg cursor-pointer"
          >
            <ArrowLeft size={16} /> KEMBALI
          </button>
          
          <div className="max-w-4xl">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif font-black text-khff-cream mb-6 tracking-tight drop-shadow-lg">
              Arsip Katalog
            </h1>
            <p className="text-khff-cream/95 text-base sm:text-lg md:text-2xl font-medium leading-relaxed drop-shadow">
              Jelajahi dan unduh catatan kuratorial, profil sineas nusantara, esai pemikiran, serta arsip karya sinematik dari edisi Kotabaru Heritage Film Festival tahun-tahun sebelumnya.
            </p>
          </div>
        </div>
      </section>

      {/* CATALOG GRID SECTION (NAVY GREEN THEATER) */}
      <section className="bg-khff-navy text-khff-cream rounded-t-[3.5rem] py-24 shadow-2xl relative z-20 border-t-8 border-khff-pink overflow-hidden -mt-12">
        {/* Background Characters */}
        <div className="absolute top-20 -left-10 opacity-10 pointer-events-none w-64 md:w-96">
          <img src="/assets/illustrations/SINGA.png" alt="" className="w-full h-auto drop-shadow-2xl" />
        </div>
        <div className="absolute -bottom-10 right-0 opacity-10 pointer-events-none w-64 md:w-96">
          <img src="/assets/illustrations/gong.png" alt="" className="w-full h-auto drop-shadow-2xl" />
        </div>

        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {catalogArchives.map((cat, idx) => (
              <a 
                key={idx} 
                href={cat.pdfUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block group h-full"
              >
                <div className={`rounded-3xl p-8 sm:p-10 transition-all duration-500 relative overflow-hidden shadow-2xl border-4 group-hover:-translate-y-3 h-full flex flex-col justify-between min-h-[420px] ${cat.bg}`}>
                  
                  {/* Decorative Heritage Artwork on bottom corner */}
                  <div className="absolute right-[-10px] bottom-[-10px] sm:right-4 sm:bottom-4 opacity-40 w-36 sm:w-44 pointer-events-none group-hover:scale-110 group-hover:opacity-50 transition-all duration-700">
                    <img src={cat.asset} alt="" className="w-full h-auto object-contain drop-shadow-md" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center mb-6">
                      <span className={`text-xs font-mono font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm ${cat.tag}`}>
                        {cat.year}
                      </span>
                    </div>

                    <p className="text-sm font-mono font-bold opacity-90 mb-2 tracking-wider uppercase">{cat.edition}</p>
                    <h3 className="text-3xl sm:text-4xl font-serif font-black mb-4 leading-tight">
                      {cat.title}
                    </h3>
                    <p className="opacity-90 text-base sm:text-lg font-medium leading-relaxed mb-8 max-w-md">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="relative z-10 pt-6 border-t border-current/20 flex items-center justify-end">
                    <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform shrink-0" />
                  </div>

                </div>
              </a>
            ))}
          </div>

          <div className="mt-20 p-8 sm:p-10 bg-white/5 border border-khff-cream/10 rounded-3xl text-center max-w-3xl mx-auto backdrop-blur-sm">
            <h4 className="text-2xl font-serif font-bold text-khff-yellow mb-3">
              Katalog KHFF 2026
            </h4>
            <p className="text-khff-cream/80 text-base sm:text-lg font-medium leading-relaxed">
              E-Katalog untuk edisi tahun 2026 sedang dalam tahapan kurasi dan pengumpulan karya. Akan tersedia untuk diunduh segera setelah jadwal festival resmi diumumkan.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}
