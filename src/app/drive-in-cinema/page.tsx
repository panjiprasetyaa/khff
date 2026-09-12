"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Script from "next/script";
import Link from "next/link";
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Calendar, 
  MapPin, 
  Users, 
  ShieldCheck, 
  Ticket, 
  Info,
  LogOut,
  Sparkles,
  Armchair,
  Bike,
  RefreshCw,
  Clock,
  User
} from "lucide-react";

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

type BookingType = "becak" | "kursi";

interface SlotDetail {
  total: number;
  used: number;
  available: number;
  isFull: boolean;
}

interface SlotsState {
  becak: SlotDetail;
  kursi: SlotDetail;
}

export default function DriveInCinemaRegistrationPage() {
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const [bookingType, setBookingType] = useState<BookingType>("becak");
  const [fullName, setFullName] = useState("");
  const [fullName2, setFullName2] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [agreed, setAgreed] = useState(false);

  // Status kuota slot realtime (23 Becak, 40 Kursi)
  const [slots, setSlots] = useState<SlotsState>({
    becak: { total: 23, used: 0, available: 23, isFull: false },
    kursi: { total: 40, used: 0, available: 40, isFull: false },
  });
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const [loading, setLoading] = useState(false);
  const [statusState, setStatusState] = useState<{
    type: "success" | "duplicate" | "error" | "full";
    message: string;
    regCode?: string;
    bookingType?: BookingType;
    name?: string;
    name2?: string;
  } | null>(null);

  const isInitializedRef = useRef(false);
  const btnContainerRef = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  const scriptUrl = process.env.NEXT_PUBLIC_DRIVE_IN_SCRIPT_URL || "";

  // Fetch slot ketersediaan realtime langsung dari Google Apps Script (atau fallback aman)
  const fetchSlots = useCallback(async () => {
    try {
      if (scriptUrl) {
        const url = `${scriptUrl}${scriptUrl.includes("?") ? "&" : "?"}action=slots`;
        const res = await fetch(url, { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          if (data && data.slots) {
            setSlots(data.slots);
            setLastRefreshed(new Date());

            // Jika tipe yang sedang dipilih ternyata sudah penuh, alihkan ke tipe yang masih tersedia
            setBookingType((current) => {
              if (current === "becak" && data.slots.becak?.isFull && !data.slots.kursi?.isFull) {
                return "kursi";
              }
              if (current === "kursi" && data.slots.kursi?.isFull && !data.slots.becak?.isFull) {
                return "becak";
              }
              return current;
            });
            return;
          }
        }
      }
      // Jika script belum di-deploy atau respons tidak mengembalikan JSON, pertahankan slot default
      setLastRefreshed(new Date());
    } catch (err) {
      console.warn("Koneksi Apps Script slot live belum aktif:", err);
      setLastRefreshed(new Date());
    } finally {
      setLoadingSlots(false);
    }
  }, [scriptUrl]);

  // Inisialisasi slot saat load & polling berkala setiap 25 detik
  useEffect(() => {
    let isMounted = true;
    const runFetch = async () => {
      if (isMounted) {
        await fetchSlots();
      }
    };
    runFetch();
    const interval = setInterval(() => {
      if (isMounted) {
        fetchSlots();
      }
    }, 25000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [fetchSlots]);

  // Callback penanganan token dari Google Identity Services
  const handleCredentialResponse = useCallback((response: GoogleCredentialResponse) => {
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
  }, []);

  // Inisialisasi Google GIS (hanya initialize jika slot masih tersedia)
  const initGoogleSignIn = useCallback(() => {
    if (typeof window === "undefined" || !window.google || !clientId) {
      return;
    }
    if (slots[bookingType]?.isFull) {
      return;
    }

    try {
      if (!isInitializedRef.current) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
        });
        isInitializedRef.current = true;
      }

      const btnContainer = btnContainerRef.current || document.getElementById("googleSignInBtn");
      if (btnContainer && !googleUser) {
        btnContainer.innerHTML = "";
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
      console.error("Inisialisasi Google SDK error:", e);
    }
  }, [clientId, handleCredentialResponse, googleUser, slots, bookingType]);

  // Poller untuk memastikan Google SDK segera di-render saat script selesai dimuat
  useEffect(() => {
    if (!slots[bookingType]?.isFull && !googleUser && typeof window !== "undefined" && window.google) {
      initGoogleSignIn();
    }

    const interval = setInterval(() => {
      if (!slots[bookingType]?.isFull && !googleUser && typeof window !== "undefined" && window.google) {
        initGoogleSignIn();
      }
    }, 300);

    const timer = setTimeout(() => {
      clearInterval(interval);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [bookingType, slots, googleUser, initGoogleSignIn]);

  // Tombol simulasi demo jika Client ID belum dikonfigurasi di .env
  const handleDemoSignIn = () => {
    const demoUser = {
      name: "Pengunjung Demo KHFF",
      email: "pengunjung.demo@gmail.com",
      picture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    };
    setGoogleUser(demoUser);
    setFullName(demoUser.name);
    setFullName2("Teman Pengunjung Demo");
    setStatusState(null);
  };

  const handleSignOut = () => {
    setGoogleUser(null);
    setFullName("");
    setFullName2("");
    setStatusState(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleUser) return;

    // 1. Cek ketersediaan kuota slot
    if (slots[bookingType]?.isFull) {
      setStatusState({
        type: "full",
        message: `Mohon maaf, kuota pemesanan untuk ${
          bookingType === "becak" ? "Becak Drive-In" : "Kursi Drive-In"
        } sudah penuh. Silakan pilih jenis tempat duduk yang masih tersedia.`,
      });
      return;
    }

    // 2. Validasi nama penumpang 1 / penonton
    if (!fullName.trim() && !googleUser.name) {
      setStatusState({
        type: "error",
        message: bookingType === "becak" 
          ? "Silakan masukkan nama lengkap penumpang 1." 
          : "Silakan masukkan nama lengkap penonton (kursi reguler).",
      });
      return;
    }

    // 3. Validasi nama penumpang 2 HANYA jika bookingType === "becak"
    if (bookingType === "becak" && !fullName2.trim()) {
      setStatusState({
        type: "error",
        message: "Silakan masukkan nama lengkap penumpang 2 untuk unit becak.",
      });
      return;
    }

    // 4. Validasi nomor WhatsApp
    if (!whatsapp.trim() || whatsapp.trim().length < 9) {
      setStatusState({
        type: "error",
        message: "Silakan masukkan nomor WhatsApp yang valid (minimal 9 digit).",
      });
      return;
    }

    // 5. Validasi persetujuan kehadiran
    if (!agreed) {
      setStatusState({
        type: "error",
        message: "Harap setujui ketentuan kehadiran sebelum melanjutkan pendaftaran.",
      });
      return;
    }

    setLoading(true);
    setStatusState(null);

    const payload = {
      type: bookingType,
      name: fullName.trim() || googleUser.name,
      name2: bookingType === "becak" ? fullName2.trim() : "",
      email: googleUser.email,
      whatsapp: whatsapp.trim(),
      passengers: bookingType === "becak" ? "2" : "1",
    };

    // Mode jika Apps Script URL belum diset: berikan simulasi sukses yang jelas
    if (!scriptUrl) {
      setTimeout(() => {
        setLoading(false);
        const prefix = bookingType === "becak" ? "KHFF-BCK-" : "KHFF-KRS-";
        const code = prefix + Math.floor(1000 + Math.random() * 9000);
        setStatusState({
          type: "success",
          message: `Mode Pengujian: Pendaftaran ${
            bookingType === "becak" ? "Becak" : "Kursi"
          } Drive-In Cinema berhasil disimulasikan! Hubungkan URL Google Apps Script pada NEXT_PUBLIC_DRIVE_IN_SCRIPT_URL untuk menyimpan data langsung ke tab spreadsheet.`,
          regCode: code,
          bookingType: bookingType,
          name: payload.name,
          name2: payload.name2,
        });

        // Kurangi slot secara lokal untuk preview
        setSlots((prev) => {
          const currentSlot = prev[bookingType];
          const newUsed = currentSlot.used + 1;
          const newAvail = Math.max(0, currentSlot.total - newUsed);
          return {
            ...prev,
            [bookingType]: {
              ...currentSlot,
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

      if (result.status === "success") {
        setStatusState({
          type: "success",
          message: result.message || "Pendaftaran Anda telah berhasil terkonfirmasi!",
          regCode: result.data?.registrationCode,
          bookingType: bookingType,
          name: payload.name,
          name2: payload.name2,
        });
        fetchSlots(); // Refresh live slots
      } else if (result.status === "duplicate") {
        setStatusState({
          type: "duplicate",
          message: result.message || "Akun Google ini sudah pernah terdaftar dalam program Drive-In Cinema.",
        });
      } else if (result.status === "full") {
        setStatusState({
          type: "full",
          message: result.message || "Mohon maaf, kuota pemesanan untuk jenis ini sudah penuh.",
        });
        fetchSlots(); // Refresh live slots
      } else {
        let errMsg = result.message || "Terjadi kesalahan saat memproses pendaftaran.";
        // Peringatan jika deployment Google Apps Script belum diperbarui ke versi multi-tab
        if (bookingType === "kursi" && errMsg.toLowerCase().includes("penumpang 2")) {
          errMsg = "Backend Google Apps Script belum diperbarui ke versi multi-tab terbaru. Buka Apps Script, simpan Code.gs terbaru, dan pilih Deploy > Manage deployments > Edit > New version.";
        }
        setStatusState({
          type: "error",
          message: errMsg,
        });
      }
    } catch (err: unknown) {
      console.error("Gagal mengirim form pendaftaran:", err);
      setStatusState({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal memproses pendaftaran. Silakan periksa koneksi internet Anda atau coba sesaat lagi.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-28 bg-khff-navy text-khff-cream font-sans relative overflow-hidden">
      {/* Script Google Identity Services */}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          if (!slots[bookingType]?.isFull) {
            initGoogleSignIn();
          }
        }}
      />

      {/* Decorative Character Artworks */}
      <div className="absolute top-24 right-0 opacity-15 w-80 pointer-events-none z-0 hidden lg:block">
        <img src="/assets/illustrations/cahaya.png" alt="" className="w-full h-auto" />
      </div>
      <div className="absolute bottom-10 left-0 opacity-15 w-72 pointer-events-none z-0 hidden lg:block">
        <img src="/assets/illustrations/geni.png" alt="" className="w-full h-auto" />
      </div>

      <div className="container mx-auto px-5 sm:px-6 max-w-5xl relative z-10">
        {/* Navigation Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 bg-white/10 border border-khff-cream/20 px-5 py-2 rounded-full text-khff-cream hover:bg-khff-yellow hover:text-khff-navy font-mono text-xs sm:text-sm font-black transition-all shadow-md mb-8 group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          KEMBALI KE BERANDA
        </Link>

        {/* Development Setup Alert (jika env belum dikonfigurasi) */}
        {(!clientId || !scriptUrl) && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-khff-yellow/10 border border-khff-yellow/30 text-khff-cream flex items-start gap-3 backdrop-blur-sm shadow-md">
            <Info size={22} className="text-khff-yellow shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed">
              <strong className="text-khff-yellow block font-mono uppercase tracking-wider mb-1">
                Petunjuk Setup Developer:
              </strong>
              {!clientId && (
                <p className="mb-1 text-khff-cream/90">
                  • <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> belum diset di <code>.env.local</code>. Anda dapat menggunakan tombol <strong>Simulasi Login Demo</strong> di bawah untuk menguji alur form.
                </p>
              )}
              {!scriptUrl && (
                <p className="text-khff-cream/90">
                  • <code>NEXT_PUBLIC_DRIVE_IN_SCRIPT_URL</code> belum diset. Form akan berjalan dalam mode simulasi.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Kolom Kiri: Informasi Acara & Status Kuota Live */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-khff-cream/20 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
              <span className="inline-block px-3.5 py-1 rounded-full bg-khff-pink text-white font-mono text-[11px] font-black tracking-[0.25em] uppercase mb-4 shadow-sm">
                Special Program
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-black text-white mb-4 leading-tight">
                Drive-In Cinema
              </h1>
              <p className="text-khff-cream/90 text-sm leading-relaxed mb-6">
                Menghadirkan pengalaman unik menikmati sajian sinema lokal di bawah langit malam Kotabaru dengan dua pilihan tempat duduk: Becak dan Kursi Penonton Reguler.
              </p>

              {/* Status Kuota Realtime Card di Kolom Kiri */}
              <div className="mb-6 p-4 rounded-2xl bg-black/30 border border-khff-cream/15">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-khff-yellow uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Ketersediaan Slot Live
                  </div>
                  <button
                    type="button"
                    onClick={fetchSlots}
                    disabled={loadingSlots}
                    title="Refresh Kuota"
                    className="p-1 rounded hover:bg-white/10 text-khff-cream/60 hover:text-white transition-colors"
                  >
                    <RefreshCw size={13} className={loadingSlots ? "animate-spin text-khff-yellow" : ""} />
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Slot Becak */}
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-white font-bold flex items-center gap-1.5">
                        <Bike size={14} className="text-khff-yellow" /> Becak (2 orang)
                      </span>
                      <span className={`font-bold ${slots.becak.isFull ? "text-red-400" : "text-emerald-400"}`}>
                        {slots.becak.isFull ? "SOLD OUT" : `Sisa ${slots.becak.available} / 50`}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full ${slots.becak.isFull ? "bg-red-400" : "bg-emerald-400"}`}
                        style={{ width: `${Math.min(100, ((27 + slots.becak.used) / 50) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Slot Kursi */}
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-white font-bold flex items-center gap-1.5">
                        <Armchair size={14} className="text-khff-pink" /> Kursi (1 orang)
                      </span>
                      <span className={`font-bold ${slots.kursi.isFull ? "text-red-400" : "text-emerald-400"}`}>
                        {slots.kursi.isFull ? "SOLD OUT" : `Sisa ${slots.kursi.available} / 80`}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full ${slots.kursi.isFull ? "bg-red-400" : "bg-emerald-400"}`}
                        style={{ width: `${Math.min(100, ((40 + slots.kursi.used) / 80) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {lastRefreshed && (
                  <span className="text-[10px] font-mono text-khff-cream/40 block mt-2.5 text-right">
                    Terakhir dicek: {lastRefreshed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </span>
                )}
              </div>

              {/* Event Metadata List */}
              <div className="space-y-4 border-t border-khff-cream/15 pt-6 text-xs sm:text-sm font-mono">
                <div className="flex items-start gap-3 text-khff-cream">
                  <Calendar size={18} className="text-khff-yellow shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-white">Kamis, 17 September 2026</span>
                    <span className="text-khff-cream/70 text-xs">Pukul 17.30 – 22.00 WIB</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-khff-cream">
                  <MapPin size={18} className="text-khff-pink shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-white">Halaman Pasar Terban</span>
                    <span className="text-khff-cream/70 text-xs">Jl. C. Simanjuntak, Terban, Gondokusuman, Yogyakarta</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-khff-cream">
                  <Users size={18} className="text-khff-cream shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-white">Pilihan Tempat Duduk</span>
                    <span className="text-khff-cream/70 text-xs leading-relaxed block">
                      • <strong>Becak</strong>: Tersedia 23/50 Slot (2 orang/unit)<br />
                      • <strong>Kursi Reguler</strong>: Tersedia 40/80 Slot (1 orang/kursi)
                    </span>
                  </div>
                </div>
              </div>

              {/* Ketentuan Pendaftaran Box */}
              <div className="mt-6 p-4 rounded-2xl bg-black/20 border border-khff-cream/10 text-xs text-khff-cream/80 space-y-1.5 leading-relaxed">
                <p className="font-bold text-khff-yellow uppercase tracking-wider font-mono">Ketentuan Pendaftaran:</p>
                <p>• Pendaftaran tidak dipungut biaya (Gratis).</p>
                <p>• <strong>1 Akun Google hanya berlaku untuk 1 kali pemesanan.</strong></p>
                <p>• Harap hadir sebelum pukul 18.45 WIB untuk proses registrasi ulang di lokasi.</p>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Form Pendaftaran Interaktif */}
          <div className="lg:col-span-7">
            <div className="bg-white/5 border border-khff-cream/20 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md relative">
              
              {/* TAMPILAN JIKA BERHASIL MENDAFTAR */}
              {statusState?.type === "success" ? (
                <div className="text-center py-4 sm:py-6">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                    <CheckCircle2 size={42} className="text-emerald-400" />
                  </div>

                  <span className="text-xs font-mono tracking-[0.25em] text-emerald-400 font-bold uppercase block mb-1">
                    Registrasi Terkonfirmasi
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-white mb-3">
                    Tiket {statusState.bookingType === "becak" ? "Becak" : "Kursi"} Drive-In Berhasil Dipesan!
                  </h2>
                  <p className="text-khff-cream/80 text-sm leading-relaxed max-w-md mx-auto mb-6">
                    {statusState.message}
                  </p>

                  {/* Tiket Digital Card */}
                  <div className="bg-gradient-to-r from-khff-navy via-[#1f4040] to-khff-navy border-2 border-khff-yellow/40 rounded-2xl p-5 sm:p-6 text-left max-w-md mx-auto mb-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-khff-yellow text-khff-navy text-[10px] font-mono font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                      E-Ticket • {statusState.bookingType === "becak" ? "Becak" : "Kursi"}
                    </div>
                    
                    <div className="flex items-center gap-2 text-khff-yellow font-mono text-xs font-bold mb-4">
                      <Ticket size={16} /> KODE REGISTRASI
                    </div>
                    <div className="text-2xl sm:text-3xl font-mono font-black text-white tracking-widest mb-4">
                      {statusState.regCode || "KHFF-CONFIRMED"}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs border-t border-white/10 pt-4 font-mono">
                      <div>
                        <span className="text-khff-cream/50 uppercase block">
                          {statusState.bookingType === "becak" ? "Penumpang 1" : "Nama Penonton"}
                        </span>
                        <span className="text-white font-bold truncate block">{statusState.name || fullName || googleUser?.name}</span>
                      </div>
                      
                      {statusState.bookingType === "becak" ? (
                        <div>
                          <span className="text-khff-cream/50 uppercase block">Penumpang 2</span>
                          <span className="text-white font-bold truncate block">{statusState.name2 || fullName2}</span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-khff-cream/50 uppercase block">Kategori</span>
                          <span className="text-khff-yellow font-bold block">Kursi Reguler</span>
                        </div>
                      )}

                      <div>
                        <span className="text-khff-cream/50 uppercase block">Alokasi Tempat</span>
                        <span className="text-khff-yellow font-bold block">
                          {statusState.bookingType === "becak" ? "1 Unit Becak (2 Org)" : "1 Tempat Duduk (1 Org)"}
                        </span>
                      </div>

                      <div>
                        <span className="text-khff-cream/50 uppercase block">Email Akun</span>
                        <span className="text-white font-bold truncate block">{googleUser?.email}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-khff-cream/60 font-mono mb-6">
                    *Tunjukkan kode registrasi ini kepada petugas di meja registrasi Pasar Terban.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center gap-2 bg-khff-yellow text-khff-navy hover:bg-white font-mono font-black px-8 py-3.5 rounded-full text-sm transition-all shadow-lg cursor-pointer"
                    >
                      KEMBALI KE BERANDA
                    </Link>
                  </div>
                </div>
              ) : (
                /* FORM PENDAFTARAN */
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* SECTION STEP 1: PILIH JENIS TEMPAT DUDUK (BECAK / KURSI) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-mono font-black uppercase tracking-wider text-khff-yellow flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-khff-yellow text-khff-navy inline-flex items-center justify-center text-xs">
                          1
                        </span>
                        Pilih Jenis Tempat Duduk
                      </h3>
                      <span className="text-[11px] font-mono text-khff-cream/60 flex items-center gap-1">
                        <Clock size={12} className="text-khff-yellow" /> Kuota Realtime
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Kartu Pilihan 1: Becak Drive-In */}
                      <div
                        onClick={() => {
                          if (!slots.becak.isFull) {
                            setBookingType("becak");
                            setStatusState(null);
                          }
                        }}
                        className={`relative rounded-2xl p-4 sm:p-5 border-2 transition-all duration-300 flex flex-col justify-between ${
                          slots.becak.isFull 
                            ? "opacity-50 cursor-not-allowed bg-black/30 border-white/10"
                            : bookingType === "becak"
                              ? "bg-khff-yellow/15 border-khff-yellow shadow-[0_0_25px_rgba(243,153,32,0.25)] cursor-pointer"
                              : "bg-white/5 border-white/15 hover:border-white/35 cursor-pointer"
                        }`}
                      >
                        {/* Sold Out Overlay Badge */}
                        {slots.becak.isFull && (
                          <span className="absolute top-3 right-3 bg-red-500 text-white font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                            SOLD OUT
                          </span>
                        )}

                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              bookingType === "becak" && !slots.becak.isFull
                                ? "bg-khff-yellow text-khff-navy"
                                : "bg-white/10 text-khff-cream"
                            }`}>
                              <Bike size={20} />
                            </div>
                            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-khff-cream/90 border border-white/10">
                              Maks. 2 Orang
                            </span>
                          </div>

                          <h4 className="text-base font-serif font-black text-white mb-1">
                            Becak Drive-In
                          </h4>
                          <p className="text-xs text-khff-cream/70 leading-relaxed mb-4">
                            Menonton sinema langsung dari atas becak (1 unit becak untuk 2 orang penumpang).
                          </p>
                        </div>

                        {/* Indikator Kuota Realtime */}
                        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                          <span className="text-khff-cream/60">Sisa Kuota:</span>
                          <span className={`font-bold flex items-center gap-1.5 ${
                            slots.becak.isFull ? "text-red-400" : "text-emerald-400"
                          }`}>
                            {!slots.becak.isFull && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                            {slots.becak.isFull ? "0 / 50 (Penuh)" : `${slots.becak.available} dari 50 Unit`}
                          </span>
                        </div>
                      </div>

                      {/* Kartu Pilihan 2: Kursi Drive-In */}
                      <div
                        onClick={() => {
                          if (!slots.kursi.isFull) {
                            setBookingType("kursi");
                            setFullName2("");
                            setStatusState(null);
                          }
                        }}
                        className={`relative rounded-2xl p-4 sm:p-5 border-2 transition-all duration-300 flex flex-col justify-between ${
                          slots.kursi.isFull 
                            ? "opacity-50 cursor-not-allowed bg-black/30 border-white/10"
                            : bookingType === "kursi"
                              ? "bg-khff-yellow/15 border-khff-yellow shadow-[0_0_25px_rgba(243,153,32,0.25)] cursor-pointer"
                              : "bg-white/5 border-white/15 hover:border-white/35 cursor-pointer"
                        }`}
                      >
                        {/* Sold Out Overlay Badge */}
                        {slots.kursi.isFull && (
                          <span className="absolute top-3 right-3 bg-red-500 text-white font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                            SOLD OUT
                          </span>
                        )}

                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              bookingType === "kursi" && !slots.kursi.isFull
                                ? "bg-khff-yellow text-khff-navy"
                                : "bg-white/10 text-khff-cream"
                            }`}>
                              <Armchair size={20} />
                            </div>
                            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-khff-cream/90 border border-white/10">
                              1 Orang / Kursi
                            </span>
                          </div>

                          <h4 className="text-base font-serif font-black text-white mb-1">
                            Kursi Drive-In
                          </h4>
                          <p className="text-xs text-khff-cream/70 leading-relaxed mb-4">
                            Tempat duduk reguler di area penonton terbuka untuk 1 orang per pendaftaran.
                          </p>
                        </div>

                        {/* Indikator Kuota Realtime */}
                        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                          <span className="text-khff-cream/60">Sisa Kuota:</span>
                          <span className={`font-bold flex items-center gap-1.5 ${
                            slots.kursi.isFull ? "text-red-400" : "text-emerald-400"
                          }`}>
                            {!slots.kursi.isFull && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                            {slots.kursi.isFull ? "0 / 80 (Penuh)" : `${slots.kursi.available} dari 80 Kursi`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION STEP 2: GOOGLE AUTH */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-mono font-black uppercase tracking-wider text-khff-yellow flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-khff-yellow text-khff-navy inline-flex items-center justify-center text-xs">
                          2
                        </span>
                        Verifikasi Akun Google
                      </h3>
                      {slots[bookingType]?.isFull ? (
                        <span className="text-xs text-red-400 font-mono font-bold">
                          Slot Penuh
                        </span>
                      ) : googleUser ? (
                        <span className="text-xs text-emerald-400 font-mono inline-flex items-center gap-1 font-bold">
                          <ShieldCheck size={14} /> Terverifikasi
                        </span>
                      ) : null}
                    </div>

                    {slots[bookingType]?.isFull ? (
                      /* Slot Full Banner */
                      <div className="p-6 rounded-2xl bg-red-500/10 border-2 border-red-500/30 text-center space-y-2">
                        <div className="inline-flex items-center gap-2 text-red-300 font-mono text-xs font-bold uppercase tracking-wider">
                          <AlertCircle size={16} /> Kuota {bookingType === "becak" ? "Becak Drive-In" : "Kursi Drive-In"} Penuh
                        </div>
                        <p className="text-xs text-red-200 leading-relaxed max-w-md mx-auto">
                          Seluruh kuota tiket untuk {bookingType === "becak" ? "Becak Drive-In" : "Kursi Drive-In"} telah habis (Sold Out).
                          {(!slots.becak.isFull || !slots.kursi.isFull) && (
                            <span className="block mt-1.5 text-khff-yellow font-bold">
                              Silakan pilih opsi {bookingType === "becak" ? "Kursi Drive-In" : "Becak Drive-In"} pada pilihan di atas yang masih tersedia.
                            </span>
                          )}
                        </p>
                      </div>
                    ) : !googleUser ? (
                      <div className="p-6 rounded-2xl bg-white/5 border border-khff-cream/15 text-center">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3 text-khff-yellow">
                          <ShieldCheck size={26} />
                        </div>
                        <h4 className="text-base font-serif font-bold text-white mb-1.5">
                          Masuk dengan Akun Google
                        </h4>
                        <p className="text-xs text-khff-cream/75 max-w-sm mx-auto mb-5 leading-relaxed">
                          Sistem menggunakan Google Sign-In untuk memastikan identitas valid dan mencegah spam serta duplikasi pengisian form.
                        </p>

                        {/* Tombol Resmi Google GIS */}
                        <div className="flex justify-center mb-3">
                          <div ref={btnContainerRef} id="googleSignInBtn" className="min-h-[44px] flex items-center justify-center" />
                        </div>

                        {/* Tombol Demo Fallback jika belum pasang Client ID */}
                        {(!clientId || clientId.includes("YOUR_GOOGLE_CLIENT_ID")) && (
                          <div className="pt-3 border-t border-white/10">
                            <button
                              type="button"
                              onClick={handleDemoSignIn}
                              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-khff-cream/20 text-khff-cream px-5 py-2.5 rounded-full font-mono text-xs font-bold transition-all cursor-pointer shadow-md"
                            >
                              <Sparkles size={14} className="text-khff-yellow" />
                              Simulasi Login Google (Mode Pengujian)
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Akun Terhubung Card */
                      <div className="p-4 rounded-2xl bg-white/10 border border-emerald-500/40 flex items-center justify-between gap-4 shadow-inner">
                        <div className="flex items-center gap-3.5 overflow-hidden">
                          {googleUser.picture ? (
                            <img
                              src={googleUser.picture}
                              alt={googleUser.name}
                              className="w-11 h-11 rounded-full border-2 border-khff-yellow shrink-0 object-cover"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-khff-yellow text-khff-navy font-bold flex items-center justify-center shrink-0">
                              {googleUser.name.charAt(0)}
                            </div>
                          )}
                          <div className="truncate">
                            <span className="text-sm font-bold text-white block truncate leading-snug">
                              {googleUser.name}
                            </span>
                            <span className="text-xs text-khff-cream/70 font-mono block truncate">
                              {googleUser.email}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleSignOut}
                          title="Ganti Akun Google"
                          className="text-xs font-mono text-khff-cream/60 hover:text-khff-pink flex items-center gap-1.5 p-2 rounded-lg hover:bg-white/5 transition-colors shrink-0 cursor-pointer"
                        >
                          <LogOut size={14} />
                          <span className="hidden sm:inline">Ganti</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* SECTION STEP 3: FORM DATA PENDAFTARAN */}
                  <div className={`space-y-4 pt-2 transition-all duration-300 ${slots[bookingType]?.isFull || !googleUser ? "opacity-35 pointer-events-none filter blur-[1px]" : "opacity-100"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-mono font-black uppercase tracking-wider text-khff-yellow flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-khff-yellow text-khff-navy inline-flex items-center justify-center text-xs">
                          3
                        </span>
                        Data Diri Pendaftar ({bookingType === "becak" ? "Becak" : "Kursi Reguler"})
                      </h3>
                      {slots[bookingType]?.isFull ? (
                        <span className="text-[11px] font-mono text-red-400 font-bold">
                          (Slot Penuh)
                        </span>
                      ) : !googleUser ? (
                        <span className="text-[11px] font-mono text-khff-cream/50">
                          (Buka setelah verifikasi Google)
                        </span>
                      ) : null}
                    </div>

                    {/* Nama Lengkap Penumpang 1 / Penonton */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-khff-cream/80 font-bold mb-1.5 flex items-center gap-1.5">
                        <User size={13} className="text-khff-yellow" />
                        {bookingType === "becak" ? "Nama Lengkap Penumpang 1 *" : "Nama Lengkap Penonton (Kursi Reguler) *"}
                      </label>
                      <input
                        type="text"
                        required
                        disabled={!googleUser}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={bookingType === "becak" ? "Nama lengkap penumpang pertama" : "Nama lengkap penonton / penumpang 1"}
                        className="w-full bg-black/40 border border-khff-cream/20 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-khff-yellow focus:outline-none font-sans text-sm transition-colors"
                      />
                    </div>

                    {/* Nama Lengkap Penumpang 2 (HANYA DITAMPILKAN JIKA MEMILIH BECAK) */}
                    {bookingType === "becak" && (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="block text-xs font-mono uppercase tracking-wider text-khff-cream/80 font-bold mb-1.5 flex items-center gap-1.5">
                          <User size={13} className="text-khff-pink" />
                          Nama Lengkap Penumpang 2 *
                        </label>
                        <input
                          type="text"
                          required
                          disabled={!googleUser}
                          value={fullName2}
                          onChange={(e) => setFullName2(e.target.value)}
                          placeholder="Nama lengkap penumpang kedua"
                          className="w-full bg-black/40 border border-khff-cream/20 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-khff-yellow focus:outline-none font-sans text-sm transition-colors"
                        />
                        <span className="text-[11px] font-mono text-khff-cream/50 mt-1 block">
                          *1 unit becak diisi oleh 2 orang penumpang.
                        </span>
                      </div>
                    )}

                    {/* Email Google (Terkunci) */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-khff-cream/80 font-bold mb-1.5">
                        Email Google Terverifikasi (Terkunci)
                      </label>
                      <input
                        type="email"
                        readOnly
                        value={googleUser?.email || ""}
                        placeholder="Email otomatis terisi dari Google"
                        className="w-full bg-black/20 border border-khff-cream/10 rounded-xl px-4 py-3 text-khff-cream/60 font-mono text-xs sm:text-sm cursor-not-allowed"
                      />
                      <span className="text-[11px] font-mono text-khff-cream/50 mt-1 block">
                        *1 Akun Google hanya bisa digunakan untuk 1 kali pendaftaran.
                      </span>
                    </div>

                    {/* Nomor WhatsApp */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-khff-cream/80 font-bold mb-1.5">
                        Nomor WhatsApp Aktif *
                      </label>
                      <input
                        type="tel"
                        required
                        disabled={!googleUser}
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="Contoh: 081234567890"
                        className="w-full bg-black/40 border border-khff-cream/20 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-khff-yellow focus:outline-none font-mono text-sm transition-colors"
                      />
                      <span className="text-[11px] font-mono text-khff-cream/50 mt-1 block">
                        *Untuk konfirmasi tiket dan informasi kedatangan di lokasi.
                      </span>
                    </div>

                    {/* Ringkasan Alokasi Tempat */}
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-khff-cream/80 flex items-center justify-between">
                      <span className="text-khff-cream/60">Alokasi Tiket:</span>
                      <span className="font-bold text-khff-yellow">
                        {bookingType === "becak" ? "1 Unit Becak (2 Orang Penumpang)" : "1 Tempat Duduk / Kursi (1 Orang)"}
                      </span>
                    </div>

                    {/* Checkbox Persetujuan */}
                    <div className="pt-2">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          disabled={!googleUser}
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                          className="mt-1 w-4 h-4 rounded border-khff-cream/40 bg-black/40 text-khff-yellow focus:ring-khff-yellow cursor-pointer"
                        />
                        <span className="text-xs text-khff-cream/80 leading-relaxed font-sans group-hover:text-white transition-colors">
                          Saya bersedia hadir di Halaman Pasar Terban sebelum pukul 18.45 WIB dan memahami bahwa keterlambatan dapat mengakibatkan slot pemesanan dialihkan kepada pengunjung antrean on-the-spot.
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* BANNER NOTIFIKASI ERROR / DUPLIKASI / FULL */}
                  {statusState && (
                    <div className={`flex items-start gap-3 p-4 rounded-2xl border text-sm leading-relaxed ${
                      statusState.type === "duplicate" 
                        ? "bg-amber-500/15 border-amber-500/40 text-amber-200" 
                        : statusState.type === "full"
                          ? "bg-orange-500/15 border-orange-500/40 text-orange-200"
                          : "bg-red-500/15 border-red-500/40 text-red-200"
                    }`}>
                      <AlertCircle size={20} className="shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-mono uppercase text-xs tracking-wider mb-0.5">
                          {statusState.type === "duplicate" 
                            ? "Pendaftaran Ganda Ditemukan" 
                            : statusState.type === "full"
                              ? "Kuota Slot Penuh"
                              : "Terjadi Kendala"}
                        </strong>
                        <span>{statusState.message}</span>
                      </div>
                    </div>
                  )}

                  {/* TOMBOL SUBMIT */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={!googleUser || loading || slots[bookingType]?.isFull}
                      className="w-full bg-khff-yellow text-khff-navy hover:bg-khff-pink hover:text-white disabled:opacity-40 disabled:hover:bg-khff-yellow disabled:hover:text-khff-navy font-mono font-black text-sm sm:text-base py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-xl hover:shadow-[0_0_30px_rgba(225,76,113,0.4)] disabled:cursor-not-allowed uppercase tracking-wider"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>MEMPROSES PENDAFTARAN...</span>
                        </>
                      ) : slots[bookingType]?.isFull ? (
                        <>
                          <AlertCircle size={18} />
                          <span>KUOTA {bookingType === "becak" ? "BECAK" : "KURSI"} SUDAH PENUH</span>
                        </>
                      ) : (
                        <>
                          <Ticket size={18} />
                          <span>KIRIM PENDAFTARAN {bookingType === "becak" ? "BECAK" : "KURSI"} SEKARANG</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
