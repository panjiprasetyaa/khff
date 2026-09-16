"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Film,
  LayoutGrid,
  ArrowUpRight,
} from "lucide-react";
import dataJson from "@/data/data.json";
import Link from "next/link";

// Program title to page URL resolver
function getProgramUrl(title: string): string | null {
  const t = title.toLowerCase().trim();

  // Becak Drive-In Cinema
  if (t.includes("becak drive") || t.includes("drive in") || t.includes("drive-in")) {
    return "/drive-in-cinema";
  }

  // Talks & Workshops
  if (t.includes("director talk") || t.includes("mistik melampaui ketakutan")) {
    return "/program/non-pemutaran/director-talks";
  }
  if (t.includes("heritage talk") || t.includes("merawat yang hidup")) {
    return "/program/non-pemutaran/heritage-talks";
  }
  if (t.includes("stop motion") || t.includes("diam-diam bergerak")) {
    return "/program/non-pemutaran/workshop-stop-motion";
  }

  // Competitions
  if (t.includes("purwaseswa")) {
    return "/program/kompetisi?tab=purwaseswa";
  }
  if (t.includes("karyanagri")) {
    return "/program/kompetisi?tab=karyanagri";
  }
  if (t.includes("mahaditya")) {
    return "/program/kompetisi?tab=mahaditya";
  }

  // Non-Kompetisi Screenings
  if (t.includes("panorama")) {
    return "/program/non-kompetisi?tab=khff-panorama";
  }
  if (t.includes("experimental cinema")) {
    return "/program/non-kompetisi?tab=heritage-in-experimental-cinema";
  }
  if (t.includes("indonesian cinema")) {
    return "/program/non-kompetisi?tab=heritage-in-indonesian-cinema";
  }

  return null;
}

// Film title to film detail page URL resolver
const filmTitleToSlug: Record<string, string> = {
  "SERADA": "serada",
  "NYANYI DI ANGKRINGAN": "nyanyi-di-angkringan",
  "NYANYIAN DI ANGKRINGAN": "nyanyi-di-angkringan",
  "WALED": "waled",
  "ANAK YANG BERTUMBUH": "anak-yang-bertumbuh",
  "MUPUSTI": "mupusti",
  "NYANYIAN POHON LONTAR": "nyanyian-pohon-lontar",
  "BONG": "bong",
  "RUANG SESAK": "ruang-sesak",
  "KHATIB GANTARANG LALANG BATA": "khatib-gantarang-lalang-bata",
  "MATEOS ANIN": "mateos-anin",
  "NIAT INGSUN NGAJI": "niat-ingsun-ngaji",
  "PORTRAIT OF TIN'S FAMILY": "portrait-of-tins-family",
  "MARANDANG": "marandang",
  "NAIJAN ON HAI AINA": "naijan-on-hai-aina",
  "HOPE": "hope",
  "IDAK-IDAK-IDAK": "idak-idak-idak",
  "SHARP OBJECTS": "sharp-object",
  "THE STONE THAT REMEMBERS": "the-stone-that-remembers",
  "GARDEN AMIDST THE FLAME": "garden-amidst-the-flame",
  "AFTERLIVES": "afterlives",
  "IBUNDA": "ibunda",
  "KANTATA TAKWA": "kantata-takwa",
  "SISUPU WONGE": "sisupu-wonge",
  "BARISAN JIWA DORAKA": "barisan-jiwa-doraka",
  "KUDAPAN RINDU RASA": "kudapan-rindu-rasa",
  "SITI WALIDAH": "siti-walidah",
};

function getFilmUrl(title: string): string | null {
  const upper = title.trim().toUpperCase();
  if (filmTitleToSlug[upper]) {
    return `/film/${filmTitleToSlug[upper]}`;
  }
  const allFilms = Object.values(dataJson.films) as { id: string; title: string }[];
  const found = allFilms.find(
    (f) => f.title.trim().toUpperCase() === upper || f.id.toLowerCase() === title.toLowerCase().trim()
  );
  return found ? `/film/${found.id}` : null;
}

