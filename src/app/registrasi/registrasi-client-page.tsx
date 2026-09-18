"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Script from "next/script";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
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
  Printer,
  Trash2,
  X,
} from "lucide-react";
import {
  BookingEvent,
  BOOKING_EVENTS,
  getBookingEventById,
  findConflictingRegisteredEvent,
} from "@/data/booking-events";
import { FESTIVAL_CONFIG } from "@/data/festival-config";
import OtsAnnouncementModal from "@/components/OtsAnnouncementModal";

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
  const router = useRouter();
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

  // Initial loading screen state (waiting for spreadsheet slots sync)
  const [isInitialSlotsLoading, setIsInitialSlotsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const isInitialFetchRef = useRef(true);

  // Handle slow connection fallback skip button
  useEffect(() => {
    if (!isInitialSlotsLoading) return;

    const skipTimer = setTimeout(() => {
      setShowSkipButton(true);
    }, 7000);

    return () => {
      clearTimeout(skipTimer);
    };
  }, [isInitialSlotsLoading]);

  const [showOtsModal, setShowOtsModal] = useState(true);

  // Lock body scroll while initial loading screen is active
  useEffect(() => {
    if (isInitialSlotsLoading) {
      document.body.style.overflow = "hidden";
    } else if (!showOtsModal) {
      document.body.style.overflow = "";
    }
    return () => {
      if (!showOtsModal) {
        document.body.style.overflow = "";
      }
    };
  }, [isInitialSlotsLoading, showOtsModal]);

  const handleSkipLoading = () => {
    isInitialFetchRef.current = false;
    setIsFadingOut(true);
    setTimeout(() => {
      setIsInitialSlotsLoading(false);
    }, 350);
  };

  // User registered event IDs for conflict detection
  const [userRegisteredEventIds, setUserRegisteredEventIds] = useState<string[]>([]);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedResetEventIds, setSelectedResetEventIds] = useState<string[]>([]);
  const [resetNotice, setResetNotice] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

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

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  const scriptUrl = process.env.NEXT_PUBLIC_PROGRAM_SCRIPT_URL || "";

  // Adjust selected event and category during render when session query param changes
  const [prevSessionParam, setPrevSessionParam] = useState(sessionParam);
  if (sessionParam !== prevSessionParam) {
    setPrevSessionParam(sessionParam);
    if (sessionParam) {
      const ev = getBookingEventById(sessionParam);
      if (ev) {
        setSelectedEventId(ev.id);
        setSelectedCategory(ev.programId);
      }
    }
  }

  // Fetch slots data from Google Apps Script
  const fetchSlots = useCallback(async () => {
    try {
      if (scriptUrl) {
        const url = `${scriptUrl}${scriptUrl.includes("?") ? "&" : "?"}action=slots`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);
        const res = await fetch(url, { method: "GET", signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          if (data && data.slots) {
            const normalizedSlots: Record<string, SlotDetail> = {};
            BOOKING_EVENTS.forEach((e) => {
              const remote =
                data.slots[e.id] ||
                (e.tabSheet ? data.slots[e.tabSheet] : null);
              const maxCap = 9999;
              const isPermanentlySoldOut =
                !!e.isSoldOut ||
                (remote && remote.isSoldOut) ||
                FESTIVAL_CONFIG.isEventOts(e.dateIso);
              const used = remote ? Number(remote.used) || 0 : 0;
              const available = isPermanentlySoldOut ? 0 : 9999;
              normalizedSlots[e.id] = {
                total: maxCap,
                used: used,
                available: available,
                isFull: isPermanentlySoldOut,
                tabSheet: e.tabSheet,
              };
            });
            setSlotsData(normalizedSlots);
            return;
          }
        }
      }
      // Fallback default open slots for all events
      const defaultSlots: Record<string, SlotDetail> = {};
      BOOKING_EVENTS.forEach((e) => {
        const isPermanentlySoldOut = !!e.isSoldOut;
        const maxCap = 9999;
        defaultSlots[e.id] = {
          total: maxCap,
          used: 0,
          available: isPermanentlySoldOut ? 0 : 9999,
          isFull: isPermanentlySoldOut,
          tabSheet: e.tabSheet,
        };
      });
      setSlotsData(defaultSlots);
    } catch (err) {
      console.warn("Live Apps Script slots offline / default:", err);
      const defaultSlots: Record<string, SlotDetail> = {};
      BOOKING_EVENTS.forEach((e) => {
        const isPermanentlySoldOut = !!e.isSoldOut;
        const maxCap = 9999;
        defaultSlots[e.id] = {
          total: maxCap,
          used: 0,
          available: isPermanentlySoldOut ? 0 : 9999,
          isFull: isPermanentlySoldOut,
          tabSheet: e.tabSheet,
        };
      });
      setSlotsData(defaultSlots);
    } finally {
      setLoadingSlots(false);
      if (isInitialFetchRef.current) {
        isInitialFetchRef.current = false;
        setIsFadingOut(true);
        setTimeout(() => {
          setIsInitialSlotsLoading(false);
        }, 400);
      }
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

  // User registered event IDs for conflict detection
  const [prevUserEmail, setPrevUserEmail] = useState<string | null>(null);
  const currentUserEmail = googleUser ? googleUser.email.toLowerCase() : null;

  // Synchronize local storage registration state during render when user changes
  if (currentUserEmail !== prevUserEmail) {
    setPrevUserEmail(currentUserEmail);
    if (!currentUserEmail) {
      setUserRegisteredEventIds([]);
    } else {
      const storageKey = `khff_registered_events_${currentUserEmail}`;
      try {
        const saved = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setUserRegisteredEventIds(parsed);
          }
        }
      } catch {
        // ignore parse error
      }
    }
  }

  // Remote sync with Apps Script when user email or scriptUrl changes (asynchronous effect)
  useEffect(() => {
    if (!googleUser || !scriptUrl) return;

    let isMounted = true;
    const storageKey = `khff_registered_events_${googleUser.email.toLowerCase()}`;
    const checkUrl = `${scriptUrl}${scriptUrl.includes("?") ? "&" : "?"}action=userRegistrations&email=${encodeURIComponent(googleUser.email)}`;

    fetch(checkUrl)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data && data.status === "success" && Array.isArray(data.registeredEventIds)) {
          setUserRegisteredEventIds((prev) => {
            const merged = Array.from(new Set([...prev, ...data.registeredEventIds]));
            try {
              localStorage.setItem(storageKey, JSON.stringify(merged));
            } catch {
              // ignore storage error
            }
            return merged;
          });
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
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
        } catch {
          // ignore
        }
        return updated;
      });
    },
    [googleUser]
  );

  // Open reset modal and select all registered events by default
  const handleOpenResetModal = () => {
    setSelectedResetEventIds([...userRegisteredEventIds]);
    setShowResetModal(true);
  };

  // Toggle single event selection for reset
  const toggleSelectResetEvent = (eventId: string) => {
    setSelectedResetEventIds((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  // Toggle all events selection for reset
  const handleToggleSelectAllReset = () => {
    if (selectedResetEventIds.length === userRegisteredEventIds.length) {
      setSelectedResetEventIds([]);
    } else {
      setSelectedResetEventIds([...userRegisteredEventIds]);
    }
  };

  // Handle confirmed reset: deletes selected rows and redirects cleanly to registration
  const handleConfirmReset = async () => {
    if (!googleUser || selectedResetEventIds.length === 0) return;
    setResetting(true);

    const storageKey = `khff_registered_events_${googleUser.email.toLowerCase()}`;
    const targetIdsToDelete = [...selectedResetEventIds];

    // If scriptUrl is connected, send request to Apps Script to delete matching rows
    if (scriptUrl) {
      try {
        const res = await fetch(scriptUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            action: "resetRegistrations",
            email: googleUser.email,
            eventIds: targetIdsToDelete,
          }),
        });
        const resText = await res.text();
        console.log("Reset registrations response:", resText);
      } catch (err) {
        console.error("Gagal membatalkan registrasi:", err);
      }
    }

    const countDeleted = targetIdsToDelete.length;
    const remaining = userRegisteredEventIds.filter(
      (id) => !targetIdsToDelete.includes(id)
    );

    // Update local storage and component state
    try {
      if (remaining.length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(remaining));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch {
      // ignore
    }

    setUserRegisteredEventIds(remaining);
    setSelectedResetEventIds([]);
    setResetting(false);
    setShowResetModal(false);

    // CRITICAL: Clear success state so digital ticket pass is not rendered with empty values
    setStatusState(null);

    // Show success notification banner above the registration form
    setResetNotice(
      `${countDeleted} sesi reservasi berhasil dibatalkan. Kuota kursi telah dikembalikan.`
    );

    // Redirect user to registration page and scroll to top
    try {
      router.push("/registrasi");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      // ignore
    }

    // Refresh quota numbers immediately so freed slots are visible
    fetchSlots();
  };

  const currentEvent = getBookingEventById(selectedEventId) || BOOKING_EVENTS[0];
  const currentSlot: SlotDetail = slotsData[currentEvent.id] || {
    total: currentEvent.maxSlots || 20,
    used: 0,
    available: currentEvent.maxSlots || 20,
    isFull: false,
    tabSheet: currentEvent.tabSheet,
  };

  // Status apakah sesi terpilih berstatus OTS ONLY (Hari H acara bersangkutan)
  const isCurrentEventOts =
    !!currentEvent.isSoldOut ||
    currentSlot.isFull ||
    FESTIVAL_CONFIG.isEventOts(currentEvent.dateIso);

  // Schedule collision detection for the selected event
  const conflictingEvent = findConflictingRegisteredEvent(currentEvent.id, userRegisteredEventIds);
  const isAlreadyRegisteredForThisEvent = userRegisteredEventIds.includes(currentEvent.id);

  const handleSignOut = () => {
    setGoogleUser(null);
    setUserRegisteredEventIds([]);
    setFullName("");
    setStatusState(null);
  };

  // Initialize Google GIS button
  const initGoogleSignIn = useCallback(() => {
    if (typeof window === "undefined" || !window.google || !clientId) return;
    if (isCurrentEventOts || googleUser) return;

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
        const screenW = typeof window !== "undefined" ? window.innerWidth : 360;
        const btnWidth = Math.min(280, Math.max(220, screenW - 80));

        window.google.accounts.id.renderButton(btnContainer, {
          theme: "filled_blue",
          size: "large",
          shape: "pill",
          text: "continue_with",
          width: btnWidth,
        });
      }
    } catch (e) {
      console.error("GIS render error:", e);
    }
  }, [clientId, handleCredentialResponse, googleUser, isCurrentEventOts]);

  // Ensure Google button renders whenever user views an open session
  useEffect(() => {
    if (isCurrentEventOts || googleUser) return;

    if (typeof window !== "undefined" && window.google) {
      initGoogleSignIn();
    }

    const interval = setInterval(() => {
      const btnContainer =
        btnContainerRef.current || document.getElementById("googleProgramSignInBtn");
      if (
        !isCurrentEventOts &&
        !googleUser &&
        typeof window !== "undefined" &&
        window.google &&
        btnContainer &&
        btnContainer.children.length === 0
      ) {
        initGoogleSignIn();
      }
    }, 250);

    const timer = setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [selectedEventId, isCurrentEventOts, googleUser, initGoogleSignIn]);

  // Submit Booking
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleUser) return;

    if (isCurrentEventOts) {
      setStatusState({
        type: "full",
        message: `Mohon maaf, pendaftaran online untuk acara '${currentEvent.title}' telah ditutup. Tiket tersedia On The Spot (OTS ONLY) langsung di venue PDIN Yogyakarta.`,
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

      let result: {
        status?: string;
        code?: string;
        message?: string;
        conflictingEventId?: string;
        data?: { registrationCode?: string };
      } | null = null;

      try {
        const text = await res.text();
        result = JSON.parse(text);
      } catch (parseErr) {
        console.warn("Respon bukan JSON valid, memverifikasi Google Sheets...", parseErr);
      }

      if (result) {
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
          return;
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
          return;
        } else if (result.status === "duplicate") {
          recordUserRegistration(currentEvent.id);
          setStatusState({
            type: "duplicate",
            message:
              result.message ||
              "Akun Google Anda sudah terdaftar pada sesi acara ini (1 akun = 1 tiket).",
          });
          fetchSlots();
          return;
        } else if (result.status === "full") {
          setStatusState({
            type: "full",
            message: result.message || "Mohon maaf, kuota tiket untuk acara ini sudah penuh.",
          });
          return;
        } else if (result.message) {
          setStatusState({
            type: "error",
            message: result.message,
          });
          return;
        }
      }

      // Verifikasi Darurat: Jika respon terputus / format HTML tapi data sebenarnya sudah masuk ke Spreadsheet
      try {
        const verifyUrl = `${scriptUrl}${scriptUrl.includes("?") ? "&" : "?"}action=userRegistrations&email=${encodeURIComponent(googleUser.email)}&_t=${Date.now()}`;
        const verifyRes = await fetch(verifyUrl);
        const verifyData = await verifyRes.json();
        if (
          verifyData &&
          verifyData.status === "success" &&
          Array.isArray(verifyData.registeredEventIds) &&
          verifyData.registeredEventIds.includes(currentEvent.id)
        ) {
          recordUserRegistration(currentEvent.id);
          setLoading(false);
          setStatusState({
            type: "success",
            message: "Registrasi tiket Anda berhasil terkonfirmasi di Google Sheets!",
            regCode: currentEvent.ticketPrefix + Math.floor(1000 + Math.random() * 9000),
            event: currentEvent,
            name: payload.name,
            whatsapp: payload.whatsapp,
            email: payload.email,
          });
          fetchSlots();
          return;
        }
      } catch (verErr) {
        console.warn("Verifikasi darurat tidak dapat diakses:", verErr);
      }

      setLoading(false);
      setStatusState({
        type: "error",
        message: "Gagal memproses pendaftaran. Silakan periksa koneksi internet Anda.",
      });
    } catch (err) {
      console.error("Booking error, menjalankan verifikasi ke Google Sheets:", err);

      // Verifikasi Darurat saat blok catch: Cek apakah pendaftaran sebenarnya sudah tercatat di Spreadsheet
      try {
        const verifyUrl = `${scriptUrl}${scriptUrl.includes("?") ? "&" : "?"}action=userRegistrations&email=${encodeURIComponent(googleUser.email)}&_t=${Date.now()}`;
        const verifyRes = await fetch(verifyUrl);
        const verifyData = await verifyRes.json();
        if (
          verifyData &&
          verifyData.status === "success" &&
          Array.isArray(verifyData.registeredEventIds) &&
          verifyData.registeredEventIds.includes(currentEvent.id)
        ) {
          recordUserRegistration(currentEvent.id);
          setLoading(false);
          setStatusState({
            type: "success",
            message: "Registrasi tiket Anda berhasil terkonfirmasi di Google Sheets!",
            regCode: currentEvent.ticketPrefix + Math.floor(1000 + Math.random() * 9000),
            event: currentEvent,
            name: payload.name,
            whatsapp: payload.whatsapp,
            email: payload.email,
          });
          fetchSlots();
          return;
        }
      } catch {
        // Abaikan jika verifikasi darurat gagal
      }

      setLoading(false);
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
      {/* INITIAL FULLSCREEN LOADING SCREEN (WAITING FOR SPREADSHEET SLOTS) */}
      {isInitialSlotsLoading && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0B2027] px-6 text-center transition-opacity duration-400 ease-out select-none ${
            isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {/* Ambient Lighting & Glows */}
          <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-khff-yellow/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-khff-pink/10 blur-3xl pointer-events-none" />

          {/* Decorative Cultural Assets */}
          <div className="absolute top-4 left-4 sm:top-8 sm:left-8 w-32 sm:w-48 md:w-56 opacity-25 pointer-events-none select-none -rotate-12">
            <img src="/assets/illustrations/kendhang.png" alt="" className="w-full h-auto" />
          </div>
          <div className="absolute top-4 right-4 sm:top-8 sm:right-8 w-40 sm:w-56 md:w-64 opacity-25 pointer-events-none select-none rotate-12">
            <img src="/assets/illustrations/gong.png" alt="" className="w-full h-auto" />
          </div>
          <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-36 sm:w-52 md:w-60 opacity-25 pointer-events-none select-none rotate-6">
            <img src="/assets/illustrations/geni.png" alt="" className="w-full h-auto" />
          </div>
          <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-32 sm:w-48 md:w-56 opacity-25 pointer-events-none select-none -rotate-12">
            <img src="/assets/illustrations/terompet.png" alt="" className="w-full h-auto" />
          </div>
          <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 -right-8 w-44 md:w-52 opacity-20 pointer-events-none select-none rotate-12">
            <img src="/assets/illustrations/bendera.png" alt="" className="w-full h-auto" />
          </div>
          <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 -left-8 w-44 md:w-52 opacity-20 pointer-events-none select-none -rotate-12">
            <img src="/assets/illustrations/buto2.png" alt="" className="w-full h-auto" />
          </div>

          <div className="relative z-10 flex flex-col items-center max-w-md mx-auto">
            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-serif font-black text-khff-cream mb-4 tracking-wider drop-shadow-sm">
              Memuat...
            </h2>

            {/* Animated Indeterminate Progress Bar */}
            <div className="w-64 sm:w-80 h-2 bg-white/10 rounded-full overflow-hidden relative shadow-inner border border-white/5">
              <div className="absolute top-0 bottom-0 bg-gradient-to-r from-transparent via-khff-yellow to-transparent w-40 rounded-full animate-progress-slide shadow-[0_0_12px_rgba(238,173,47,0.8)]" />
            </div>

            {/* Optional Skip Button if network is taking unusually long */}
            {showSkipButton && (
              <button
                type="button"
                onClick={handleSkipLoading}
                className="mt-6 text-[11px] font-mono text-khff-cream/50 hover:text-khff-yellow underline transition-colors cursor-pointer"
              >
                Koneksi lambat? Lewati dan buka form langsung
              </button>
            )}
          </div>
        </div>
      )}

      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          initGoogleSignIn();
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
            Dapatkan tiket resmi gratis untuk menyaksikan penayangan program festival dan mengikuti temu wicara di PDIN Yogyakarta. <strong className="text-khff-yellow font-bold">Pendaftaran dibuka untuk umum (Akses Terbuka)</strong>. Kursi penonton di venue PDIN menggunakan sistem <em>First Come, First Served</em>.
          </p>
        </div>

        {/* OTS Announcement Banner */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-amber-500/15 border border-amber-500/35 text-khff-cream flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-sm shadow-md max-w-5xl animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <AlertTriangle size={22} className="text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed">
              <strong className="text-amber-300 block font-mono uppercase tracking-wider mb-0.5">
                Pengumuman Tiket & Ketentuan OTS (On The Spot)
              </strong>
              <p className="text-khff-cream/90">
                Pendaftaran online ditutup pada pukul 07.00 WIB di Hari H pelaksanaan dan tiket dialihkan ke sistem OTS langsung di venue PDIN Yogyakarta.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowOtsModal(true)}
            className="w-full sm:w-auto text-center justify-center shrink-0 px-4 py-2.5 sm:py-2 rounded-xl bg-khff-yellow/20 hover:bg-khff-yellow text-khff-yellow hover:text-khff-navy border border-khff-yellow/40 font-mono text-xs font-bold transition-all cursor-pointer shadow"
          >
            Baca Ketentuan Lengkap
          </button>
        </div>

        {/* Reset / Cancellation Banner Notice */}
        {resetNotice && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-khff-cream flex items-start justify-between gap-3 backdrop-blur-sm shadow-md max-w-4xl animate-in fade-in duration-300">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={22} className="text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm leading-relaxed">
                <strong className="text-emerald-300 block font-mono uppercase tracking-wider mb-1">
                  Reservasi Sesi Berhasil Dibatalkan
                </strong>
                <p className="text-khff-cream/90">{resetNotice}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setResetNotice(null)}
              className="text-khff-cream/50 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              title="Tutup pemberitahuan"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Development Setup Alert (if Google Client ID is not set) */}
        {!clientId && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-khff-yellow/10 border border-khff-yellow/30 text-khff-cream flex items-start gap-3 backdrop-blur-sm shadow-md max-w-4xl">
            <AlertCircle size={22} className="text-khff-yellow shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed">
              <strong className="text-khff-yellow block font-mono uppercase tracking-wider mb-1">
                Petunjuk Setup Akun Google:
              </strong>
              <p className="text-khff-cream/90">
                <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> belum dikonfigurasi di <code>.env.local</code>. Silakan konfigurasikan Google Client ID untuk mengaktifkan login Google.
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
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-6 gap-y-3 p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 mb-6 text-xs sm:text-sm font-mono">
                <div className="flex items-center gap-2.5 shrink-0">
                  <Calendar size={16} className="text-khff-yellow shrink-0" />
                  <span>{statusState.event?.scheduleDate}</span>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <Clock size={16} className="text-khff-yellow shrink-0" />
                  <span>{statusState.event?.scheduleTime}</span>
                </div>
                <div className="flex items-center gap-2.5 min-w-0">
                  <MapPin size={16} className="text-khff-yellow shrink-0" />
                  <span className="leading-snug">{statusState.event?.venue}</span>
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
                {(
                  [
                    { id: "all", label: "Semua Sesi (11)" },
                    { id: "kompetisi", label: "Kompetisi (3)" },
                    { id: "non-kompetisi", label: "Non-Kompetisi (5)" },
                    { id: "non-pemutaran", label: "Talks & Workshop (3)" },
                  ] as const
                ).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
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
                            className={`inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-mono font-bold whitespace-nowrap ${
                              event.isSoldOut || slot.isFull
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            }`}
                          >
                            {event.isSoldOut || slot.isFull ? "OTS ONLY" : "KUOTA TERSEDIA"}
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

                  {/* Slot capacity status */}
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                      <span className="text-khff-cream/80">Kapasitas Kursi:</span>
                      <span className={`font-bold ${isCurrentEventOts ? "text-amber-300" : "text-emerald-400"}`}>
                        {isCurrentEventOts ? "OTS ONLY (DI LOKASI)" : "Pendaftaran Terbuka (Gratis)"}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-khff-cream/65 leading-relaxed">
                      Sistem tempat duduk di lokasi: <strong>First Come, First Served</strong> di PDIN Yogyakarta.
                    </p>
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
                          Anda telah terdaftar di program <strong>&lsquo;{conflictingEvent.title}&rsquo;</strong> ({conflictingEvent.scheduleTime}) pada rentang waktu yang sama. Anda hanya dapat memilih 1 program pada slot jam yang bertabrakan.
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

                {/* Closed / OTS Notice */}
                {isCurrentEventOts ? (
                  <div className="text-center p-6 bg-amber-950/40 border border-amber-500/30 rounded-2xl">
                    <AlertCircle size={32} className="text-amber-400 mx-auto mb-2" />
                    <h4 className="font-serif font-black text-white text-base mb-1">
                      Pendaftaran Online Ditutup (OTS ONLY)
                    </h4>
                    <p className="text-xs text-khff-cream/70 leading-relaxed">
                      Sesi ini hanya melayani pendaftaran langsung On The Spot (OTS) di meja registrasi venue PDIN Yogyakarta sebelum acara dimulai.
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
                            onClick={handleOpenResetModal}
                            className="text-khff-cream/60 hover:text-red-400 underline transition-colors cursor-pointer inline-flex items-center gap-1.5"
                            title="Batalkan dan hapus sesi terdaftar dari akun ini"
                          >
                            <Trash2 size={12} />
                            <span>Kelola / Hapus Sesi</span>
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
                          isCurrentEventOts ||
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
                        ) : isCurrentEventOts ? (
                          <>
                            <Ticket size={16} />
                            <span>Pendaftaran Ditutup (OTS ONLY)</span>
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

      {/* CONFIRMATION MODAL: BATALKAN SESI PILIHAN DENGAN CHECKBOX */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-[#122829] border-2 border-red-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-in zoom-in-95 duration-200 text-khff-cream"
            role="dialog"
            aria-modal="true"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => !resetting && setShowResetModal(false)}
              disabled={resetting}
              className="absolute top-5 right-5 text-khff-cream/50 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                <Trash2 size={24} />
              </div>
              <div className="min-w-0 pr-6">
                <h3 className="font-serif font-black text-lg sm:text-xl text-white leading-tight">
                  Batalkan Reservasi Sesi
                </h3>
                <p className="text-xs text-khff-cream/70 mt-1 truncate">
                  Akun: <strong className="text-khff-yellow font-mono">{googleUser?.email}</strong>
                </p>
              </div>
            </div>

            {/* Description without mentioning spreadsheet */}
            <p className="text-xs sm:text-sm text-khff-cream/85 leading-relaxed mb-4">
              Pilih sesi program yang ingin Anda batalkan reservasinya. Tindakan ini akan <strong>menghapus data pendaftaran</strong> dan membebaskan kuota kursi untuk pengunjung lain.
            </p>

            {/* List of registered sessions with checkboxes */}
            {userRegisteredEventIds.length > 0 ? (
              <div className="mb-6 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-khff-cream/70 px-1">
                  <span>
                    Pilih sesi yang ingin dihapus ({selectedResetEventIds.length}/{userRegisteredEventIds.length}):
                  </span>
                  <button
                    type="button"
                    onClick={handleToggleSelectAllReset}
                    disabled={resetting}
                    className="text-khff-yellow hover:underline cursor-pointer font-bold disabled:opacity-50"
                  >
                    {selectedResetEventIds.length === userRegisteredEventIds.length
                      ? "Batal Pilih Semua"
                      : "Pilih Semua"}
                  </button>
                </div>

                <div className="p-2 sm:p-3 rounded-2xl bg-black/50 border border-white/10 max-h-60 overflow-y-auto custom-mini-scrollbar space-y-2">
                  {userRegisteredEventIds.map((id) => {
                    const ev = getBookingEventById(id);
                    if (!ev) return null;
                    const isChecked = selectedResetEventIds.includes(id);

                    return (
                      <div
                        key={id}
                        onClick={() => !resetting && toggleSelectResetEvent(id)}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                          isChecked
                            ? "bg-red-500/15 border-red-500/50 text-white"
                            : "bg-white/5 border-white/5 text-khff-cream/70 hover:bg-white/10 hover:text-khff-cream"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // Handled by outer container click
                          disabled={resetting}
                          className="mt-0.5 w-4 h-4 rounded border-white/30 text-red-600 focus:ring-red-500/50 bg-black/40 shrink-0 cursor-pointer accent-red-600"
                        />
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs sm:text-sm font-bold leading-snug ${isChecked ? "text-white" : "text-khff-cream/90"}`}>
                            {ev.title}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-khff-cream/60 mt-1">
                            <span>{ev.scheduleDate.split(",")[0]}</span>
                            <span>•</span>
                            <span className="text-khff-yellow font-bold">{ev.scheduleTime}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-xs text-khff-cream/60 italic mb-6">
                Tidak ada sesi aktif yang terdaftar untuk akun ini.
              </p>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                disabled={resetting}
                className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                disabled={resetting || selectedResetEventIds.length === 0}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-white/10 disabled:text-white/30 disabled:border disabled:border-white/5 disabled:cursor-not-allowed text-white font-mono text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                {resetting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>
                      {selectedResetEventIds.length > 0
                        ? `Hapus (${selectedResetEventIds.length}) Sesi Terpilih`
                        : "Pilih Sesi Terlebih Dahulu"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POP-UP MODAL PENGUMUMAN RESMI HARI H & TIKET OTS */}
      <OtsAnnouncementModal
        isOpen={!isInitialSlotsLoading && showOtsModal}
        onClose={() => setShowOtsModal(false)}
      />
    </main>
  );
}
