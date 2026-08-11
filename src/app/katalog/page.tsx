// src/app/katalog/page.tsx
import type { Metadata } from "next";
import KatalogClientPage from "./katalog-client-page";

export const metadata: Metadata = {
  title: "Katalog",
};

export default function KatalogPage() {
  return <KatalogClientPage />;
}
