import { Metadata } from "next";
import { Suspense } from "react";
import RegistrasiClientPage from "./registrasi-client-page";

export const metadata: Metadata = {
  title: "Registrasi Tiket Program - Kotabaru Heritage Film Festival 2026",
  description:
    "Registrasi tiket resmi gratis untuk pemutaran program kompetisi, non-kompetisi, dan temu wicara Kotabaru Heritage Film Festival 2026 di PDIN Yogyakarta. Kuota terbatas 20 slot per sesi.",
  openGraph: {
    title: "Registrasi Tiket Program | Kotabaru Heritage Film Festival 2026",
    description:
      "Registrasi tiket resmi gratis untuk pemutaran program kompetisi, non-kompetisi, dan temu wicara Kotabaru Heritage Film Festival 2026 di PDIN Yogyakarta.",
  },
};

export default function RegistrasiPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B2027] text-khff-cream flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden">
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
            <h2 className="text-xl sm:text-2xl font-serif font-black text-khff-cream mb-4 tracking-wider drop-shadow-sm">
              Memuat...
            </h2>
            <div className="w-64 sm:w-80 h-2 bg-white/10 rounded-full overflow-hidden relative shadow-inner border border-white/5">
              <div className="absolute top-0 bottom-0 bg-gradient-to-r from-transparent via-khff-yellow to-transparent w-40 rounded-full animate-progress-slide shadow-[0_0_12px_rgba(238,173,47,0.8)]" />
            </div>
          </div>
        </div>
      }
    >
      <RegistrasiClientPage />
    </Suspense>
  );
}
