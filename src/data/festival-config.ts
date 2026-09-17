/**
 * Konfigurasi Terpusat Festival KHFF 2026:
 * Mode Pendaftaran & Ketentuan Hari H
 */
export const FESTIVAL_CONFIG = {
  // Mode Pendaftaran:
  // - "open": Seluruh slot program dibuka malam ini untuk pendaftaran online
  // - "ots": Mode Hari H (Pendaftaran online ditutup, beralih ke OTS ONLY di venue)
  // - "auto": Otomatis beralih ke OTS saat tanggal memasuki 18 September 2026 WIB
  registrationMode: "open" as "open" | "ots" | "auto",

  // Tanggal mulai Hari H Festival
  eventStartIso: "2026-09-18T00:00:00+07:00",

  /**
   * Pengecekan apakah festival sudah berada di mode Hari H (OTS ONLY)
   */
  isHariH(): boolean {
    if (this.registrationMode === "open") return false;
    if (this.registrationMode === "ots") return true;
    try {
      return new Date() >= new Date(this.eventStartIso);
    } catch {
      return false;
    }
  },
};
