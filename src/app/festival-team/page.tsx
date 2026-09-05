import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  festivalBoard,
  festivalJury,
  festivalTeam,
  creditGroups,
} from "@/data/about-data";

export const metadata: Metadata = {
  title: "Tim Festival",
  description:
    "Mengenal segenap Dewan Pengarah, Dewan Juri, Tim Pelaksana, dan Kerabat Kerja Kotabaru Heritage Film Festival 2026.",
};

export default function FestivalTeamPage() {
  return (
    <main className="min-h-screen bg-khff-navy text-khff-cream font-sans relative overflow-hidden">
      {/* HEADER SECTION (CINEMATIC GREEN TO YELLOW GRADIENT) */}
      <section className="pt-36 pb-28 px-6 bg-gradient-to-b from-khff-navy via-[#23585a] to-khff-yellow text-khff-cream relative z-10 w-full">
        <div className="container mx-auto max-w-6xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-khff-navy/80 border border-khff-cream/20 px-5 py-2 rounded-full text-khff-cream hover:bg-khff-yellow hover:text-khff-navy font-mono mb-8 transition-all text-sm font-black shadow-lg"
          >
            <ArrowLeft size={16} /> KEMBALI KE BERANDA
          </Link>

          <div className="max-w-4xl relative">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif font-black text-khff-cream mb-6 tracking-tight drop-shadow-lg">
              Tim Festival
            </h1>
            <p className="text-khff-cream/95 text-base sm:text-lg md:text-2xl font-medium leading-relaxed drop-shadow">
              Kekuatan kolaboratif, dedikasi, dan kerja bersama di balik perayaan
              sinema warisan budaya di jantung Kota Yogyakarta.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT SECTION (NAVY GREEN THEATER) */}
      <section className="bg-khff-navy text-khff-cream rounded-t-[3.5rem] py-20 md:py-24 px-6 shadow-2xl relative z-20 border-t-8 border-khff-pink overflow-hidden -mt-12">
        {/* Floating Heritage Illustrations in background */}
        <div className="absolute top-20 -right-10 opacity-10 pointer-events-none w-80 md:w-96">
          <img
            src="/assets/illustrations/gong.png"
            alt=""
            className="w-full h-auto"
          />
        </div>
        <div className="absolute top-1/3 -left-12 opacity-10 pointer-events-none w-72 md:w-96">
          <img
            src="/assets/illustrations/bendera.png"
            alt=""
            className="w-full h-auto"
          />
        </div>
        <div className="absolute bottom-1/4 -right-12 opacity-10 pointer-events-none w-72 md:w-96">
          <img
            src="/assets/illustrations/SINGA.png"
            alt=""
            className="w-full h-auto"
          />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          {/* Quick Navigation Tabs */}
          <div className="flex flex-wrap gap-3 md:gap-4 mb-16 pb-8 border-b border-khff-cream/20">
            <a
              href="#festival-board"
              className="px-6 py-3 rounded-2xl font-serif text-sm md:text-base bg-white/5 text-khff-cream/80 border border-khff-cream/20 hover:bg-khff-yellow hover:text-khff-navy hover:border-khff-yellow transition-all duration-300 shadow-md font-bold"
            >
              Festival Board
            </a>
            <a
              href="#festival-juri"
              className="px-6 py-3 rounded-2xl font-serif text-sm md:text-base bg-white/5 text-khff-cream/80 border border-khff-cream/20 hover:bg-khff-pink hover:text-white hover:border-khff-pink transition-all duration-300 shadow-md font-bold"
            >
              Festival Juri
            </a>
            <a
              href="#tim-festival"
              className="px-6 py-3 rounded-2xl font-serif text-sm md:text-base bg-white/5 text-khff-cream/80 border border-khff-cream/20 hover:bg-white hover:text-khff-navy hover:border-white transition-all duration-300 shadow-md font-bold"
            >
              Tim Festival
            </a>
            <a
              href="#kerabat-kerja"
              className="px-6 py-3 rounded-2xl font-serif text-sm md:text-base bg-white/5 text-khff-cream/80 border border-khff-cream/20 hover:bg-khff-yellow hover:text-khff-navy hover:border-khff-yellow transition-all duration-300 shadow-md font-bold"
            >
              Segenap Kerabat Kerja
            </a>
          </div>

          {/* SECTION 1: FESTIVAL BOARD */}
          <section id="festival-board" className="mb-24 scroll-mt-28">
            <div className="mb-10 flex flex-col items-center md:items-start">
              <span className="text-xs md:text-sm font-mono font-black uppercase tracking-[0.25em] text-khff-yellow mb-2">
                Direction & Advisory
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-black text-khff-cream tracking-tight drop-shadow-md">
                Festival Board
              </h2>
              <div className="w-20 h-1.5 bg-khff-yellow rounded-full mt-3"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 justify-items-center max-w-5xl mx-auto">
              {festivalBoard.map((person) => (
                <div
                  key={person.id}
                  className="flex flex-col bg-khff-cream rounded-[1.5rem] md:rounded-[2rem] overflow-hidden w-full max-w-[260px] shadow-xl hover:shadow-2xl transition-all duration-300 group border-2 border-khff-cream/10 hover:border-khff-yellow/50 text-left"
                >
                  {/* Top part: Text */}
                  <div className="p-4 md:p-5 flex flex-col justify-end min-h-[96px] bg-white">
                    <p className="text-khff-navy/60 font-mono text-[10px] md:text-xs tracking-widest uppercase mb-1 font-bold leading-tight line-clamp-2">
                      {person.role}
                    </p>
                    <h3 className="text-base md:text-xl font-black font-serif text-khff-navy leading-tight line-clamp-2">
                      {person.name}
                    </h3>
                  </div>
                  {/* Bottom part: Image */}
                  <div className="w-full aspect-square relative bg-khff-navy overflow-hidden">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-full h-full object-cover object-[center_top] group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 2: FESTIVAL JURI */}
          <section id="festival-juri" className="mb-24 scroll-mt-28">
            <div className="mb-10 flex flex-col items-center md:items-start">
              <span className="text-xs md:text-sm font-mono font-black uppercase tracking-[0.25em] text-khff-pink mb-2">
                Official Jury Board
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-black text-khff-cream tracking-tight drop-shadow-md">
                Festival Juri
              </h2>
              <div className="w-20 h-1.5 bg-khff-pink rounded-full mt-3"></div>
            </div>

            <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-4 md:gap-6 justify-items-center max-w-[840px] mx-auto">
              {festivalJury.map((person) => (
                <div
                  key={person.id}
                  className="flex flex-col bg-khff-cream rounded-[1.5rem] md:rounded-[2rem] overflow-hidden w-full max-w-[260px] shadow-xl hover:shadow-2xl transition-all duration-300 group border-2 border-khff-cream/10 hover:border-khff-pink/50 text-left"
                >
                  {/* Top part: Text */}
                  <div className="p-4 md:p-5 flex flex-col justify-end min-h-[96px] bg-white">
                    <p className="text-khff-navy/60 font-mono text-[10px] md:text-xs tracking-widest uppercase mb-1 font-bold leading-tight line-clamp-2">
                      {person.role}
                    </p>
                    <h3 className="text-base md:text-xl font-black font-serif text-khff-navy leading-tight line-clamp-2">
                      {person.name}
                    </h3>
                  </div>
                  {/* Bottom part: Image */}
                  <div className="w-full aspect-square relative bg-khff-navy overflow-hidden">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-full h-full object-cover object-[center_top] group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 3: TIM FESTIVAL */}
          <section id="tim-festival" className="mb-24 scroll-mt-28">
            <div className="mb-10 flex flex-col items-center md:items-start">
              <span className="text-xs md:text-sm font-mono font-black uppercase tracking-[0.25em] text-white/80 mb-2">
                Executive Team
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-black text-khff-cream tracking-tight drop-shadow-md">
                Tim Festival
              </h2>
              <div className="w-20 h-1.5 bg-white/70 rounded-full mt-3"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 justify-items-center max-w-5xl mx-auto">
              {festivalTeam.map((person) => (
                <div
                  key={person.id}
                  className="flex flex-col bg-khff-cream rounded-[1.5rem] md:rounded-[2rem] overflow-hidden w-full max-w-[260px] shadow-xl hover:shadow-2xl transition-all duration-300 group border-2 border-khff-cream/10 hover:border-white/50 text-left"
                >
                  {/* Top part: Text */}
                  <div className="p-4 md:p-5 flex flex-col justify-end min-h-[96px] bg-white">
                    <p className="text-khff-navy/60 font-mono text-[10px] md:text-xs tracking-widest uppercase mb-1 font-bold leading-tight line-clamp-2">
                      {person.role}
                    </p>
                    <h3 className="text-base md:text-xl font-black font-serif text-khff-navy leading-tight line-clamp-2">
                      {person.name}
                    </h3>
                  </div>
                  {/* Bottom part: Image */}
                  <div className="w-full aspect-square relative bg-khff-navy overflow-hidden">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-full h-full object-cover object-[center_top] group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 4: FESTIVAL CREW CREDITS */}
          <section id="kerabat-kerja" className="mb-24 scroll-mt-28">
            <div className="mb-12 flex flex-col items-center md:items-start">
              <span className="text-xs md:text-sm font-mono font-black uppercase tracking-[0.25em] text-khff-yellow mb-2">
                Festival Crew & Support
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-black text-khff-yellow tracking-wider drop-shadow-md">
                SEGENAP KERABAT KERJA
              </h2>
              <div className="w-20 h-1.5 bg-khff-yellow rounded-full mt-3"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto w-full">
              {creditGroups.map((group, groupIdx) => {
                const isLast = groupIdx === creditGroups.length - 1;
                return (
                  <div
                    key={groupIdx}
                    className={`bg-white/5 border border-khff-cream/15 rounded-3xl p-6 md:p-8 hover:bg-white/10 transition-all shadow-xl flex flex-col ${
                      isLast ? "md:col-span-2" : ""
                    }`}
                  >
                    <h3 className="text-base md:text-lg font-serif font-black text-khff-cream tracking-wider border-b border-khff-cream/15 pb-3 mb-6 uppercase">
                      {group.category}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {group.roles.map((item, idx) => (
                        <div key={idx} className="flex flex-col space-y-1">
                          <div className="text-khff-yellow/80 font-mono text-[10px] md:text-xs uppercase tracking-widest font-bold">
                            {item.role}
                          </div>
                          <div className="text-white font-serif font-bold text-base md:text-lg tracking-wide leading-snug">
                            {item.names.map((name, nIdx) => (
                              <div key={nIdx}>{name}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION 5: CALLOUT TO ABOUT & GALERI */}
          <div className="mt-20 rounded-3xl p-8 md:p-14 bg-gradient-to-br from-[#23585a] to-khff-navy border-4 border-khff-yellow text-center shadow-2xl relative overflow-hidden">
            <div className="absolute right-6 bottom-4 opacity-15 w-48 md:w-64 pointer-events-none">
              <img
                src="/assets/illustrations/terompet.png"
                alt=""
                className="w-full h-auto"
              />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h3 className="text-2xl md:text-4xl font-serif font-black text-white mb-4">
                Ingin Tahu Lebih Banyak Tentang KHFF?
              </h3>
              <p className="text-khff-cream/90 text-base md:text-xl font-medium mb-8 leading-relaxed">
                Pelajari sejarah festival, gagasan kuratorial, atau nikmati
                momen-momen terbaik melalui arsip dokumentasi kami.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link
                  href="/about"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-khff-yellow text-khff-navy px-8 py-4 rounded-full font-black hover:bg-white transition-all duration-300 text-base md:text-lg shadow-xl hover:scale-105"
                >
                  <span>Tentang Kami</span>
                  <ArrowRight size={20} />
                </Link>
                <Link
                  href="/galeri"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-khff-navy px-8 py-4 rounded-full font-black hover:bg-khff-pink hover:text-white transition-all duration-300 text-base md:text-lg shadow-xl hover:scale-105"
                >
                  <span>Lihat Arsip Galeri</span>
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
