"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation, Mousewheel, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/free-mode";

export default function GaleriPage() {
  const router = useRouter();

  // 2026 Albums (REMOVED UNTUK SEMENTARA, ADA DI GIT HISTORY)

  const galeri2025 = [
    "/assets/galeri/2025/KHFF DAY 1-1.jpg",
    "/assets/galeri/2025/KHFF DAY 1-4.jpg",
    "/assets/galeri/2025/Salinan dari DAY 3 Foto Bareng-3.jpg",
    "/assets/galeri/2025/Salinan dari DAY 3 Layar Kobar-23.jpg",
    "/assets/galeri/2025/Salinan dari DAY 3 Layar Kobar-9.jpg",
    "/assets/galeri/2025/Salinan dari DAY 3 Pameran-1.jpg",
    "/assets/galeri/2025/Salinan dari DAY 5  LT 5 INDO HERITAGE-16.jpg",
    "/assets/galeri/2025/Salinan dari KHFF DAY 1-77.jpg",
    "/assets/galeri/2025/Salinan dari Pasar Sepakbola-1.jpg",
    "/assets/galeri/2025/Salinan dari Public Letcture-4.jpg",
    "/assets/galeri/2025/Salinan dari Workshop KHFF-10.jpg"
  ];

  const galeri2024 = [
    "/assets/galeri/2024/Salinan dari Salinan _Opening Pameran-1.jpg",
    "/assets/galeri/2024/Salinan dari Salinan _Public Lecture-3.JPG",
    "/assets/galeri/2024/Salinan dari Salinan_Layar Kobar-1.JPG",
    "/assets/galeri/2024/Salinan dari Salinan_Layar Kobar-5.JPG",
    "/assets/galeri/2024/Salinan dari Salinan_Lokakarya-2.JPG",
    "/assets/galeri/2024/Salinan dari Salinan_Mahaditya.JPG",
    "/assets/galeri/2024/Salinan dari Salinan_Penjurian-2.jpg",
    "/assets/galeri/2024/Salinan dari Salinan_Penjurian-3.jpg",
    "/assets/galeri/2024/Salinan dari Salinan_Public Lecture-2.JPG",
    "/assets/galeri/2024/Salinan dari Salinan_Purwaseswa-2.JPG"
  ];

  const galeri2023 = [
    "/assets/galeri/2023/Salinan dari 1688631654735.JPG",
    "/assets/galeri/2023/Salinan dari 1688662658392.JPG",
    "/assets/galeri/2023/Salinan dari 5.jpg",
    "/assets/galeri/2023/Salinan dari DSC02300.JPG",
    "/assets/galeri/2023/Salinan dari DSC02766.JPG",
    "/assets/galeri/2023/Salinan dari DSC02939.JPG",
    "/assets/galeri/2023/Salinan dari DSC02990.JPG",
    "/assets/galeri/2023/Salinan dari DSC06487.JPG",
    "/assets/galeri/2023/Salinan dari DSCF4152.jpg",
    "/assets/galeri/2023/Salinan dari IMG_3787.JPG",
    "/assets/galeri/2023/Salinan dari rab-khf-2.jpg",
    "/assets/galeri/2023/Salinan dari rab-khf-4.jpg",
    "/assets/galeri/2023/Salinan dari rab-khf-5.jpg",
    "/assets/galeri/2023/Salinan dari TUP02338.JPG"
  ];

  const renderGallerySlider = (year: string, photos: string[], colorTheme: { border: string, line: string, bg: string }) => {
    const slug = year.replace(/\s+/g, '-').toLowerCase();

    return (
      <div className="mb-24 container mx-auto px-6 max-w-7xl">
        {/* Title placed OUTSIDE and ABOVE the card */}
        <div className="mb-6 flex flex-col items-center md:items-start">
          <h3 className="text-4xl md:text-5xl font-serif font-black text-khff-cream mb-3 drop-shadow-md">
            {year}
          </h3>
          <div className={`w-24 h-2 ${colorTheme.line} rounded-full`}></div>
        </div>
        
        {/* The Card Container that wraps ONLY the photos */}
        <div className={`relative w-full rounded-3xl overflow-hidden group/slider border-4 ${colorTheme.border} shadow-[0_15px_40px_rgba(0,0,0,0.4)] ${colorTheme.bg}`}>
          
          <Swiper
            modules={[Navigation, Mousewheel, Pagination]}
            navigation={{
              nextEl: `.swiper-next-${slug}`,
              prevEl: `.swiper-prev-${slug}`,
            }}
            pagination={{ clickable: true }}
            mousewheel={{ forceToAxis: true }}
            slidesPerView="auto"
            centeredSlides={true}
            spaceBetween={0}
            grabCursor={true}
            className={`w-full h-[50vh] md:h-[70vh] !pb-12 ${slug}-swiper`}
          >
            {photos.map((photo, index) => (
              <SwiperSlide key={index} className="w-[85%] md:w-[70%] h-full transition-all duration-500">
                {({ isActive }) => (
                  <div className={`relative w-full h-full bg-black flex items-center justify-center overflow-hidden transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-40 scale-95'}`}>
                    <img
                      src={photo}
                      alt={`Highlight ${year} - ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover/slider:scale-[1.02]"
                    />
                    <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/slider:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </div>
                )}
              </SwiperSlide>
            ))}
            
            {/* Navigation Arrows inside the Card */}
            <button className={`swiper-prev-${slug} absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md opacity-0 group-hover/slider:opacity-100 hover:bg-khff-yellow hover:text-khff-navy hover:scale-110 transition-all duration-300 disabled:opacity-0 disabled:cursor-not-allowed border border-white/20 shadow-xl`}>
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button className={`swiper-next-${slug} absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md opacity-0 group-hover/slider:opacity-100 hover:bg-khff-yellow hover:text-khff-navy hover:scale-110 transition-all duration-300 disabled:opacity-0 disabled:cursor-not-allowed border border-white/20 shadow-xl`}>
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </Swiper>
        </div>
      </div>
    );
  };

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
              Arsip Galeri.
            </h1>
            <p className="text-khff-cream/95 text-lg md:text-2xl font-medium leading-relaxed drop-shadow">
              Telusuri kilas balik momen, rekaman visual, dan dokumentasi kemeriahan Kotabaru Heritage Film Festival dari tahun ke tahun.
            </p>
          </div>
        </div>
      </section>

      {/* HIGHLIGHT PHOTOS SECTION (2025, 2024, 2023) */}
      <section className="bg-khff-navy text-khff-cream rounded-t-[3.5rem] pt-24 pb-12 shadow-2xl relative z-20 border-t-8 border-khff-pink overflow-hidden -mt-12">
        <div className="absolute -bottom-10 right-0 opacity-10 pointer-events-none w-96">
          <img src="/assets/karakter/gong.png" alt="" className="w-full h-auto" />
        </div>

        {renderGallerySlider("KHFF 2025", galeri2025, { border: "border-khff-pink", line: "bg-khff-pink", bg: "bg-[#143638]" })}
        {renderGallerySlider("KHFF 2024", galeri2024, { border: "border-khff-yellow", line: "bg-khff-yellow", bg: "bg-khff-navy" })}
        {renderGallerySlider("KHFF 2023", galeri2023, { border: "border-white/40", line: "bg-white/70", bg: "bg-[#1f4a4c]" })}

      </section>
    </main>
  );
}
