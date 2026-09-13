import { Metadata } from "next";
import { Suspense } from "react";
import TiketClientPage from "./tiket-client-page";

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

export default function TiketPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-khff-navy text-khff-cream flex items-center justify-center font-mono">
          <div className="animate-pulse text-khff-yellow flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-khff-yellow animate-ping" />
            <span>Memuat sistem registrasi tiket...</span>
          </div>
        </div>
      }
    >
      <TiketClientPage />
    </Suspense>
  );
}
