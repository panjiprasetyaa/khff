"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Script from "next/script";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
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
  AlertCircle,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Share2,
  Printer,
  Sparkles,
} from "lucide-react";
import {
  BookingEvent,
  BOOKING_EVENTS,
  getBookingEventById,
  checkScheduleConflict,
  findConflictingRegisteredEvent,
  getConflictingEventIds,
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

export default function RegistrasiClientPage() {
  const searchParams = useSearchParams();
  const sessionParam = searchParams.get("session") || searchParams.get("sesi");

  // Determine initial selected event
  const initialEvent = sessionParam
    ? getBookingEventById(sessionParam) || BOOKING_EVENTS[0]
    : BOOKING_EVENTS[0];

  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "kompetisi" | "non-kompetisi" | "non-pemutaran"
  >(initialEvent.programId);
  const [selectedEventId, setSelectedEventId] = useState<string>(initialEvent.id);

  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [copied, setCopied] = useState(false);

  // Slots dictionary mapped by eventId
  const [slotsData, setSlotsData] = useState<Record<string, SlotDetail>>({});
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  // User registered event IDs for conflict detection
  const [userRegisteredEventIds, setUserRegisteredEventIds] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [statusState, setStatusState] = useState<{
    type: "success" | "duplicate" | "error" | "full" | "conflict";
    message: string;
    regCode?: string;
    event?: BookingEvent;
    conflictingEvent?: BookingEvent;
    name?: string;
    whatsapp?: string;
    email?: string;
  } | null>(null);

  const btnContainerRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);
  const googleRenderedRef = useRef(false);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  const scriptUrl = process.env.NEXT_PUBLIC_PROGRAM_SCRIPT_URL || "";

  // Sync with searchParams if it changes
  useEffect(() => {
    if (sessionParam) {
      const ev = getBookingEventById(sessionParam);
      if (ev) {
        setSelectedEventId(ev.id);
        setSelectedCategory(ev.programId);
      }
    }
  }, [sessionParam]);

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
  }, [fetchSlots]);

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

  // Load registered events for the active Google user from local storage & remote script
  useEffect(() => {
    if (!googleUser) {
      setUserRegisteredEventIds([]);
      return;
    }

    const storageKey = `khff_registered_events_${googleUser.email.toLowerCase()}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setUserRegisteredEventIds(parsed);
        }
      }
    } catch (e) {
      console.warn("Gagal membaca riwayat pendaftaran lokal:", e);
    }

    // Sync with remote Apps Script if scriptUrl configured
    if (scriptUrl) {
      const checkUrl = `${scriptUrl}${scriptUrl.includes("?") ? "&" : "?"}action=userRegistrations&email=${encodeURIComponent(googleUser.email)}`;
      fetch(checkUrl)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.status === "success" && Array.isArray(data.registeredEventIds)) {
            setUserRegisteredEventIds((prev) => {
              const merged = Array.from(new Set([...prev, ...data.registeredEventIds]));
              try {
                localStorage.setItem(storageKey, JSON.stringify(merged));
              } catch (err) {}
              return merged;
            });
          }
        })
        .catch((err) => {
          console.warn("Could not sync remote user registrations:", err);
        });
    }
  }, [googleUser, scriptUrl]);

  // Record a successful registration locally
  const recordUserRegistration = useCallback(
    (eventId: string) => {
      if (!googleUser) return;
      const storageKey = `khff_registered_events_${googleUser.email.toLowerCase()}`;
      setUserRegisteredEventIds((prev) => {
        const updated = Array.from(new Set([...prev, eventId]));
        try {
          localStorage.setItem(storageKey, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    },
    [googleUser]
  );

  // Reset user's registrations (useful for demo testing)
  const handleResetMyRegistrations = () => {
    if (!googleUser) return;
    const storageKey = `khff_registered_events_${googleUser.email.toLowerCase()}`;
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {}
    setUserRegisteredEventIds([]);
    setStatusState(null);
  };

  const currentEvent = getBookingEventById(selectedEventId) || BOOKING_EVENTS[0];
  const currentSlot: SlotDetail = slotsData[currentEvent.id] || {
    total: currentEvent.maxSlots || 20,
    used: 0,
    available: currentEvent.maxSlots || 20,
    isFull: false,
    tabSheet: currentEvent.tabSheet,
  };

  // Schedule collision detection for the selected event
  const conflictingEvent = findConflictingRegisteredEvent(currentEvent.id, userRegisteredEventIds);
  const isAlreadyRegisteredForThisEvent = userRegisteredEventIds.includes(currentEvent.id);

  const handleSignOut = () => {
    googleRenderedRef.current = false;
    setGoogleUser(null);
    setUserRegisteredEventIds([]);
    setFullName("");
    setStatusState(null);
  };

  // Initialize Google GIS button once without re-rendering on session switch
  const initGoogleSignIn = useCallback(() => {
    if (typeof window === "undefined" || !window.google || !clientId) return;
    if (googleRenderedRef.current) return;

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
      if (btnContainer && !googleUser && btnContainer.children.length === 0) {
        window.google.accounts.id.renderButton(btnContainer, {
          theme: "filled_blue",
          size: "large",
          shape: "pill",
          text: "continue_with",
          width: 280,
        });
        googleRenderedRef.current = true;
      }
    } catch (e) {
      console.error("GIS render error:", e);
    }
  }, [clientId, handleCredentialResponse, googleUser]);

  useEffect(() => {
    if (!googleUser && typeof window !== "undefined" && window.google) {
      initGoogleSignIn();
    }
  }, [googleUser, initGoogleSignIn]);

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

    // Check duplicate registration
    if (isAlreadyRegisteredForThisEvent) {
      setStatusState({
        type: "duplicate",
        message: `Akun Google Anda (${googleUser.email}) sudah terdaftar pada sesi '${currentEvent.title}'. Setiap akun hanya dapat mendaftar 1 tiket per sesi program.`,
      });
      return;
    }

    // Check schedule collision with another registered event
    if (conflictingEvent) {
      setStatusState({
        type: "conflict",
        message: `Pendaftaran digagalkan karena jadwal bertabrakan! Anda telah terdaftar di program '${conflictingEvent.title}' (${conflictingEvent.scheduleDate}, ${conflictingEvent.scheduleTime}) pada rentang waktu yang sama. Anda hanya dapat memilih 1 program pada slot waktu yang bersamaan.`,
        conflictingEvent: conflictingEvent,
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
        recordUserRegistration(currentEvent.id);
        setStatusState({
          type: "success",
          message: `Registrasi tiket berhasil disimulasikan! Hubungkan URL Google Apps Script pada NEXT_PUBLIC_PROGRAM_SCRIPT_URL untuk menyimpan data langsung ke tab '${currentEvent.tabSheet}' di Spreadsheet Anda.`,
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
        recordUserRegistration(currentEvent.id);
        setStatusState({
          type: "success",
          message: result.message || "Registrasi tiket Anda berhasil terkonfirmasi!",
          regCode: result.data?.registrationCode,
          event: currentEvent,
          name: payload.name,
          whatsapp: payload.whatsapp,
          email: payload.email,
        });
        fetchSlots();
      } else if (result.status === "conflict") {
        setStatusState({
          type: "conflict",
          message:
            result.message ||
            "Pendaftaran digagalkan karena jadwal bertabrakan dengan program lain yang telah Anda daftarkan.",
          conflictingEvent: result.conflictingEventId
            ? getBookingEventById(result.conflictingEventId)
            : conflictingEvent || undefined,
        });
      } else if (result.status === "duplicate") {
        recordUserRegistration(currentEvent.id);
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

  // Filter events by selected category
  const filteredEvents = BOOKING_EVENTS.filter((e) => {
    if (selectedCategory === "all") return true;
    return e.programId === selectedCategory;
  });

  return (
    <main className="min-h-screen bg-khff-navy text-khff-cream font-sans relative overflow-hidden pb-24">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          if (!currentSlot.isFull) initGoogleSignIn();
        }}
      />

      {/* Decorative Background Assets */}
      <div className="absolute top-0 right-0 w-80 md:w-[36rem] opacity-10 pointer-events-none z-0">
        <img src="/assets/illustrations/gong.png" alt="" className="w-full h-auto" />
      </div>
      <div className="absolute bottom-10 left-0 w-64 md:w-96 opacity-10 pointer-events-none z-0">
        <img src="/assets/illustrations/geni.png" alt="" className="w-full h-auto" />
      </div>

      <div className="container mx-auto px-5 sm:px-8 max-w-6xl relative z-10 pt-32 sm:pt-36">
        {/* Navigation Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-white/10 border border-khff-cream/20 px-5 py-2 rounded-full text-khff-cream hover:bg-khff-yellow hover:text-khff-navy font-mono text-xs sm:text-sm font-black transition-all shadow-md mb-8 group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          KEMBALI KE BERANDA
        </Link>

        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black text-white mb-4 leading-tight">
            Registrasi Tiket Program
          </h1>
          <p className="text-khff-cream/90 text-sm sm:text-base md:text-lg leading-relaxed">
            Dapatkan tiket resmi gratis untuk menyaksikan penayangan program festival dan mengikuti temu wicara di PDIN Yogyakarta. Kuota sangat terbatas hanya <strong className="text-khff-yellow font-bold">20 slot kursi per sesi</strong> demi kenyamanan festival.
          </p>
        </div>

        {/* Development Setup Alert (if Google Client ID is not set) */}
        {!clientId && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-khff-yellow/10 border border-khff-yellow/30 text-khff-cream flex items-start gap-3 backdrop-blur-sm shadow-md max-w-4xl">
            <AlertCircle size={22} className="text-khff-yellow shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed">
              <strong className="text-khff-yellow block font-mono uppercase tracking-wider mb-1">
                Petunjuk Setup Akun Google:
              </strong>
              <p className="text-khff-cream/90">
                <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> belum dikonfigurasi di <code>.env.local</code>. Anda dapat menggunakan tombol <strong>Simulasi Login Demo</strong> di bawah untuk menguji form reservasi.
              </p>
            </div>
          </div>
        )}

        {/* SUCCESS VIEW: DIGITAL TICKET PASS */}
        {statusState?.type === "success" ? (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 sm:p-10 rounded-3xl bg-[#163839] border-2 border-khff-yellow shadow-2xl text-khff-cream relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-white/15 mb-6">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-khff-yellow">
                    E-Tiket Terkonfirmasi
                  </span>
                </div>
                <span className="font-mono text-xs text-khff-cream/60">
                  KHFF 2026 PASS
                </span>
              </div>

              <div className="mb-6">
                <span className="text-xs font-mono text-khff-yellow uppercase tracking-widest font-bold block mb-1">
                  {statusState.event?.category}
                </span>
                <h2 className="text-2xl sm:text-4xl font-serif font-black text-white leading-tight mb-2">
                  <Link
                    href={statusState.event?.programUrl || "/program"}
                    className="hover:text-khff-yellow inline-flex items-center gap-2 transition-colors group/suc"
                    title={`Lihat detail halaman ${statusState.event?.title}`}
                  >
                    <span>{statusState.event?.title}</span>
                    <ArrowUpRight
                      size={24}
                      className="text-khff-yellow/70 group-hover/suc:text-khff-yellow group-hover/suc:translate-x-0.5 group-hover/suc:-translate-y-0.5 transition-all shrink-0"
                    />
                  </Link>
                </h2>
                {statusState.event?.subtitle && (
                  <p className="text-khff-cream/85 text-sm sm:text-base italic">
                    {statusState.event?.subtitle}
                  </p>
                )}
              </div>

              {/* Schedule Info Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-black/40 border border-white/10 mb-6 text-xs sm:text-sm font-mono">
                <div className="flex items-center gap-2.5">
                  <Calendar size={16} className="text-khff-yellow shrink-0" />
                  <span>{statusState.event?.scheduleDate}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock size={16} className="text-khff-yellow shrink-0" />
                  <span>{statusState.event?.scheduleTime}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin size={16} className="text-khff-yellow shrink-0" />
                  <span className="truncate">{statusState.event?.venue}</span>
                </div>
              </div>

              {/* Booking Code Card */}
              <div className="p-5 rounded-2xl bg-black/60 border border-khff-yellow/40 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-[10px] sm:text-xs font-mono uppercase text-khff-cream/60 block mb-1">
                    Kode Tiket Reservasi Anda:
                  </span>
                  <span className="text-2xl sm:text-3xl font-mono font-black text-khff-yellow tracking-widest">
                    {statusState.regCode}
                  </span>
                </div>
                {statusState.regCode && (
                  <button
                    type="button"
                    onClick={() => handleCopyCode(statusState.regCode!)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-khff-yellow text-khff-navy hover:bg-white font-mono text-xs font-black transition-all cursor-pointer shadow-md"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? "Tersalin!" : "Salin Kode"}</span>
                  </button>
                )}
              </div>

              {/* Attendee Details */}
              <div className="border-t border-white/15 pt-5 space-y-2.5 text-xs sm:text-sm font-mono text-khff-cream/80 mb-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-khff-cream/60 shrink-0">Nama Pemegang:</span>
                  <span className="font-bold text-white text-right break-words">{statusState.name}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-khff-cream/60 shrink-0">Email:</span>
                  <span className="text-khff-yellow text-right break-all">{statusState.email}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-khff-cream/60 shrink-0">WhatsApp:</span>
                  <span className="text-white text-right">{statusState.whatsapp}</span>
                </div>
              </div>

              {/* Important Note */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-khff-cream/80 space-y-1.5 leading-relaxed mb-6">
                <strong className="text-khff-yellow block font-mono">Ketentuan Kehadiran:</strong>
                <p>• Mohon simpan kode tiket ini untuk verifikasi registrasi ulang di lokasi (PDIN Yogyakarta).</p>
                <p>• Hadir sekurang-kurangnya <strong>15 menit</strong> sebelum sesi dimulai.</p>
                <p>• Kursi penonton yang tidak diisi tepat waktu dapat dialihkan kepada pengunjung umum / antrean on-the-spot.</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  <Printer size={15} />
                  <span>Cetak / Simpan Tiket</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStatusState(null);
                    setAgreed(false);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-khff-yellow text-khff-navy hover:bg-white font-mono text-xs font-black transition-all cursor-pointer shadow-lg uppercase tracking-wider"
                >
                  <Ticket size={15} />
                  <span>Registrasi Sesi Lainnya</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* MAIN TWO-COLUMN BOOKING INTERFACE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: SESSION SELECTOR & DETAILS */}
            <div className="lg:col-span-7 space-y-6">
              {/* Category Filter Tabs */}
              <div className="flex flex-wrap gap-2 pb-2">
                {[
                  { id: "all", label: "Semua Sesi (11)" },
                  { id: "kompetisi", label: "Kompetisi (3)" },
                  { id: "non-kompetisi", label: "Non-Kompetisi (5)" },
                  { id: "non-pemutaran", label: "Talks & Workshop (3)" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? "bg-khff-yellow text-khff-navy shadow-md font-black"
                        : "bg-white/5 text-khff-cream/70 hover:bg-white/10 hover:text-white border border-white/10"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Sessions List */}
              <div className="space-y-3 max-h-[560px] overflow-y-auto p-1.5 sm:p-2 custom-mini-scrollbar">
                {filteredEvents.map((event) => {
                  const isSelected = event.id === selectedEventId;
                  const isRegistered = userRegisteredEventIds.includes(event.id);
                  const conflict = findConflictingRegisteredEvent(event.id, userRegisteredEventIds);
                  const slot = slotsData[event.id] || {
                    total: event.maxSlots || 20,
                    used: 0,
                    available: event.maxSlots || 20,
                    isFull: false,
                  };

                  return (
                    <div
                      key={event.id}
                      onClick={() => {
                        if (selectedEventId !== event.id) {
                          setSelectedEventId(event.id);
                          if (statusState && statusState.type !== "success") {
                            setStatusState(null);
                          }
                        }
                      }}
                      className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#163839] border-khff-yellow shadow-lg ring-1 ring-khff-yellow/40"
                          : isRegistered
                          ? "bg-blue-950/25 border-blue-500/40 hover:border-blue-400/60"
                          : conflict
                          ? "bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-950/30"
                          : "bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-khff-yellow font-bold">
                              {event.category}
                            </span>
                            {isRegistered ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/25 text-blue-300 border border-blue-500/40">
                                <CheckCircle2 size={10} /> Terdaftar
                              </span>
                            ) : conflict ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/25 text-amber-300 border border-amber-500/40">
                                <AlertTriangle size={10} /> Bentrok Jadwal
                              </span>
                            ) : null}
                          </div>
                          <h3 className="font-serif font-black text-base sm:text-lg text-white leading-snug">
                            <Link
                              href={event.programUrl}
                              onClick={(e) => e.stopPropagation()}
                              className="hover:text-khff-yellow inline-flex items-center gap-1.5 transition-colors group/title"
                              title={`Lihat detail halaman ${event.title}`}
                            >
                              <span>{event.title}</span>
                              <ArrowUpRight
                                size={15}
                                className="text-khff-yellow/70 group-hover/title:text-khff-yellow group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 transition-all shrink-0"
                              />
                            </Link>
                          </h3>
                          {event.subtitle && (
                            <p className="text-xs text-khff-cream/75 mt-0.5">
                              {event.subtitle}
                            </p>
                          )}
                          {conflict && (
                            <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/25">
                              <AlertTriangle size={12} className="shrink-0 text-amber-400" />
                              <span>Bentrok dengan: <strong>{conflict.title}</strong></span>
                            </div>
                          )}
                        </div>

                        {/* Quota indicator */}
                        <div className="shrink-0 text-right">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold ${
                              slot.isFull
                                ? "bg-red-500/20 text-red-400 border border-red-500/40"
                                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            }`}
                          >
                            {slot.isFull ? "SOLD OUT" : `Sisa ${slot.available} Slot`}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-3 border-t border-white/10 text-xs font-mono text-khff-cream/70">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-khff-yellow" />
                          <span>{event.scheduleDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} className="text-khff-yellow" />
                          <span>{event.scheduleTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-khff-yellow" />
                          <span>{event.venue}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: BOOKING FORM CARD */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-white/10 to-white/5 border-2 border-khff-cream/20 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md lg:sticky lg:top-28">
                {/* Active Session Highlight Box */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/15 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-khff-yellow font-bold uppercase tracking-widest">
                      Sesi Terpilih
                    </span>
                    <button
                      type="button"
                      onClick={fetchSlots}
                      disabled={loadingSlots}
                      title="Refresh Kuota"
                      className="text-xs text-khff-cream/60 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <RefreshCw size={12} className={loadingSlots ? "animate-spin text-khff-yellow" : ""} />
                      <span>{loadingSlots ? "Cek..." : "Refresh"}</span>
                    </button>
                  </div>

                  <h3 className="font-serif font-black text-lg sm:text-xl text-white mb-1 leading-snug">
                    <Link
                      href={currentEvent.programUrl}
                      className="hover:text-khff-yellow inline-flex items-center gap-1.5 transition-colors group/cur"
                      title={`Lihat detail halaman ${currentEvent.title}`}
                    >
                      <span>{currentEvent.title}</span>
                      <ArrowUpRight
                        size={16}
                        className="text-khff-yellow/70 group-hover/cur:text-khff-yellow group-hover/cur:translate-x-0.5 group-hover/cur:-translate-y-0.5 transition-all shrink-0"
                      />
                    </Link>
                  </h3>
                  {currentEvent.subtitle && (
                    <p className="text-xs text-khff-cream/80 mb-3">
                      {currentEvent.subtitle}
                    </p>
                  )}

                  <div className="space-y-1.5 text-xs font-mono text-khff-cream/70 pt-2 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-khff-yellow shrink-0" />
                      <span>{currentEvent.scheduleDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-khff-yellow shrink-0" />
                      <span>{currentEvent.scheduleTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-khff-yellow shrink-0" />
                      <span>{currentEvent.venue}</span>
                    </div>
                  </div>

                  {/* Slot progress bar */}
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-khff-cream/80">Kapasitas Kursi:</span>
                      <span className={`font-bold ${currentSlot.isFull ? "text-red-400" : "text-emerald-400"}`}>
                        {currentSlot.isFull ? "KUOTA PENUH" : `Tersisa ${currentSlot.available} / 20 Kursi`}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          currentSlot.isFull ? "bg-red-400" : "bg-emerald-400"
                        }`}
                        style={{
                          width: `${Math.min(100, (currentSlot.used / (currentSlot.total || 20)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Registered or Conflict Alert in Active Session Box */}
                  {isAlreadyRegisteredForThisEvent ? (
                    <div className="mt-4 p-3 rounded-xl bg-blue-500/15 border border-blue-500/40 text-blue-200 text-xs font-mono flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-blue-400" />
                      <div>
                        <strong className="block font-bold text-blue-300">Anda Sudah Terdaftar di Sesi Ini</strong>
                        <span>Akun Anda telah memiliki reservasi e-tiket untuk sesi ini. Silakan cek e-tiket Anda atau pilih sesi lain di jam yang berbeda.</span>
                      </div>
                    </div>
                  ) : conflictingEvent ? (
                    <div className="mt-4 p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs font-mono flex items-start gap-2.5">
                      <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-400" />
                      <div>
                        <strong className="block font-bold text-amber-300">Jadwal Bertabrakan (Konflik Sesi)</strong>
                        <span>
                          Anda telah terdaftar di program <strong>'{conflictingEvent.title}'</strong> ({conflictingEvent.scheduleTime}) pada rentang waktu yang sama. Anda hanya dapat memilih 1 program pada slot jam yang bertabrakan.
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Form Status Messages */}
                {statusState && (
                  <div
                    className={`p-3.5 rounded-xl mb-6 text-xs sm:text-sm flex items-start gap-2.5 font-mono ${
                      statusState.type === "duplicate" || statusState.type === "conflict"
                        ? "bg-amber-500/20 border border-amber-500/40 text-amber-200"
                        : statusState.type === "full"
                        ? "bg-red-500/20 border border-red-500/40 text-red-200"
                        : "bg-red-500/20 border border-red-500/40 text-red-200"
                    }`}
                  >
                    {statusState.type === "conflict" ? (
                      <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-400" />
                    ) : (
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    )}
                    <span>{statusState.message}</span>
                  </div>
                )}

                {/* Slot Full Notice */}
                {currentSlot.isFull ? (
                  <div className="text-center p-6 bg-red-950/40 border border-red-500/30 rounded-2xl">
                    <AlertCircle size={32} className="text-red-400 mx-auto mb-2" />
                    <h4 className="font-serif font-black text-white text-base mb-1">
                      Kuota Sesi Ini Sudah Penuh
                    </h4>
                    <p className="text-xs text-khff-cream/70 leading-relaxed">
                      Silakan pilih sesi atau hari penayangan lain yang masih memiliki slot tersedia di kolom sebelah kiri.
                    </p>
                  </div>
                ) : !googleUser ? (
                  /* STEP 1: GOOGLE AUTHENTICATION */
                  <div className="space-y-4">
                    <div className="text-center sm:text-left">
                      <span className="text-xs font-mono text-khff-yellow font-bold uppercase tracking-wider block mb-1">
                        Langkah 1 dari 2
                      </span>
                      <h4 className="text-lg font-serif font-black text-white">
                        Masuk dengan Akun Google
                      </h4>
                      <p className="text-xs text-khff-cream/70 mt-1 leading-relaxed">
                        Akun Google digunakan untuk verifikasi satu orang satu tiket serta konfirmasi tiket instan.
                      </p>
                    </div>

                    {/* Google GSI Button Container */}
                    <div className="flex justify-center py-2 max-w-full overflow-hidden">
                      <div id="googleProgramSignInBtn" ref={btnContainerRef} className="min-h-[44px] max-w-full" />
                    </div>

                    {/* Demo / Simulation Mode Button */}
                    <div className="pt-3 border-t border-white/10 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setGoogleUser({
                            name: "Festival Attendee (Demo)",
                            email: "festival.attendee@gmail.com",
                            picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
                          });
                          setFullName("Festival Attendee");
                          setStatusState(null);
                        }}
                        className="text-[11px] font-mono text-khff-cream/60 hover:text-khff-yellow underline transition-colors cursor-pointer"
                      >
                        Atau klik di sini untuk simulasi login demo
                      </button>
                    </div>
                  </div>
                ) : (
                  /* STEP 2: REGISTRATION FORM */
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Signed-in user card */}
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          {googleUser.picture ? (
                            <img
                              src={googleUser.picture}
                              alt={googleUser.name}
                              className="w-10 h-10 rounded-full border border-white/20 object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-khff-yellow text-khff-navy flex items-center justify-center font-bold shrink-0">
                              {googleUser.name.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="block text-xs font-bold text-white truncate">
                              {googleUser.name}
                            </span>
                            <span className="block text-[11px] font-mono text-khff-yellow truncate">
                              {googleUser.email}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleSignOut}
                          title="Ganti Akun Google"
                          className="text-khff-cream/50 hover:text-red-400 p-1.5 transition-colors cursor-pointer shrink-0"
                        >
                          <LogOut size={16} />
                        </button>
                      </div>

                      {userRegisteredEventIds.length > 0 && (
                        <div className="flex items-center justify-between text-[11px] font-mono text-khff-cream/70 pt-2 border-t border-white/10">
                          <span>Sesi Terdaftar: <strong className="text-khff-yellow">{userRegisteredEventIds.length}</strong> sesi</span>
                          <button
                            type="button"
                            onClick={handleResetMyRegistrations}
                            className="text-khff-cream/50 hover:text-red-400 underline transition-colors cursor-pointer"
                            title="Reset riwayat pendaftaran lokal akun ini"
                          >
                            Reset Sesi Saya
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Full Name Input */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-khff-cream mb-1.5">
                        Nama Lengkap Sesuai ID <span className="text-khff-pink">*</span>
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-khff-cream/40" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Masukkan nama lengkap Anda"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/30 border border-white/15 focus:border-khff-yellow text-white text-xs sm:text-sm font-sans outline-none transition-all placeholder:text-khff-cream/30"
                        />
                      </div>
                    </div>

                    {/* WhatsApp Input */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-khff-cream mb-1.5">
                        Nomor WhatsApp Aktif <span className="text-khff-pink">*</span>
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-khff-cream/40" />
                        <input
                          type="tel"
                          required
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          placeholder="Contoh: 081234567890"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/30 border border-white/15 focus:border-khff-yellow text-white text-xs sm:text-sm font-mono outline-none transition-all placeholder:text-khff-cream/30"
                        />
                      </div>
                      <span className="text-[10px] font-mono text-khff-cream/50 block mt-1">
                        *Digunakan untuk konfirmasi kehadiran & info darurat festival
                      </span>
                    </div>

                    {/* Commitment Checkbox */}
                    <div className="pt-1">
                      <label className="flex items-start gap-2.5 text-xs text-khff-cream/80 cursor-pointer select-none leading-relaxed">
                        <input
                          type="checkbox"
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded border-white/20 bg-black/30 text-khff-yellow focus:ring-0 cursor-pointer"
                        />
                        <span>
                          Saya berkomitmen untuk hadir tepat waktu di lokasi acara (PDIN Yogyakarta) sebelum sesi dimulai.
                        </span>
                      </label>
                    </div>

                    {/* Submit CTA */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={
                          loading ||
                          currentSlot.isFull ||
                          isAlreadyRegisteredForThisEvent ||
                          !!conflictingEvent
                        }
                        className="w-full bg-khff-yellow text-khff-navy hover:bg-white disabled:opacity-50 font-mono font-black text-xs sm:text-sm py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-xl uppercase tracking-wider disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Memproses E-Tiket...</span>
                          </>
                        ) : isAlreadyRegisteredForThisEvent ? (
                          <>
                            <CheckCircle2 size={16} />
                            <span>Sudah Terdaftar di Sesi Ini</span>
                          </>
                        ) : conflictingEvent ? (
                          <>
                            <AlertTriangle size={16} />
                            <span>Jadwal Bertabrakan (Tidak Dapat Mendaftar)</span>
                          </>
                        ) : (
                          <>
                            <Ticket size={16} />
                            <span>Konfirmasi & Terbitkan E-Tiket</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
