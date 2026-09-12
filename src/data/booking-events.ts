export interface BookingEvent {
  id: string;
  tabSheet: string;
  programId: "kompetisi" | "non-kompetisi" | "non-pemutaran";
  programLabel: string;
  category: string;
  title: string;
  subtitle?: string;
  scheduleDate: string;
  scheduleTime: string;
  venue: string;
  venueDetail?: string;
  maxSlots: number;
  ticketPrefix: string;
}

export const BOOKING_EVENTS: BookingEvent[] = [
  // --- 1. PROGRAM KOMPETISI (Karya Pelajar, Pemerintah, & Independen) ---
  {
    id: "kompetisi-purwaseswa",
    tabSheet: "Kompetisi_Purwaseswa",
    programId: "kompetisi",
    programLabel: "Program Kompetisi",
    category: "Kompetisi",
    title: "Kompetisi: Purwaseswa",
    subtitle: "5 Film Pelajar Terpilih Indonesia",
    scheduleDate: "Jumat, 18 September 2026",
    scheduleTime: "13.00 WIB",
    venue: "Ruang Audiovisual PDIN",
    venueDetail: "Pusat Desain Industri Nasional (PDIN), Jl. Terban",
    maxSlots: 20,
    ticketPrefix: "KHFF-PUR-",
  },
  {
    id: "kompetisi-karyanagri",
    tabSheet: "Kompetisi_Karyanagri",
    programId: "kompetisi",
    programLabel: "Program Kompetisi",
    category: "Kompetisi",
    title: "Kompetisi: Karyanagri",
    subtitle: "5 Film Warisan Budaya Nasional",
    scheduleDate: "Jumat, 18 September 2026",
    scheduleTime: "16.00 WIB",
    venue: "Ruang Audiovisual PDIN",
    venueDetail: "Pusat Desain Industri Nasional (PDIN), Jl. Terban",
    maxSlots: 20,
    ticketPrefix: "KHFF-KAR-",
  },
  {
    id: "kompetisi-mahaditya",
    tabSheet: "Kompetisi_Mahaditya",
    programId: "kompetisi",
    programLabel: "Program Kompetisi",
    category: "Kompetisi",
    title: "Kompetisi: Mahaditya",
    subtitle: "5 Film Perspektif Suara Independen",
    scheduleDate: "Sabtu, 19 September 2026",
    scheduleTime: "13.00 WIB",
    venue: "Ruang Seminar PDIN",
    venueDetail: "Pusat Desain Industri Nasional (PDIN), Jl. Terban",
    maxSlots: 20,
    ticketPrefix: "KHFF-MAH-",
  },

  // --- 2. PROGRAM NON-KOMPETISI (Panorama & Showcase Sinema) ---
  {
    id: "nonkomp-panorama",
    tabSheet: "NonKomp_Panorama",
    programId: "non-kompetisi",
    programLabel: "Program Non-Kompetisi",
    category: "Non-Kompetisi",
    title: "KHFF Panorama",
    subtitle: "Karya Terkurasi Ragam Narasi & Budaya",
    scheduleDate: "Jumat, 18 September 2026",
    scheduleTime: "13.00 WIB",
    venue: "Ruang Seminar PDIN",
    venueDetail: "Pusat Desain Industri Nasional (PDIN), Jl. Terban",
    maxSlots: 20,
    ticketPrefix: "KHFF-PAN-",
  },
  {
    id: "nonkomp-indonesian-cinema-1",
    tabSheet: "NonKomp_IndoCinema_1",
    programId: "non-kompetisi",
    programLabel: "Program Non-Kompetisi",
    category: "Non-Kompetisi",
    title: "Heritage in Indonesian Cinema #1",
    subtitle: "Pemutaran Khusus Film 'Ibunda' (Teguh Karya, 1986)",
    scheduleDate: "Jumat, 18 September 2026",
    scheduleTime: "19.15 WIB",
    venue: "Ruang Audiovisual PDIN",
    venueDetail: "Pusat Desain Industri Nasional (PDIN), Jl. Terban",
    maxSlots: 20,
    ticketPrefix: "KHFF-HIC1-",
  },
  {
    id: "nonkomp-indonesian-cinema-2",
    tabSheet: "NonKomp_IndoCinema_2",
    programId: "non-kompetisi",
    programLabel: "Program Non-Kompetisi",
    category: "Non-Kompetisi",
    title: "Heritage in Indonesian Cinema #2",
    subtitle: "Pemutaran Khusus Film 'Kantata Takwa' (Erros Djarot & Gotot Prakosa)",
    scheduleDate: "Sabtu, 19 September 2026",
    scheduleTime: "16.00 WIB",
    venue: "Ruang Seminar PDIN",
    venueDetail: "Pusat Desain Industri Nasional (PDIN), Jl. Terban",
    maxSlots: 20,
    ticketPrefix: "KHFF-HIC2-",
  },
  {
    id: "nonkomp-experimental-cinema-1",
    tabSheet: "NonKomp_Experimental_1",
    programId: "non-kompetisi",
    programLabel: "Program Non-Kompetisi",
    category: "Non-Kompetisi",
    title: "Heritage in Experimental Cinema #1",
    subtitle: "Beyond Provenance: Idak-Idak, Sharp Object, The Stone That Remembers",
    scheduleDate: "Jumat, 18 September 2026",
    scheduleTime: "16.00 WIB",
    venue: "Ruang Seminar PDIN",
    venueDetail: "Pusat Desain Industri Nasional (PDIN), Jl. Terban",
    maxSlots: 20,
    ticketPrefix: "KHFF-EXP1-",
  },
  {
    id: "nonkomp-experimental-cinema-2",
    tabSheet: "NonKomp_Experimental_2",
    programId: "non-kompetisi",
    programLabel: "Program Non-Kompetisi",
    category: "Non-Kompetisi",
    title: "Heritage in Experimental Cinema #2",
    subtitle: "Garden Amidst the Flame & Afterlives",
    scheduleDate: "Jumat, 18 September 2026",
    scheduleTime: "19.15 WIB",
    venue: "Ruang Seminar PDIN",
    venueDetail: "Pusat Desain Industri Nasional (PDIN), Jl. Terban",
    maxSlots: 20,
    ticketPrefix: "KHFF-EXP2-",
  },

  // --- 3. PROGRAM NON-PEMUTARAN (Talks & Workshop) ---
  {
    id: "nonpemutaran-director-talks",
    tabSheet: "NonPemutaran_DirectorTalks",
    programId: "non-pemutaran",
    programLabel: "Program Non-Pemutaran",
    category: "Director Talks",
    title: "Director Talks: Mistik Melampaui Ketakutan",
    subtitle: "Wregas Bhanuteja (Sutradara 'Para Perasuk')",
    scheduleDate: "Jumat, 18 September 2026",
    scheduleTime: "19.15 WIB",
    venue: "Ruang Kaca Bawah (Selatan) PDIN",
    venueDetail: "Pusat Desain Industri Nasional (PDIN), Jl. Terban",
    maxSlots: 20,
    ticketPrefix: "KHFF-DIR-",
  },
  {
    id: "nonpemutaran-heritage-talks",
    tabSheet: "NonPemutaran_HeritageTalks",
    programId: "non-pemutaran",
    programLabel: "Program Non-Pemutaran",
    category: "Heritage Talks",
    title: "Heritage Talks: Merawat yang Hidup",
    subtitle: "Zaki Habibi (Akademisi & Peneliti Budaya Visual)",
    scheduleDate: "Sabtu, 19 September 2026",
    scheduleTime: "16.00 WIB",
    venue: "Ruang Kaca Bawah (Selatan) PDIN",
    venueDetail: "Pusat Desain Industri Nasional (PDIN), Jl. Terban",
    maxSlots: 20,
    ticketPrefix: "KHFF-TALK-",
  },
  {
    id: "nonpemutaran-workshop-stop-motion",
    tabSheet: "NonPemutaran_Workshop",
    programId: "non-pemutaran",
    programLabel: "Program Non-Pemutaran",
    category: "Workshop",
    title: "Workshop: Heritage Stop Motion: Diam-Diam Bergerak",
    subtitle: "Rimbun Project (Studio Animasi & Kolektif Partisipatif)",
    scheduleDate: "Sabtu, 19 September 2026",
    scheduleTime: "13.00 WIB",
    venue: "Ruang Kaca Bawah (Selatan) PDIN",
    venueDetail: "Pusat Desain Industri Nasional (PDIN), Jl. Terban",
    maxSlots: 20,
    ticketPrefix: "KHFF-WKP-",
  },
];

export function getAllBookingEvents(): BookingEvent[] {
  return BOOKING_EVENTS;
}

export function getBookingEventById(id: string): BookingEvent | undefined {
  return BOOKING_EVENTS.find((e) => e.id === id);
}

export function getBookingEventsByProgram(
  programId: "kompetisi" | "non-kompetisi" | "non-pemutaran"
): BookingEvent[] {
  return BOOKING_EVENTS.filter((e) => e.programId === programId);
}

export function matchEventByQuery(query: string): BookingEvent | undefined {
  const q = query.toLowerCase();
  return BOOKING_EVENTS.find(
    (e) =>
      e.id === q ||
      e.tabSheet.toLowerCase() === q ||
      e.title.toLowerCase().includes(q)
  );
}
