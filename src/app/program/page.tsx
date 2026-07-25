import { programs } from "@/data/dummy";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ProgramList() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-black">
      <div className="container mx-auto px-6 max-w-6xl">
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">Programs.</h1>
        <p className="text-gray-400 text-lg mb-16 max-w-2xl">
          Eksplorasi berbagai program pemutaran film yang telah dikurasi dengan saksama untuk Kotabaru Heritage Film Festival.
        </p>

        <div className="space-y-12">
          {programs.map((program) => (
            <Link key={program.id} href={`/program/${program.id}`} className="block group">
              <div className="border border-white/10 rounded-2xl p-8 md:p-12 hover:bg-white/5 transition-colors duration-500 relative overflow-hidden bg-white/[0.02]">
                <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-4 transition-all duration-500 hidden md:block">
                  <ArrowRight size={48} className="text-white/20" />
                </div>
                
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 group-hover:text-gray-200">{program.name}</h2>
                <p className="text-gray-400 max-w-3xl mb-12 text-lg">{program.description}</p>
                
                <div className="flex gap-4">
                  {program.films.slice(0, 4).map((f) => (
                    <div key={f.id} className="w-24 md:w-32 aspect-[2/3] rounded-md overflow-hidden shadow-lg border border-white/10 relative">
                      <img src={f.posterUrl} alt={f.title} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                    </div>
                  ))}
                  {program.films.length > 4 && (
                    <div className="w-24 md:w-32 aspect-[2/3] rounded-md bg-white/10 flex items-center justify-center border border-white/10">
                      <span className="text-white font-bold text-lg">+{program.films.length - 4}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
