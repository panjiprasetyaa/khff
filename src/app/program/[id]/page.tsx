"use client";

import { use, useState } from "react";
import { programs } from "@/data/dummy";
import { notFound } from "next/navigation";
import FilmCard from "@/components/FilmCard";
import Link from "next/link";
import { ArrowLeft, Filter } from "lucide-react";

export default function ProgramDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const program = programs.find((p) => p.id === id);
  const [selectedDirector, setSelectedDirector] = useState<string | null>(null);
  
  if (!program) notFound();

  // Get unique directors for the filter
  const directors = Array.from(new Set(program.films.map(f => f.director)));

  // Filter films
  const filteredFilms = selectedDirector 
    ? program.films.filter(f => f.director === selectedDirector)
    : program.films;

  return (
    <main className="min-h-screen pt-32 pb-24 bg-black">
      <div className="container mx-auto px-6 max-w-7xl">
        <Link href="/program" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={20} /> Kembali ke Daftar Program
        </Link>
        
        <div className="mb-16 border-b border-white/10 pb-12">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
            {program.name}
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl">
            {program.description}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Panel Daftar Lengkap (Film) */}
          <div className="w-full">
             <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
                <h2 className="text-2xl font-serif font-bold text-white">Menampilkan {filteredFilms.length} Karya</h2>
                <span className="text-gray-500 text-sm font-mono">15 Film</span>
             </div>
             
             {filteredFilms.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                  {filteredFilms.map((film) => (
                    <FilmCard key={film.id} film={film} />
                  ))}
                </div>
             ) : (
                <div className="py-20 text-center">
                  <p className="text-gray-500">Tidak ada film yang cocok dengan filter yang dipilih.</p>
                </div>
             )}
          </div>
        </div>
      </div>
    </main>
  );
}
