/**
 * ===================================================================
 * KOTABARU HERITAGE FILM FESTIVAL 2026
 * Backend Serverless: Google Apps Script untuk Becak Drive-In Cinema
 * ===================================================================
 * 
 * PANDUAN DEPLOY:
 * 1. Buka spreadsheet Google Drive Anda.
 * 2. Masuk ke Extensions > Apps Script.
 * 3. Hapus semua kode default, lalu tempel kode di bawah ini.
 * 4. Klik tombol "Deploy" (kanan atas) > "New deployment".
 * 5. Pilih type: "Web app".
 * 6. Set "Execute as": "Me" (email Anda).
 * 7. Set "Who has access": "Anyone" (PENTING: harus Anyone agar form bisa kirim data).
 * 8. Klik "Deploy", beri izin (Authorize Access), lalu salin Web App URL.
 */

const SHEET_NAME = "Pendaftar_DriveIn";

function doPost(e) {
  // Gunakan lock untuk mencegah race-condition saat ada pendaftaran bersamaan
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    
    // Inisialisasi Sheet dan Header jika belum dibuat
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        "Timestamp",
        "Nama Lengkap",
        "Email (Google Terverifikasi)",
        "No. WhatsApp",
        "Jumlah Penumpang Becak",
        "Catatan",
        "Kode Registrasi",
        "Status"
      ]);
      // Format header
      var headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#1d4d4f");
      headerRange.setFontColor("#ffffff");
    }

    var contents = e.postData.contents;
    var data = JSON.parse(contents);

    var email = (data.email || "").trim().toLowerCase();
    var name = (data.name || "").trim();
    var whatsapp = (data.whatsapp || "").trim();
    var passengers = data.passengers || "2";
    var notes = (data.notes || "").trim();

    // 1. Validasi data wajib
    if (!email) {
      return createJsonResponse({
        status: "error",
        code: "INVALID_EMAIL",
        message: "Email Google tidak ditemukan atau tidak valid."
      });
    }

    if (!name || !whatsapp) {
      return createJsonResponse({
        status: "error",
        code: "INCOMPLETE_DATA",
        message: "Nama lengkap dan nomor WhatsApp wajib diisi."
      });
    }

    // 2. CEK ANTI-SPAM & DUPLIKASI (Kolom C = Email)
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var existingEmails = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
      for (var i = 0; i < existingEmails.length; i++) {
        var existingEmail = existingEmails[i][0].toString().trim().toLowerCase();
        if (existingEmail === email) {
          return createJsonResponse({
            status: "duplicate",
            code: "DUPLICATE_REGISTRATION",
            message: "Akun Google (" + email + ") sudah pernah terdaftar untuk Becak Drive-In Cinema. 1 Akun hanya diperbolehkan mendaftar 1 kali."
          });
        }
      }
    }

    // 3. Generate Kode Registrasi Unik (Contoh: KHFF-DRV-8492)
    var regCode = "KHFF-DRV-" + Math.floor(1000 + Math.random() * 9000);

    // 4. Tambah Baris Baru ke Google Sheet
    sheet.appendRow([
      new Date(),
      name,
      email,
      "'" + whatsapp, // Tanda petik agar digit 0 di depan nomor HP tidak hilang
      passengers,
      notes,
      regCode,
      "Terkonfirmasi"
    ]);

    // 5. Kembalikan Response Sukses
    return createJsonResponse({
      status: "success",
      code: "REGISTRATION_SUCCESS",
      message: "Pendaftaran berhasil! Becak Drive-In Cinema Anda telah terkonfirmasi.",
      data: {
        registrationCode: regCode,
        name: name,
        email: email,
        passengers: passengers
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

// Untuk cek health status endpoint via GET
function doGet(e) {
  return createJsonResponse({
    status: "ok",
    message: "Google Apps Script Backend KHFF Becak Drive-In Cinema aktif dan siap menerima data."
  });
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
