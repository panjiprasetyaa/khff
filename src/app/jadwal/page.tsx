"use client";

import { useState } from "react";
import { MapPin, Building2 } from "lucide-react";
import dataJson from "@/data/data.json";

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

// Colour accent per day
const dayColors: Record<string, string> = {
  "pre-festival": "from-white/10 to-transparent border-white/20",
  "day-1": "from-white/10 to-transparent border-white/20",
  "day-2": "from-white/10 to-transparent border-white/20",
  "day-3": "from-white/10 to-transparent border-white/20",
};

const tabAccent: Record<string, string> = {
  "pre-festival": "bg-white/10 text-white",
  "day-1": "bg-white/10 text-white",
  "day-2": "bg-white/10 text-white",
  "day-3": "bg-white/10 text-white",
};

const activeTabAccent: Record<string, string> = {
  "pre-festival": "bg-white text-black",
  "day-1": "bg-white text-black",
  "day-2": "bg-white text-black",
  "day-3": "bg-white text-black",
};

const trackBadgeColor: Record<string, string> = {
  "Pasar Terban": "bg-white/20 text-white border-white/30",
  "PDIN": "bg-white/20 text-white border-white/30",
};

// Render table for single-track (rows: time, location, program)
function SingleTrackTable({ events }: { events: SingleEvent[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-white/5 text-left">
            <th className="px-4 py-3 text-white/40 uppercase tracking-widest text-xs font-bold w-36">Waktu</th>
            <th className="px-4 py-3 text-white/40 uppercase tracking-widest text-xs font-bold w-56">Lokasi</th>
            <th className="px-4 py-3 text-white/40 uppercase tracking-widest text-xs font-bold">Program</th>
          </tr>
        </thead>
        <tbody>
          {events.map((ev, i) => (
            <tr key={i} className="border-t border-white/10 group hover:bg-white/5 transition-colors">
              <td className="px-4 py-4 font-mono text-white/60 group-hover:text-white transition-colors align-top whitespace-nowrap">
                {ev.time}
              </td>
              <td className="px-4 py-4 text-gray-400 align-top">
                <span className="flex items-start gap-1.5">
                  <MapPin size={13} className="mt-0.5 shrink-0 opacity-50" />
                  {ev.location}
                </span>
              </td>
              <td className="px-4 py-4 text-white font-medium align-top">{ev.program}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Render table for multi-track (columns: time, ruang seminar, audiovisual, balkon)
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
      <div className="overflow-hidden rounded-xl border border-white/10 min-w-[600px]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/5 text-left">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-white/40 uppercase tracking-widest text-xs font-bold"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map((ev, i) => (
              <tr key={i} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                <td className="px-4 py-4 font-mono text-white/60 whitespace-nowrap align-top">{ev.time}</td>
                {colKeys.slice(0, columns.length - 1).map((key, j) => {
                  const val = ev[key as keyof MultiTrackEvent] as string | undefined;
                  return (
                    <td key={j} className="px-4 py-4 align-top">
                      {val && val !== "—" ? (
                        <span className="inline-block bg-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-lg leading-relaxed">
                          {val}
                        </span>
                      ) : (
                        <span className="text-white/20 text-xs">—</span>
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
    <div className="mt-8">
      <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4 flex items-center gap-2">
        <Building2 size={13} /> Aktivasi Ruang / Ruang Pendukung
      </h4>
      <div className="flex flex-wrap gap-3">
        {rooms.map((r, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <p className="text-white font-semibold text-sm">{r.area}</p>
            <p className="text-gray-500 text-xs mt-0.5">{r.function}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Jadwal() {
  const [activeDay, setActiveDay] = useState(schedule[0].id);
  const currentDay = schedule.find((d) => d.id === activeDay)!;

  return (
    <main className="min-h-screen pt-32 pb-24 bg-black">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4">
            Jadwal Festival.
          </h1>
          <p className="text-gray-400 text-lg">
            Rangkaian acara lengkap Kotabaru Heritage Film Festival 2026.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-12 p-1 bg-white/5 rounded-2xl w-fit">
          {schedule.map((day) => (
            <button
              key={day.id}
              onClick={() => setActiveDay(day.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ${
                activeDay === day.id
                  ? activeTabAccent[day.id]
                  : `${tabAccent[day.id]} hover:opacity-80`
              }`}
            >
              {day.id === "pre-festival" ? "Pre-Festival" : day.day.split(" — ")[0]}
            </button>
          ))}
        </div>

        {/* Day Content */}
        <div
          key={activeDay}
          className={`rounded-3xl border bg-gradient-to-br p-8 md:p-12 transition-all duration-500 ${dayColors[activeDay]}`}
        >
          {/* Day Header */}
          <div className="mb-10 pb-8 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 block mb-2">
                {currentDay.id === "pre-festival" ? "Pre-Festival" : currentDay.day}
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">
                {currentDay.date}
              </h2>
            </div>
            {currentDay.venue && (
              <span className="inline-flex items-center gap-2 text-sm text-gray-400 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                <MapPin size={14} />
                {currentDay.venue}
              </span>
            )}
          </div>

          {/* Single-track day */}
          {currentDay.type === "single" && currentDay.events && (
            <>
              <SingleTrackTable events={currentDay.events as SingleEvent[]} />
              <RoomActivationSection rooms={currentDay.roomActivation ?? []} />
            </>
          )}

          {/* Multi-track day (Day 3) */}
          {currentDay.type === "multi-track" && currentDay.events && currentDay.columns && (
            <>
              <MultiTrackTable columns={currentDay.columns} events={currentDay.events as MultiTrackEvent[]} />
              <RoomActivationSection rooms={currentDay.roomActivation ?? []} />
            </>
          )}

          {/* Split-track day (Day 2) */}
          {currentDay.type === "split" && currentDay.tracks && (
            <div className="space-y-12">
              {currentDay.tracks.map((track, ti) => (
                <div key={ti}>
                  {/* Track header badge */}
                  <div className="flex items-center gap-3 mb-6">
                    <span
                      className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${
                        trackBadgeColor[track.venue] ?? "bg-white/10 text-white border-white/20"
                      }`}
                    >
                      {track.venue}
                    </span>
                    <span className="text-white/30 text-sm">{track.label}</span>
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
        </div>

        {/* Venue Summary */}
        <div className="mt-16 pt-12 border-t border-white/10">
          <h3 className="text-xl font-serif font-bold text-white mb-8">Ringkasan Venue</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { day: "Pre-Festival", date: "16 Sept 2026", venue: "PDIN", desc: "Penjurian & Sekretariat", color: "border-white/20" },
              { day: "Day 1", date: "17 Sept 2026", venue: "Pasar Terban", desc: "Opening Ceremony & Film", color: "border-amber-500/30" },
              { day: "Day 2", date: "18 Sept 2026", venue: "Pasar Terban + PDIN", desc: "Public Screening & Festival", color: "border-sky-500/30" },
              { day: "Day 3", date: "19 Sept 2026", venue: "PDIN", desc: "Closing & Awarding", color: "border-rose-500/30" },
            ].map((item, i) => (
              <div key={i} className={`bg-white/5 border ${item.color} rounded-2xl p-6`}>
                <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2">{item.day}</p>
                <p className="text-white font-bold text-lg mb-1">{item.venue}</p>
                <p className="text-xs text-gray-500">{item.date}</p>
                <p className="text-gray-400 text-sm mt-3">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
