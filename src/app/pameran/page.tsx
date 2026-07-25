"use client";

import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";

export default function PameranPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-black flex items-center justify-center">
      <div className="container mx-auto px-6 text-center">
        <MapPin size={64} className="text-white/20 mx-auto mb-6" />
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
          Pameran Karya
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
          Detail 5 tim eksibisi dan lokasi instalasi seni di area Kotabaru akan segera diumumkan.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 text-white border border-white px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all">
          <ArrowLeft size={20} /> Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
