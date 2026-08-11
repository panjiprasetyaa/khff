"use client";

import Link from "next/link";
import { ArrowRight, PlayCircle, Play, X, ExternalLink } from "lucide-react";
import { programs, specialPrograms, praEvents } from "@/data/dummy";
import { useState, useEffect } from "react";
import CustomVideoPlayer from "@/components/CustomVideoPlayer";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";

/*
const homepageSchedule = [
  {
    day: "Day 1 - Opening",
    date: "Kamis, 17 September 2026",
    events: [
      {
        time: "16.00",
        name: "Aktivasi Tenant & Kuliner",
        location: "Area Tenant",
      },
      {
        time: "17.30",
        name: "Registrasi & Becak Drive-In",
        location: "Halaman Pasar Terban",
      },
      {
        time: "19.15",
        name: "Opening Ceremony",
        location: "Lobby Pasar Terban",
      },
      { time: "20.30", name: "Opening Film", location: "Halaman Pasar Terban" },
    ],
  },
  {
    day: "Day 2 - Festival",
    date: "Jumat, 18 September 2026",
    events: [
      {
        time: "13.15",
        name: "Mahaditya Awards & KHFF Rewind #1",
        location: "PDIN",
      },
      {
        time: "15.15",
        name: "National Heritage #1 & Purwaseswa Awards",
        location: "PDIN",
      },
      {
        time: "19.15",
        name: "Karyanagri Awards & International Heritage",
        location: "PDIN",
      },
    ],
  },
  {
    day: "Day 3 - Festival & Closing",
    date: "Sabtu, 19 September 2026",
    events: [
      { time: "13.15", name: "National Heritage #2", location: "PDIN" },
      { time: "15.15", name: "KHFF Rewind #2", location: "PDIN" },
      {
        time: "19.15",
        name: "Closing Awarding Ceremony",
        location: "Lobby PDIN",
      },
      { time: "20.00", name: "Closing Film", location: "Lobby PDIN" },
    ],
  },
];
*/