// Type definitions
interface SingleEvent {
  time: string;
  startTime?: string;
  endTime?: string;
  duration?: string;
  location?: string;
  program: string;
  keterangan?: string;
  note?: string;
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
      "Heritage Talks: Merawat yang Hidup bersama Zaki Habibi",
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

// Render table for single-track (Day 1)
function SingleTrackTable({ events }: { events: SingleEvent[] }) {
  return (
    <div className="w-full">
      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {events.map((ev, i) => {
          const progUrl = getProgramUrl(ev.program);
          return (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white/5 border border-khff-cream/20 shadow-xl backdrop-blur-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-black text-khff-yellow px-3 py-1 rounded-xl bg-khff-yellow/15 border border-khff-yellow/30">
                  {ev.time}
                </span>
                {ev.location && (
                  <span className="font-mono text-[11px] uppercase tracking-wider text-white font-bold">
                    {ev.location}
                  </span>
                )}
              </div>
              {progUrl ? (
                <Link
                  href={progUrl}
                  className="group/link inline-flex items-center gap-1.5 text-white hover:text-khff-yellow transition-colors font-serif font-black text-lg leading-snug"
                >
                  <span>{ev.program}</span>
                  <ArrowUpRight size={16} className="text-khff-yellow opacity-70 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform shrink-0" />
                </Link>
              ) : (
                <h4 className="text-white font-serif font-black text-lg leading-snug">
                  {ev.program}
                </h4>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto custom-mini-scrollbar pb-4 scroll-smooth">
        <div className="overflow-hidden rounded-2xl border-2 border-khff-cream/20 shadow-2xl bg-black/20 min-w-[700px]">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="bg-khff-navy text-left border-b border-khff-cream/20">
                <th className="px-6 py-4 text-khff-yellow font-mono uppercase tracking-widest text-xs md:text-sm font-black w-44">
                  Waktu
                </th>
                <th className="px-6 py-4 text-white font-mono uppercase tracking-widest text-xs md:text-sm font-black w-56">
                  Lokasi
                </th>
                <th className="px-6 py-4 text-white font-mono uppercase tracking-widest text-xs md:text-sm font-black">
                  Program / Kegiatan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-khff-cream/10">
              {events.map((ev, i) => {
                const progUrl = getProgramUrl(ev.program);
                return (
                  <tr
                    key={i}
                    className="group hover:bg-white/10 transition-all duration-300"
                  >
                    <td className="px-6 py-5 font-mono font-bold text-khff-yellow align-top whitespace-nowrap">
                      <div className="text-base">{ev.time}</div>
                    </td>
                    <td className="px-6 py-5 text-khff-cream/90 align-top font-mono text-sm font-medium">
                      {ev.location && (
                        <span className="inline-block bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/20 text-xs uppercase tracking-wider text-white font-bold">
                          {ev.location}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 align-top">
                      {progUrl ? (
                        <Link
                          href={progUrl}
                          className="group/link inline-flex items-center gap-1.5 text-white hover:text-khff-yellow transition-colors font-serif font-black text-lg md:text-xl leading-snug"
                        >
                          <span>{ev.program}</span>
                          <ArrowUpRight size={18} className="text-khff-yellow opacity-70 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform shrink-0" />
                        </Link>
                      ) : (
                        <h4 className="text-white font-serif font-black text-lg md:text-xl leading-snug">
                          {ev.program}
                        </h4>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Render Room Schedule (Day 2 & Day 3 - Consistent with Day 1 Table Style)
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
    <div className="space-y-16">
      {filteredRooms.map((room, rIdx) => (
        <div
          key={rIdx}
          className="bg-white/5 p-6 md:p-8 rounded-3xl border border-khff-cream/15 shadow-xl space-y-6"
        >
          {/* Room Header - Matching Day 1 Track Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-khff-cream/15">
            <div className="flex items-center gap-3">
              <span className="w-3 h-8 bg-khff-pink rounded-full inline-block" />
              <h3 className="text-khff-yellow font-serif font-black text-2xl md:text-3xl">
                {room.name}
              </h3>
            </div>
            <span className="text-xs md:text-sm font-mono font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-khff-pink text-white shadow-md border border-white/20">
              PDIN Yogyakarta
            </span>
          </div>

          {/* Desktop Table View (Consistent with Day 1) */}
          <div className="hidden md:block overflow-x-auto custom-mini-scrollbar pb-4 scroll-smooth">
            <div className="overflow-hidden rounded-2xl border-2 border-khff-cream/20 shadow-2xl bg-black/20 min-w-[700px]">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="bg-khff-navy text-left border-b border-khff-cream/20">
                    <th className="px-6 py-4 text-khff-yellow font-mono uppercase tracking-widest text-xs md:text-sm font-black w-44">
                      Waktu
                    </th>
                    <th className="px-6 py-4 text-white font-mono uppercase tracking-widest text-xs md:text-sm font-black w-56">
                      Lokasi
                    </th>
                    <th className="px-6 py-4 text-white font-mono uppercase tracking-widest text-xs md:text-sm font-black">
                      Program / Kegiatan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-khff-cream/10">
                  {room.sessions.map((session, sIdx) => {
                    const progUrl = getProgramUrl(session.title);
                    return (
                      <tr
                        key={sIdx}
                        className="group hover:bg-white/10 transition-all duration-300"
                      >
                        <td className="px-6 py-5 font-mono font-bold text-khff-yellow align-top whitespace-nowrap">
                          <div className="text-base">{session.time}</div>
                        </td>
                        <td className="px-6 py-5 text-khff-cream/90 align-top font-mono text-sm font-medium">
                          <span className="inline-block bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/20 text-xs uppercase tracking-wider text-white font-bold">
                            {room.name}
                          </span>
                        </td>
                        <td className="px-6 py-5 align-top">
                          {progUrl ? (
                            <Link
                              href={progUrl}
                              className="group/link inline-flex flex-wrap items-center gap-2 text-white hover:text-khff-yellow transition-colors font-serif font-black text-lg md:text-xl leading-snug"
                            >
                              <span>{session.title}</span>
                              {(session.title.toLowerCase().includes("stop motion") || session.title.toLowerCase().includes("heritage workshop")) && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-red-500/20 text-red-300 border border-red-500/40 uppercase tracking-wider">
                                  SOLD OUT
                                </span>
                              )}
                              <ArrowUpRight size={18} className="text-khff-yellow opacity-70 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform shrink-0" />
                            </Link>
                          ) : (
                            <h4 className="text-white font-serif font-black text-lg md:text-xl leading-snug flex flex-wrap items-center gap-2">
                              <span>{session.title}</span>
                              {(session.title.toLowerCase().includes("stop motion") || session.title.toLowerCase().includes("heritage workshop")) && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-red-500/20 text-red-300 border border-red-500/40 uppercase tracking-wider">
                                  SOLD OUT
                                </span>
                              )}
                            </h4>
                          )}

                          {/* Speaker detail if any */}
                          {session.speaker && (
                            <p className="text-sm font-sans text-khff-yellow mt-1">
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

                              <div className="grid grid-cols-1 gap-2.5">
                                {session.films.map((film, fIdx) => {
                                  const filmUrl = getFilmUrl(film.title);
                                  return filmUrl ? (
                                    <Link
                                      key={fIdx}
                                      href={filmUrl}
                                      className="group/film block p-3.5 rounded-xl bg-white/5 border border-khff-cream/10 hover:bg-white/10 hover:border-khff-yellow/40 transition-all cursor-pointer"
                                    >
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="font-serif font-bold text-base md:text-lg text-white group-hover/film:text-khff-yellow transition-colors">
                                          {film.title}
                                        </div>
                                        <ArrowUpRight size={16} className="text-khff-yellow opacity-0 group-hover/film:opacity-100 group-hover/film:translate-x-0.5 transition-all shrink-0" />
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
                                    </Link>
                                  ) : (
                                    <div
                                      key={fIdx}
                                      className="p-3.5 rounded-xl bg-white/5 border border-khff-cream/10"
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
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View (Consistent with Day 1) */}
          <div className="md:hidden space-y-4">
            {room.sessions.map((session, sIdx) => {
              const progUrl = getProgramUrl(session.title);
              return (
                <div
                  key={sIdx}
                  className="p-5 rounded-2xl bg-white/5 border border-khff-cream/20 shadow-xl backdrop-blur-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-black text-khff-yellow px-3 py-1 rounded-xl bg-khff-yellow/15 border border-khff-yellow/30">
                      {session.time}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-white font-bold">
                      {room.name}
                    </span>
                  </div>
                  {progUrl ? (
                    <Link
                      href={progUrl}
                      className="group/link inline-flex flex-wrap items-center gap-2 text-white hover:text-khff-yellow transition-colors font-serif font-black text-lg leading-snug"
                    >
                      <span>{session.title}</span>
                      {(session.title.toLowerCase().includes("stop motion") || session.title.toLowerCase().includes("heritage workshop")) && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-red-500/20 text-red-300 border border-red-500/40 uppercase tracking-wider">
                          SOLD OUT
                        </span>
                      )}
                      <ArrowUpRight size={16} className="text-khff-yellow opacity-70 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform shrink-0" />
                    </Link>
                  ) : (
                    <h4 className="text-white font-serif font-black text-lg leading-snug flex flex-wrap items-center gap-2">
                      <span>{session.title}</span>
                      {(session.title.toLowerCase().includes("stop motion") || session.title.toLowerCase().includes("heritage workshop")) && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-red-500/20 text-red-300 border border-red-500/40 uppercase tracking-wider">
                          SOLD OUT
                        </span>
                      )}
                    </h4>
                  )}

                  {session.speaker && (
                    <p className="text-sm font-sans text-khff-yellow mt-1.5">
                      <span className="text-khff-cream/80 font-medium">Narasumber:</span>{" "}
                      <span className="font-bold">{session.speaker}</span>
                    </p>
                  )}

                  {session.films && session.films.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-khff-cream/10">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-khff-cream/60 uppercase tracking-wider mb-3">
                        <Film size={14} className="text-khff-pink" />
                        <span>Daftar Film ({session.films.length} Film):</span>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5">
                        {session.films.map((film, fIdx) => {
                          const filmUrl = getFilmUrl(film.title);
                          return filmUrl ? (
                            <Link
                              key={fIdx}
                              href={filmUrl}
                              className="group/film block p-3.5 rounded-xl bg-white/5 border border-khff-cream/10 hover:bg-white/10 hover:border-khff-yellow/40 transition-all cursor-pointer"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="font-serif font-bold text-base text-white group-hover/film:text-khff-yellow transition-colors">
                                  {film.title}
                                </div>
                                <ArrowUpRight size={16} className="text-khff-yellow opacity-0 group-hover/film:opacity-100 group-hover/film:translate-x-0.5 transition-all shrink-0" />
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
                            </Link>
                          ) : (
                            <div
                              key={fIdx}
                              className="p-3.5 rounded-xl bg-white/5 border border-khff-cream/10"
                            >
                              <div className="font-serif font-bold text-base text-white">
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
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
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
  const [prevDayParam, setPrevDayParam] = useState(dayParam);

  // Filter by room inside the active day
  const [selectedRoom, setSelectedRoom] = useState<string>("all");

  // Adjust state during render when URL query param changes without triggering cascading effect renders
  if (dayParam !== prevDayParam) {
    setPrevDayParam(dayParam);
    if (dayParam && schedule.some((d) => d.id === dayParam) && dayParam !== activeDay) {
      setActiveDay(dayParam);
      setSelectedRoom("all");
    }
  }

  const handleDayTabClick = (dayId: string) => {
    setActiveDay(dayId);
    setSelectedRoom("all");
    setPrevDayParam(dayId);
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

            {/* DAY 2 & DAY 3: Multi-Room Schedule */}
            {currentDay.type === "multi-track" && (
              <div className="space-y-8">
                {/* Room Filter Pills */}
                {currentDay.rooms && (
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-khff-cream/15 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-xs md:text-sm font-mono font-bold text-khff-cream/80">
                      <LayoutGrid size={16} className="text-khff-yellow" />
                      <span>FILTER RUANGAN:</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                      <button
                        onClick={() => setSelectedRoom("all")}
                        className={`px-4 py-2 rounded-xl text-xs md:text-sm font-mono font-bold transition-all cursor-pointer ${
                          selectedRoom === "all"
                            ? "bg-khff-pink text-white border border-khff-pink shadow-md"
                            : "bg-white/10 text-khff-cream/80 border border-khff-cream/20 hover:text-white hover:bg-white/15"
                        }`}
                      >
                        Semua Ruangan
                      </button>
                      {currentDay.rooms.map((room, rIdx) => (
                        <button
                          key={rIdx}
                          onClick={() => setSelectedRoom(room.name)}
                          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-mono font-bold transition-all cursor-pointer ${
                            selectedRoom === room.name
                              ? "bg-khff-pink text-white border border-khff-pink shadow-md"
                              : "bg-white/10 text-khff-cream/80 border border-khff-cream/20 hover:text-white hover:bg-white/15"
                          }`}
                        >
                          {room.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detailed Room Cards View */}
                {currentDay.rooms && (
                  <RoomCardView
                    rooms={currentDay.rooms}
                    selectedRoom={selectedRoom}
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
