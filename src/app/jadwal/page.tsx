"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import dataJson from "@/data/data.json";
import Link from "next/link";

// Type definitions
interface SingleEvent {
  time: string;
  location: string;
  program: string;
}

interface MultiTrackEvent {
  time: string;
  ruangSeminar?: string;
  ruangAudiovisual?: string;
  balkonRumput?: string;
  hallPDIN?: string;
}

interface RoomActivation {
  area: string;
  function: string;
}

interface SingleTrack {
  venue: string;
  label: string;
  type: "single";
  events: SingleEvent[];
  roomActivation?: RoomActivation[];
}

interface MultiTrack {
  venue: string;
  label: string;
  type: "multi-track";
  columns: string[];
  events: MultiTrackEvent[];
  roomActivation?: RoomActivation[];
}

type Track = SingleTrack | MultiTrack;

interface ScheduleDay {
  id: string;
  day: string;
  date: string;
  type: "single" | "multi-track" | "split";
  venue?: string;
  events?: SingleEvent[] | MultiTrackEvent[];
  columns?: string[];
  tracks?: Track[];
  roomActivation?: RoomActivation[];
}

const schedule = dataJson.schedule as unknown as ScheduleDay[];

// Venue summary descriptions per tab ID
const venueSummaries: Record<string, { title: string; venue: string; description: string; highlights: string[] }> = {
  "pre-festival": {
    title: "Ringkasan Venue Pra-Festival",
    venue: "Pusat Desain Industri Nasional (PDIN)",
    description: "Pusat kegiatan persiapan teknis, registrasi ulang tamu undangan festival, ruang sekretariat utama, serta sesi penjurian akhir untuk program kompetisi Mahaditya, Purwaseswa, dan Karyanagri.",
    highlights: ["Sekretariat & Hospitality", "Ruang Penjurian Resmi", "Pusat Koordinasi Tenant & Sineas"]
  },
  "day-1": {
    title: "Ringkasan Venue Hari Pertama",
    venue: "Pasar Terban (Kawasan Heritage)",
    description: "Panggung utama pembuka festival dengan transformasi ruang pasar tradisional menjadi arena sinematik terbuka. Dilengkapi sarana registrasi becak untuk Drive-In Cinema, bazar kuliner nusantara, dan layar penayangan Opening Film.",
    highlights: ["Opening Ceremony & Pawai Budaya", "Aktivasi Kuliner & Kriya Lokal", "Layar Tancap & Registrasi Drive-In Becak"]
  },
  "day-2": {
    title: "Ringkasan Venue Hari Kedua",
    venue: "Pasar Terban & Pusat Desain Industri Nasional (PDIN)",
    description: "Aktivasi dua kawasan sekaligus: PDIN berfungsi sebagai pusat diskusi, workshop eksklusif, serta ruang penayangan kompetisi dalam ruangan, sementara Pasar Terban menjadi pusat screening terbuka dan ruang temu komunitas film.",
    highlights: ["Public Lecture & Workshop Sineas", "Penayangan Paralel Kompetisi", "Panggung Diskusi Komunitas Nonton"]
  },
  "day-3": {
    title: "Ringkasan Venue Hari Ketiga (Penutupan)",
    venue: "Hall Utama & Balkon PDIN",
    description: "Puncak perhelatan Kotabaru Heritage Film Festival 2026. Menghadirkan sesi penayangan eksklusif Closing Film, paparan kesimpulan dewan juri, serta Malam Penganugerahan (Awarding Ceremony) bagi para jawara sinema nusantara.",
    highlights: ["Awarding Ceremony (Malam Penganugerahan)", "Screening Closing Film & Layar Kobar", "Resepsi Penutup Sineas & Publik"]
  }
};

const tabAccent: Record<string, string> = {
  "pre-festival": "bg-white/5 text-khff-cream/70 border border-khff-cream/20 hover:bg-white/10 hover:text-khff-cream",
  "day-1": "bg-white/5 text-khff-cream/70 border border-khff-cream/20 hover:bg-white/10 hover:text-khff-cream",
  "day-2": "bg-white/5 text-khff-cream/70 border border-khff-cream/20 hover:bg-white/10 hover:text-khff-cream",
  "day-3": "bg-white/5 text-khff-cream/70 border border-khff-cream/20 hover:bg-white/10 hover:text-khff-cream",
};

