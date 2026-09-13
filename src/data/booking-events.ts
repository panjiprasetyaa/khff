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
  programUrl: string;
  isSoldOut?: boolean;
  // Metadata waktu untuk deteksi bentrok jadwal
  dateIso: string;
  startTime: string;
  endTime: string;
  startMinutes: number;
  endMinutes: number;
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
    venue: "Ruang Audiovisual, PDIN Yogyakarta",
    venueDetail: "Pusat Desain Industri Nasional (PDIN), Jl. Terban",
    maxSlots: 20,
    ticketPrefix: "KHFF-PUR-",
    programUrl: "/program/kompetisi?tab=purwaseswa",
    dateIso: "2026-09-18",
    startTime: "13:00",
    endTime: "14:20",
    startMinutes: 780,
    endMinutes: 860,
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
    venue: "Ruang Audiovisual, PDIN Yogyakarta",
    venueDetail: "Pusat Desain Industri Nasional (PDIN), Jl. Terban",
    maxSlots: 20,
    ticketPrefix: "KHFF-KAR-",
    programUrl: "/program/kompetisi?tab=karyanagri",
    dateIso: "2026-09-18",
    startTime: "16:00",
    endTime: "18:10",
    startMinutes: 960,
    endMinutes: 1090,
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
    venue: "Ruang Seminar, PDIN Yogyakarta",
    venueDetail: "Pusat Desain Industri Nasional (PDIN), Jl. Terban",
    maxSlots: 20,
    ticketPrefix: "KHFF-MAH-",
    programUrl: "/program/kompetisi?tab=mahaditya",
    dateIso: "2026-09-19",
    startTime: "13:00",
    endTime: "15:45",
    startMinutes: 780,
    endMinutes: 945,
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
    venue: "Ruang Seminar, PDIN Yogyakarta",
    venueDetail: "Pusat Desain Industri Nasional (PDIN), Jl. Terban",
    maxSlots: 20,
    ticketPrefix: "KHFF-PAN-",
    programUrl: "/program/non-kompetisi?tab=khff-panorama",
    dateIso: "2026-09-18",
    startTime: "13:00",
    endTime: "15:30",
    startMinutes: 780,
    endMinutes: 930,
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
    venue: "Ruang Audiovisual, PDIN Yogyakarta",
    venueDetail: "Pusat Desain Industri Nasional (PDIN), Jl. Terban",
    maxSlots: 20,
    ticketPrefix: "KHFF-HIC1-",
    programUrl: "/program/non-kompetisi?tab=heritage-in-indonesian-cinema",
    dateIso: "2026-09-18",
    startTime: "19:15",
    endTime: "21:08",
    startMinutes: 1155,
    endMinutes: 1268,
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
    venue: "Ruang Seminar, PDIN Yogyakarta",
    venueDetail: "Pusat Desain Industri Nasional (PDIN), Jl. Terban",
    maxSlots: 20,
    ticketPrefix: "KHFF-HIC2-",
    programUrl: "/program/non-kompetisi?tab=heritage-in-indonesian-cinema",
    dateIso: "2026-09-19",
    startTime: "16:00",
    endTime: "17:20",
    startMinutes: 960,
    endMinutes: 1040,
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
    venue: "Ruang Seminar, PDIN Yogyakarta",
    venueDetail: "Pusat Desain Industri Nasional (PDIN), Jl. Terban",
    maxSlots: 20,
    ticketPrefix: "KHFF-EXP1-",
    programUrl: "/program/non-kompetisi?tab=heritage-in-experimental-cinema",
    dateIso: "2026-09-18",
    startTime: "16:00",
    endTime: "17:55",
    startMinutes: 960,
    endMinutes: 1075,
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
    venue: "Ruang Seminar, PDIN Yogyakarta",
    venueDetail: "Pusat Desain Industri Nasional (PDIN), Jl. Terban",
    maxSlots: 20,
    ticketPrefix: "KHFF-EXP2-",
    programUrl: "/program/non-kompetisi?tab=heritage-in-experimental-cinema",
    dateIso: "2026-09-18",
    startTime: "19:15",
    endTime: "20:45",
    startMinutes: 1155,
    endMinutes: 1245,
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
    scheduleTime: "16.00 WIB",
    venue: "Ruang Kaca Bawah (Selatan), PDIN Yogyakarta",
    venueDetail: "Pusat Desain Industri Nasional (PDIN), Jl. Terban",
    maxSlots: 20,
    ticketPrefix: "KHFF-DIR-",
    programUrl: "/program/non-pemutaran/director-talks",
    dateIso: "2026-09-18",
    startTime: "16:00",
    endTime: "18:10",
    startMinutes: 960,
    endMinutes: 1090,
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
    venue: "Ruang Kaca Bawah (Selatan), PDIN Yogyakarta",
    venueDetail: "Pusat Desain Industri Nasional (PDIN), Jl. Terban",
    maxSlots: 20,
    ticketPrefix: "KHFF-TALK-",
    programUrl: "/program/non-pemutaran/heritage-talks",
    dateIso: "2026-09-19",
    startTime: "16:00",
    endTime: "18:10",
    startMinutes: 960,
    endMinutes: 1090,
  },
  {
    id: "nonpemutaran-workshop-stop-motion",
    tabSheet: "NonPemutaran_Workshop",
    programId: "non-pemutaran",
    programLabel: "Program Non-Pemutaran",
    category: "Heritage Workshop",
    title: "Heritage Workshop: Stop Motion!",
    subtitle: "Rimbun Project (Studio Animasi & Kolektif Partisipatif)",
    scheduleDate: "Sabtu, 19 September 2026",
    scheduleTime: "13.00 WIB",
    venue: "Ruang Kaca Bawah (Selatan), PDIN Yogyakarta",
    venueDetail: "Pusat Desain Industri Nasional (PDIN), Jl. Terban",
    maxSlots: 20,
    isSoldOut: true,
    ticketPrefix: "KHFF-WKP-",
    programUrl: "/program/non-pemutaran/workshop-stop-motion",
    dateIso: "2026-09-19",
    startTime: "13:00",
    endTime: "16:00",
    startMinutes: 780,
    endMinutes: 960,
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

/**
 * Memeriksa apakah dua sesi program festival memiliki jadwal yang bertabrakan (tumpang tindih waktu)
 */
export function checkScheduleConflict(eventA: BookingEvent, eventB: BookingEvent): boolean {
  if (!eventA || !eventB) return false;
  if (eventA.id === eventB.id) return false; // Acara yang sama adalah duplikat, bukan bentrok jam
  if (eventA.dateIso !== eventB.dateIso) return false; // Beda hari tidak bentrok

  // Kondisi tumpang tindih: startA < endB && startB < endA
  return eventA.startMinutes < eventB.endMinutes && eventB.startMinutes < eventA.endMinutes;
}

/**
 * Mencari program yang bertabrakan dengan event target dari daftar event ID yang sudah didaftarkan user
 */
export function findConflictingRegisteredEvent(
  targetEventId: string,
  userRegisteredEventIds: string[]
): BookingEvent | null {
  const target = getBookingEventById(targetEventId);
  if (!target) return null;

  for (const registeredId of userRegisteredEventIds) {
    if (registeredId === targetEventId) continue;
    const registeredEvent = getBookingEventById(registeredId);
    if (registeredEvent && checkScheduleConflict(target, registeredEvent)) {
      return registeredEvent;
    }
  }
  return null;
}

/**
 * Mendapatkan daftar seluruh ID program lain yang jadwalnya bentrok dengan acara tertentu
 */
export function getConflictingEventIds(eventId: string): string[] {
  const target = getBookingEventById(eventId);
  if (!target) return [];

  return BOOKING_EVENTS
    .filter((other) => other.id !== target.id && checkScheduleConflict(target, other))
    .map((other) => other.id);
}
