"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import { Film } from "@/data/dummy";
import FilmCard from "./FilmCard";
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

interface ProgramCarouselProps {
  films: Film[];
  programId: string;
}

export default function ProgramCarousel({ films, programId }: ProgramCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <div className="relative w-full group py-4">
      <Swiper
        modules={[Navigation, FreeMode]}
        spaceBetween={16}
        slidesPerView={1.2} // Peek design for mobile
        freeMode={true}
        breakpoints={{
          480: { slidesPerView: 2.2, spaceBetween: 20 },
          768: { slidesPerView: 3.2, spaceBetween: 24 },
          1024: { slidesPerView: 4.2, spaceBetween: 32 }, // Peek design for desktop
        }}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        className="w-full h-full"
      >
        {films.map((film) => (
          <SwiperSlide key={`${programId}-${film.id}`}>
            <FilmCard film={film} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <div className="hidden md:block">
        <button
          className={`absolute left-0 top-[40%] -translate-y-1/2 -ml-6 z-10 bg-black/90 hover:bg-white hover:text-black text-white p-4 rounded-full border border-white/20 shadow-2xl transition-all duration-300 backdrop-blur-md ${
            isBeginning ? 'opacity-0 cursor-default pointer-events-none' : 'opacity-0 group-hover:opacity-100 cursor-pointer'
          }`}
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className={`absolute right-0 top-[40%] -translate-y-1/2 -mr-6 z-10 bg-black/90 hover:bg-white hover:text-black text-white p-4 rounded-full border border-white/20 shadow-2xl transition-all duration-300 backdrop-blur-md ${
            isEnd ? 'opacity-0 cursor-default pointer-events-none' : 'opacity-0 group-hover:opacity-100 cursor-pointer'
          }`}
          onClick={() => swiperRef.current?.slideNext()}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
