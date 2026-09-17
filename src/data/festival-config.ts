/**
 * Konfigurasi Terpusat Festival KHFF 2026:
 * Mode Pendaftaran & Ketentuan Hari H (Otomatis per Tanggal Acara)
 */
export const FESTIVAL_CONFIG = {
  // Mode Pendaftaran:
  // - "auto": Otomatis beralih ke OTS per tanggal masing-masing acara (Hari H acara bersangkutan di zona waktu WIB)
  // - "open": Paksa buka seluruh slot online untuk pendaftaran
  // - "ots": Paksa tutup seluruh slot online ke OTS
  registrationMode: "auto" as "auto" | "open" | "ots",

  // Tanggal mulai Hari H Festival (Day 1)
  eventStartIso: "2026-09-18T00:00:00+07:00",

  /**
   * Mendapatkan tanggal hari ini dalam format "YYYY-MM-DD" pada zona waktu Indonesia Barat (WIB / Asia/Jakarta)
   */
  getTodayWib(): string {
    try {
      return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());
    } catch {
      return new Date().toISOString().slice(0, 10);
    }
  },

  /**
   * Pengecekan apakah sebuah acara sudah memasuki Hari H (OTS ONLY)
   * Otomatis per tanggal acara:
   * Jika tanggal hari ini (WIB) >= tanggal pelaksanaan acara (dateIso),
   * pendaftaran online untuk acara tersebut ditutup dan dialihkan ke On The Spot (OTS).
   *
   * @param eventDateIso format "YYYY-MM-DD" (contoh: "2026-09-18", "2026-09-19")
   */
  isEventOts(eventDateIso?: string): boolean {
    if (this.registrationMode === "open") return false;
    if (this.registrationMode === "ots") return true;
    if (!eventDateIso) return false;

    const todayWib = this.getTodayWib();
    return todayWib >= eventDateIso;
  },

  /**
   * Pengecekan apakah festival secara umum sudah berada di mode Hari H (Day 1 ke atas)
   */
  isHariH(): boolean {
    if (this.registrationMode === "open") return false;
    if (this.registrationMode === "ots") return true;
    return this.getTodayWib() >= "2026-09-18";
  },
};

