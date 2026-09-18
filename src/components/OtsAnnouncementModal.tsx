"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { X, AlertTriangle, Clock } from "lucide-react";

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

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [countdown, setCountdown] = useState(3);
  const modalCardRef = useRef<HTMLDivElement>(null);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setCountdown(3);
    }
  }

  // 3-second countdown timer when modal opens (precise sub-second timer)
  useEffect(() => {
    if (!isOpen) return;

    const endTime = Date.now() + 3000;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Lock background scroll completely to popup (Desktop & iOS/Mobile)
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;
    const originalTouchAction = document.body.style.touchAction;
    const scrollY = window.scrollY;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.touchAction = "none";

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      document.body.style.touchAction = originalTouchAction;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  // Block wheel scrolling on background/backdrop
  useEffect(() => {
    if (!isOpen) return;

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && !modalCardRef.current?.contains(target)) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isOpen]);

  // Close on Escape key only after countdown finishes
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && countdown === 0) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, countdown, onClose]);

  if (!mounted || !isOpen) return null;

  const canClose = countdown === 0;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 overscroll-contain select-none touch-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ots-modal-title"
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
        }
      }}
    >
      <div
        ref={modalCardRef}
        onClick={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        style={{ touchAction: "pan-y" }}
        className="bg-[#122829] border-2 border-khff-yellow/50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 max-w-xl w-full shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative animate-in zoom-in-95 duration-200 text-khff-cream max-h-[88vh] overflow-y-auto overscroll-contain my-auto select-text"
      >
        {/* TOMBOL CLOSE 'X' DI POJOK KANAN ATAS (COUNTDOWN 3 DETIK) */}
        <button
          type="button"
          onClick={canClose ? onClose : undefined}
          disabled={!canClose}
          className={`absolute top-3.5 right-3.5 sm:top-5 sm:right-5 w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all shrink-0 z-10 ${
            canClose
              ? "bg-white/10 hover:bg-khff-yellow hover:text-khff-navy border-white/20 text-khff-cream cursor-pointer shadow-lg group focus:outline-none focus:ring-2 focus:ring-khff-yellow"
              : "bg-white/5 border-white/10 text-khff-cream/40 cursor-not-allowed"
          }`}
          title={canClose ? "Tutup Pengumuman (Klik X)" : `Tunggu ${countdown} detik untuk menutup`}
          aria-label={canClose ? "Tutup Pengumuman (Klik X)" : `Tunggu ${countdown} detik untuk menutup`}
        >
          {canClose ? (
            <X size={18} className="sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-200" />
          ) : (
            <span className="font-mono text-xs sm:text-sm font-bold text-khff-yellow animate-pulse">
              {countdown}
            </span>
          )}
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
          {/* Point 1: Hari H Tiket OTS Only */}
          <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-amber-500/15 border border-amber-500/35 flex items-start gap-2.5 sm:gap-3">
            <AlertTriangle size={17} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 block font-bold mb-0.5 text-xs sm:text-sm">
                Pada Hari H: Tiket Dialihkan ke On The Spot (OTS ONLY) Pukul 07.00 WIB
              </strong>
              <span className="text-khff-cream/90 text-[11px] sm:text-xs leading-relaxed">
                Pendaftaran online untuk acara di tiap tanggal pelaksanaan akan ditutup pada pukul <strong>07.00 WIB</strong> di Hari H dan seluruh tiket dialihkan ke sistem <strong>On The Spot (OTS)</strong> langsung di meja registrasi venue PDIN Yogyakarta.
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
        <div className="pt-3 sm:pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {!canClose ? (
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono text-khff-cream/70 justify-center sm:justify-start">
              <Clock size={14} className="text-khff-yellow shrink-0 animate-spin" style={{ animationDuration: "3s" }} />
              <span>
                Dapat ditutup dalam <strong className="text-khff-yellow font-bold">{countdown} detik</strong>
              </span>
            </div>
          ) : (
            <div className="hidden sm:block" />
          )}
          <button
            type="button"
            onClick={canClose ? onClose : undefined}
            disabled={!canClose}
            className={`w-full sm:w-auto px-5 py-2.5 sm:py-2.5 rounded-xl font-mono font-black text-xs uppercase tracking-wider transition-all shadow-lg text-center ${
              canClose
                ? "bg-khff-yellow text-khff-navy hover:bg-white cursor-pointer"
                : "bg-white/10 text-khff-cream/40 border border-white/10 cursor-not-allowed"
            }`}
          >
            {canClose ? "Saya Mengerti (X)" : `Tunggu (${countdown}s)`}
          </button>
        </div>
      </div>
    </div>
  );
}
