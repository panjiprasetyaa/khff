/**
 * Konfigurasi Terpusat Festival KHFF 2026:
 * Mode Pendaftaran & Ketentuan Hari H (Otomatis per Tanggal Acara)
 */
export const FESTIVAL_CONFIG = {
  // Mode Pendaftaran:
  // - "auto": Otomatis beralih ke OTS per tanggal masing-masing acara (Hari H acara bersangkutan pada pukul 07:00 WIB)
  // - "open": Paksa buka seluruh slot online untuk pendaftaran
  // - "ots": Paksa tutup seluruh slot online ke OTS
  registrationMode: "auto" as "auto" | "open" | "ots",

  // Tanggal mulai Hari H Festival (Day 1)
  eventStartIso: "2026-09-18T07:00:00+07:00",

  // Jam penutupan pendaftaran online pada Hari H pelaksanaan acara (WIB)
  otsCutoffTime: "07:00",

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
   * Pendaftaran online ditutup pada pukul 07:00 WIB di Hari H pelaksanaan masing-masing acara.
   * Jika waktu sekarang (WIB) >= [eventDateIso]T07:00:00+07:00,
   * pendaftaran online untuk acara tersebut ditutup dan dialihkan ke On The Spot (OTS).
   *
   * @param eventDateIso format "YYYY-MM-DD" (contoh: "2026-09-18", "2026-09-19")
   */
  isEventOts(eventDateIso?: string): boolean {
    if (this.registrationMode === "open") return false;
    if (this.registrationMode === "ots") return true;
    if (!eventDateIso) return false;

    const dateStr = eventDateIso.slice(0, 10);
    const cutoffTimestamp = new Date(`${dateStr}T${this.otsCutoffTime}:00+07:00`).getTime();
    return Date.now() >= cutoffTimestamp;
  },

  /**
   * Pengecekan apakah festival secara umum sudah berada di mode Hari H (Day 1 setelah pukul 07:00 WIB)
   */
  isHariH(): boolean {
    if (this.registrationMode === "open") return false;
    if (this.registrationMode === "ots") return true;
    const cutoffTimestamp = new Date(`2026-09-18T${this.otsCutoffTime}:00+07:00`).getTime();
    return Date.now() >= cutoffTimestamp;
  },
};

