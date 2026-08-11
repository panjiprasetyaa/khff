// src/app/galeri/page.tsx
import type { Metadata } from "next";
import GaleriClientPage from "./galeri-client-page";

export const metadata: Metadata = {
  title: "Galeri",
};

export default function GaleriPage() {
  return <GaleriClientPage />;
}
