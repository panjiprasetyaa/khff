import data from './data.json';

export interface Film {
  id: string;
  title: string;
  director: string;
  year: number;
  duration: number; // in minutes
  synopsis: string;
  posterUrl: string;
  trailerUrl: string; // youtube embed or local video
  stills?: string[];
  directorPhoto?: string;
  phLogo?: string;
  email?: string;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  films: Film[];
}

// Menentukan apakah proses kurasi sedang berlangsung (menampilkan placeholder)
export const IS_CURATION_ONGOING = false;

// Mengekspor data film langsung dari JSON
export const films: Record<string, Film> = data.films as unknown as Record<string, Film>;

// Mengonversi referensi filmIds di JSON kembali menjadi array object Film untuk UI
export const programs: Program[] = data.programs.map((program) => ({
  id: program.id,
  name: program.name,
  description: program.description,
  films: program.filmIds
    .map((id) => (data.films as unknown as Record<string, Film>)[id])
    .filter(Boolean)
}));

export const specialPrograms = data.specialPrograms;
export const schedule = data.schedule;

export interface PraEvent {
  id: number;
  image: string;
  judul: string;
}

export const praEvents: PraEvent[] = data.praEvents;
