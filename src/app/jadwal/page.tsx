// src/app/jadwal/page.tsx
import type { Metadata } from "next";
import JadwalClientPage from "./jadwal-client-page";

export const metadata: Metadata = {
  title: "Jadwal",
};

export default function JadwalPage() {
  return <JadwalClientPage />;
}
