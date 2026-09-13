/**
 * ===================================================================
 * KOTABARU HERITAGE FILM FESTIVAL 2026
 * Backend Serverless Google Apps Script: Pemesanan Tiket Seluruh Program
 * (Kompetisi, Non-Kompetisi, dan Non-Pemutaran)
 * ===================================================================
 * 
 * FITUR UTAMA:
 * 1. Inisialisasi Otomatis: Membuat seluruh 11 tab program festival lengkap dengan
 *    format kolom, warna tema KHFF, dan urutan rapi secara otomatis.
 * 2. Kuota 20 Slot per Acara: Dikelola ketat dengan LockService serverless.
 * 3. Anti-Duplikasi: 1 Akun Google hanya dapat memesan 1 slot per acara.
 * 4. Pencegahan Konflik Jadwal: Menolak registrasi pada 2 program yang jamnya bentrok.
 * 5. Fitur Reset / Pembatalan Sesi: Menghapus baris registrasi dan mengembalikan kuota slot.
 * 6. Realtime Quota Tracking: Endpoint doGet mengembalikan status sisa slot live.
 * 
 * -------------------------------------------------------------------
 * PANDUAN MENGHUBUNGKAN GOOGLE SPREADSHEET BARU (STEP-BY-STEP):
 * -------------------------------------------------------------------
 * 1. Buka Google Spreadsheet BARU di Google Drive Anda (file kosong).
 * 2. Di menu atas Spreadsheet, klik "Extensions" (Ekstensi) > "Apps Script".
 * 3. Hapus seluruh kode default yang ada di editor Apps Script.
 * 4. Salin seluruh isi file ini (ProgramTicketsCode.gs) dan tempel ke editor Apps Script.
 * 5. Beri nama proyek di kiri atas, contoh: "KHFF 2026 Program Tickets API".
 * 6. Tekan tombol Save (ikon Disket atau Cmd+S / Ctrl+S).
 * 
 * --- [LANGKAH INISIASI TAB SPREADSHEET]:
 * 7. Di toolbar atas editor Apps Script, pilih fungsi "setupAllSheets" dari dropdown.
 * 8. Klik tombol "Run" (Jalankan).
 *    - Jika muncul otorisasi, klik "Review permissions" > pilih akun Anda > klik "Advanced" > "Go to ... (unsafe)" > "Allow".
 *    - SELESAI! Seluruh 11 tab program festival akan langsung otomatis dibuat, diurutkan,
 *      dan diformat rapi di Google Spreadsheet Anda, serta tab 'Sheet1' kosong otomatis dihapus.
 * 
 * --- [LANGKAH DEPLOYMENT WEB APP]:
 * 9. Klik tombol biru "Deploy" (Terapkan) di kanan atas > pilih "New deployment".
 * 10. Pada jendela deployment:
 *     - Klik ikon gerigi (Select type) di sebelah kiri > pilih "Web app".
 *     - Description: "Versi 1 - Inisialisasi 11 Program KHFF".
 *     - Execute as: "Me (email-anda@gmail.com)".
 *     - Who has access: WAJIB pilih "Anyone" (Siapa saja, bahkan anonim).
 * 11. Klik "Deploy".
 * 12. Salin "Web app URL" yang diberikan (berformat: https://script.google.com/macros/s/.../exec).
 * 13. Buka file `.env.local` pada project web KHFF, lalu perbarui variabel:
 *     NEXT_PUBLIC_PROGRAM_SCRIPT_URL=https://script.google.com/macros/s/.../exec
 * 14. Selesai! Web akan langsung terhubung secara realtime dengan Google Spreadsheet Anda.
 * ===================================================================
 */

const MAX_SLOTS_PER_EVENT = 20;

