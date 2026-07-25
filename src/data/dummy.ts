export interface Film {
  id: string;
  title: string;
  director: string;
  year: number;
  duration: number; // in minutes
  synopsis: string;
  posterUrl: string;
  trailerUrl: string; // youtube embed
}

export interface Program {
  id: string;
  name: string;
  description: string;
  films: Film[];
}

export const films: Record<string, Film> = {
  "budi-pekerti": {
    id: "budi-pekerti",
    title: "Budi Pekerti",
    director: "Wregas Bhanuteja",
    year: 2023,
    duration: 110,
    synopsis: "Setelah video perselisihannya dengan seorang pengunjung pasar menjadi viral, seorang guru BK menghadapi ancaman kehilangan pekerjaannya.",
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop", 
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", 
  },
  "autobiography": {
    id: "autobiography",
    title: "Autobiography",
    director: "Makbul Mubarak",
    year: 2022,
    duration: 115,
    synopsis: "Seorang pemuda bekerja sebagai penjaga rumah purnawirawan jenderal yang sedang mencalonkan diri sebagai bupati, dan mulai terpengaruh oleh kekuasaannya.",
    posterUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=600&auto=format&fit=crop", 
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", 
  },
  "yuni": {
    id: "yuni",
    title: "Yuni",
    director: "Kamila Andini",
    year: 2021,
    duration: 95,
    synopsis: "Seorang gadis remaja cerdas yang memiliki mimpi besar untuk kuliah, harus menghadapi tekanan dari lingkungan sekitarnya untuk segera menikah.",
    posterUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=600&auto=format&fit=crop",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
  "27-steps-of-may": {
    id: "27-steps-of-may",
    title: "27 Steps of May",
    director: "Ravi Bharwani",
    year: 2018,
    duration: 112,
    synopsis: "May, yang mengalami trauma mendalam akibat kekerasan seksual 8 tahun lalu, hidup dalam kesunyian bersama ayahnya yang merasa bersalah.",
    posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&auto=format&fit=crop",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  },
  "penyalin-cahaya": {
    id: "penyalin-cahaya",
    title: "Penyalin Cahaya",
    director: "Wregas Bhanuteja",
    year: 2021,
    duration: 130,
    synopsis: "Suryani yang kehilangan beasiswanya setelah foto mabuknya tersebar, berusaha mencari tahu apa yang sebenarnya terjadi padanya di malam pesta teater.",
    posterUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=600&auto=format&fit=crop",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  },
  "kucumbu-tubuh-indahku": {
    id: "kucumbu-tubuh-indahku",
    title: "Kucumbu Tubuh Indahku",
    director: "Garin Nugroho",
    year: 2018,
    duration: 106,
    synopsis: "Kisah perjalanan hidup Juno, seorang penari Lengger Lanang yang harus menghadapi berbagai trauma dan kekerasan di sekitarnya.",
    posterUrl: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=600&auto=format&fit=crop",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  }
};

export const programs: Program[] = [
  {
    id: "mahaditya",
    name: "Program Mahaditya",
    description: "Program Pemutaran Kompetisi utama untuk film-film pendek dengan penceritaan yang kuat dan penyutradaraan yang matang.",
    films: [films["budi-pekerti"], films["autobiography"]]
  },
  {
    id: "purwaseswa",
    name: "Program Purwaseswa",
    description: "Program Pemutaran Kompetisi yang menyoroti inovasi visual, eksperimen gaya, dan sutradara pendatang baru.",
    films: [films["yuni"], films["27-steps-of-may"]]
  },
  {
    id: "karyanagri",
    name: "Program Karyanagri",
    description: "Program Pemutaran Kompetisi untuk film-film yang mengangkat kearifan lokal, sejarah, dan isu sosial Nusantara.",
    films: [films["penyalin-cahaya"], films["kucumbu-tubuh-indahku"]]
  },
  {
    id: "national-heritage",
    name: "National Heritage",
    description: "Program Pemutaran Heritage yang merayakan sejarah sinema dan pengarsipan film-film klasik Indonesia.",
    films: [films["budi-pekerti"]] // reuse for dummy
  },
  {
    id: "international-heritage",
    name: "International Heritage",
    description: "Program Pemutaran Heritage yang menyoroti karya-karya klasik dan restorasi dari berbagai belahan dunia.",
    films: [films["autobiography"]] // reuse for dummy
  },
  {
    id: "opening-film",
    name: "Opening Film",
    description: "Pemutaran khusus film pembuka Kotabaru Heritage Film Festival 2026.",
    films: [films["yuni"]] // reuse for dummy
  },
  {
    id: "closing-film",
    name: "Closing Film",
    description: "Pemutaran film penutup yang merayakan kebersamaan festival.",
    films: [films["27-steps-of-may"]] // reuse for dummy
  }
];

export const specialPrograms = [
  {
    id: "public-lecture-1",
    title: "Public Lecture: Masa Depan Sinema Independen",
    speaker: "Garin Nugroho",
    date: "12 September 2026",
    time: "10:00 - 12:00 WIB",
    location: "Aula Kotabaru"
  },
  {
    id: "workshop-1",
    title: "Workshop: Penulisan Naskah Film Pendek",
    speaker: "Wregas Bhanuteja",
    date: "13 September 2026",
    time: "13:00 - 16:00 WIB",
    location: "Ruang Seminar 2"
  }
];

export const schedule = [
  {
    day: "Day 1",
    date: "17 September 2026",
    events: [
      { time: "09:00", name: "Opening Ceremony", location: "Main Stage" },
      { time: "10:00", name: "Public Lecture: Masa Depan Sinema", location: "Aula Kotabaru" },
      { time: "13:00", name: "Screening: Program Mahaditya", location: "Studio 1" },
      { time: "19:00", name: "Gala Premiere (Opening Film)", location: "Main Theatre" }
    ]
  },
  {
    day: "Day 2",
    date: "18 September 2026",
    events: [
      { time: "10:00", name: "Screening: Program Purwaseswa", location: "Studio 2" },
      { time: "13:00", name: "Workshop: Penulisan Naskah", location: "Ruang Seminar 2" },
      { time: "16:00", name: "Screening: Program Karyanagri", location: "Studio 1" },
      { time: "19:00", name: "Diskusi Panel", location: "Aula Kotabaru" }
    ]
  },
  {
    day: "Day 3",
    date: "19 September 2026",
    events: [
      { time: "10:00", name: "Screening: National Heritage", location: "Studio 1" },
      { time: "13:00", name: "Screening: International Heritage", location: "Studio 2" },
      { time: "19:00", name: "Closing Ceremony & Awarding", location: "Main Theatre" }
    ]
  }
];
