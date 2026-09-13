import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  ChevronRight,
  Info,
} from "lucide-react";
import { nonPemutaranEvents, getNonPemutaranEvent } from "@/data/non-pemutaran";
import ProgramTicketButton from "@/components/ProgramTicketButton";

export async function generateStaticParams() {
  return nonPemutaranEvents.map((event) => ({
    slug: event.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getNonPemutaranEvent(slug);

  if (!event) {
    return {
      title: "Program Tidak Ditemukan - KHFF 2026",
    };
  }

  return {
    title: `${event.category}: ${event.title} - KHFF 2026`,
    description: event.shortDesc,
    openGraph: {
      title: `${event.category}: ${event.title} | Kotabaru Heritage Film Festival 2026`,
      description: event.shortDesc,
      images: [
        {
          url: event.image,
          width: 1200,
          height: 800,
          alt: event.title,
        },
      ],
    },
  };
}

export default async function NonPemutaranDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getNonPemutaranEvent(slug);

  if (!event) {
    notFound();
  }

  const otherEvents = nonPemutaranEvents.filter((e) => e.slug !== event.slug);

  return (
    <main className="min-h-screen bg-khff-navy text-khff-cream font-sans relative overflow-hidden">
      {/* CINEMATIC HERO SECTION */}
      <section className="pt-32 sm:pt-36 pb-20 sm:pb-24 px-5 sm:px-8 md:px-12 bg-gradient-to-b from-khff-navy via-[#23585a] to-khff-yellow text-khff-cream relative z-10 w-full overflow-hidden">
        {/* Background Subtle Watermark */}
        <div className="absolute top-10 right-0 w-80 md:w-[32rem] opacity-10 pointer-events-none -scale-x-100">
          <img
            src="/assets/illustrations/gong.png"
            alt=""
            className="w-full h-auto"
          />
        </div>

        <div className="container mx-auto max-w-5xl relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Link
              href="/program/non-pemutaran"
              className="inline-flex items-center gap-2 bg-khff-navy/80 hover:bg-khff-yellow hover:text-khff-navy border border-khff-cream/25 px-4 sm:px-5 py-2 rounded-full text-khff-cream font-mono transition-all text-xs sm:text-sm font-black shadow-lg backdrop-blur-xs"
            >
              <ArrowLeft size={16} /> KEMBALI KE PROGRAM NON-PEMUTARAN
            </Link>

            <span className="hidden sm:inline-block text-xs font-mono text-khff-cream/50">
              /
            </span>
            <span className="hidden sm:inline-block text-xs font-mono uppercase tracking-widest text-khff-cream/80">
              {event.category}
            </span>
          </div>

          {/* Event Category & Theme */}
          <div className="flex flex-wrap items-center gap-3 mb-5 font-mono text-xs sm:text-sm">
            <span className="font-bold text-khff-yellow uppercase tracking-widest">
              {event.category}
            </span>
            <span className="text-white/40">•</span>
            <span className="text-khff-cream/80 italic font-serif text-sm sm:text-base">
              &ldquo;{event.theme}&rdquo;
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black text-white mb-6 tracking-tight leading-[1.1] drop-shadow-xl">
            {event.title}
          </h1>

          {/* Short Description Lead */}
          <p className="text-lg sm:text-xl md:text-2xl text-khff-cream/95 font-medium max-w-3xl leading-relaxed drop-shadow mb-8">
            {event.shortDesc}
          </p>

          {/* Quick Schedule Strip */}
          <div className="inline-grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 bg-black/60 backdrop-blur-md border border-white/15 p-4 sm:p-5 rounded-3xl shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-khff-yellow/20 flex items-center justify-center text-khff-yellow shrink-0">
                <Calendar size={18} />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase text-khff-cream/60 block">
                  Hari & Tanggal
                </span>
                <span className="font-bold text-sm sm:text-base text-white">
                  {event.day}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:border-l sm:border-white/15 sm:pl-4">
              <div className="w-10 h-10 rounded-2xl bg-khff-yellow/20 flex items-center justify-center text-khff-yellow shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase text-khff-cream/60 block">
                  Waktu Acara
                </span>
                <span className="font-bold text-sm sm:text-base text-khff-yellow font-mono">
                  {event.time}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:border-l sm:border-white/15 sm:pl-4">
              <div className="w-10 h-10 rounded-2xl bg-khff-yellow/20 flex items-center justify-center text-khff-yellow shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase text-khff-cream/60 block">
                  Tempat
                </span>
                <span className="font-bold text-sm sm:text-base text-white truncate max-w-[200px] block">
                  {event.venue}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILED CONTENT SECTION */}
      <section className="bg-khff-navy text-khff-cream py-16 sm:py-20 px-5 sm:px-8 md:px-12 relative z-20 border-t-8 border-khff-pink shadow-2xl -mt-8">
        <div className="container mx-auto max-w-5xl">
          {/* Main Visual Banner */}
          <div className="relative w-full h-72 sm:h-96 md:h-[480px] rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl mb-12 sm:mb-16">
            <Image
              src={event.image}
              alt={event.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-khff-yellow font-mono text-xs font-black uppercase tracking-widest block mb-1">
                  KOTABARU HERITAGE FILM FESTIVAL 2026
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-white drop-shadow-md">
                  {event.title}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-xs font-mono text-white/90 shrink-0">
                  Terbuka untuk Umum
                </div>
                <ProgramTicketButton
                  eventId={`nonpemutaran-${event.id}`}
                  label="Registrasi di Sini"
                  size="md"
                  variant="primary"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Sidebar: Speaker & Info Box (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Ticket Reservation Card */}
              <div className="bg-[#163839] border-2 border-khff-yellow/40 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-khff-yellow uppercase tracking-wider font-black">
                    Reservasi Kursi
                  </span>
                  <span className="bg-emerald-600 text-white text-xs font-mono px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" /> Kuota 20 Slot
                  </span>
                </div>
                <p className="text-xs text-khff-cream/85 leading-relaxed">
                  Amankan tempat duduk Anda untuk sesi ini. Registrasi instan via akun Google.
                </p>
                <ProgramTicketButton
                  eventId={`nonpemutaran-${event.id}`}
                  label="Registrasi di Sini"
                  className="w-full"
                  size="lg"
                  variant="primary"
                />
              </div>

              {/* Speaker Card */}
              <div className="bg-white/5 border border-white/15 rounded-3xl p-6 sm:p-7 shadow-xl backdrop-blur-xs">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                  <div className="w-12 h-12 rounded-2xl bg-khff-yellow flex items-center justify-center text-khff-navy shrink-0 shadow-md">
                    <User size={24} />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase text-khff-cream/60 block">
                      Narasumber / Pengisi
                    </span>
                    <h3 className="text-xl font-serif font-black text-white">
                      {event.speaker}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-xs font-mono text-khff-yellow font-bold uppercase block mb-1">
                      Peran
                    </span>
                    <p className="text-khff-cream/90 font-medium">
                      {event.speakerRole}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <span className="text-xs font-mono text-khff-cream/50 uppercase block mb-1">
                      Tentang Pengisi
                    </span>
                    <p className="text-khff-cream/75 text-xs leading-relaxed">
                      {event.speakerBio}
                    </p>
                  </div>
                </div>
              </div>

              {/* Event Location & Access Info Card */}
              <div className="bg-white/5 border border-white/15 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-khff-yellow font-mono text-xs font-black uppercase tracking-wider">
                  <Info size={16} /> Informasi Tempat & Fasilitas
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-khff-cream/80 leading-relaxed">
                  <p>
                    <strong className="text-white block">Venue:</strong>
                    {event.venueDetail}
                  </p>
                  <p className="pt-2 border-t border-white/10">
                    <strong className="text-white block">Ruang:</strong>
                    {event.venue}
                  </p>
                  <p className="pt-2 border-t border-white/10 text-khff-yellow/90">
                    💡 Disarankan hadir 15 menit sebelum sesi dimulai untuk registrasi kehadiran di lokasi.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Complete Curatorial Program Notes (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              <div className="border-b border-white/15 pb-6">
                <span className="inline-block px-3.5 py-1 rounded-full bg-khff-yellow text-khff-navy font-mono text-xs font-black uppercase tracking-widest mb-3">
                  Catatan Program
                </span>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-white leading-tight">
                  {event.title}
                </h3>
                <p className="text-khff-yellow/90 font-serif italic text-base sm:text-lg mt-2">
                  Tema: &ldquo;{event.theme}&rdquo;
                </p>
              </div>

              {/* Program Notes Paragraphs */}
              <div className="space-y-6 text-khff-cream/90 text-base sm:text-lg md:text-xl leading-relaxed font-sans">
                {event.notes.map((paragraph, idx) => (
                  <div
                    key={idx}
                    className={
                      idx === 0
                        ? "p-6 sm:p-8 rounded-3xl bg-white/5 border-l-4 border-khff-yellow shadow-inner text-white font-medium leading-relaxed"
                        : "leading-relaxed"
                    }
                  >
                    <p>{paragraph}</p>
                  </div>
                ))}
              </div>

              {/* Call-to-action / Quick Navigation */}
              <div className="pt-8 border-t border-white/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Link
                  href="/jadwal"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-khff-yellow text-khff-navy font-mono font-black text-xs sm:text-sm uppercase tracking-wider hover:bg-white hover:scale-105 transition-all shadow-xl"
                >
                  <Calendar size={16} />
                  <span>Lihat Jadwal Lengkap Festival</span>
                </Link>

                <Link
                  href="/program/non-pemutaran"
                  className="inline-flex items-center gap-2 text-khff-cream/80 hover:text-khff-yellow font-mono text-xs sm:text-sm font-bold transition-colors"
                >
                  <span>Daftar Program Non-Pemutaran</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* EXPLORE OTHER NON-PEMUTARAN PROGRAMS */}
          <div className="mt-20 sm:mt-24 pt-16 border-t-2 border-white/15">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
              <div>
                <span className="text-khff-yellow font-mono text-xs font-black tracking-widest uppercase block mb-1">
                  AGENDA LAINNYA
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-black text-white">
                  Program Non-Pemutaran Lainnya
                </h3>
              </div>
              <Link
                href="/program/non-pemutaran"
                className="text-khff-cream/70 hover:text-khff-yellow font-mono text-xs font-black uppercase tracking-wider transition-colors"
              >
                Lihat Semua Program →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherEvents.map((other) => (
                <Link
                  key={other.slug}
                  href={`/program/non-pemutaran/${other.slug}`}
                  className="group block rounded-3xl overflow-hidden bg-white/5 border border-white/15 hover:border-khff-yellow p-6 sm:p-8 transition-all hover:-translate-y-1 shadow-xl"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className={`px-3 py-1 rounded-full font-mono text-[11px] font-black uppercase tracking-wider ${other.badgeBg}`}
                    >
                      {other.category}
                    </span>
                    <span className="text-xs font-mono text-khff-cream/60">
                      {other.day}
                    </span>
                  </div>

                  <h4 className="text-xl sm:text-2xl font-serif font-black text-white group-hover:text-khff-yellow transition-colors mb-2">
                    {other.title}
                  </h4>
                  <p className="text-khff-cream/75 text-sm line-clamp-2 mb-4">
                    {other.shortDesc}
                  </p>

                  <div className="flex items-center justify-between text-xs font-mono text-khff-yellow font-black pt-3 border-t border-white/10">
                    <span>Baca Selengkapnya</span>
                    <ChevronRight
                      size={15}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
