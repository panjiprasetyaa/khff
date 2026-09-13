export interface NonPemutaranEvent {
  id: string;
  slug: string;
  category: string;
  title: string;
  theme: string;
  day: string;
  date: string;
  time: string;
  venue: string;
  venueDetail: string;
  speaker: string;
  speakerRole: string;
  speakerBio: string;
  image: string;
  badgeBg: string;
  shortDesc: string;
  notes: string[];
}

export const nonPemutaranEvents: NonPemutaranEvent[] = [
  {
    id: "director-talks",
    slug: "director-talks",
    category: "Director Talks",
    title: "Director Talks: Mistik Melampaui Ketakutan",
    theme: "Heritage dalam Sudut Pandang Pembuat Film",
    day: "Jumat, 18 September 2026",
    date: "18 September 2026",
    time: "19.15 WIB",
    venue: "Ruang Kaca Bawah (Selatan) PDIN",
    venueDetail: "Pusat Desain Industri Nasional (PDIN), Jl. Terban, Yogyakarta",
    speaker: "Wregas Bhanuteja",
    speakerRole: "Sutradara Film 'Para Perasuk'",
    speakerBio:
      "Wregas Bhanuteja adalah sutradara lulusan IKJ yang meraih Best Short Film di Cannes Critics’ Week melalui Prenjak (2016) dan 12 Piala Citra melalui Penyalin Cahaya (2021), serta film-filmnya berkompetisi di berbagai festival internasional, termasuk Sundance Film Festival.",
    image: "/assets/gallery/2025/Salinan dari DAY 3 Foto Bareng-3.jpg",
    badgeBg: "bg-khff-pink text-white",
    shortDesc:
      "Menelaah kembali hubungan antara mistik, tradisi komunal, dan kebudayaan melalui medium sinema kontemporer bersama sutradara Wregas Bhanuteja.",
    notes: [
      "Sejarah dan kebudayaan Indonesia tumbuh melalui beragam tradisi, termasuk pengalaman-pengalaman yang hari ini kerap kita kategorikan sebagai mistik. Namun, dalam kehidupan modern, mistik sering ditempatkan berseberangan dengan rasionalitas: dianggap sebagai sesuatu yang irasional, terbelakang, bahkan perlu ditinggalkan. Dalam sinema Indonesia, kecenderungan tersebut menemukan bentuk yang populer melalui maraknya horor supranatural; ketika mistik terutama hadir sebagai sumber teror, ketakutan, dan hiburan.",
      "Para Perasuk karya Wregas Bhanuteja menawarkan kemungkinan yang berbeda. Film ini tidak semata-mata menggunakan mistik untuk menakut-nakuti, tetapi menghadirkannya sebagai bagian dari pengalaman komunal: sebuah praktik yang mempertemukan tubuh, tradisi, kesenangan, kepercayaan, ruang hidup, dan relasi antarmanusia. Kerasukan tidak berhenti sebagai fenomena yang harus ditakuti, melainkan membuka kemungkinan untuk mengalami sesuatu yang berada di luar batas keseharian.",
      "Berangkat dari film tersebut, Director Talk ini mengajak kita melihat kembali hubungan antara mistik, tradisi, dan kebudayaan melalui medium sinema. Jika heritage adalah sesuatu yang terus hidup, berubah, dan dinegosiasikan oleh masyarakat, bagaimana kita memahami praktik-praktik mistik yang juga terus mengalami perubahan dan penafsiran? Apakah modernitas harus selalu berarti meninggalkan yang dianggap irasional? Dan ketika sinema mencoba melihat mistik melampaui fungsi terornya, pengalaman macam apa yang sesungguhnya sedang dibuka?",
    ],
  },
  {
    id: "heritage-talks",
    slug: "heritage-talks",
    category: "Heritage Talks",
    title: "Merawat yang Hidup",
    theme: "Heritage dalam Sudut Pandang KHFF",
    day: "Sabtu, 19 September 2026",
    date: "19 September 2026",
    time: "15.30 WIB",
    venue: "Ruang Kaca Bawah (Selatan) PDIN",
    venueDetail: "Pusat Desain Industri Nasional (PDIN), Jl. Terban, Yogyakarta",
    speaker: "Zaki Habibi",
    speakerRole: "Akademisi & Pengkaji Film KHFF",
    speakerBio:
      "Zaki Habibi adalah peneliti media dan budaya visual perkotaan, dosen Ilmu Komunikasi UII, serta penulis buku dan esai foto.",
    image: "/assets/gallery/2025/Salinan dari DAY 5  LT 5 INDO HERITAGE-16.jpg",
    badgeBg: "bg-khff-yellow text-khff-navy",
    shortDesc:
      "Membahas konsep dan kerangka kuratorial KHFF dalam memandang warisan budaya sebagai entitas hidup yang terus bergerak dan dirawat bersama.",
    notes: [
      "Warisan budaya kerap dipersepsikan sebagai artefak masa lalu yang beku, sakral, dan berjarak dari realitas keseharian. Di banyak ruang diskursus, merawat warisan budaya sering kali disempitkan sekadar menjaga fisik bangunan kuno atau mengarsipkan tradisi di balik etalase museum. Padahal, esensi terdalam dari warisan budaya berada pada denyut kehidupan masyarakatnya: bagaimana ingatan kolektif, nilai-nilai, dan identitas terus dihidupi, dipercakapkan, serta disesuaikan dengan tantangan zaman.",
      "Bagi Kotabaru Heritage Film Festival (KHFF), 'Merawat yang Hidup' adalah landasan etis sekaligus tawaran kuratorial. Heritage bukanlah monumen mati, melainkan proses yang terus bergerak dan dirawat bersama. Melalui medium sinema, festival berupaya mengaktifkan memori ruang Kotabaru dan ekosistem budaya Nusantara sebagai panggung dialog antara masa lalu, masa kini, dan masa depan yang partisipatif.",
      "Sesi Heritage Talks ini mengundang publik, peneliti, komunitas, dan pegiat seni untuk membongkar kembali makna warisan budaya dalam sudut pandang sinematik. Bagaimana festival film dapat menjadi wahana pelestarian yang kontekstual dan kritis? Apa peran komunitas dalam merawat lanskap budaya di tengah gempuran modernitas yang seragam? Ruang percakapan ini dirancang sebagai wadah bertukar gagasan untuk bersama-sama merawat dan merayakan apa yang terus hidup di sekitar kita.",
    ],
  },
  {
    id: "workshop-stop-motion",
    slug: "workshop-stop-motion",
    category: "Heritage Workshop",
    title: "Heritage Workshop: Stop Motion!",
    theme: "Stop Motion: Heritage dan Workshop Partisipatif",
    day: "Sabtu, 19 September 2026",
    date: "19 September 2026",
    time: "13.00 WIB",
    venue: "Ruang Kaca Bawah (Selatan) PDIN",
    venueDetail: "Pusat Desain Industri Nasional (PDIN), Jl. Terban, Yogyakarta",
    speaker: "Rimbun Project",
    speakerRole: "Studio Animasi & Kolektif Partisipatif",
    speakerBio:
      "Kolektif kreatif berbasis di Yogyakarta yang mendedikasikan diri pada eksplorasi animasi stop motion mandiri dan lokakarya seni gerak komunitas.",
    image: "/assets/gallery/2025/Salinan dari Workshop KHFF-10.jpg",
    badgeBg: "bg-[#23585a] text-khff-yellow border border-khff-yellow/40",
    shortDesc:
      "Ruang belajar kreatif teknik animasi gerak henti (stop motion) secara partisipatif dengan merespons narasi, arsip, dan objek warisan budaya.",
    notes: [
      "Animasi gerak henti (stop motion) memiliki daya pikat magis tersendiri: memberikan jiwa dan ilusi kehidupan pada benda-benda mati bingkai demi bingkai (frame-by-frame). Dalam konteks pelestarian budaya, pendekatan ini membuka cara tutur yang sangat segar, taktis, dan intim untuk menceritakan kembali legenda, arsip, bentuk arsitektur, hingga tradisi lokal tanpa terasa menggurui.",
      "Workshop bertajuk 'Diam-Diam Bergerak' bersama Rimbun Project dirancang sebagai laboratorium kreatif partisipatif. Peserta diajak berkenalan langsung dengan prinsip dasar animasi stop motion, perancangan papan cerita (storyboard), hingga manipulasi material fisik di sekitar kita. Di sini, warisan budaya tidak didekati secara teoritis, melainkan dialami melalui sentuhan tangan, ketelitian visual, dan eksperimen artistik yang menyenangkan.",
      "Program ini terbuka untuk pelajar, mahasiswa, penggiat komunitas, maupun pemula yang tertarik mengeksplorasi sinema gerak henti. Di akhir sesi workshop, karya-karya singkat yang dihasilkan secara kolektif akan diputar bersama sebagai bentuk perayaan atas kreativitas yang tumbuh dari pemahaman akan warisan budaya bersama.",
    ],
  },
];

export function getNonPemutaranEvent(slug: string): NonPemutaranEvent | undefined {
  return nonPemutaranEvents.find((e) => e.slug === slug || e.id === slug);
}
