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
 * 4. Klik tombol "Deploy" (kanan atas) > "Manage deployments" (jika edit) atau "New deployment".
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
        "Nama Lengkap (Penumpang 1)",
        "Nama Lengkap (Penumpang 2)",
        "Email (Google Terverifikasi)",
        "No. WhatsApp",
        "Jumlah Penumpang Becak",
        "Kode Registrasi",
        "Status"
      ]);
      // Format header
      var headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#1d4d4f");
      headerRange.setFontColor("#ffffff");
    } else {
      // Migrasi cerdas: jika sheet sudah dibuat dengan kolom lama, pastikan kolom Penumpang 2 tersedia
      var lastCol = Math.max(sheet.getLastColumn(), 1);
      var currentHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
      var hasPassenger2 = currentHeaders.some(function(h) {
        return h.toString().toLowerCase().indexOf("penumpang 2") !== -1;
      });

      if (!hasPassenger2 && currentHeaders.length >= 2) {
        sheet.insertColumnAfter(2);
        sheet.getRange(1, 3).setValue("Nama Lengkap (Penumpang 2)")
          .setFontWeight("bold")
          .setBackground("#1d4d4f")
          .setFontColor("#ffffff");
      }
    }

    var contents = e.postData.contents;
    var data = JSON.parse(contents);

    var email = (data.email || "").trim().toLowerCase();
    var name = (data.name || "").trim();
    var name2 = (data.name2 || "").trim();
    var whatsapp = (data.whatsapp || "").trim();
    var passengers = data.passengers || "2";

    // 1. Validasi data wajib
    if (!email) {
      return createJsonResponse({
        status: "error",
        code: "INVALID_EMAIL",
        message: "Email Google tidak ditemukan atau tidak valid."
      });
    }

    if (!name || !name2 || !whatsapp) {
      return createJsonResponse({
        status: "error",
        code: "INCOMPLETE_DATA",
        message: "Nama lengkap penumpang 1, nama lengkap penumpang 2, dan nomor WhatsApp wajib diisi."
      });
    }

    // 2. CEK ANTI-SPAM & DUPLIKASI (Cari kolom Email secara dinamis berdasarkan header)
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var headerCols = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      var emailColIndex = 4; // default kolom D
      for (var c = 0; c < headerCols.length; c++) {
        if (headerCols[c].toString().toLowerCase().indexOf("email") !== -1) {
          emailColIndex = c + 1;
          break;
        }
      }

      var existingEmails = sheet.getRange(2, emailColIndex, lastRow - 1, 1).getValues();
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
      name2,
      email,
      "'" + whatsapp, // Tanda petik agar digit 0 di depan nomor HP tidak hilang
      passengers,
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
        name2: name2,
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
