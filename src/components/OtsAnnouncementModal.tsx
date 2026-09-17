"use client";

import { useEffect, useState } from "react";
import { X, Sparkles, CheckCircle2, AlertTriangle, Clock, MapPin } from "lucide-react";

interface OtsAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OtsAnnouncementModal({
  isOpen,
  onClose,
}: OtsAnnouncementModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ots-modal-title"
    >
      {/* 
        PENTING: Klik backdrop di luar modal sengaja TIDAK menutup modal.
        User WAJIB membaca dan klik tanda 'X' di pojok kanan atas untuk menutupnya.
      */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#122829] border-2 border-khff-yellow/50 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative animate-in zoom-in-95 duration-200 text-khff-cream max-h-[90vh] overflow-y-auto"
      >
        {/* TOMBOL CLOSE 'X' DI POJOK KANAN ATAS */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-khff-yellow hover:text-khff-navy border border-white/20 text-khff-cream flex items-center justify-center transition-all cursor-pointer shadow-lg group focus:outline-none focus:ring-2 focus:ring-khff-yellow"
          title="Tutup Pengumuman (Klik X)"
          aria-label="Tutup Pengumuman (Klik X)"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-200" />
        </button>

        {/* Modal Badge */}
        <div className="inline-flex items-center gap-2 bg-khff-yellow/20 border border-khff-yellow/40 px-3.5 py-1.5 rounded-full text-khff-yellow font-mono text-xs font-bold uppercase tracking-wider mb-4 pr-12">
          <Sparkles size={14} className="shrink-0" />
          <span>Pengumuman Tiket & Ketentuan OTS</span>
        </div>

        {/* Title */}
        <h2
          id="ots-modal-title"
          className="text-2xl sm:text-3xl font-serif font-black text-white leading-tight mb-4 pr-6"
        >
          Pendaftaran Seluruh Slot Dibuka & Ketentuan Hari H
        </h2>

        {/* Intro */}
        <p className="text-xs sm:text-sm text-khff-cream/85 leading-relaxed mb-5">
          Selamat datang di portal registrasi resmi <strong>Kotabaru Heritage Film Festival 2026</strong>. Mohon perhatikan ketentuan tiket berikut sebelum mendaftar:
        </p>

        {/* Information Highlights */}
        <div className="space-y-3 text-xs sm:text-sm leading-relaxed mb-6">
          {/* Point 1: Malam ini semua slot dibuka */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/35 flex items-start gap-3">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-300 block font-bold mb-0.5">
                Semua Slot Program Dibuka Online Malam Ini
              </strong>
              <span className="text-khff-cream/90">
                Seluruh 11 program festival (Kompetisi, Non-Kompetisi, dan Workshop) kini telah dibuka penuh untuk pendaftaran tiket gratis tanpa pembatasan kuota 20 slot.
              </span>
            </div>
          </div>

          {/* Point 2: Hari H Tiket OTS Only */}
          <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/35 flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 block font-bold mb-0.5">
                Pada Hari H: Tiket Tersedia On The Spot (OTS ONLY)
              </strong>
              <span className="text-khff-cream/90">
                Saat festival memasuki Hari H pelaksanaan, pendaftaran online akan ditutup dan seluruh tiket dialihkan ke sistem <strong>On The Spot (OTS)</strong> langsung di meja registrasi venue PDIN Yogyakarta.
              </span>
            </div>
          </div>

          {/* Point 3: Prioritas Kursi First Come First Served */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
            <Clock size={18} className="text-khff-yellow shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold mb-0.5">
                Kapasitas Kursi: First Come, First Served
              </strong>
              <span className="text-khff-cream/80">
                Kapasitas ruangan di PDIN memiliki batas fisik kursi. Tempat duduk diprioritaskan bagi pengunjung yang hadir lebih awal di lokasi. Pintu ruang penayangan dibuka 15 menit sebelum acara dimulai.
              </span>
            </div>
          </div>

          {/* Point 4: Lokasi Venue */}
          <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3 text-xs font-mono text-khff-cream/80">
            <MapPin size={16} className="text-khff-yellow shrink-0" />
            <span>Pusat Desain Industri Nasional (PDIN), Jl. Terban No. 35, Yogyakarta</span>
          </div>
        </div>

        {/* Footer info & Confirmation */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] font-mono text-khff-cream/60 text-center sm:text-left">
            Klik tanda silang <strong>[X]</strong> di pojok kanan atas untuk menutup pengumuman ini.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-khff-yellow text-khff-navy hover:bg-white font-mono font-black text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer text-center"
          >
            Saya Mengerti (X)
          </button>
        </div>
      </div>
    </div>
  );
}