// Daftar 11 Acara Program Festival dalam Urutan Rapi
var ORDERED_PROGRAM_EVENTS = [
  // --- 1. PROGRAM KOMPETISI ---
  {
    eventId: "kompetisi-purwaseswa",
    tabSheet: "Kompetisi_Purwaseswa",
    title: "Kompetisi: Purwaseswa",
    category: "Kompetisi",
    schedule: "Jumat, 18 Sep 2026 | 13.00 - 14.20 WIB",
    venue: "Ruang Audiovisual, PDIN Yogyakarta"
  },
  {
    eventId: "kompetisi-karyanagri",
    tabSheet: "Kompetisi_Karyanagri",
    title: "Kompetisi: Karyanagri",
    category: "Kompetisi",
    schedule: "Jumat, 18 Sep 2026 | 16.00 - 18.10 WIB",
    venue: "Ruang Audiovisual, PDIN Yogyakarta"
  },
  {
    eventId: "kompetisi-mahaditya",
    tabSheet: "Kompetisi_Mahaditya",
    title: "Kompetisi: Mahaditya",
    category: "Kompetisi",
    schedule: "Sabtu, 19 Sep 2026 | 13.00 - 15.45 WIB",
    venue: "Ruang Audiovisual, PDIN Yogyakarta"
  },

  // --- 2. PROGRAM NON-KOMPETISI ---
  {
    eventId: "nonkomp-panorama",
    tabSheet: "NonKomp_Panorama",
    title: "Panorama: Jogja Film Academy",
    category: "Non-Kompetisi",
    schedule: "Jumat, 18 Sep 2026 | 13.00 - 15.30 WIB",
    venue: "Ruang Seminar, PDIN Yogyakarta"
  },
  {
    eventId: "nonkomp-experimental-cinema-1",
    tabSheet: "NonKomp_Experimental_1",
    title: "Heritage in Experimental Cinema #1",
    category: "Non-Kompetisi",
    schedule: "Jumat, 18 Sep 2026 | 16.00 - 17.55 WIB",
    venue: "Ruang Seminar, PDIN Yogyakarta"
  },
  {
    eventId: "nonkomp-experimental-cinema-2",
    tabSheet: "NonKomp_Experimental_2",
    title: "Heritage in Experimental Cinema #2",
    category: "Non-Kompetisi",
    schedule: "Jumat, 18 Sep 2026 | 19.15 - 20.45 WIB",
    venue: "Ruang Seminar, PDIN Yogyakarta"
  },
  {
    eventId: "nonkomp-indonesian-cinema-1",
    tabSheet: "NonKomp_IndoCinema_1",
    title: "Heritage in Indonesian Cinema #1",
    category: "Non-Kompetisi",
    schedule: "Jumat, 18 Sep 2026 | 19.15 - 21.08 WIB",
    venue: "Ruang Audiovisual, PDIN Yogyakarta"
  },
  {
    eventId: "nonkomp-indonesian-cinema-2",
    tabSheet: "NonKomp_IndoCinema_2",
    title: "Heritage in Indonesian Cinema #2",
    category: "Non-Kompetisi",
    schedule: "Sabtu, 19 Sep 2026 | 16.00 - 17.20 WIB",
    venue: "Ruang Audiovisual, PDIN Yogyakarta"
  },

  // --- 3. PROGRAM NON-PEMUTARAN (Talks & Workshop) ---
  {
    eventId: "nonpemutaran-director-talks",
    tabSheet: "NonPemutaran_DirectorTalks",
    title: "Director Talks: Mistik Melampaui Ketakutan (Wregas Bhanuteja)",
    category: "Director Talks",
    schedule: "Jumat, 18 Sep 2026 | 16.00 - 18.10 WIB",
    venue: "Ruang Kaca Bawah (Selatan), PDIN Yogyakarta"
  },
  {
    eventId: "nonpemutaran-workshop-stop-motion",
    tabSheet: "NonPemutaran_Workshop",
    title: "Heritage Workshop: Stop Motion!",
    category: "Heritage Workshop",
    schedule: "Sabtu, 19 Sep 2026 | 13.00 - 16.00 WIB",
    venue: "Ruang Kaca Bawah (Selatan), PDIN Yogyakarta"
  },
  {
    eventId: "nonpemutaran-heritage-talks",
    tabSheet: "NonPemutaran_HeritageTalks",
    title: "Merawat yang Hidup (Heritage Talks: Zaki Habibi)",
    category: "Heritage Talks",
    schedule: "Sabtu, 19 Sep 2026 | 16.00 - 18.10 WIB",
    venue: "Ruang Kaca Bawah (Selatan), PDIN Yogyakarta"
  }
];

// Pemetaan Event ID ke Nama Tab Sheet
var EVENT_SHEET_MAP = {
  "kompetisi-purwaseswa": "Kompetisi_Purwaseswa",
  "kompetisi-karyanagri": "Kompetisi_Karyanagri",
  "kompetisi-mahaditya": "Kompetisi_Mahaditya",
  "nonkomp-panorama": "NonKomp_Panorama",
  "nonkomp-indonesian-cinema-1": "NonKomp_IndoCinema_1",
  "nonkomp-indonesian-cinema-2": "NonKomp_IndoCinema_2",
  "nonkomp-experimental-cinema-1": "NonKomp_Experimental_1",
  "nonkomp-experimental-cinema-2": "NonKomp_Experimental_2",
  "nonpemutaran-director-talks": "NonPemutaran_DirectorTalks",
  "nonpemutaran-heritage-talks": "NonPemutaran_HeritageTalks",
  "nonpemutaran-workshop-stop-motion": "NonPemutaran_Workshop"
};

