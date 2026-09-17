"use client";

import { useEffect, useSyncExternalStore } from "react";
import { X, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

interface OtsAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const emptySubscribe = () => () => {};

export default function OtsAnnouncementModal({
  isOpen,
  onClose,
}: OtsAnnouncementModalProps) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto"
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
        className="bg-[#122829] border-2 border-khff-yellow/50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 max-w-xl w-full shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative animate-in zoom-in-95 duration-200 text-khff-cream max-h-[88vh] overflow-y-auto overscroll-contain my-auto"
      >
        {/* TOMBOL CLOSE 'X' DI POJOK KANAN ATAS (RESPONSIF & MUDAH DIKLIK) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-khff-yellow hover:text-khff-navy border border-white/20 text-khff-cream flex items-center justify-center transition-all cursor-pointer shadow-lg group focus:outline-none focus:ring-2 focus:ring-khff-yellow shrink-0 z-10"
          title="Tutup Pengumuman (Klik X)"
          aria-label="Tutup Pengumuman (Klik X)"
        >
          <X size={18} className="sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-200" />
        </button>

        {/* Title */}
        <h2
          id="ots-modal-title"
          className="text-lg sm:text-2xl md:text-3xl font-serif font-black text-white leading-tight mb-3 sm:mb-4 pr-10 sm:pr-12"
        >
          Pendaftaran Seluruh Slot Dibuka & Ketentuan Hari H
        </h2>

        {/* Intro */}
        <p className="text-xs sm:text-sm text-khff-cream/85 leading-relaxed mb-4 sm:mb-5">
          Selamat datang di portal registrasi resmi <strong>Kotabaru Heritage Film Festival 2026</strong>. Mohon perhatikan ketentuan tiket berikut sebelum mendaftar:
        </p>

        {/* Information Highlights */}
        <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm leading-relaxed mb-5 sm:mb-6">
          {/* Point 1: Malam ini semua slot dibuka */}
          <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-emerald-500/15 border border-emerald-500/35 flex items-start gap-2.5 sm:gap-3">
            <CheckCircle2 size={17} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-300 block font-bold mb-0.5 text-xs sm:text-sm">
                Semua Slot Program Dibuka Online Malam Ini
              </strong>
              <span className="text-khff-cream/90 text-[11px] sm:text-xs leading-relaxed">
                Seluruh 11 program festival (Kompetisi, Non-Kompetisi, dan Workshop) kini telah dibuka penuh untuk pendaftaran tiket gratis tanpa pembatasan kuota 20 slot.
              </span>
            </div>
          </div>

          {/* Point 2: Hari H Tiket OTS Only */}
          <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-amber-500/15 border border-amber-500/35 flex items-start gap-2.5 sm:gap-3">
            <AlertTriangle size={17} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 block font-bold mb-0.5 text-xs sm:text-sm">
                Pada Hari H: Tiket Tersedia On The Spot (OTS ONLY)
              </strong>
              <span className="text-khff-cream/90 text-[11px] sm:text-xs leading-relaxed">
                Saat festival memasuki Hari H pelaksanaan, pendaftaran online akan ditutup dan seluruh tiket dialihkan ke sistem <strong>On The Spot (OTS)</strong> langsung di meja registrasi venue PDIN Yogyakarta.
              </span>
            </div>
          </div>

          {/* Point 3: Prioritas Kursi First Come First Served */}
          <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5 sm:gap-3">
            <Clock size={17} className="text-khff-yellow shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold mb-0.5 text-xs sm:text-sm">
                Kapasitas Kursi: First Come, First Served
              </strong>
              <span className="text-khff-cream/80 text-[11px] sm:text-xs leading-relaxed">
                Kapasitas ruangan di PDIN memiliki batas fisik kursi. Tempat duduk diprioritaskan bagi pengunjung yang hadir lebih awal di lokasi. Pintu ruang penayangan dibuka 15 menit sebelum acara dimulai.
              </span>
            </div>
          </div>
        </div>

        {/* Footer Confirmation */}
        <div className="pt-3 sm:pt-4 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 sm:py-2.5 rounded-xl bg-khff-yellow text-khff-navy hover:bg-white font-mono font-black text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer text-center"
          >
            Saya Mengerti (X)
          </button>
        </div>
      </div>
    </div>
  );
}