const activeTabAccent: Record<string, string> = {
  "pre-festival": "bg-khff-yellow text-khff-navy border border-khff-yellow font-black shadow-[0_0_20px_rgba(236,172,45,0.5)] scale-105",
  "day-1": "bg-khff-pink text-white border border-khff-pink font-black shadow-[0_0_20px_rgba(235,93,121,0.5)] scale-105",
  "day-2": "bg-white text-khff-navy border border-white font-black shadow-[0_0_20px_rgba(255,255,255,0.5)] scale-105",
  "day-3": "bg-khff-yellow text-khff-navy border border-khff-yellow font-black shadow-[0_0_20px_rgba(236,172,45,0.5)] scale-105",
};

// Render table for single-track (rows: time, location, program)
function SingleTrackTable({ events }: { events: SingleEvent[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-khff-cream/20 shadow-2xl bg-black/20">
      <table className="w-full text-sm md:text-base">
        <thead>
          <tr className="bg-khff-navy text-left border-b border-khff-cream/20">
            <th className="px-6 py-4 text-khff-yellow font-mono uppercase tracking-widest text-xs md:text-sm font-black w-40">Waktu</th>
            <th className="px-6 py-4 text-khff-pink font-mono uppercase tracking-widest text-xs md:text-sm font-black w-64">Lokasi / Ruang</th>
            <th className="px-6 py-4 text-white font-mono uppercase tracking-widest text-xs md:text-sm font-black">Materi Program & Keterangan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-khff-cream/10">
          {events.map((ev, i) => (
            <tr key={i} className="group hover:bg-white/10 transition-all duration-300">
              <td className="px-6 py-5 font-mono font-bold text-khff-yellow align-top whitespace-nowrap">
                {ev.time}
              </td>
              <td className="px-6 py-5 text-khff-cream/90 align-top font-mono text-sm font-medium">
                <span className="inline-block bg-white/10 px-3.5 py-1.5 rounded-xl border border-khff-cream/20 text-xs uppercase tracking-wider text-khff-yellow font-bold">
                  {ev.location}
                </span>
              </td>
              <td className="px-6 py-5 text-white font-serif font-black text-lg md:text-xl align-top leading-snug">{ev.program}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Render table for multi-track
function MultiTrackTable({
  columns,
  events,
}: {
  columns: string[];
  events: MultiTrackEvent[];
}) {
  const colKeys = ["ruangSeminar", "ruangAudiovisual", "balkonRumput", "hallPDIN"];

  return (
    <div className="overflow-x-auto">
      <div className="overflow-hidden rounded-2xl border-2 border-khff-cream/20 shadow-2xl bg-black/20 min-w-[750px]">
        <table className="w-full text-sm md:text-base">
          <thead>
            <tr className="bg-khff-navy text-left border-b border-khff-cream/20">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`px-5 py-4 font-mono uppercase tracking-widest text-xs font-black ${i === 0 ? 'text-khff-yellow w-36' : 'text-khff-cream'}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-khff-cream/10">
            {events.map((ev, i) => (
              <tr key={i} className="hover:bg-white/10 transition-all duration-300">
                <td className="px-5 py-5 font-mono font-bold text-khff-yellow whitespace-nowrap align-top">{ev.time}</td>
                {colKeys.slice(0, columns.length - 1).map((key, j) => {
                  const val = ev[key as keyof MultiTrackEvent] as string | undefined;
                  return (
                    <td key={j} className="px-5 py-5 align-top">
                      {val && val !== "—" ? (
                        <span className="inline-block bg-khff-yellow/20 text-white font-serif font-bold text-base px-4 py-2.5 rounded-xl border border-khff-yellow/40 leading-relaxed shadow">
                          {val}
                        </span>
                      ) : (
                        <span className="text-khff-cream/30 text-xs font-mono font-bold">— Kosong —</span>
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
  );
}

// Room activation cards
function RoomActivationSection({ rooms }: { rooms: RoomActivation[] }) {
  if (!rooms || rooms.length === 0) return null;
  return (
    <div className="mt-10 pt-8 border-t border-khff-cream/10">
      <h4 className="text-xs font-mono font-black uppercase tracking-[0.25em] text-khff-pink mb-6 border-l-4 border-khff-pink pl-3">
        Aktivasi Ruang & Area Pendukung Festival
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rooms.map((r, i) => (
          <div key={i} className="bg-white/5 border border-khff-cream/20 rounded-2xl p-5 hover:bg-white/10 transition-all shadow-md">
            <p className="text-khff-yellow font-serif font-black text-lg mb-1">{r.area}</p>
            <p className="text-khff-cream/80 text-sm font-medium leading-relaxed">{r.function}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Jadwal() {
  const [activeDay, setActiveDay] = useState(schedule[0].id);
  const currentDay = schedule.find((d) => d.id === activeDay)!;
  const currentSummary = venueSummaries[activeDay] || venueSummaries["day-1"];

  return (
    <main className="min-h-screen bg-khff-navy text-khff-cream font-sans relative overflow-hidden">
      
      {/* HEADER SECTION (CINEMATIC GREEN TO YELLOW GRADIENT) */}
      <section className="pt-36 pb-28 px-6 bg-gradient-to-b from-khff-navy via-[#23585a] to-khff-yellow text-khff-cream relative z-10 w-full">
        <div className="container mx-auto max-w-6xl">
          <Link href="/" className="inline-flex items-center gap-2 bg-khff-navy/80 border border-khff-cream/20 px-5 py-2 rounded-full text-khff-cream hover:bg-khff-yellow hover:text-khff-navy font-mono mb-8 transition-all text-sm font-black shadow-lg">
            <ArrowLeft size={16} /> KEMBALI KE BERANDA
          </Link>
          
          <div className="max-w-4xl relative">
            <span className="inline-block px-5 py-2 rounded-full bg-khff-yellow text-khff-navy text-xs md:text-sm uppercase tracking-[0.3em] font-mono font-black mb-6 shadow-xl">
              Official Schedule & Program Timetable
            </span>
            <div className="absolute right-0 top-0 opacity-25 w-56 pointer-events-none hidden md:block">
              <img src="/assets/karakter/kendhang.png" alt="Kendhang" className="w-full h-auto drop-shadow-2xl" />
            </div>
            <h1 className="text-6xl md:text-8xl font-serif font-black text-khff-cream mb-6 tracking-tight drop-shadow-lg">
              Jadwal Festival.
            </h1>
            <p className="text-khff-cream/95 text-lg md:text-2xl font-medium leading-relaxed drop-shadow">
              Rangkaian penayangan film terkurasi, forum wawasan, bazar kuliner, dan malam penganugerahan Kotabaru Heritage Film Festival 2026.
            </p>
          </div>
        </div>
      </section>

      {/* SCHEDULE CONTENT SECTION (NAVY GREEN THEATER) */}
      <section className="bg-khff-navy text-khff-cream rounded-t-[3.5rem] py-20 px-6 shadow-2xl relative z-20 border-t-8 border-khff-pink overflow-hidden -mt-12">
        {/* Floating Gong Illustration in background */}
        <div className="absolute top-40 -right-20 opacity-10 pointer-events-none w-96 z-0">
          <img src="/assets/karakter/gong.png" alt="Gong" className="w-full h-auto" />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-3 md:gap-4 mb-16 pb-8 border-b border-khff-cream/20">
            {schedule.map((day) => (
              <button
                key={day.id}
                onClick={() => setActiveDay(day.id)}
                className={`px-8 py-4 rounded-2xl font-serif text-lg md:text-xl transition-all duration-300 shadow-xl cursor-pointer ${
                  activeDay === day.id
                    ? activeTabAccent[day.id]
                    : tabAccent[day.id]
                }`}
              >
                {day.id === "pre-festival" ? "Pre-Festival" : day.day.split(" — ")[0]}
              </button>
            ))}
          </div>

          {/* Day Content Box */}
          <div key={activeDay} className="animate-in fade-in duration-300">
            
            {/* Day Title Banner */}
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white/5 p-8 rounded-3xl border border-khff-cream/20 shadow-xl backdrop-blur-sm">
              <div>
                <span className="text-xs font-mono font-black uppercase tracking-[0.25em] text-khff-yellow block mb-2">
                  {currentDay.id === "pre-festival" ? "Sesi Persiapan & Penjurian" : currentDay.day}
                </span>
                <h2 className="text-4xl md:text-6xl font-serif font-black text-white tracking-tight">
                  {currentDay.date}
                </h2>
              </div>
              {currentDay.venue && (
                <span className="inline-flex items-center gap-3 text-sm md:text-base text-khff-cream font-mono font-black bg-khff-navy px-6 py-3.5 rounded-2xl border-2 border-khff-pink shadow-lg shrink-0 uppercase tracking-wider">
                  VENUE : <span className="text-khff-yellow">{currentDay.venue}</span>
                </span>
              )}
            </div>

            {/* Single-track day */}
            {currentDay.type === "single" && currentDay.events && (
              <div className="space-y-12">
                <SingleTrackTable events={currentDay.events as SingleEvent[]} />
                <RoomActivationSection rooms={currentDay.roomActivation ?? []} />
              </div>
            )}

            {/* Multi-track day (Day 3) */}
            {currentDay.type === "multi-track" && currentDay.events && currentDay.columns && (
              <div className="space-y-12">
                <MultiTrackTable columns={currentDay.columns} events={currentDay.events as MultiTrackEvent[]} />
                <RoomActivationSection rooms={currentDay.roomActivation ?? []} />
              </div>
            )}

            {/* Split-track day (Day 2) */}
            {currentDay.type === "split" && currentDay.tracks && (
              <div className="space-y-16">
                {currentDay.tracks.map((track, ti) => (
                  <div key={ti} className="bg-white/5 p-8 rounded-3xl border border-khff-cream/10">
                    {/* Track header badge */}
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                      <span className="text-xs md:text-sm font-mono font-black uppercase tracking-widest px-5 py-2 rounded-full bg-khff-pink text-white shadow-md border border-white/20">
                        VENUE : {track.venue}
                      </span>
                      <span className="text-khff-yellow font-serif font-black text-xl md:text-2xl">{track.label}</span>
                    </div>

                    {track.type === "single" && (
                      <SingleTrackTable events={track.events as SingleEvent[]} />
                    )}
                    {track.type === "multi-track" && (
                      <>
                        <MultiTrackTable columns={track.columns!} events={track.events as MultiTrackEvent[]} />
                        <RoomActivationSection rooms={track.roomActivation ?? []} />
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* INTEGRATED VENUE SUMMARY PER TAB */}
            <div className="mt-16 bg-gradient-to-br from-[#23585a] to-khff-navy border-4 border-khff-yellow rounded-3xl p-8 md:p-14 shadow-2xl relative overflow-hidden">
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-25 w-64 pointer-events-none hidden lg:block">
                <img src="/assets/karakter/gong.png" alt="Gong" className="w-full h-auto" />
              </div>

              <div className="relative z-10 max-w-4xl">
                <div className="inline-block bg-khff-yellow text-khff-navy px-4 py-1.5 rounded-full text-xs font-mono font-black uppercase tracking-[0.2em] mb-4 shadow">
                  Detail Lokasi & Penyelenggaraan
                </div>
                <h3 className="text-3xl md:text-5xl font-serif font-black text-white mb-4 leading-tight">
                  {currentSummary.title}
                </h3>
                <p className="text-khff-pink font-mono font-bold text-lg mb-6 uppercase tracking-wider">
                  Lokasi Utama : <span className="text-khff-yellow">{currentSummary.venue}</span>
                </p>
                <p className="text-khff-cream/95 text-lg md:text-xl font-medium leading-relaxed mb-8">
                  {currentSummary.description}
                </p>

                <div>
                  <span className="text-xs font-mono font-black uppercase tracking-widest text-khff-cream/60 block mb-3">Fokus Kegiatan pada Hari Ini:</span>
                  <div className="flex flex-wrap gap-3">
                    {currentSummary.highlights.map((item, idx) => (
                      <span key={idx} className="bg-white/10 border border-khff-cream/30 text-white font-mono font-bold px-4 py-2 rounded-xl text-sm shadow-md hover:border-khff-yellow transition-colors">
                        — {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
    </main>
  );
}