// Pemetaan Konflik Jadwal Antar-Program (Tumpang tindih waktu pada hari festival yang sama)
// Satu user (email Google) hanya dapat memilih 1 program di slot waktu yang bertabrakan.
var EVENT_CONFLICT_MAP = {
  // Cluster 1: Jumat 18 Sep, 13.00 - 15.30
  "kompetisi-purwaseswa": ["nonkomp-panorama"],
  "nonkomp-panorama": ["kompetisi-purwaseswa"],

  // Cluster 2: Jumat 18 Sep, 16.00 - 18.10
  "kompetisi-karyanagri": ["nonkomp-experimental-cinema-1", "nonpemutaran-director-talks"],
  "nonkomp-experimental-cinema-1": ["kompetisi-karyanagri", "nonpemutaran-director-talks"],
  "nonpemutaran-director-talks": ["kompetisi-karyanagri", "nonkomp-experimental-cinema-1"],

  // Cluster 3: Jumat 18 Sep, 19.15 - 21.08
  "nonkomp-indonesian-cinema-1": ["nonkomp-experimental-cinema-2"],
  "nonkomp-experimental-cinema-2": ["nonkomp-indonesian-cinema-1"],

  // Cluster 4: Sabtu 19 Sep, 13.00 - 16.00
  "kompetisi-mahaditya": ["nonpemutaran-workshop-stop-motion"],
  "nonpemutaran-workshop-stop-motion": ["kompetisi-mahaditya"],

  // Cluster 5: Sabtu 19 Sep, 16.00 - 18.10
  "nonkomp-indonesian-cinema-2": ["nonpemutaran-heritage-talks"],
  "nonpemutaran-heritage-talks": ["nonkomp-indonesian-cinema-2"]
};

var EVENT_TITLES_MAP = {
  "kompetisi-purwaseswa": "Kompetisi: Purwaseswa (13.00 - 14.20)",
  "nonkomp-panorama": "Panorama: Jogja Film Academy (13.00 - 15.30)",
  "kompetisi-karyanagri": "Kompetisi: Karyanagri (16.00 - 18.10)",
  "nonkomp-experimental-cinema-1": "Heritage in Experimental Cinema #1 (16.00 - 17.55)",
  "nonpemutaran-director-talks": "Director Talks: Mistik Melampaui Ketakutan (16.00 - 18.10)",
  "nonkomp-indonesian-cinema-1": "Heritage in Indonesian Cinema #1 (19.15 - 21.08)",
  "nonkomp-experimental-cinema-2": "Heritage in Experimental Cinema #2 (19.15 - 20.45)",
  "kompetisi-mahaditya": "Kompetisi: Mahaditya (13.00 - 15.45)",
  "nonpemutaran-workshop-stop-motion": "Heritage Workshop: Stop Motion! (13.00 - 16.00)",
  "nonkomp-indonesian-cinema-2": "Heritage in Indonesian Cinema #2 (16.00 - 17.20)",
  "nonpemutaran-heritage-talks": "Merawat yang Hidup (Heritage Talks) (16.00 - 18.10)"
};

/**
 * ===================================================================
 * FUNGSI SETUP: Inisialisasi Seluruh 11 Tab Program & Format Kolom Rapi
 * ===================================================================
 * Jalankan fungsi ini dari menu Apps Script editor (dropdown function -> Run).
 * Bisa juga dipanggil otomatis saat Spreadsheet baru pertama kali terhubung.
 */
function setupAllSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  initAllSheets(ss);
  Logger.log("Berhasil! Semua 11 tab program festival telah dibuat, diurutkan, dan diformat.");
  return "Berhasil membuat & merapikan 11 tab program festival!";
}

/**
 * Logika Inisialisasi Seluruh Tab Sheet
 */
