/**
 * ===================================================================
 * KOTABARU HERITAGE FILM FESTIVAL 2026
 * Backend Serverless Google Apps Script: Pemesanan Tiket Seluruh Program
 * (Kompetisi, Non-Kompetisi, dan Non-Pemutaran)
 * ===================================================================
 * 
 * FITUR UTAMA:
 * 1. Multi-Tab Otomatis: Setiap acara memiliki tab terpisah di Spreadsheet.
 * 2. Kuota 20 Slot per Acara: Dikelola ketat dengan LockService serverless.
 * 3. Anti-Duplikasi: 1 Akun Google hanya dapat memesan 1 slot per acara.
 * 4. Realtime Quota Tracking: Endpoint doGet mengembalikan status sisa slot live.
 * 
 * -------------------------------------------------------------------
 * PANDUAN LENGKAP MENGHUBUNGKAN GOOGLE SPREADSHEET BARU (STEP-BY-STEP):
 * -------------------------------------------------------------------
 * 1. Buka Google Spreadsheet baru yang telah Anda buat di Google Drive.
 * 2. Di menu atas Spreadsheet, klik "Extensions" (Ekstensi) > "Apps Script".
 * 3. Hapus kode default (myFunction) di editor Apps Script.
 * 4. Salin seluruh isi file ini (ProgramTicketsCode.gs) dan tempel ke editor Apps Script.
 * 5. Beri nama proyek di kiri atas, contoh: "KHFF 2026 Program Tickets API".
 * 6. Tekan tombol Save (ikon Disket atau Cmd+S / Ctrl+S).
 * 7. Klik tombol biru "Deploy" (Terapkan) di kanan atas > pilih "New deployment" (Deployment baru).
 * 8. Pada jendela yang muncul:
 *    - Klik ikon gerigi (Select type) di sebelah kiri > pilih "Web app".
 *    - Description: "Versi 1 - Multi Program Tickets".
 *    - Execute as: "Me (email-anda@gmail.com)".
 *    - Who has access: WAJIB pilih "Anyone" (Siapa saja, bahkan anonim).
 * 9. Klik tombol "Deploy".
 *    - Jika muncul permintaan "Authorize access" (Otorisasi Akses), klik "Authorize access".
 *    - Pilih akun Google Anda.
 *    - Klik "Advanced" (Lanjutan) di kiri bawah > klik "Go to KHFF 2026 Program Tickets API (unsafe)".
 *    - Klik "Allow" (Izinkan).
 * 10. Salin "Web app URL" yang diberikan (berformat: https://script.google.com/macros/s/.../exec).
 * 11. Buka file `.env.local` pada project web KHFF, lalu masukkan URL tersebut:
 *     NEXT_PUBLIC_PROGRAM_SCRIPT_URL=https://script.google.com/macros/s/.../exec
 * 12. Selesai! Web akan langsung terhubung secara realtime dengan Google Spreadsheet Anda.
 * ===================================================================
 */

const MAX_SLOTS_PER_EVENT = 20;

// Pemetaan Event ID ke Nama Tab Spreadsheet
var EVENT_SHEET_MAP = {
  // Kompetisi
  "kompetisi-purwaseswa": "Kompetisi_Purwaseswa",
  "kompetisi-karyanagri": "Kompetisi_Karyanagri",
  "kompetisi-mahaditya": "Kompetisi_Mahaditya",
  // Non-Kompetisi
  "nonkomp-panorama": "NonKomp_Panorama",
  "nonkomp-indonesian-cinema-1": "NonKomp_IndoCinema_1",
  "nonkomp-indonesian-cinema-2": "NonKomp_IndoCinema_2",
  "nonkomp-experimental-cinema-1": "NonKomp_Experimental_1",
  "nonkomp-experimental-cinema-2": "NonKomp_Experimental_2",
  // Non-Pemutaran
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
 * Endpoint GET: Mengambil status sisa kuota seluruh acara secara realtime
 * atau daftar registrasi user berdasarkan email
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // Query registrasi user berdasarkan email: ?action=userRegistrations&email=...
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
        timestamp: new Date().toISOString()
      });
    }

    // Default: Status Kuota Seluruh Sesi
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
 * Endpoint POST: Menangani pemesanan tiket untuk acara tertentu
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000); // Lock 15 detik untuk konsistensi kuota

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var contents = e.postData.contents;
    var data = JSON.parse(contents);

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
    var sheet = getOrCreateEventSheet(ss, tabName, eventTitle);

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
    lock.releaseLock();
  }
}

/**
 * Helper: Ambil tab sheet atau buat baru secara otomatis lengkap dengan styling header
 */
function getOrCreateEventSheet(ss, tabName, eventTitle) {
  var sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    sheet = ss.insertSheet(tabName);
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
    header.setBackground("#1d4d4f");
    header.setFontColor("#ffffff");
    header.setHorizontalAlignment("center");

    // Atur lebar kolom yang rapi
    sheet.setColumnWidth(1, 160); // Timestamp
    sheet.setColumnWidth(2, 220); // Nama
    sheet.setColumnWidth(3, 240); // Email
    sheet.setColumnWidth(4, 150); // No WA
    sheet.setColumnWidth(5, 260); // Acara
    sheet.setColumnWidth(6, 160); // Kode Tiket
    sheet.setColumnWidth(7, 140); // Status
  }
  return sheet;
}

/**
 * Helper: Cek apakah email sudah terdaftar di tab spesifik
 */
function isEmailRegisteredInSheet(sheet, email) {
  if (!sheet || sheet.getLastRow() <= 1) return false;

  var lastRow = sheet.getLastRow();
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var emailCol = -1;

  for (var c = 0; c < headers.length; c++) {
    if (headers[c].toString().toLowerCase().indexOf("email") !== -1) {
      emailCol = c + 1;
      break;
    }
  }

  if (emailCol !== -1) {
    var values = sheet.getRange(2, emailCol, lastRow - 1, 1).getValues();
    for (var r = 0; r < values.length; r++) {
      if (values[r][0].toString().trim().toLowerCase() === email) {
        return true;
      }
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
