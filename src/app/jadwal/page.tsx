// src/app/jadwal/page.tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import JadwalClientPage from "./jadwal-client-page";

export const metadata: Metadata = {
  title: "Jadwal Festival | KHFF 2026",
  description:
    "Jadwal lengkap pemutaran film, talkshow, workshop, dan seremoni di Kotabaru Heritage Film Festival 2026.",
};

export default function JadwalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-khff-navy flex items-center justify-center text-khff-cream font-mono">
          Memuat jadwal...
        </div>
      }
    >
      <JadwalClientPage />
    </Suspense>
  );
}

