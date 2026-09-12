/**
 * ===================================================================
 * KOTABARU HERITAGE FILM FESTIVAL 2026
 * Backend Serverless: Google Apps Script untuk Drive-In Cinema
 * Mendukung Multi-Tab (Becak & Kursi) & Realtime Quota Tracking
 * ===================================================================
 * 
 * KUOTA PROGRAM:
 * - Becak: 23 Slot (1 Becak = 2 Penumpang)
 * - Kursi: 40 Slot (1 Kursi = 1 Penumpang)
 * 
 * PANDUAN UPDATE DEPLOYMENT (PENTING):
 * 1. Buka project Apps Script Anda di https://script.google.com.
 * 2. Ganti seluruh isi Code.gs dengan kode terbaru ini, lalu tekan Save (Cmd+S / Ctrl+S).
 * 3. Klik tombol "Deploy" di kanan atas > pilih "Manage deployments".
 * 4. Klik ikon pensil (Edit) pada deployment aktif Web App Anda.
 * 5. Pada dropdown "Version", WAJIB pilih "New version" (Versi Baru).
 * 6. Klik "Deploy". URL Web App akan tetap sama dan langsung menjalankan logika kursi reguler terbaru.
 * 
 * JIKA MEMBUAT DEPLOYMENT BARU:
 * 1. Klik "Deploy" > "New deployment".
 * 2. Pilih type: "Web app", Execute as: "Me", Who has access: "Anyone".
 * 3. Salin Web App URL baru ke .env.local:
 *    NEXT_PUBLIC_DRIVE_IN_SCRIPT_URL=https://script.google.com/macros/s/.../exec
 */

const TAB_BECAK = "Pendaftar_Becak";
const TAB_KURSI = "Pendaftar_Kursi";

const MAX_BECAK = 23;
const MAX_KURSI = 40;

/**
 * Endpoint GET: Digunakan untuk mengambil sisa kuota slot secara realtime
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetBecak = ss.getSheetByName(TAB_BECAK);
    var sheetKursi = ss.getSheetByName(TAB_KURSI);

    var becakUsed = sheetBecak ? Math.max(0, sheetBecak.getLastRow() - 1) : 0;
    var kursiUsed = sheetKursi ? Math.max(0, sheetKursi.getLastRow() - 1) : 0;

    return createJsonResponse({
      status: "success",
      slots: {
        becak: {
          total: MAX_BECAK,
          used: becakUsed,
          available: Math.max(0, MAX_BECAK - becakUsed),
          isFull: becakUsed >= MAX_BECAK
        },
        kursi: {
          total: MAX_KURSI,
          used: kursiUsed,
          available: Math.max(0, MAX_KURSI - kursiUsed),
          isFull: kursiUsed >= MAX_KURSI
        }
      }
    });
  } catch (err) {
    return createJsonResponse({
      status: "error",
      message: "Gagal memuat status kuota slot: " + err.toString(),
      slots: {
        becak: { total: MAX_BECAK, used: 0, available: MAX_BECAK, isFull: false },
        kursi: { total: MAX_KURSI, used: 0, available: MAX_KURSI, isFull: false }
      }
    });
  }
}

/**
 * Endpoint POST: Menangani pendaftaran form untuk Becak atau Kursi
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000); // 15 detik lock timeout

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var contents = e.postData.contents;
    var data = JSON.parse(contents);

    var rawType = (data.type || "becak").toString().trim().toLowerCase();
    // Normalisasi jenis pemesanan: Kursi Reguler vs Becak
    var type = (rawType.indexOf("kursi") !== -1 || rawType.indexOf("reguler") !== -1) ? "kursi" : "becak";
    var email = (data.email || "").toString().trim().toLowerCase();
    var name = (data.name || "").toString().trim();
    var name2 = (data.name2 || "").toString().trim();
    var whatsapp = (data.whatsapp || "").toString().trim();

    // 1. Validasi dasar
    if (!email) {
      return createJsonResponse({
        status: "error",
        code: "INVALID_EMAIL",
        message: "Email Google tidak ditemukan atau tidak valid."
      });
    }

    // Untuk Kursi Reguler: HANYA wajib mengisi nama dan nomor WhatsApp
    if (!name || !whatsapp) {
      return createJsonResponse({
        status: "error",
        code: "INCOMPLETE_DATA",
        message: type === "becak"
          ? "Nama lengkap penumpang 1 dan nomor WhatsApp wajib diisi."
          : "Nama lengkap dan nomor WhatsApp wajib diisi."
      });
    }

    // Penumpang 2 HANYA wajib untuk unit Becak (kapasitas 2 orang)
    if (type === "becak" && !name2) {
      return createJsonResponse({
        status: "error",
        code: "INCOMPLETE_PASSENGER_2",
        message: "Untuk pemesanan Becak, nama lengkap Penumpang 2 wajib diisi."
      });
    }

    // 2. Inisialisasi Sheet Tab sesuai jenis pemesanan
    var sheet;
    if (type === "becak") {
      sheet = getOrCreateBecakSheet(ss);
    } else {
      sheet = getOrCreateKursiSheet(ss);
    }

    // 3. Cek kapasitas kuota slot saat ini
    var currentUsed = Math.max(0, sheet.getLastRow() - 1);
    var maxSlot = type === "becak" ? MAX_BECAK : MAX_KURSI;

    if (currentUsed >= maxSlot) {
      return createJsonResponse({
        status: "full",
        code: "SLOT_FULL",
        message: "Mohon maaf, kuota pemesanan untuk " + (type === "becak" ? "Becak Drive-In" : "Kursi Drive-In") + " sudah penuh."
      });
    }

    // 4. Anti-Duplikasi: Cek apakah email sudah terdaftar di tab Becak atau Kursi
    if (isEmailRegistered(ss, email)) {
      return createJsonResponse({
        status: "duplicate",
        code: "DUPLICATE_REGISTRATION",
        message: "Akun Google (" + email + ") sudah pernah terdaftar dalam program Drive-In Cinema. 1 akun hanya diperbolehkan mendaftar 1 kali."
      });
    }

    // 5. Generate Kode Registrasi Unik
    var prefix = type === "becak" ? "KHFF-BCK-" : "KHFF-KRS-";
    var regCode = prefix + Math.floor(1000 + Math.random() * 9000);

    // 6. Masukkan data ke sheet tab yang tepat
    if (type === "becak") {
      sheet.appendRow([
        new Date(),
        name,
        name2,
        email,
        "'" + whatsapp,
        "Becak (2 Orang)",
        regCode,
        "Terkonfirmasi"
      ]);
    } else {
      sheet.appendRow([
        new Date(),
        name,
        email,
        "'" + whatsapp,
        "Kursi (1 Orang)",
        regCode,
        "Terkonfirmasi"
      ]);
    }

    // 7. Hitung sisa kuota terbaru
    var updatedUsed = currentUsed + 1;
    var updatedAvailable = Math.max(0, maxSlot - updatedUsed);

    return createJsonResponse({
      status: "success",
      code: "REGISTRATION_SUCCESS",
      message: "Pendaftaran berhasil! Tiket " + (type === "becak" ? "Becak" : "Kursi") + " Drive-In Cinema Anda telah terkonfirmasi.",
      data: {
        registrationCode: regCode,
        type: type,
        name: name,
        name2: type === "becak" ? name2 : undefined,
        email: email,
        whatsapp: whatsapp,
        passengers: type === "becak" ? "2" : "1",
        remainingSlots: updatedAvailable
      }
    });

  } catch (err) {
    return createJsonResponse({
      status: "error",
      code: "SERVER_ERROR",
      message: "Terjadi kesalahan internal pada server Apps Script: " + err.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Helper: Ambil atau buat tab Pendaftar_Becak
 */
