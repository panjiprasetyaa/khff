"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Film,
  Table2,
  LayoutGrid,
} from "lucide-react";
import dataJson from "@/data/data.json";
import Link from "next/link";

// Type definitions
interface SingleEvent {
  time: string;
  startTime?: string;
  endTime?: string;
  duration?: string;
  location?: string;
  program: string;
}

interface MultiTrackEvent {
  time: string;
  ruangSeminar?: string;
  ruangAudiovisual?: string;
  ruangKacaBawah?: string;
  mainStage?: string;
}

interface SingleTrack {
  venue: string;
  label: string;
  type: "single";
  events: SingleEvent[];
}

interface MultiTrack {
  venue: string;
  label: string;
  type: "multi-track";
  columns: string[];
  keys: string[];
  events: MultiTrackEvent[];
}

type Track = SingleTrack | MultiTrack;

interface FilmItem {
  title: string;
  director: string;
  genre: string;
  duration: string;
  year: string;
  origin: string;
}

interface SessionItem {
  time: string;
  duration?: string;
  title: string;
  subtitle?: string;
  speaker?: string;
  films?: FilmItem[];
}

interface RoomSchedule {
  name: string;
  sessions: SessionItem[];
}

interface ScheduleDay {
  id: string;
  day: string;
  date: string;
  type: "single" | "multi-track" | "split";
  venue?: string;
  events?: SingleEvent[] | MultiTrackEvent[];
  columns?: string[];
  keys?: string[];
  tracks?: Track[];
  rooms?: RoomSchedule[];
}

const schedule = (dataJson.schedule as unknown as ScheduleDay[]).filter(
  (d) => d.id !== "pre-festival",
);

// Venue summary descriptions per tab ID
const venueSummaries: Record<
  string,
  { title: string; venue: string; description: string; highlights: string[] }
> = {
  "day-1": {
    title: "Becak Drive-In Cinema & Seremoni Pembukaan",
    venue: "Pasar Terban (Kawasan Heritage)",
    description:
      "Panggung pembuka festival dengan transformasi kawasan Pasar Terban menjadi arena sinematik terbuka. Menghadirkan Jelajah Becak Kotabaru, pertunjukan seni tari kolosal, seremoni pembukaan resmi bersama Mas Wregas Bhanuteja, dan pemutaran Becak Drive-In Cinema.",
    highlights: [
      "Jelajah Becak Rute Kotabaru",
      "Seremoni Pembukaan & Tari Kolosal",
      "Opening Becak Drive In Cinema",
      "Sambutan Walikota & Kadisbud",
    ],
  },
  "day-2": {
    title: "Screening Kompetisi, Panorama & Director Talk",
    venue: "Pusat Desain Industri Nasional (PDIN)",
    description:
      "PDIN menjadi pusat kegiatan festival dengan penayangan film di Ruang Seminar dan Ruang Audiovisual (KHFF Panorama, Kompetisi Purwaseswa, Kompetisi Karyanagri, Experimental Cinema, dan Restorasi 'Ibunda'), aktivasi panggung publik Main Stage, serta sesi Director Talk 'Mistik Melampaui Ketakutan' bersama Wregas Bhanuteja.",
    highlights: [
      "KHFF Panorama (4 Film Pendek)",
      "Kompetisi Purwaseswa & Karyanagri",
      "Heritage in Experimental Cinema #1 & #2",
      "Heritage in Indonesian Cinema #1: Ibunda",
      "Director Talk bersama Wregas Bhanuteja",
    ],
  },
  "day-3": {
    title: "Kompetisi Mahaditya, Workshop & Heritage Talk",
    venue: "Pusat Desain Industri Nasional (PDIN)",
    description:
      "Puncak festival menghadirkan penayangan 5 film karya independen dalam Kompetisi Mahaditya, workshop animasi stop motion 'Diam-Diam Bergerak' bersama Rimbun Project, pemutaran film legendaris 'Kantata Takwa', dan Heritage Talk bersama Zaki Habibi di Ruang Kaca Bawah.",
    highlights: [
      "Kompetisi Mahaditya (5 Film Pendek)",
      "Heritage Workshop: Stop Motion! Rimbun Project",
      "Heritage in Indonesian Cinema #2: Kantata Takwa",
      "Heritage Talk: Merawat yang Hidup bersama Zaki Habibi",
    ],
  },
};