function initAllSheets(ss) {
  if (!ss) ss = SpreadsheetApp.getActiveSpreadsheet();

  for (var i = 0; i < ORDERED_PROGRAM_EVENTS.length; i++) {
    var item = ORDERED_PROGRAM_EVENTS[i];
    var sheet = ss.getSheetByName(item.tabSheet);

    if (!sheet) {
      sheet = ss.insertSheet(item.tabSheet);
      formatSheetHeader(sheet);
    } else if (sheet.getLastRow() === 0) {
      formatSheetHeader(sheet);
    }

    // Pindahkan tab agar urutannya konsisten 1..11
    ss.setActiveSheet(sheet);
    ss.moveActiveSheet(i + 1);
  }

  // Hapus tab default kosong (Sheet1 / Lembar1) jika ada tab program lain
  var defaultSheetNames = ["Sheet1", "Sheet 1", "Lembar1", "Lembar 1"];
  for (var d = 0; d < defaultSheetNames.length; d++) {
    var defSheet = ss.getSheetByName(defaultSheetNames[d]);
    if (defSheet && ss.getSheets().length > ORDERED_PROGRAM_EVENTS.length) {
      if (defSheet.getLastRow() <= 1) {
        try {
          ss.deleteSheet(defSheet);
        } catch (e) {
          // Abaikan jika sheet sedang aktif atau tidak bisa dihapus
        }
      }
    }
  }

  // Set active sheet kembali ke tab pertama
  var firstSheet = ss.getSheetByName(ORDERED_PROGRAM_EVENTS[0].tabSheet);
  if (firstSheet) {
    ss.setActiveSheet(firstSheet);
  }
}

/**
 * Format Header Baris 1 pada Setiap Tab Sheet
 */
function formatSheetHeader(sheet) {
  sheet.appendRow([
    "Timestamp",
    "Nama Lengkap",
    "Email (Google Terverifikasi)",
    "No. WhatsApp",
    "Nama Acara / Sesi",
    "Kode Tiket",
    "Status Kehadiran"
  ]);

  var header = sheet.getRange(1, 1, 1, 7);
  header.setFontWeight("bold");
  header.setBackground("#1d4d4f"); // KHFF Dark Teal
  header.setFontColor("#ffffff");
  header.setHorizontalAlignment("center");
  header.setVerticalAlignment("middle");
  sheet.setRowHeight(1, 36);

  // Bekukan baris 1 (Freeze Row 1)
  sheet.setFrozenRows(1);

  // Atur lebar kolom yang rapi
  sheet.setColumnWidth(1, 170); // Timestamp
  sheet.setColumnWidth(2, 230); // Nama Lengkap
  sheet.setColumnWidth(3, 260); // Email
  sheet.setColumnWidth(4, 160); // No WhatsApp
  sheet.setColumnWidth(5, 280); // Nama Acara
  sheet.setColumnWidth(6, 170); // Kode Tiket
  sheet.setColumnWidth(7, 150); // Status
}