function getOrCreateBecakSheet(ss) {
  var sheet = ss.getSheetByName(TAB_BECAK);
  if (!sheet) {
    sheet = ss.insertSheet(TAB_BECAK);
    sheet.appendRow([
      "Timestamp",
      "Nama Lengkap (Penumpang 1)",
      "Nama Lengkap (Penumpang 2)",
      "Email (Google Terverifikasi)",
      "No. WhatsApp",
      "Kategori Tiket",
      "Kode Registrasi",
      "Status"
    ]);
    var header = sheet.getRange(1, 1, 1, 8);
    header.setFontWeight("bold");
    header.setBackground("#1d4d4f");
    header.setFontColor("#ffffff");
  }
  return sheet;
}

/**
 * Helper: Ambil atau buat tab Pendaftar_Kursi
 */
function getOrCreateKursiSheet(ss) {
  var sheet = ss.getSheetByName(TAB_KURSI);
  if (!sheet) {
    sheet = ss.insertSheet(TAB_KURSI);
    sheet.appendRow([
      "Timestamp",
      "Nama Lengkap",
      "Email (Google Terverifikasi)",
      "No. WhatsApp",
      "Kategori Tiket",
      "Kode Registrasi",
      "Status"
    ]);
    var header = sheet.getRange(1, 1, 1, 7);
    header.setFontWeight("bold");
    header.setBackground("#2c4a3e");
    header.setFontColor("#ffffff");
  }
  return sheet;
}

/**
 * Helper: Cek apakah email sudah terdaftar di tab Becak maupun Kursi
 */
function isEmailRegistered(ss, email) {
  var tabs = [TAB_BECAK, TAB_KURSI];
  for (var t = 0; t < tabs.length; t++) {
    var sheet = ss.getSheetByName(tabs[t]);
    if (sheet && sheet.getLastRow() > 1) {
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
    }
  }
  return false;
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
