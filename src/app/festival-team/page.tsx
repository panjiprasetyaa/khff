import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    <div className="bg-khff-navy text-khff-cream min-h-screen font-sans overflow-x-hidden w-full relative">
      {/* HERO SECTION */}
      <section className="relative w-full pt-36 pb-20 md:pt-44 md:pb-28 bg-gradient-to-b from-khff-navy via-[#1f4a4c] to-khff-blue overflow-hidden border-b border-khff-cream/10">
        {/* Background decorative illustrations */}
        <div className="absolute top-16 right-5 md:right-16 opacity-10 w-44 md:w-64 pointer-events-none -rotate-12">
          <img
            src="/assets/illustrations/terompet.png"
            alt=""
            className="w-full h-auto"
          />
        </div>
        <div className="absolute -bottom-10 left-5 md:left-12 opacity-10 w-48 md:w-72 pointer-events-none rotate-12">
          <img
            src="/assets/illustrations/bendera.png"
            alt=""
            className="w-full h-auto"
          />
        </div>

        <div className="container mx-auto px-6 md:px-12 max-w-6xl relative z-10 text-center flex flex-col items-center">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black text-khff-cream mb-6 tracking-tight drop-shadow-md">
            Tim Festival
          </h1>

          <p className="text-lg md:text-2xl text-khff-cream/90 font-medium max-w-3xl mx-auto leading-relaxed mb-10">
            Kekuatan kolaboratif, dedikasi, dan kerja bersama di balik perayaan
            sinema warisan budaya di jantung Kota Yogyakarta.
          </p>

          {/* Quick Jump Anchor Links */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-xs md:text-sm font-mono font-bold tracking-wider">
            <a
              href="#festival-board"
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-khff-yellow hover:text-khff-navy border border-khff-cream/20 transition-all duration-300"
            >
              FESTIVAL BOARD
            </a>
            <a
              href="#festival-juri"
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-khff-yellow hover:text-khff-navy border border-khff-cream/20 transition-all duration-300"
            >
              FESTIVAL JURI
            </a>
            <a
              href="#tim-festival"
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-khff-yellow hover:text-khff-navy border border-khff-cream/20 transition-all duration-300"
            >
              TIM FESTIVAL
            </a>
            <a
              href="#kerabat-kerja"
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-khff-yellow hover:text-khff-navy border border-khff-cream/20 transition-all duration-300"
            >
              SEGENAP KERABAT KERJA
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 1: FESTIVAL BOARD */}
      <section
        id="festival-board"
        className="py-20 md:py-28 bg-khff-blue relative overflow-hidden"
      >
        <div className="absolute top-10 left-10 opacity-5 w-64 pointer-events-none">
          <img src="/assets/illustrations/gong.png" alt="" className="w-full" />
        </div>

        <div className="container mx-auto px-6 md:px-12 max-w-6xl relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-serif font-black text-khff-cream mb-16 drop-shadow-md">
            Festival Board
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 justify-items-center max-w-5xl mx-auto">
            {festivalBoard.map((person) => (
              <div
                key={person.id}
                className="flex flex-col bg-khff-cream rounded-[1.5rem] md:rounded-[2rem] overflow-hidden w-full max-w-[220px] shadow-xl hover:shadow-2xl transition-all duration-300 group border-2 border-khff-cream/10 text-left"
              >
                {/* Top part: Text */}
                <div className="p-4 md:p-5 flex flex-col justify-end min-h-[100px] bg-white">
                  <p className="text-khff-navy/60 font-mono text-[10px] md:text-xs tracking-widest uppercase mb-1 font-bold leading-tight line-clamp-2">
                    {person.role}
                  </p>
                  <h3 className="text-lg md:text-xl font-black font-serif text-khff-navy leading-tight line-clamp-2">
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
        </div>
      </section>

      {/* SECTION 2: FESTIVAL JURI */}
      <section
        id="festival-juri"
        className="py-20 md:py-28 bg-[#173e40] border-t border-khff-cream/10 relative overflow-hidden"
      >
        <div className="container mx-auto px-6 md:px-12 max-w-6xl relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-serif font-black text-khff-cream mb-16 drop-shadow-md">
            Festival Juri
          </h2>

          <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-4 md:gap-6 justify-items-center max-w-[740px] mx-auto">
            {festivalJury.map((person) => (
              <div
                key={person.id}
                className="flex flex-col bg-khff-cream rounded-[1.5rem] md:rounded-[2rem] overflow-hidden w-full max-w-[220px] shadow-xl hover:shadow-2xl transition-all duration-300 group border-2 border-khff-cream/10 text-left"
              >
                {/* Top part: Text */}
                <div className="p-4 md:p-5 flex flex-col justify-end min-h-[100px] bg-white">
                  <p className="text-khff-navy/60 font-mono text-[10px] md:text-xs tracking-widest uppercase mb-1 font-bold leading-tight line-clamp-2">
                    {person.role}
                  </p>
                  <h3 className="text-lg md:text-xl font-black font-serif text-khff-navy leading-tight line-clamp-2">
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
        </div>
      </section>

      {/* SECTION 3: TIM FESTIVAL */}
      <section
        id="tim-festival"
        className="py-20 md:py-28 bg-khff-blue border-t border-khff-cream/10 relative overflow-hidden"
      >
        <div className="container mx-auto px-6 md:px-12 max-w-6xl relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-serif font-black text-khff-cream mb-16 drop-shadow-md">
            Tim Festival
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 justify-items-center max-w-5xl mx-auto">
            {festivalTeam.map((person) => (
              <div
                key={person.id}
                className="flex flex-col bg-khff-cream rounded-[1.5rem] md:rounded-[2rem] overflow-hidden w-full max-w-[220px] shadow-xl hover:shadow-2xl transition-all duration-300 group border-2 border-khff-cream/10 text-left"
              >
                {/* Top part: Text */}
                <div className="p-4 md:p-5 flex flex-col justify-end min-h-[100px] bg-white">
                  <p className="text-khff-navy/60 font-mono text-[10px] md:text-xs tracking-widest uppercase mb-1 font-bold leading-tight line-clamp-2">
                    {person.role}
                  </p>
                  <h3 className="text-lg md:text-xl font-black font-serif text-khff-navy leading-tight line-clamp-2">
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
        </div>
      </section>

      {/* SECTION 4: FESTIVAL CREW CREDITS */}
      <section
        id="kerabat-kerja"
        className="py-24 md:py-32 bg-khff-navy border-t border-khff-cream/10 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center select-none">
          <span className="text-[8rem] md:text-[14rem] font-serif font-black tracking-widest text-khff-cream uppercase opacity-5">
            KHFF 2026
          </span>
        </div>

        <div className="container mx-auto px-6 md:px-12 max-w-4xl relative z-10 text-center">
          <div className="mb-20">
            <h2 className="text-3xl md:text-5xl font-serif font-black text-khff-yellow mb-3 tracking-wider">
              SEGENAP KERABAT KERJA
            </h2>
            <p className="text-xs md:text-sm font-mono text-khff-cream/60 uppercase tracking-widest">
              Festival Crew & Support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20 max-w-6xl mx-auto w-full">
            {creditGroups.map((group, groupIdx) => {
              const isLast = groupIdx === creditGroups.length - 1;
              return (
                <div
                  key={groupIdx}
                  className={`space-y-8 flex flex-col items-center w-full ${
                    isLast ? "md:col-span-2" : ""
                  }`}
                >
                  <h3 className="text-base md:text-lg font-serif font-black text-khff-cream tracking-wider border-b border-khff-cream/15 pb-2 inline-block px-8 uppercase">
                    {group.category}
                  </h3>

                  <div className="flex flex-col gap-y-6 w-full text-center">
                    {group.roles.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center space-y-1"
                      >
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
        </div>
      </section>

      {/* SECTION 5: CALLOUT TO ABOUT & GALERI */}
      <section className="py-24 bg-khff-yellow text-khff-navy text-center relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-serif font-black mb-6">
            Ingin Tahu Lebih Banyak Tentang KHFF?
          </h2>
          <p className="text-khff-navy/80 text-base md:text-xl font-medium mb-10 max-w-2xl mx-auto">
            Pelajari sejarah festival, gagasan kuratorial, atau nikmati
            momen-momen terbaik melalui arsip dokumentasi kami.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-khff-navy text-white px-8 py-4 rounded-full font-bold hover:bg-khff-pink transition-all duration-300 text-base md:text-lg shadow-xl hover:scale-105"
            >
              <span>Tentang Kami</span>
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/galeri"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-khff-navy px-8 py-4 rounded-full font-bold hover:bg-khff-navy hover:text-white transition-all duration-300 text-base md:text-lg shadow-xl hover:scale-105"
            >
              <span>Lihat Arsip Galeri</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