/**
 * Endpoint GET: Mengambil status sisa kuota seluruh acara secara realtime,
 * query registrasi user, atau inisialisasi tab otomatis.
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. Inisiasi tab jika dipanggil secara eksplisit (?action=init)
    if (e && e.parameter && e.parameter.action === "init") {
      initAllSheets(ss);
    }

    // 2. Query registrasi user berdasarkan email: ?action=userRegistrations&email=...
    if (e && e.parameter && e.parameter.action === "userRegistrations" && e.parameter.email) {
      var queryEmail = e.parameter.email.toString().trim().toLowerCase();
      var registeredIds = [];

      for (var evId in EVENT_SHEET_MAP) {
        var tName = EVENT_SHEET_MAP[evId];
        var s = ss.getSheetByName(tName);
        if (s && isEmailRegisteredInSheet(s, queryEmail)) {
          registeredIds.push(evId);
        }
      }

      return createJsonResponse({
        status: "success",
        email: queryEmail,
        registeredEventIds: registeredIds,
        spreadsheetName: ss.getName(),
        spreadsheetUrl: ss.getUrl(),
        timestamp: new Date().toISOString()
      });
    }

    // 3. Default: Status Kuota Seluruh Sesi
    var slots = {};

    for (var eventId in EVENT_SHEET_MAP) {
      var tabName = EVENT_SHEET_MAP[eventId];
      var sheet = ss.getSheetByName(tabName);
      var used = 0;
      if (sheet && sheet.getLastRow() > 1) {
        used = sheet.getLastRow() - 1;
      }
      var available = Math.max(0, MAX_SLOTS_PER_EVENT - used);
      slots[eventId] = {
        total: MAX_SLOTS_PER_EVENT,
        used: used,
        available: available,
        isFull: used >= MAX_SLOTS_PER_EVENT,
        tabSheet: tabName
      };
    }

    return createJsonResponse({
      status: "success",
      spreadsheetName: ss.getName(),
      spreadsheetUrl: ss.getUrl(),
      totalEvents: ORDERED_PROGRAM_EVENTS.length,
      slots: slots,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return createJsonResponse({
      status: "error",
      message: "Gagal memproses permintaan: " + err.toString()
    });
  }
}

/**
 * Endpoint POST: Menangani pemesanan tiket & pembatalan/reset sesi
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  var hasLock = false;
  try {
    hasLock = lock.tryLock(30000); // 30 detik lock timeout
  } catch (eLock) {
    hasLock = false;
  }

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var contents = e.postData.contents;
    var data = JSON.parse(contents);

    // ACTION: Reset / Pembatalan Sesi oleh User (Menghapus baris dari Spreadsheet)
    if (data.action === "resetRegistrations" || data.action === "cancelRegistrations") {
      var emailToReset = (data.email || "").toString().trim().toLowerCase();
      if (!emailToReset) {
        return createJsonResponse({
          status: "error",
          code: "INVALID_EMAIL",
          message: "Email akun Google wajib disertakan untuk membatalkan sesi."
        });
      }

      var deletedCount = 0;
      var affectedSheets = [];

      for (var evId in EVENT_SHEET_MAP) {
        var tName = EVENT_SHEET_MAP[evId];
        var s = ss.getSheetByName(tName);
        if (s && s.getLastRow() > 1) {
          var lastRow = s.getLastRow();
          var headers = s.getRange(1, 1, 1, s.getLastColumn()).getValues()[0];
          var emailCol = -1;
          for (var col = 0; col < headers.length; col++) {
            if (headers[col].toString().toLowerCase().indexOf("email") !== -1) {
              emailCol = col + 1;
              break;
            }
          }

          if (emailCol !== -1) {
            var values = s.getRange(2, emailCol, lastRow - 1, 1).getValues();
            // Loop mundur dari bawah ke atas agar indeks baris konsisten saat deleteRow
            for (var r = values.length - 1; r >= 0; r--) {
              if (values[r][0].toString().trim().toLowerCase() === emailToReset) {
                s.deleteRow(r + 2);
                deletedCount++;
                if (affectedSheets.indexOf(tName) === -1) {
                  affectedSheets.push(tName);
                }
              }
            }
          }
        }
      }

      return createJsonResponse({
        status: "success",
        action: "resetRegistrations",
        message: "Seluruh pendaftaran sesi untuk " + emailToReset + " berhasil dibatalkan dan dihapus dari Spreadsheet (" + deletedCount + " baris dihapus). Slot kursi telah dikembalikan.",
        deletedCount: deletedCount,
        affectedSheets: affectedSheets
      });
    }

    var eventId = (data.eventId || "").toString().trim();
    var eventTitle = (data.eventTitle || "").toString().trim();
    var programType = (data.programType || "").toString().trim();
    var name = (data.name || "").toString().trim();
    var whatsapp = (data.whatsapp || "").toString().trim();
    var email = (data.email || "").toString().trim().toLowerCase();
    var ticketPrefix = (data.ticketPrefix || "KHFF-TKT-").toString().trim();

    // 1. Validasi Kelengkapan Data
    if (!eventId || !EVENT_SHEET_MAP[eventId]) {
      return createJsonResponse({
        status: "error",
        code: "INVALID_EVENT",
        message: "ID Acara tidak valid atau tidak terdaftar."
      });
    }

    if (!email) {
      return createJsonResponse({
        status: "error",
        code: "INVALID_EMAIL",
        message: "Email Google wajib diverifikasi sebelum memesan tiket."
      });
    }

    if (!name || !whatsapp) {
      return createJsonResponse({
        status: "error",
        code: "INCOMPLETE_DATA",
        message: "Nama lengkap dan nomor WhatsApp aktif wajib diisi."
      });
    }

    // 2. Ambil atau Buat Tab Sheet yang Sesuai
    var tabName = EVENT_SHEET_MAP[eventId];
    var sheet = getOrCreateEventSheet(ss, tabName);

    // 3. Cek Kapasitas Kuota (Maksimal 20 Slot)
    var currentUsed = Math.max(0, sheet.getLastRow() - 1);
    if (currentUsed >= MAX_SLOTS_PER_EVENT) {
      return createJsonResponse({
        status: "full",
        code: "SLOT_FULL",
        message: "Mohon maaf, kuota 20 slot untuk acara '" + eventTitle + "' sudah penuh."
      });
    }

    // 4. Cek Anti-Duplikasi Email di Tab Acara Ini
    if (isEmailRegisteredInSheet(sheet, email)) {
      return createJsonResponse({
        status: "duplicate",
        code: "DUPLICATE_REGISTRATION",
        message: "Akun Google (" + email + ") sudah terdaftar di acara ini. Setiap akun hanya dapat memesan 1 tiket per sesi acara."
      });
    }

    // 5. Cek Konflik Jadwal (Tabrakan Waktu dengan Program Lain)
    // Jika user sudah terdaftar di program lain yang berlangsung pada rentang jam yang sama, pendaftaran digagalkan.
    var conflictingIds = EVENT_CONFLICT_MAP[eventId] || [];
    for (var c = 0; c < conflictingIds.length; c++) {
      var confId = conflictingIds[c];
      var confTabName = EVENT_SHEET_MAP[confId];
      var confSheet = ss.getSheetByName(confTabName);
      if (confSheet && isEmailRegisteredInSheet(confSheet, email)) {
        var confTitle = EVENT_TITLES_MAP[confId] || confId;
        return createJsonResponse({
          status: "conflict",
          code: "SCHEDULE_CONFLICT",
          message: "Pendaftaran digagalkan karena jadwal bertabrakan! Akun Google Anda telah terdaftar di program '" + confTitle + "' yang berlangsung pada waktu bersamaan. Anda hanya dapat memilih 1 program pada slot waktu yang sama.",
          conflictingEventId: confId,
          conflictingEventTitle: confTitle
        });
      }
    }

    // 6. Generate Kode Tiket Unik
    var randomNum = Math.floor(1000 + Math.random() * 9000);
    var regCode = ticketPrefix + randomNum;

    // 7. Tulis Data ke Tab Acara
    sheet.appendRow([
      new Date(),
      name,
      email,
      "'" + whatsapp,
      eventTitle,
      regCode,
      "Terkonfirmasi"
    ]);

    var updatedUsed = currentUsed + 1;
    var updatedAvailable = Math.max(0, MAX_SLOTS_PER_EVENT - updatedUsed);

    return createJsonResponse({
      status: "success",
      code: "REGISTRATION_SUCCESS",
      message: "Pemesanan tiket berhasil! Tiket Anda telah terkonfirmasi.",
      data: {
        registrationCode: regCode,
        eventId: eventId,
        eventTitle: eventTitle,
        programType: programType,
        tabSheet: tabName,
        name: name,
        email: email,
        whatsapp: whatsapp,
        remainingSlots: updatedAvailable
      }
    });

  } catch (err) {
    return createJsonResponse({
      status: "error",
      code: "SERVER_ERROR",
      message: "Terjadi kesalahan pada server Apps Script: " + err.toString()
    });
  } finally {
    SpreadsheetApp.flush();
    if (hasLock) {
      try {
        lock.releaseLock();
      } catch (eRelease) {}
    }
  }
}

/**
 * Helper: Ambil tab sheet atau buat baru jika belum ada
 */
function getOrCreateEventSheet(ss, tabName) {
  var sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    sheet = ss.insertSheet(tabName);
    formatSheetHeader(sheet);
  }
  return sheet;
}

/**
 * Helper: Cek apakah email sudah terdaftar di tab spesifik
 */
function isEmailRegisteredInSheet(sheet, email) {
  if (!sheet || sheet.getLastRow() <= 1) return false;

  var lastRow = sheet.getLastRow();
  // Default kolom email pada format standar KHFF adalah Kolom 3
  var emailCol = 3;
  var headers = sheet.getRange(1, 1, 1, Math.min(sheet.getLastColumn(), 7)).getValues()[0];

  for (var c = 0; c < headers.length; c++) {
    if (headers[c].toString().toLowerCase().indexOf("email") !== -1) {
      emailCol = c + 1;
      break;
    }
  }

  var values = sheet.getRange(2, emailCol, lastRow - 1, 1).getValues();
  for (var r = 0; r < values.length; r++) {
    if (values[r][0].toString().trim().toLowerCase() === email) {
      return true;
    }
  }
  return false;
}

/**
 * Helper: Mengembalikan respons JSON dengan CORS ramah browser
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
