# Kotabaru Heritage Film Festival (KHFF) 2026 - Official Website

Selamat datang di repositori resmi website KHFF 2026! Website ini dibangun secara khusus untuk menampilkan profil festival, program kompetisi, jadwal acara, dan portal pendaftaran audiens secara responsif dan elegan.

---

## 🚀 Teknologi yang Digunakan (*Tech Stack*)
- **Framework:** Next.js (App Router)
- **UI Library:** React.js
- **Styling:** Tailwind CSS
- **Data Architecture:** Static JSON (Serverless)
- **Hosting / Deployment:** Vercel

---

## 👥 Pembagian Peran Tim (Workflow)
Untuk memastikan pengembangan berjalan lancar tanpa ada kode yang bertabrakan (*merge conflict*), tim dibagi menjadi 3 peran spesifik:

1. **Koordinator (Lead Engineer):**
   - Menyiapkan arsitektur dan struktur *folder*.
   - Mengatur *routing* dan URL website.
   - Melakukan *Review Code* (PR) dan bertanggung jawab untuk rilis/laporan mingguan ke Project Manager.
2. **UI Engineer:**
   - Membangun komponen antarmuka (Navbar, Footer, Card Film, Pop-up Video).
   - Menyelaraskan tipografi dan warna (*styling*) dengan arahan Desainer Grafis.
   - Memastikan tampilan responsif di layar komputer maupun *smartphone*.
3. **Data / Logic Engineer:**
   - Mengelola seluruh informasi tertulis pada website (Jadwal, Sinopsis, Daftar Program).
   - Mengisi dan menyempurnakan struktur data tanpa perlu mengubah kode desain utama.

---

## 💾 Panduan Pembaruan Konten (Untuk Data Engineer)
Seluruh informasi utama (*database*) pada website ini dikelola dalam format JSON terpusat.

**Lokasi File:** `src/data/data.json`

### Aturan Modifikasi:
1. **Film Baru:** Selalu daftarkan judul dan sinopsis film baru di dalam objek `"films"` terlebih dahulu.
2. **Kategori Program:** Jika film tersebut masuk ke dalam "Program Mahaditya", salin ID film tersebut ke dalam *array* `"filmIds"` di objek `"programs"`.
3. **Penting:** Pastikan format JSON tidak rusak. Selalu gunakan tanda kutip ganda `""` dan akhiri dengan koma `,` jika ada baris data selanjutnya.

---

## 🛠️ Cara Menjalankan Website Secara Lokal

Bagi anggota tim yang ingin menjalankan dan mengetes *website* ini di komputernya sendiri, silakan ikuti langkah berikut:

1. **Unduh Proyek (Clone):**
   ```bash
   git clone https://github.com/panjiprasetyaa/khff.git
   ```
2. **Masuk ke Direktori Proyek:**
   ```bash
   cd khff-web
   ```
3. **Instalasi Modul:**
   ```bash
   npm install
   ```
4. **Nyalakan Server:**
   ```bash
   npm run dev
   ```
5. **Buka di Browser:**
   Buka aplikasi browser (Chrome/Safari) dan ketik `http://localhost:3000`.
