"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Script from "next/script";
import {
  X,
  AlertCircle,
  Loader2,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  User,
  Phone,
  LogOut,
  RefreshCw,
  Copy,
  Check,
  ChevronDown,
} from "lucide-react";
import {
  BookingEvent,
  BOOKING_EVENTS,
  getBookingEventById,
} from "@/data/booking-events";

interface GoogleUser {
  name: string;
  email: string;
  picture: string;
}

interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
  clientId?: string;
}

interface GoogleJwtPayload {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
}

interface GoogleIdConfiguration {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  auto_select?: boolean;
}

interface GoogleGsiButtonConfiguration {
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape?: "rectangular" | "pill" | "circle" | "square";
  logo_alignment?: "left" | "center";
  width?: number;
  locale?: string;
}

interface GoogleIdentityServices {
  accounts: {
    id: {
      initialize: (config: GoogleIdConfiguration) => void;
      renderButton: (
        parent: HTMLElement,
        options: GoogleGsiButtonConfiguration
      ) => void;
      prompt?: () => void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentityServices;
  }
}

interface SlotDetail {
  total: number;
  used: number;
  available: number;
  isFull: boolean;
  tabSheet?: string;
}

interface ProgramBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEventId?: string;
}

export default function ProgramBookingModal({
  isOpen,
  onClose,
  initialEventId,
}: ProgramBookingModalProps) {
  const [selectedEventId, setSelectedEventId] = useState<string>(
    initialEventId || BOOKING_EVENTS[0].id
  );
  const [prevInitialEventId, setPrevInitialEventId] = useState(initialEventId);
  if (initialEventId && initialEventId !== prevInitialEventId) {
    setPrevInitialEventId(initialEventId);
    setSelectedEventId(initialEventId);
  }

  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [copied, setCopied] = useState(false);

  // Slots dictionary mapped by eventId
  const [slotsData, setSlotsData] = useState<Record<string, SlotDetail>>({});
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const [loading, setLoading] = useState(false);
  const [statusState, setStatusState] = useState<{
    type: "success" | "duplicate" | "error" | "full";
    message: string;
    regCode?: string;
    event?: BookingEvent;
    name?: string;
    whatsapp?: string;
    email?: string;
  } | null>(null);

  const btnContainerRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  const scriptUrl = process.env.NEXT_PUBLIC_PROGRAM_SCRIPT_URL || "";

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Fetch slots data from Google Apps Script
  const fetchSlots = useCallback(async () => {
    try {
      if (scriptUrl) {
        const url = `${scriptUrl}${scriptUrl.includes("?") ? "&" : "?"}action=slots`;
        const res = await fetch(url, { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          if (data && data.slots) {
            const normalizedSlots: Record<string, SlotDetail> = {};
            BOOKING_EVENTS.forEach((e) => {
              const remote =
                data.slots[e.id] ||
                (e.tabSheet ? data.slots[e.tabSheet] : null);
              const maxCap = e.maxSlots || 20;
              const used = remote ? Number(remote.used) || 0 : 0;
              const available = Math.max(0, maxCap - used);
              normalizedSlots[e.id] = {
                total: maxCap,
                used: used,
                available: available,
                isFull: available <= 0,
                tabSheet: e.tabSheet,
              };
            });
            setSlotsData(normalizedSlots);
            setLastRefreshed(new Date());
            return;
          }
        }
      }
      // Fallback default 20 slots for all events
      const defaultSlots: Record<string, SlotDetail> = {};
      BOOKING_EVENTS.forEach((e) => {
        defaultSlots[e.id] = {
          total: e.maxSlots || 20,
          used: 0,
          available: e.maxSlots || 20,
          isFull: false,
          tabSheet: e.tabSheet,
        };
      });
      setSlotsData(defaultSlots);
      setLastRefreshed(new Date());
    } catch (err) {
      console.warn("Live Apps Script slots offline / default:", err);
      const defaultSlots: Record<string, SlotDetail> = {};
      BOOKING_EVENTS.forEach((e) => {
        defaultSlots[e.id] = {
          total: e.maxSlots || 20,
          used: 0,
          available: e.maxSlots || 20,
          isFull: false,
          tabSheet: e.tabSheet,
        };
      });
      setSlotsData(defaultSlots);
      setLastRefreshed(new Date());
    } finally {
      setLoadingSlots(false);
    }
  }, [scriptUrl]);

  // Polling slots every 25 seconds
  useEffect(() => {
    if (!isOpen) return;
    let isCancelled = false;
    const timer = setTimeout(() => {
      if (!isCancelled) fetchSlots();
    }, 0);
    const interval = setInterval(() => {
      if (!isCancelled) fetchSlots();
    }, 25000);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isOpen, fetchSlots]);

  // Google credential response
  const handleCredentialResponse = useCallback(
    (response: GoogleCredentialResponse) => {
      try {
        const base64Url = response.credential.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const user: GoogleJwtPayload = JSON.parse(jsonPayload);
        setGoogleUser({
          name: user.name || "",
          email: user.email || "",
          picture: user.picture || "",
        });
        setFullName(user.name || "");
        setStatusState(null);
      } catch (err) {
        console.error("Gagal membaca Google credential", err);
        setStatusState({
          type: "error",
          message: "Gagal memverifikasi akun Google. Silakan coba lagi.",
        });
      }
    },
    []
  );

  const currentEvent = getBookingEventById(selectedEventId) || BOOKING_EVENTS[0];
  const currentSlot: SlotDetail = slotsData[currentEvent.id] || {
    total: currentEvent.maxSlots || 20,
    used: 0,
    available: currentEvent.maxSlots || 20,
    isFull: false,
    tabSheet: currentEvent.tabSheet,
  };

  const handleSignOut = () => {
    setGoogleUser(null);
    setFullName("");
    setStatusState(null);
  };

  // Initialize Google GIS button (disabled if slot is full)
  const initGoogleSignIn = useCallback(() => {
    if (typeof window === "undefined" || !window.google || !clientId) return;
    if (currentSlot.isFull) return;

    try {
      if (!isInitializedRef.current) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
        });
        isInitializedRef.current = true;
      }

      const btnContainer =
        btnContainerRef.current || document.getElementById("googleProgramSignInBtn");
      if (btnContainer && !googleUser) {
        btnContainer.innerHTML = "";
        window.google.accounts.id.renderButton(btnContainer, {
          theme: "filled_blue",
          size: "large",
          shape: "pill",
          text: "continue_with",
          width: 280,
        });
      }
    } catch (e) {
      console.error("GIS render error:", e);
    }
  }, [clientId, handleCredentialResponse, googleUser, currentSlot.isFull]);

  useEffect(() => {
    if (isOpen && !currentSlot.isFull && !googleUser && typeof window !== "undefined" && window.google) {
      initGoogleSignIn();
    }
    const interval = setInterval(() => {
      if (isOpen && !currentSlot.isFull && !googleUser && typeof window !== "undefined" && window.google) {
        initGoogleSignIn();
      }
    }, 300);
    const timer = setTimeout(() => clearInterval(interval), 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [isOpen, selectedEventId, currentSlot.isFull, googleUser, initGoogleSignIn]);

  // Submit Booking
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleUser) return;

    if (currentSlot.isFull) {
      setStatusState({
        type: "full",
        message: `Mohon maaf, kuota 20 slot untuk acara '${currentEvent.title}' sudah penuh.`,
      });
      return;
    }

    if (!fullName.trim()) {
      setStatusState({
        type: "error",
        message: "Silakan masukkan nama lengkap Anda.",
      });
      return;
    }

    if (!whatsapp.trim() || whatsapp.trim().length < 9) {
      setStatusState({
        type: "error",
        message: "Silakan masukkan nomor WhatsApp aktif yang valid (minimal 9 digit).",
      });
      return;
    }

    if (!agreed) {
      setStatusState({
        type: "error",
        message: "Harap centang persetujuan kehadiran sebelum melanjutkan.",
      });
      return;
    }

    setLoading(true);
    setStatusState(null);

    const payload = {
      eventId: currentEvent.id,
      eventTitle: currentEvent.title,
      programType: currentEvent.programId,
      ticketPrefix: currentEvent.ticketPrefix,
      name: fullName.trim(),
      whatsapp: whatsapp.trim(),
      email: googleUser.email,
    };

    // Simulation mode if scriptUrl not yet filled in .env.local
    if (!scriptUrl) {
      setTimeout(() => {
        setLoading(false);
        const code = currentEvent.ticketPrefix + Math.floor(1000 + Math.random() * 9000);
        setStatusState({
          type: "success",
          message: `Pemesanan tiket berhasil disimulasikan! Hubungkan URL Google Apps Script pada NEXT_PUBLIC_PROGRAM_SCRIPT_URL untuk menyimpan data langsung ke tab '${currentEvent.tabSheet}' di Spreadsheet Anda.`,
          regCode: code,
          event: currentEvent,
          name: payload.name,
          whatsapp: payload.whatsapp,
          email: payload.email,
        });

        // Decrement local slot
        setSlotsData((prev) => {
          const old = prev[currentEvent.id] || {
            total: currentEvent.maxSlots || 20,
            used: 0,
            available: currentEvent.maxSlots || 20,
            isFull: false,
          };
          const newUsed = old.used + 1;
          const maxCap = currentEvent.maxSlots || 20;
          const newAvail = Math.max(0, maxCap - newUsed);
          return {
            ...prev,
            [currentEvent.id]: {
              ...old,
              used: newUsed,
              available: newAvail,
              isFull: newAvail <= 0,
            },
          };
        });
      }, 1000);
      return;
    }

    try {
      const res = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      setLoading(false);

      if (result.status === "success") {
        setStatusState({
          type: "success",
          message: result.message || "Pemesanan tiket Anda berhasil terkonfirmasi!",
          regCode: result.data?.registrationCode,
          event: currentEvent,
          name: payload.name,
          whatsapp: payload.whatsapp,
          email: payload.email,
        });
        fetchSlots();
      } else if (result.status === "duplicate") {
        setStatusState({
          type: "duplicate",
          message:
            result.message ||
            "Akun Google Anda sudah terdaftar pada sesi acara ini (1 akun = 1 tiket).",
        });
      } else if (result.status === "full") {
        setStatusState({
          type: "full",
          message: result.message || "Mohon maaf, kuota tiket untuk acara ini sudah penuh.",
        });
      } else {
        setStatusState({
          type: "error",
          message: result.message || "Terjadi kendala saat memproses pendaftaran.",
        });
      }
    } catch (err) {
      setLoading(false);
      console.error("Booking error:", err);
      setStatusState({
        type: "error",
        message: "Gagal terhubung ke server pendaftaran. Silakan periksa koneksi internet Anda.",
      });
    }
  };

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          if (isOpen && !currentSlot.isFull) initGoogleSignIn();
        }}
      />

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      >
        <div
          className="bg-khff-navy border-2 border-khff-yellow/40 rounded-3xl p-5 sm:p-8 md:p-10 max-w-2xl w-full my-auto shadow-2xl relative text-khff-cream overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-khff-pink hover:text-white flex items-center justify-center text-white/80 transition-all z-20 cursor-pointer"
            aria-label="Tutup Pemesanan Tiket"
          >
            <X size={18} />
          </button>

          {/* Modal Header */}
          <div className="pr-10 mb-6">
            <span className="text-xs font-mono text-khff-yellow font-bold uppercase tracking-wider block mb-1">
              Reservasi Tiket Program KHFF 2026
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-white leading-snug">
              Pemesanan Tiket Acara
            </h2>
            {statusState?.type !== "success" && (
              <p className="text-khff-cream/75 text-xs sm:text-sm mt-1">
                Setiap sesi memiliki kuota terbatas <strong className="text-khff-yellow">20 Slot</strong>. Silakan masuk dengan akun Google untuk konfirmasi instan.
              </p>
            )}
          </div>

          {/* SUCCESS VIEW: DIGITAL TICKET PASS */}
          {statusState?.type === "success" ? (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[#163839] border-2 border-khff-yellow shadow-2xl text-khff-cream relative overflow-hidden">

                <div className="flex items-center justify-between pb-4 border-b border-white/15 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400 shrink-0" />
                    <span className="font-mono text-xs font-black uppercase tracking-wider text-khff-yellow">
                      Tiket Terkonfirmasi
                    </span>
                  </div>
                </div>

                <div className="mb-5">
                  <span className="text-[11px] font-mono text-khff-yellow uppercase tracking-widest block mb-1">
                    {statusState.event?.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-black text-white leading-tight mb-1">
                    {statusState.event?.title}
                  </h3>
                  {statusState.event?.subtitle && (
                    <p className="text-khff-cream/80 text-xs sm:text-sm italic">
                      {statusState.event?.subtitle}
                    </p>
                  )}
                </div>

                {/* Event Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-black/40 border border-white/10 mb-5 text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-khff-yellow shrink-0" />
                    <span>{statusState.event?.scheduleDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-khff-yellow shrink-0" />
                    <span className="font-bold text-khff-yellow">{statusState.event?.scheduleTime}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <MapPin size={14} className="text-khff-yellow shrink-0" />
                    <span className="truncate">{statusState.event?.venue}</span>
                  </div>
                </div>

                {/* Registration Code Ticket Box */}
                <div className="p-4 rounded-2xl bg-black/60 border-2 border-dashed border-khff-yellow/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-khff-cream/60 block">
                      Kode Tiket Registrasi
                    </span>
                    <span className="text-2xl sm:text-3xl font-mono font-black text-khff-yellow tracking-wider">
                      {statusState.regCode}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(statusState.regCode || "")}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-all cursor-pointer"
                  >
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    <span>{copied ? "Tersalin!" : "Salin Kode"}</span>
                  </button>
                </div>

                {/* Participant Info */}
                <div className="text-xs text-khff-cream/80 space-y-1 border-t border-white/10 pt-3">
                  <p>
                    <strong className="text-white">Peserta:</strong> {statusState.name}
                  </p>
                  <p>
                    <strong className="text-white">WhatsApp:</strong> {statusState.whatsapp}
                  </p>
                  <p>
                    <strong className="text-white">Email Google:</strong> {statusState.email}
                  </p>
                </div>
              </div>

              {/* Info Note */}
              <p className="text-xs text-khff-cream/70 text-center">
                💡 Harap simpan atau tangkap layar (*screenshot*) kartu tiket ini dan tunjukkan kepada panitia di meja registrasi lokasi saat hadir.
              </p>

              <div className="flex flex-wrap gap-3 justify-end pt-2">
                <button
                  onClick={() => {
                    setStatusState(null);
                  }}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  Registrasi Sesi Lain
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-khff-yellow text-khff-navy font-mono font-black text-xs uppercase tracking-wider hover:bg-white transition-all cursor-pointer shadow-lg"
                >
                  Selesai
                </button>
              </div>
            </div>
          ) : (
            /* BOOKING FORM */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Picker Dropdown */}
              <div>
                <label className="block font-mono text-xs font-black uppercase tracking-wider text-khff-yellow mb-2">
                  1. Pilih Acara / Sesi (Kapasitas 20 Slot)
                </label>
                <div className="relative">
                  <select
                    value={selectedEventId}
                    onChange={(e) => {
                      setSelectedEventId(e.target.value);
                      setStatusState(null);
                    }}
                    className="w-full bg-black/40 border border-white/20 rounded-2xl px-4 py-3.5 text-sm sm:text-base text-white focus:outline-none focus:border-khff-yellow font-sans appearance-none cursor-pointer pr-10"
                  >
                    <optgroup label="--- Program Kompetisi ---">
                      {BOOKING_EVENTS.filter((e) => e.programId === "kompetisi").map((e) => (
                        <option key={e.id} value={e.id} className="bg-khff-navy text-white">
                          {e.title}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="--- Program Non-Kompetisi ---">
                      {BOOKING_EVENTS.filter((e) => e.programId === "non-kompetisi").map((e) => (
                        <option key={e.id} value={e.id} className="bg-khff-navy text-white">
                          {e.title}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="--- Program Non-Pemutaran ---">
                      {BOOKING_EVENTS.filter((e) => e.programId === "non-pemutaran").map((e) => (
                        <option key={e.id} value={e.id} className="bg-khff-navy text-white">
                          {e.title}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-khff-cream/60 pointer-events-none"
                  />
                </div>
              </div>

              {/* Event Details Card & Slot Indicator */}
              <div className="bg-black/30 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-khff-yellow font-bold">
                      {currentEvent.category} • {currentEvent.programLabel}
                    </span>
                    <h4 className="text-lg font-serif font-black text-white">
                      {currentEvent.title}
                    </h4>
                  </div>

                  {/* Slot Indicator Badge */}
                  <div className="shrink-0 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs font-black uppercase tracking-wider ${
                        currentSlot.isFull
                          ? "bg-red-600 text-white"
                          : currentSlot.available <= 5
                          ? "bg-amber-500 text-khff-navy font-bold"
                          : "bg-emerald-600 text-white"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          currentSlot.isFull
                            ? "bg-white"
                            : currentSlot.available <= 5
                            ? "bg-khff-navy"
                            : "bg-white"
                        }`}
                      />
                      <span>
                        {currentSlot.isFull
                          ? `Slot Penuh (0/${currentSlot.total || 20})`
                          : `Sisa ${Math.min(currentSlot.available, currentSlot.total || 20)} / ${currentSlot.total || 20} Slot`}
                      </span>
                    </span>

                    <button
                      type="button"
                      onClick={() => fetchSlots()}
                      disabled={loadingSlots}
                      title="Segarkan info slot terkini"
                      className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-khff-cream/70 hover:text-khff-yellow transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <RefreshCw size={13} className={loadingSlots ? "animate-spin text-khff-yellow" : ""} />
                    </button>
                  </div>
                </div>

                {/* Progress Bar of Slots */}
                <div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        currentSlot.isFull
                          ? "bg-red-500"
                          : currentSlot.available <= 5
                          ? "bg-amber-500"
                          : "bg-green-400"
                      }`}
                      style={{
                        width: `${Math.min(100, (currentSlot.used / currentSlot.total) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-mono text-khff-cream/60 mt-1">
                    <span>{currentSlot.used} Terisi</span>
                    {lastRefreshed && (
                      <span className="hidden sm:inline text-[10px] text-khff-cream/40">
                        Update {lastRefreshed.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                    <span>Kapasitas: {currentSlot.total} Kursi</span>
                  </div>
                </div>

                {/* Schedule & Venue pills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-khff-cream/80 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-khff-yellow shrink-0" />
                    <span>{currentEvent.scheduleDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-khff-yellow shrink-0" />
                    <span className="font-semibold text-khff-yellow">{currentEvent.scheduleTime}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <MapPin size={13} className="text-khff-yellow shrink-0" />
                    <span className="truncate">{currentEvent.venue}</span>
                  </div>
                </div>
              </div>

              {/* STEP 2: GOOGLE AUTH */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-mono text-xs font-black uppercase tracking-wider text-khff-yellow">
                    2. Verifikasi Akun Google
                  </label>
                  {currentSlot.isFull && (
                    <span className="text-[11px] text-red-400 font-mono font-bold">
                      Slot Penuh
                    </span>
                  )}
                </div>

                {currentSlot.isFull ? (
                  <div className="p-4 sm:p-5 rounded-2xl bg-red-500/10 border-2 border-red-500/30 text-center space-y-2">
                    <div className="inline-flex items-center gap-1.5 text-red-300 font-mono text-xs font-bold uppercase tracking-wider">
                      <AlertCircle size={15} /> Kuota 20 Slot Penuh
                    </div>
                    <p className="text-xs text-red-200 leading-relaxed max-w-md mx-auto">
                      Seluruh 20 kursi untuk sesi acara ini telah terisi penuh (Sold Out). Silakan pilih sesi acara lain pada pilihan di atas yang masih tersedia.
                    </p>
                  </div>
                ) : googleUser ? (
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/10 border border-green-400/40">
                    <div className="flex items-center gap-3">
                      {googleUser.picture ? (
                        <img
                          src={googleUser.picture}
                          alt={googleUser.name}
                          className="w-10 h-10 rounded-full border border-white/20 object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-khff-yellow text-khff-navy flex items-center justify-center font-bold">
                          {googleUser.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-sm text-white block">
                          {googleUser.name}
                        </span>
                        <span className="text-xs font-mono text-green-300">
                          {googleUser.email} (Terverifikasi)
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="inline-flex items-center gap-1.5 text-xs text-khff-cream/60 hover:text-khff-pink transition-colors px-2.5 py-1.5 rounded-lg bg-black/20 cursor-pointer"
                    >
                      <LogOut size={13} /> Ganti
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center space-y-3">
                    <p className="text-xs text-khff-cream/80">
                      Login dengan Google untuk memastikan reservasi valid dan mencegah duplikasi tiket.
                    </p>
                    <div className="flex justify-center min-h-[44px]">
                      <div ref={btnContainerRef} id="googleProgramSignInBtn" />
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 3: FORM INPUT (Hanya Nama Lengkap & Nomor WA) */}
              <div className={`space-y-4 transition-all duration-300 ${currentSlot.isFull || !googleUser ? "opacity-35 pointer-events-none" : "opacity-100"}`}>
                <label className="block font-mono text-xs font-black uppercase tracking-wider text-khff-yellow">
                  3. Data Pemesan Tiket
                </label>

                <div>
                  <label className="block text-xs font-medium text-khff-cream/80 mb-1">
                    Nama Lengkap *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama lengkap Anda"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2.5 pl-10 text-sm text-white focus:outline-none focus:border-khff-yellow"
                    />
                    <User
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-khff-cream/50 pointer-events-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-khff-cream/80 mb-1">
                    Nomor WhatsApp Aktif *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 081234567890"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2.5 pl-10 text-sm text-white focus:outline-none focus:border-khff-yellow"
                    />
                    <Phone
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-khff-cream/50 pointer-events-none"
                    />
                  </div>
                  <span className="text-[11px] text-khff-cream/50 font-mono mt-1 block">
                    Panitia akan mengirimkan pengingat lokasi dan jadwal melalui WhatsApp.
                  </span>
                </div>

                {/* Agreement Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 text-xs text-khff-cream/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 rounded border-white/30 text-khff-yellow focus:ring-khff-yellow cursor-pointer"
                    />
                    <span>
                      Saya menyatakan data di atas sudah benar dan bersedia hadir tepat waktu di lokasi acara.
                    </span>
                  </label>
                </div>
              </div>

              {/* Status Alert Banner */}
              {statusState && (
                <div
                  className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                    statusState.type === "duplicate"
                      ? "bg-amber-500/20 border-amber-500/40 text-amber-200"
                      : statusState.type === "full"
                      ? "bg-red-500/20 border-red-500/40 text-red-200"
                      : "bg-red-500/20 border-red-500/40 text-red-200"
                  }`}
                >
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{statusState.message}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-all cursor-pointer text-center"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={loading || currentSlot.isFull || !googleUser}
                  className={`w-full sm:w-auto px-7 py-3 rounded-full font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                    loading || currentSlot.isFull || !googleUser
                      ? "bg-white/20 text-white/50 cursor-not-allowed"
                      : "bg-khff-yellow text-khff-navy hover:bg-white hover:scale-105"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Memproses Tiket...</span>
                    </>
                  ) : currentSlot.isFull ? (
                    <span>Kuota Sesi Ini Penuh</span>
                  ) : !googleUser ? (
                    <span>Login Google Dahulu</span>
                  ) : (
                    <>
                      <Ticket size={16} />
                      <span>Registrasi di Sini</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
