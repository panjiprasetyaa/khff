"use client";

import { ArrowLeft, ExternalLink, FolderOpen } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GaleriPage() {
  const router = useRouter();

  const albums = [
    {
      day: "Day 1",
      title: "Opening Ceremony & Kuliner",
      date: "17 September 2026",
      desc: "Foto suasana Aktivasi Tenant, Registrasi Drive-In Becak, Upacara Pembukaan, dan Screening Film Pembuka di Pasar Terban.",
      driveUrl: "https://drive.google.com",
      asset: "/assets/karakter/gedang.png",
      bg: "bg-khff-yellow text-khff-navy border-khff-yellow",
      tag: "bg-khff-navy text-khff-yellow"
    },
    {
      day: "Day 2",
      title: "Public Screening & Awards",
      date: "18 September 2026",
      desc: "Dokumentasi Mahaditya, Purwaseswa & Karyanagri Awards, screening Heritage, Directors Talks, serta antusiasme penonton di PDIN.",
      driveUrl: "https://drive.google.com",
      asset: "/assets/karakter/tebu.png",
      bg: "bg-khff-pink text-white border-khff-pink",
      tag: "bg-white text-khff-pink"
    },
    {
      day: "Day 3",
      title: "Festival & Closing Ceremony",
      date: "19 September 2026",
      desc: "Arsip visual penayangan National Heritage #2, KHFF Rewind #2, Malam Penganugerahan (Awarding Ceremony), dan penutupan festival di Lobby PDIN.",
      driveUrl: "https://drive.google.com",
      asset: "/assets/karakter/terompet.png",
      bg: "bg-white text-khff-navy border-white",
      tag: "bg-khff-navy text-white"
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
            <h1 className="text-6xl md:text-8xl font-serif font-black text-khff-cream mb-6 tracking-tight drop-shadow-lg">
              Galeri Festival.
            </h1>
            <p className="text-khff-cream/95 text-lg md:text-2xl font-medium leading-relaxed drop-shadow">
              Akses dan unduh seluruh arsip foto, dokumentasi suasana, dan potret kegiatan harian Kotabaru Heritage Film Festival langsung via Google Drive resmi.
            </p>
          </div>
        </div>
      </section>

      {/* ALBUMS GRID SECTION (NAVY GREEN THEATER) */}
      <section className="bg-khff-navy text-khff-cream rounded-t-[3.5rem] py-24 shadow-2xl relative z-20 border-t-8 border-khff-pink overflow-hidden -mt-12">
        <div className="absolute -bottom-10 right-0 opacity-10 pointer-events-none w-96">
          <img src="/assets/karakter/gong.png" alt="" className="w-full h-auto" />
        </div>

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {albums.map((album, idx) => (
              <a 
                key={idx} 
                href={album.driveUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block group h-full"
              >
                <div className={`rounded-3xl p-8 md:p-10 transition-all duration-500 relative overflow-hidden shadow-2xl border-4 group-hover:-translate-y-3 h-full flex flex-col justify-between min-h-[440px] ${album.bg}`}>
                  
                  {/* Decorative Heritage Artwork on bottom corner */}
                  <div className="absolute right-4 bottom-4 opacity-35 w-40 pointer-events-none group-hover:scale-110 group-hover:opacity-60 transition-all duration-700">
                    <img src={album.asset} alt="" className="w-full h-auto object-contain drop-shadow-md" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                      <span className={`text-xs font-mono font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm ${album.tag}`}>
                        {album.day}
                      </span>
                      <FolderOpen size={24} className="opacity-70 group-hover:scale-110 transition-transform" />
                    </div>

                    <p className="text-sm font-mono font-bold opacity-80 mb-2">{album.date}</p>
                    <h3 className="text-3xl font-serif font-black mb-4 leading-tight">
                      {album.title}
                    </h3>
                    <p className="text-base font-medium opacity-90 leading-relaxed mb-8">
                      {album.desc}
                    </p>
                  </div>

                  <div className="relative z-10 pt-6 border-t border-black/20 font-mono font-black text-base flex items-center justify-between group-hover:translate-x-1 transition-transform">
                    <span className="flex items-center gap-2">Buka Folder GDrive <ExternalLink size={18} /></span>
                    <span className="text-2xl">→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