const tabAccent: Record<string, string> = {
  "day-1":
    "bg-white/5 text-khff-cream/70 border border-khff-cream/20 hover:bg-white/10 hover:text-khff-cream",
  "day-2":
    "bg-white/5 text-khff-cream/70 border border-khff-cream/20 hover:bg-white/10 hover:text-khff-cream",
  "day-3":
    "bg-white/5 text-khff-cream/70 border border-khff-cream/20 hover:bg-white/10 hover:text-khff-cream",
};

const activeTabAccent: Record<string, string> = {
  "day-1":
    "bg-khff-pink text-white border border-khff-pink font-black shadow-[0_0_20px_rgba(235,93,121,0.5)] scale-105",
  "day-2":
    "bg-white text-khff-navy border border-white font-black shadow-[0_0_20px_rgba(255,255,255,0.5)] scale-105",
  "day-3":
    "bg-khff-yellow text-khff-navy border border-khff-yellow font-black shadow-[0_0_20px_rgba(236,172,45,0.5)] scale-105",
};

// Render table for single-track (rows: time, duration, location, program)
function SingleTrackTable({ events }: { events: SingleEvent[] }) {
  return (
    <div className="w-full">
      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {events.map((ev, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white/5 border border-khff-cream/20 shadow-xl backdrop-blur-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="font-mono text-xs font-black text-khff-yellow px-3 py-1 rounded-xl bg-khff-yellow/15 border border-khff-yellow/30">
                {ev.time}
              </span>
              {ev.duration && (
                <span className="font-mono text-[11px] text-khff-cream/80 font-bold px-2.5 py-0.5 rounded-lg bg-white/10 border border-khff-cream/20">
                  {ev.duration}
                </span>
              )}
              {ev.location && (
                <span className="font-mono text-[11px] uppercase tracking-wider text-khff-pink font-bold">
                  {ev.location}
                </span>
              )}
            </div>
            <h4 className="text-white font-serif font-black text-lg leading-snug">
              {ev.program}
            </h4>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto custom-mini-scrollbar pb-4 scroll-smooth">
        <div className="overflow-hidden rounded-2xl border-2 border-khff-cream/20 shadow-2xl bg-black/20 min-w-[700px]">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="bg-khff-navy text-left border-b border-khff-cream/20">
                <th className="px-6 py-4 text-khff-yellow font-mono uppercase tracking-widest text-xs md:text-sm font-black w-44">
                  Waktu & Durasi
                </th>
                <th className="px-6 py-4 text-khff-pink font-mono uppercase tracking-widest text-xs md:text-sm font-black w-56">
                  Lokasi
                </th>
                <th className="px-6 py-4 text-white font-mono uppercase tracking-widest text-xs md:text-sm font-black">
                  Program / Kegiatan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-khff-cream/10">
              {events.map((ev, i) => (
                <tr
                  key={i}
                  className="group hover:bg-white/10 transition-all duration-300"
                >
                  <td className="px-6 py-5 font-mono font-bold text-khff-yellow align-top whitespace-nowrap">
                    <div className="text-base">{ev.time}</div>
                    {ev.duration && (
                      <span className="inline-block mt-1 text-[11px] font-mono text-khff-cream/70 bg-white/10 px-2 py-0.5 rounded border border-white/15">
                        {ev.duration}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-khff-cream/90 align-top font-mono text-sm font-medium">
                    {ev.location && (
                      <span className="inline-block bg-white/10 px-3.5 py-1.5 rounded-xl border border-khff-cream/20 text-xs uppercase tracking-wider text-khff-pink font-bold">
                        {ev.location}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 align-top">
                    <h4 className="text-white font-serif font-black text-lg md:text-xl leading-snug">
                      {ev.program}
                    </h4>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Render Room Card Sessions (Day 2 & Day 3 Rich View)
function RoomCardView({
  rooms,
  selectedRoom,
}: {
  rooms: RoomSchedule[];
  selectedRoom: string;
}) {
  const filteredRooms =
    selectedRoom === "all"
      ? rooms
      : rooms.filter((r) => r.name === selectedRoom);

  return (
    <div className="space-y-10">
      {filteredRooms.map((room, rIdx) => (
        <div
          key={rIdx}
          className="bg-white/5 border-2 border-khff-cream/20 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden"
        >
          {/* Room Header */}
          <div className="flex items-center gap-3 mb-8 pb-5 border-b border-khff-cream/15">
            <span className="w-3 h-8 bg-khff-yellow rounded-full inline-block" />
            <h3 className="text-2xl md:text-3xl font-serif font-black text-white">
              {room.name}
            </h3>
          </div>

          {/* Sessions List */}
          <div className="space-y-6">
            {room.sessions.map((session, sIdx) => (
              <div
                key={sIdx}
                className="bg-black/25 rounded-2xl p-5 md:p-6 border border-khff-cream/15 hover:border-khff-yellow/50 transition-all duration-200"
              >
                {/* Session Header: Time */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-khff-yellow" />
                    <span className="font-mono font-bold text-khff-yellow text-sm md:text-base">
                      {session.time}
                    </span>
                  </div>
                  {session.duration && session.duration !== "-" && (
                    <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/10 text-khff-cream/90 border border-khff-cream/20">
                      {session.duration}
                    </span>
                  )}
                </div>

                {/* Session Title */}
                <h4 className="text-xl md:text-2xl font-serif font-black text-white leading-tight mb-1">
                  {session.title}
                </h4>

                {/* Subtitle / Topic */}
                {session.subtitle && (
                  <p className="text-khff-cream/80 text-sm md:text-base font-sans mb-3">
                    {session.subtitle}
                  </p>
                )}

                {/* Speaker detail as clean plain text */}
                {session.speaker && (
                  <p className="text-sm font-sans text-khff-yellow mb-3">
                    <span className="text-khff-cream/80 font-medium">Narasumber:</span>{" "}
                    <span className="font-bold">{session.speaker}</span>
                  </p>
                )}

                {/* Film compilation list if any */}
                {session.films && session.films.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-khff-cream/10">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-khff-cream/60 uppercase tracking-wider mb-3">
                      <Film size={14} className="text-khff-pink" />
                      <span>Daftar Film ({session.films.length} Film):</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {session.films.map((film, fIdx) => (
                        <div
                          key={fIdx}
                          className="p-3.5 rounded-xl bg-white/5 border border-khff-cream/10 hover:bg-white/10 transition-colors"
                        >
                          <div className="font-serif font-bold text-base md:text-lg text-white">
                            {film.title}
                          </div>
                          <div className="text-xs text-khff-cream/75 font-sans mt-1 leading-relaxed">
                            <span>Sutradara: <span className="text-white font-medium">{film.director}</span></span>
                            <span className="mx-2 text-khff-cream/30">•</span>
                            <span>{film.genre}</span>
                            <span className="mx-2 text-khff-cream/30">•</span>
                            <span>{film.duration}</span>
                            <span className="mx-2 text-khff-cream/30">•</span>
                            <span>{film.year}</span>
                            <span className="mx-2 text-khff-cream/30">•</span>
                            <span>{film.origin}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Render table for multi-track (Timeline Matrix View)
function MultiTrackTable({
  columns,
  keys,
  events,
}: {
  columns: string[];
  keys: string[];
  events: MultiTrackEvent[];
}) {
  return (
    <div className="w-full">
      {/* Mobile Swipe Hint */}
      <div className="md:hidden flex items-center justify-end gap-1.5 text-xs font-mono text-khff-yellow/80 mb-2">
        <span>Geser jadwal ke samping →</span>
      </div>
      <div className="overflow-x-auto custom-mini-scrollbar pb-4 scroll-smooth">
        <div className="overflow-hidden rounded-2xl border-2 border-khff-cream/20 shadow-2xl bg-black/20 min-w-[780px]">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="bg-khff-navy text-left border-b border-khff-cream/20">
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className={`px-5 py-4 font-mono uppercase tracking-widest text-xs font-black ${
                      i === 0 ? "text-khff-yellow w-40" : "text-khff-cream"
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-khff-cream/10">
              {events.map((ev, i) => (
                <tr
                  key={i}
                  className="hover:bg-white/10 transition-all duration-300"
                >
                  <td className="px-5 py-5 font-mono font-bold text-khff-yellow whitespace-nowrap align-top">
                    {ev.time}
                  </td>
                  {keys.map((key, j) => {
                    const val = ev[key as keyof MultiTrackEvent] as
                      | string
                      | undefined;
                    return (
                      <td key={j} className="px-5 py-5 align-top">
                        {val && val !== "-" ? (
                          <div className="bg-khff-yellow/15 text-white font-sans text-sm p-3.5 rounded-xl border border-khff-yellow/30 leading-relaxed shadow-sm">
                            {val}
                          </div>
                        ) : (
                          <span className="text-khff-cream/30 text-xs font-mono font-bold">
                            - Kosong -
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function JadwalClientPage() {
  const searchParams = useSearchParams();
  const dayParam = searchParams.get("day");

  const defaultDay = schedule.length > 0 ? schedule[0].id : "day-1";
  const [activeDay, setActiveDay] = useState(() => {
    if (dayParam && schedule.some((d) => d.id === dayParam)) {
      return dayParam;
    }
    return defaultDay;
  });

  // Toggle view mode between rich room cards and matrix table
  const [viewMode, setViewMode] = useState<"rooms" | "table">("rooms");
  // Filter by room inside the active day
  const [selectedRoom, setSelectedRoom] = useState<string>("all");

  // Keep state synced with URL query param
  useEffect(() => {
    if (dayParam && schedule.some((d) => d.id === dayParam)) {
      setActiveDay(dayParam);
      setSelectedRoom("all");
    }
  }, [dayParam]);

  const handleDayTabClick = (dayId: string) => {
    setActiveDay(dayId);
    setSelectedRoom("all");
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("day", dayId);
      window.history.replaceState(null, "", url.toString());
    }
  };

  const currentDay = schedule.find((d) => d.id === activeDay) || schedule[0];
  const currentSummary = venueSummaries[activeDay] || venueSummaries["day-1"];

  if (!currentDay) return null;

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
              Jadwal Festival
            </h1>
            <p className="text-khff-cream/95 text-lg md:text-2xl font-medium leading-relaxed drop-shadow">
              Jelajahi rangkaian festival dengan melihat jadwal lengkap setiap
              program pemutaran film, talkshow, workshop, dan seremoni di
              Kotabaru Heritage Film Festival 2026.
            </p>
          </div>
        </div>
      </section>

      {/* SCHEDULE CONTENT SECTION (NAVY GREEN THEATER) */}
      <section className="bg-khff-navy text-khff-cream rounded-t-[3.5rem] py-20 px-6 shadow-2xl relative z-20 border-t-8 border-khff-pink overflow-hidden -mt-12">
        {/* Floating Gong Illustration in background */}
        <div className="absolute top-40 -right-20 opacity-10 pointer-events-none w-96 z-0">
          <img
            src="/assets/illustrations/gong.png"
            alt="Gong"
            className="w-full h-auto"
          />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          {/* Day Tab Navigation */}
          <div className="flex flex-wrap gap-3 md:gap-4 mb-14 pb-8 border-b border-khff-cream/20">
            {schedule.map((day) => (
              <button
                key={day.id}
                onClick={() => handleDayTabClick(day.id)}
                className={`px-8 py-4 rounded-2xl font-serif text-lg md:text-xl transition-all duration-300 shadow-xl cursor-pointer ${
                  activeDay === day.id
                    ? activeTabAccent[day.id]
                    : tabAccent[day.id]
                }`}
              >
                {day.day.split(" - ")[0]}
              </button>
            ))}
          </div>

          {/* Day Content Box */}
          <div key={activeDay} className="animate-in fade-in duration-300">
            {/* Integrated Day Hero Banner & Summary */}
            <div className="mb-14 bg-gradient-to-br from-[#23585a] to-khff-navy border-4 border-khff-yellow rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-25 w-64 pointer-events-none hidden lg:block z-0">
                <img
                  src="/assets/illustrations/gong.png"
                  alt="Gong"
                  className="w-full h-auto"
                />
              </div>

              <div className="relative z-10 max-w-4xl">
                <div className="inline-flex w-fit max-w-full items-center bg-khff-yellow text-khff-navy px-4 py-1.5 md:px-5 md:py-2 rounded-full text-xs md:text-sm font-mono font-black uppercase tracking-[0.2em] mb-5 shadow-lg border border-khff-yellow/50 whitespace-nowrap overflow-hidden text-ellipsis">
                  {currentDay.day}
                </div>

                <div className="mb-6 flex flex-col gap-4 border-b border-khff-cream/20 pb-6">
                  <div>
                    <h2 className="text-4xl md:text-5xl font-serif font-black text-white tracking-tight leading-tight mt-2 flex items-center gap-3 flex-wrap">
                      <Calendar className="text-khff-yellow" size={32} />
                      <span>{currentDay.date}</span>
                    </h2>
                  </div>
                  {currentSummary.venue && (
                    <div className="w-fit">
                      <span className="inline-flex items-center gap-2 text-xs md:text-sm text-khff-cream font-mono font-black bg-khff-navy/80 px-5 py-3 rounded-2xl border-2 border-khff-pink shadow-lg uppercase tracking-wider backdrop-blur-md">
                        <MapPin size={16} className="text-khff-pink" />
                        <span>VENUE:</span>
                        <span className="text-khff-yellow">
                          {currentSummary.venue}
                        </span>
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="text-2xl md:text-4xl font-serif font-black text-white mb-4 leading-tight">
                  {currentSummary.title}
                </h3>

                <p className="text-khff-cream/95 text-base md:text-xl font-medium leading-relaxed mb-8 max-w-3xl">
                  {currentSummary.description}
                </p>

                <div>
                  <span className="text-xs font-mono font-black uppercase tracking-widest text-khff-cream/60 block mb-3">
                    Agenda Utama:
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {currentSummary.highlights.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-white/10 border border-khff-cream/30 text-white font-mono font-bold px-4 py-2 rounded-xl text-sm shadow-md hover:border-khff-yellow transition-colors"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* DAY 1: Split-Tracks (Becak Drive-In & Seremoni Pembukaan) */}
            {currentDay.type === "split" && currentDay.tracks && (
              <div className="space-y-16">
                {currentDay.tracks.map((track, ti) => (
                  <div
                    key={ti}
                    className="bg-white/5 p-6 md:p-8 rounded-3xl border border-khff-cream/15 shadow-xl"
                  >
                    {/* Track Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-khff-cream/15">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-8 bg-khff-pink rounded-full inline-block" />
                        <h3 className="text-khff-yellow font-serif font-black text-2xl md:text-3xl">
                          {track.label}
                        </h3>
                      </div>
                      <span className="text-xs md:text-sm font-mono font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-khff-pink text-white shadow-md border border-white/20">
                        {track.venue}
                      </span>
                    </div>

                    <SingleTrackTable events={track.events as SingleEvent[]} />
                  </div>
                ))}
              </div>
            )}

            {/* DAY 2 & DAY 3: Multi-Track / Multi-Room with View Mode Switcher */}
            {currentDay.type === "multi-track" && (
              <div className="space-y-8">
                {/* Controls Bar: View Toggle & Room Filter */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-khff-cream/15 backdrop-blur-sm">
                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-2 bg-khff-navy p-1.5 rounded-xl border border-khff-cream/20">
                    <button
                      onClick={() => setViewMode("rooms")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs md:text-sm font-bold transition-all cursor-pointer ${
                        viewMode === "rooms"
                          ? "bg-khff-yellow text-khff-navy shadow-md"
                          : "text-khff-cream/80 hover:text-white"
                      }`}
                    >
                      <LayoutGrid size={16} />
                      <span>Tampilan Per Ruangan</span>
                    </button>
                    <button
                      onClick={() => setViewMode("table")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs md:text-sm font-bold transition-all cursor-pointer ${
                        viewMode === "table"
                          ? "bg-khff-yellow text-khff-navy shadow-md"
                          : "text-khff-cream/80 hover:text-white"
                      }`}
                    >
                      <Table2 size={16} />
                      <span>Tampilan Matriks (Tabel)</span>
                    </button>
                  </div>

                  {/* Room Filter Pills (Available when viewMode === 'rooms') */}
                  {viewMode === "rooms" && currentDay.rooms && (
                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                      <button
                        onClick={() => setSelectedRoom("all")}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                          selectedRoom === "all"
                            ? "bg-khff-pink text-white border border-khff-pink shadow"
                            : "bg-white/10 text-khff-cream/80 border border-khff-cream/20 hover:text-white"
                        }`}
                      >
                        Semua Ruangan
                      </button>
                      {currentDay.rooms.map((room, rIdx) => (
                        <button
                          key={rIdx}
                          onClick={() => setSelectedRoom(room.name)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                            selectedRoom === room.name
                              ? "bg-khff-pink text-white border border-khff-pink shadow"
                              : "bg-white/10 text-khff-cream/80 border border-khff-cream/20 hover:text-white"
                          }`}
                        >
                          {room.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* View 1: Detailed Room Cards View */}
                {viewMode === "rooms" && currentDay.rooms && (
                  <RoomCardView
                    rooms={currentDay.rooms}
                    selectedRoom={selectedRoom}
                  />
                )}

                {/* View 2: Multi-Track Table (Matrix Timeline View) */}
                {viewMode === "table" && currentDay.events && currentDay.columns && (
                  <MultiTrackTable
                    columns={currentDay.columns}
                    keys={currentDay.keys ?? []}
                    events={currentDay.events as MultiTrackEvent[]}
                  />
                )}
              </div>
            )}

            {/* Single Track Fallback (if any) */}
            {currentDay.type === "single" && currentDay.events && (
              <div className="space-y-12">
                <SingleTrackTable events={currentDay.events as SingleEvent[]} />
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
