import Link from "next/link";
import { Film, programs, IS_CURATION_ONGOING } from "@/data/dummy";

interface FilmCardProps {
  film: Film;
  overrideTitle?: string;
  programId?: string;
}

export default function FilmCard({ film, overrideTitle, programId }: FilmCardProps) {
  const program = programs.find(p => p.films.some(f => f.id === film.id));
  const displayTitle = overrideTitle ? overrideTitle : (IS_CURATION_ONGOING ? (program?.name.replace('Program ', '') || "Karya Terpilih") : film.title);
  const displayDirector = IS_CURATION_ONGOING ? "Nantikan informasi selanjutnya" : film.director;
  return (
    <Link href={`/film/${film.id}${programId ? `?p=${programId}` : ''}`} className="block group cursor-pointer">
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-white/5 mb-4 shadow-lg border border-white/10 transition-all duration-500 group-hover:border-white/40 group-hover:shadow-2xl">
        <img
          src={IS_CURATION_ONGOING ? "/assets/poster-placeholder.png" : (film.posterUrl || "/assets/poster-placeholder.png")}
          alt={displayTitle}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlay gradient for hover effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <span className="text-white text-sm font-bold tracking-widest uppercase flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            Lihat Detail <span className="text-xl">→</span>
          </span>
        </div>
      </div>
      <div className="px-1">
        <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-2 group-hover:text-gray-300 transition-colors line-clamp-1">
          {displayTitle}
        </h3>
        <p className="text-xs md:text-sm text-gray-500 font-sans tracking-widest uppercase">
          {displayDirector}
        </p>
      </div>
    </Link>
  );
}
