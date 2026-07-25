import { schedule } from "@/data/dummy";
import { MapPin } from "lucide-react";

export default function Jadwal() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-black">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">Jadwal Festival.</h1>
          <p className="text-gray-400 text-lg">
            Rangkaian acara lengkap Kotabaru Heritage Film Festival.
          </p>
        </div>

        <div className="space-y-24">
          {schedule.map((day, idx) => (
            <div key={idx} className="relative">
              {/* Sticky Header Hari */}
              <div className="sticky top-[80px] bg-black/90 backdrop-blur-md z-10 py-6 border-b border-white/10 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="text-white/50 uppercase tracking-widest font-bold text-sm block mb-1">{day.day}</span>
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">{day.date}</h2>
                </div>
              </div>

              {/* Daftar Acara */}
              <div className="space-y-4">
                {day.events.map((ev, i) => (
                  <div key={i} className="group flex flex-col md:flex-row gap-4 md:gap-12 p-6 rounded-xl hover:bg-white/5 transition-colors duration-300 border border-transparent hover:border-white/10">
                    <div className="w-32 shrink-0">
                      <span className="text-3xl font-mono font-light text-white/50 group-hover:text-white transition-colors duration-300">{ev.time}</span>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold text-white mb-2">{ev.name}</h3>
                      <p className="text-gray-400 flex items-center gap-2">
                        <MapPin size={16} /> {ev.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