export default function Home() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [activeVideoTrailer, setActiveVideoTrailer] = useState("");

  const openVideo = (url: string) => {
    setActiveVideoTrailer(url);
    setIsVideoOpen(true);
  };

  useEffect(() => {
    if (isVideoOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isVideoOpen]);

  return (
    <div className="bg-khff-yellow text-khff-navy min-h-screen font-sans overflow-x-hidden w-full relative">
      {/* 1. HERO SECTION (FULL ARTWORK BACKGROUND WITH READABILITY OVERLAY) */}
      <section className="relative min-h-[92vh] sm:min-h-screen w-full flex items-center justify-center overflow-hidden bg-khff-navy pt-36 pb-24">
        {/* Full Artwork Background with Aspect Ratio Preservation (No Stretched / Gepeng Distortion) */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          {/* Portrait Image for Mobile */}
          <img
            src="/assets/cover-web-potrait.png"
            alt="KHFF 2026 Artwork Parade & Cinema Strip (Portrait)"
            className="block sm:hidden w-full h-full object-cover object-center"
          />
          {/* Landscape Image for Desktop */}
          <img
            src="/assets/background-baru.jpeg"
            alt="KHFF 2026 Artwork Parade & Cinema Strip"
            className="hidden sm:block w-full h-full object-cover object-[center_bottom] sm:object-[center_85%]"
          />
        </div>

        {/* Editorial Readability Gradient Overlay - Lighter center to let sunset glow, dark bottom to seamlessly melt into Section 2 */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-khff-navy/70 via-khff-navy/30 to-khff-navy/95 pointer-events-none" />

        {/* Center Text Container with High Contrast Typography & Subtle Glass Staging */}
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-5xl md:text-5xl lg:text-7xl font-serif font-black text-khff-cream mb-6 leading-[0.9] tracking-tight drop-shadow-[0_6px_35px_rgba(0,0,0,0.85)]">
            Kotabaru Heritage <br /> Film Festival <br /> 2026
          </h1>
          <p className="text-sm sm:text-lg md:text-3xl font-mono mb-6 tracking-wide md:tracking-widest font-black py-2 inline-block text-khff-yellow drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)]">
            <span className="text-khff-cream drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)]">
              17-19 September 2026
            </span>
            <br></br>
            <span className="text-khff-yellow drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)]">
              Pasar Terban & PDIN Kotabaru, Yogyakarta
            </span>
          </p>
          <p className="text-base md:text-2xl text-khff-cream max-w-3xl mx-auto font-semibold leading-relaxed drop-shadow-[0_3px_15px_rgba(0,0,0,0.85)]">
            “Menjaga Warisan, Merayakan Imajinasi”
          </p>
        </div>
      </section>

      {/* 2. PRA-EVENT PANORAMA (CINEMATIC HERITAGE GRADIENT) */}
      <section className="py-24 bg-gradient-to-b from-khff-navy via-[#23585a] to-khff-yellow text-khff-cream relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 mb-16 text-center relative z-10">
          <span className="text-sm md:text-base uppercase font-mono tracking-[0.3em] font-black text-khff-yellow bg-white/10 border border-khff-cream/20 px-6 py-2 rounded-full inline-block mb-6 shadow-md">
            Pra Event KHFF 2026
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif font-black text-white mb-6 tracking-tight drop-shadow-lg">
            Panorama
          </h2>
          <p className="text-khff-cream/95 text-lg sm:text-xl md:text-2xl font-mono font-bold max-w-3xl mx-auto leading-relaxed drop-shadow mb-6">
            Periode Penayangan : 19 Juli - 12 September 2026
          </p>
          <p className="text-khff-cream/80 text-base md:text-lg font-medium max-w-4xl mx-auto leading-relaxed">
            PANORAMA merupakan program pra-event Kotabaru Heritage Film Festival
            (KHFF) 2026 yang menghadirkan kembali sepuluh film pendek Program
            Panorama KHFF 2024 melalui kanal YouTube @kebudayaanjogjakota.
            Didukung oleh Dinas Kebudayaan Kota Yogyakarta, satu film akan
            tayang setiap minggu sebagai bagian dari perjalanan menuju KHFF
            2026.
          </p>
          <a
            href="https://www.youtube.com/playlist?list=PLH6gQAT9xGRw"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 mt-8 bg-khff-pink text-white hover:bg-white hover:text-khff-navy font-mono font-black text-base transition-all duration-300 px-8 py-4 rounded-full shadow-2xl hover:scale-105"
          >
            <span>Tonton Seluruh Arsip di YouTube</span>{" "}
            <PlayCircle size={22} className="shrink-0" />
          </a>
        </div>

        {/* Swiper Slider for Posters with Transparent Arrows (Netflix Style) */}
        <div className="relative z-10 w-full group/slider overflow-hidden pt-6 pb-10">
          {/* MOBILE SWIPER (Snap & Scale, No FreeMode) */}
          <div className="block md:hidden">
            <Swiper
              modules={[Navigation, Scrollbar, Mousewheel]}
              navigation={{
                nextEl: ".swiper-button-next-custom",
                prevEl: ".swiper-button-prev-custom",
              }}
              scrollbar={{ draggable: true, hide: false }}
              mousewheel={{ forceToAxis: true }}
              grabCursor={true}
              centeredSlides={true}
              slideToClickedSlide={true}
              spaceBetween={24}
              slidesPerView="auto"
              className="w-full px-6 py-4 !overflow-visible"
              style={{
                "--swiper-scrollbar-drag-bg-color": "rgba(255, 255, 255, 0.4)",
                "--swiper-scrollbar-bg-color": "transparent",
                "--swiper-scrollbar-bottom": "-20px",
                "--swiper-scrollbar-size": "5px",
              } as React.CSSProperties}
            >
              {praEvents.map((event) => (
                <SwiperSlide key={`mobile-${event.id}`} className="!w-auto !h-auto">
                  <div className="w-[260px] h-[380px] rounded-3xl overflow-hidden relative shadow-2xl bg-khff-navy border-4 border-white/20 transition-all duration-500 transform-gpu will-change-transform cursor-pointer [.swiper-slide:not(.swiper-slide-active)_&]:scale-[0.85] [.swiper-slide:not(.swiper-slide-active)_&]:opacity-50 [.swiper-slide-active_&]:scale-105 [.swiper-slide-active_&]:-translate-y-2">
                    <img
                      src={event.image}
                      alt={event.judul}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-khff-navy via-khff-navy/90 to-transparent pt-[28px] pb-4 px-4 translate-y-2 group-hover:translate-y-0 transition-all">
                      <p className="text-khff-yellow font-black font-mono text-xs uppercase tracking-wider text-center mb-1 drop-shadow-md">
                        Panorama #{event.id}
                      </p>
                      <p className="text-white font-serif font-black text-base text-center leading-snug drop-shadow-md">
                        {event.judul}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* DESKTOP SWIPER (FreeMode, Default Hover) */}
          <div className="hidden md:block">
            <Swiper
              modules={[Navigation, Scrollbar, FreeMode, Mousewheel]}
              navigation={{
                nextEl: ".swiper-button-next-custom",
                prevEl: ".swiper-button-prev-custom",
              }}
              scrollbar={{ draggable: true, hide: false }}
              mousewheel={{ forceToAxis: true }}
              grabCursor={true}
              freeMode={true}
              spaceBetween={24}
              slidesPerView="auto"
              className="w-full px-12 py-4 !overflow-visible"
              style={{
                "--swiper-scrollbar-drag-bg-color": "rgba(255, 255, 255, 0.4)",
                "--swiper-scrollbar-bg-color": "transparent",
                "--swiper-scrollbar-bottom": "-20px",
                "--swiper-scrollbar-size": "5px",
              } as React.CSSProperties}
            >
              {praEvents.map((event) => (
                <SwiperSlide key={`desktop-${event.id}`} className="!w-auto !h-auto group">
                  <div className="w-[300px] h-[440px] rounded-3xl overflow-hidden relative shadow-2xl bg-khff-navy border-4 border-white/20 transition-all duration-500 transform-gpu cursor-pointer hover:border-khff-pink hover:-translate-y-3 hover:scale-[1.03]">
                    <img
                      src={event.image}
                      alt={event.judul}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-khff-navy via-khff-navy/90 to-transparent pt-[28px] pb-4 px-4 translate-y-2 group-hover:translate-y-0 transition-all">
                      <p className="text-khff-yellow font-black font-mono text-xs uppercase tracking-wider text-center mb-1 drop-shadow-md">
                        Panorama #{event.id}
                      </p>
                      <p className="text-white font-serif font-black text-base text-center leading-snug drop-shadow-md">
                        {event.judul}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Left Navigation Overlay (Netflix Style) */}
          <div className="swiper-button-prev-custom absolute top-0 bottom-0 left-0 z-20 w-16 lg:w-24 bg-gradient-to-r from-khff-yellow/80 to-transparent flex items-center justify-start pl-2 lg:pl-6 cursor-pointer opacity-100 transition-opacity duration-300 [&.swiper-button-disabled]:hidden">
            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 hover:scale-110 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </div>
          </div>

          {/* Right Navigation Overlay (Netflix Style) */}
          <div className="swiper-button-next-custom absolute top-0 bottom-0 right-0 z-20 w-16 lg:w-24 bg-gradient-to-l from-khff-yellow/80 to-transparent flex items-center justify-end pr-2 lg:pr-6 cursor-pointer opacity-100 transition-opacity duration-300 [&.swiper-button-disabled]:hidden">
            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 hover:scale-110 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROGRAM UTAMA (3 KOLOM - TRANSISI KE HIJAU TUA) */}
      <section className="py-28 bg-gradient-to-br from-khff-navy to-khff-blue text-khff-cream rounded-t-[3.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.3)] relative z-20 border-t-8 border-khff-pink -mt-8 overflow-hidden">
        {/* Floating Asset */}
        <div className="absolute top-0 right-0 w-40 md:w-80 h-auto opacity-[0.05] md:opacity-10 pointer-events-none z-0 rotate-12">
          <img
            src="/assets/illustrations/gong.png"
            alt="Gong"
            className="w-full h-auto"
          />
        </div>
        <div className="absolute bottom-40 left-0 w-48 md:w-96 h-auto opacity-[0.03] md:opacity-5 pointer-events-none z-0 -rotate-12">
          <img
            src="/assets/illustrations/kendhang.png"
            alt=""
            className="w-full h-auto"
          />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 md:w-[600px] h-auto opacity-[0.01] md:opacity-[0.03] pointer-events-none z-0">
          <img
            src="/assets/illustrations/buto2.png"
            alt=""
            className="w-full h-auto"
          />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-20 max-w-4xl mx-auto">
            <span className="text-sm md:text-base font-mono uppercase tracking-[0.3em] font-bold text-khff-yellow block mb-3 drop-shadow-md">
              Program Festival
            </span>
            <h2 className="text-5xl md:text-7xl font-serif font-black text-white mb-6 tracking-tight">
              Tiga Program Utama
            </h2>
            <p className="text-khff-cream/80 text-lg md:text-xl font-medium leading-relaxed">
              Menikmati film, berbagi cerita, dan membangun koneksi dalam
              pengalaman festival yang merayakan warisan budaya bersama.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Kolom 1: Program Kompetisi */}
            <Link href="/program/kompetisi" className="block group">
              <div className="bg-khff-yellow rounded-3xl p-8 shadow-xl text-khff-navy flex flex-col justify-between h-full min-h-[380px] group-hover:-translate-y-3 transition-all duration-300 relative overflow-hidden border-2 border-transparent group-hover:border-white/40">
                <div className="absolute right-0 md:-right-6 bottom-0 md:-bottom-6 opacity-10 md:opacity-20 w-32 md:w-52 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                  <img
                    src="/assets/illustrations/terompet.png"
                    alt=""
                    className="w-full"
                  />
                </div>
                <div className="relative z-10">
                  <span className="text-xs font-bold font-mono uppercase tracking-widest px-3 py-1 bg-khff-navy text-khff-yellow rounded-full inline-block mb-6">
                    Competition
                  </span>
                  <h3 className="text-4xl font-serif font-black mb-4 leading-tight">
                    Program
                    <br />
                    Kompetisi
                  </h3>
                  <p className="text-khff-navy/80 font-medium text-lg max-w-sm">
                    Ajang apresiasi sinema pendek pilihan dari seluruh
                    Nusantara: Mahaditya, Purwaseswa, dan Karyanagri.
                  </p>
                </div>
                <div className="mt-12 pt-6 border-t border-khff-navy/20 font-black font-mono text-base flex items-center justify-between group-hover:translate-x-2 transition-transform">
                  <span>LIHAT DAFTAR KARYA</span>
                  <span className="text-2xl">→</span>
                </div>
              </div>
            </Link>

            {/* Kolom 2: Program Non Kompetisi */}
            <Link href="/program/non-kompetisi" className="block group">
              <div className="bg-khff-pink rounded-3xl p-8 shadow-xl text-white flex flex-col justify-between h-full min-h-[380px] group-hover:-translate-y-3 transition-all duration-300 relative overflow-hidden border-2 border-transparent group-hover:border-white/40">
                <div className="absolute right-0 md:-right-10 bottom-0 md:-bottom-10 opacity-10 md:opacity-20 w-32 md:w-64 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                  <img
                    src="/assets/illustrations/bendera.png"
                    alt="Bendera KHFF"
                    className="w-full h-auto drop-shadow-lg"
                  />
                </div>
                <div className="relative z-10">
                  <span className="text-xs font-bold font-mono uppercase tracking-widest px-3 py-1 bg-white text-khff-pink rounded-full inline-block mb-6">
                    Screenings
                  </span>
                  <h3 className="text-4xl font-serif font-black mb-4 leading-tight">
                    Program Non
                    <br />
                    Kompetisi
                  </h3>
                  <p className="text-white/90 font-medium text-lg max-w-sm">
                    Kurasi penayangan istimewa mulai dari Opening Film,
                    International & National Heritage, hingga Closing Film.
                  </p>
                </div>
                <div className="mt-12 pt-6 border-t border-white/30 font-black font-mono text-base flex items-center justify-between group-hover:translate-x-2 transition-transform">
                  <span>JELAJAHI PENAYANGAN</span>
                  <span className="text-2xl">→</span>
                </div>
              </div>
            </Link>

            {/* Kolom 3: Program Non Pemutaran (Workshop & Lecture) */}
            <Link href="/program/non-pemutaran" className="block group">
              <div className="bg-white rounded-3xl p-8 shadow-xl text-khff-navy flex flex-col justify-between h-full min-h-[380px] group-hover:-translate-y-3 transition-all duration-300 relative overflow-hidden border-2 border-transparent group-hover:border-khff-pink/40">
                <div className="absolute bottom-0 md:-bottom-10 right-0 md:-right-6 opacity-10 md:opacity-20 w-28 md:w-44 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                  <img
                    src="/assets/illustrations/kendhang.png"
                    alt=""
                    className="w-full"
                  />
                </div>
                <div className="relative z-10">
                  <span className="text-xs font-bold font-mono uppercase tracking-widest px-3 py-1 bg-khff-navy text-white rounded-full inline-block mb-6">
                    Education & Forum
                  </span>
                  <h3 className="text-4xl font-serif font-black mb-4 leading-tight">
                    Program Non
                    <br />
                    Pemutaran
                  </h3>
                  <p className="text-khff-navy/80 font-medium text-lg max-w-sm">
                    Ruang lokakarya edukatif dan kuliah terbuka (Workshop &
                    Public Lecture) bersama praktisi film nusantara.
                  </p>
                </div>
                <div className="mt-12 pt-6 border-t border-khff-navy/20 font-black font-mono text-base flex items-center justify-between group-hover:translate-x-2 transition-transform">
                  <span>DETAIL & PENDAFTARAN</span>
                  <span className="text-2xl">→</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. KILAS BALIK KHFF 2026 */}
      <section className="py-24 bg-[#143638] relative overflow-hidden">
        {/* Floating Visual Asset (New Character) */}
        <div className="absolute top-0 right-0 opacity-10 w-48 md:w-[28rem] pointer-events-none">
          <img
            src="/assets/illustrations/butotumpuk.png"
            alt=""
            className="w-full h-auto drop-shadow-2xl"
          />
        </div>

        <div className="container mx-auto px-6 lg:px-12 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif font-black text-khff-yellow mb-12">
            Kilas Balik KHFF 2025
          </h2>
          <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-khff-yellow/20 bg-black">
            <CustomVideoPlayer
              src="/videos/teaser.mp4"
              poster="/assets/background-baru.jpeg"
              className="aspect-video"
              videoClassName="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 5. FESTIVAL GUIDE KICKER */}
      <section className="py-24 bg-gradient-to-tr from-khff-blue to-khff-navy border-t border-khff-cream/10 relative">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="relative w-full min-h-[50vh] md:min-h-[70vh] rounded-3xl overflow-hidden group border-4 border-khff-pink shadow-2xl bg-khff-navy flex flex-col justify-center">
            {/* Foto Becak Asli Ngawi Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src="/assets/sponsors/becakk.jpg"
                alt="Drive In Cinema Becak"
                className="w-full h-full object-cover object-center opacity-80 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-khff-navy via-khff-navy/40 to-transparent z-10" />
            </div>

            <div className="relative z-20 p-8 md:p-20 max-w-3xl">
              <span className="inline-block px-4 py-1 rounded-full bg-khff-pink text-white font-bold tracking-[0.3em] uppercase mb-6 font-mono text-xs shadow-md">
                Special Program
              </span>
              <h3 className="text-4xl sm:text-5xl md:text-7xl font-serif font-black text-white mb-6 drop-shadow-xl leading-none">
                Drive In
                <br />
                Cinema
              </h3>
              <p className="text-khff-cream text-base md:text-2xl mb-8 drop-shadow font-medium leading-relaxed">
                Menghadirkan cara baru menikmati film lokal dari atas becak,
                memadukan pengalaman sinema dengan transportasi tradisional
                Yogyakarta yang ramah lingkungan.
              </p>
              {/* Waktu dan Tempat Drive-in Di Takeout untuk rilis */}
            </div>
          </div>
        </div>
      </section>

      {/* 6. JADWAL SELEKSI (TAKEOUT SEMENTARA UNTUK RILIS) */}
      {/*
      <section className="py-24 bg-[#143638] border-t border-khff-cream/10 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-serif font-black text-khff-cream mb-6">Jadwal Festival</h2>
            <p className="text-khff-cream/80 text-lg md:text-xl">
              Jelajahi rangkaian festival dengan melihat jadwal lengkap setiap program, kegiatan, dan ruang pertemuan di Kotabaru Heritage Film Festival 2026.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {homepageSchedule.map((schedule, index) => (
              <div key={index} className="bg-khff-navy rounded-3xl p-8 shadow-xl text-left border border-white/10 hover:border-khff-pink transition-colors">
                <h3 className="text-3xl font-serif font-black text-white mb-2">{schedule.day}</h3>
                <p className="text-khff-yellow font-mono text-sm font-bold mb-8 tracking-wide uppercase">{schedule.date}</p>
                
                <div className="space-y-6">
                  {schedule.events.map((ev, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="text-khff-pink font-mono font-black shrink-0 w-16">{ev.time}</div>
                      <div>
                        <h4 className="text-white font-bold mb-1 leading-tight">{ev.name}</h4>
                        <p className="text-khff-cream/60 text-xs font-mono uppercase">{ev.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
             <Link href="/jadwal" className="inline-flex items-center gap-3 bg-khff-yellow text-khff-navy px-8 py-4 rounded-xl font-black hover:bg-white transition-all text-lg shadow-xl hover:scale-105">
                Lihat Jadwal Keseluruhan <ArrowRight size={20} />
             </Link>
          </div>
        </div>
      </section>
      */}

      {/* 7. GALERI DOKUMENTASI REMOVED FROM HOME (MOVED TO NAVBAR /galeri) */}

      {/* 8. REGISTRASI G-FORM (TAKEOUT SEMENTARA UNTUK RILIS) */}
      {/* 
      <section className="py-32 bg-[#f07495] text-white relative overflow-hidden">
        ...
      </section> 
      */}

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
            {activeVideoTrailer.includes("youtube") ? (
              <iframe
                className="w-full h-full"
                src={activeVideoTrailer}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <CustomVideoPlayer
                src={activeVideoTrailer}
                autoPlay={true}
                className="w-full h-full"
                videoClassName="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
