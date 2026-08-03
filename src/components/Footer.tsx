import Link from "next/link";
import { AtSign, Mail, MapPin, Film, Sparkles } from "lucide-react";

export default function Footer() {
  const sponsors = [
    { id: 1, name: "Jogja Istimewa", logo: "/assets/sponsor/jogja_istimewa-removebg-preview.png" },
    { id: 2, name: "Kotabaru Heritage", logo: "/assets/sponsor/logo kotabaru.png" },
    { id: 3, name: "Dinas Pendidikan YK", logo: "/assets/sponsor/logo_sponsor_dinas_pendidikan_yk-removebg-preview.png" },
    { id: 4, name: "Official Partner", logo: "/assets/sponsor/Screenshot_2026-08-02_000140-removebg-preview.png" },
  ];

  return (
    <footer className="bg-khff-navy text-khff-cream py-20 border-t border-khff-cream/20 font-sans relative overflow-hidden">
      {/* Decorative asset overlay */}
      <div className="hidden md:block absolute -bottom-10 -right-10 opacity-10 pointer-events-none w-80">
        <img src="/assets/karakter/gong.png" alt="Gong" className="w-full h-auto" />
      </div>
      <div className="hidden md:block absolute top-10 left-10 opacity-10 pointer-events-none w-64">
        <img src="/assets/karakter/kendhang.png" alt="Kendhang" className="w-full h-auto" />
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
        {/* Sponsors & Partners */}
        <div className="mb-20 text-center border-b border-khff-cream/10 pb-16">
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-khff-yellow mb-8 block font-black">
            Supported By & Official Media Partners
          </span>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className="p-4 bg-white/5 border border-khff-cream/15 rounded-2xl flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:-translate-y-1.5 hover:border-khff-yellow/50 shadow-lg group min-w-[140px] md:min-w-[180px] h-24 md:h-28"
              >
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="h-12 md:h-16 max-w-[85%] w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 text-left mb-16">
          <div className="md:col-span-4 space-y-6">
            <div className="inline-block">
              <h2 className="text-4xl font-serif font-black text-khff-yellow tracking-tight">
                KHFF 2026.
              </h2>
              <span className="text-xs font-mono tracking-widest text-khff-pink uppercase font-bold block mt-1">
                Kotabaru Heritage Film Festival
              </span>
            </div>
            <p className="text-base text-khff-cream/80 max-w-sm font-medium leading-relaxed">
              Merayakan persilangan sinema dan sejarah di jantung Yogyakarta. Wadah apresiasi karya sineas nusantara, pengarsipan budaya, dan hiburan rakyat.
            </p>
          </div>

          <div className="md:col-span-4 space-y-4 flex flex-col items-start w-full overflow-hidden">
            <h4 className="text-khff-yellow font-mono font-black mb-2 uppercase tracking-widest text-sm">
              Contact
            </h4>
            <a href="mailto:kotabaruheritagefilmfestival@gmail.com" className="flex items-start gap-3 text-khff-cream/90 hover:text-khff-pink transition-colors font-medium w-full">
              <Mail size={18} className="text-khff-pink shrink-0 mt-1" />
              <span className="break-all sm:break-normal text-left">kotabaruheritagefilmfestival@gmail.com</span>
            </a>
            <a href="https://instagram.com/kotabaruheritagefilmfestival" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-khff-cream/90 hover:text-khff-pink transition-colors font-medium w-full">
              <AtSign size={18} className="text-khff-yellow shrink-0 mt-1" />
              <span className="break-all sm:break-normal text-left">@kotabaruheritagefilmfestival</span>
            </a>
          </div>

          <div className="md:col-span-4 space-y-4 flex flex-col items-start w-full">
            <h4 className="text-khff-yellow font-mono font-black mb-2 uppercase tracking-widest text-sm">
              Festival Venue
            </h4>
            <div className="space-y-4 text-sm text-khff-cream/90 font-medium leading-relaxed w-full">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="shrink-0 mt-1 text-khff-pink" />
                <div>
                  <p className="font-bold text-white">Pasar Terban</p>
                  <p className="opacity-80">Jl. C. Simanjuntak No.21, Terban, Gondokusuman,<br />Kota Yogyakarta, Daerah Istimewa Yogyakarta 55223</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={20} className="shrink-0 mt-1 text-khff-pink" />
                <div>
                  <p className="font-bold text-white">PDIN Kotabaru</p>
                  <p className="opacity-80">Jl. C. Simanjuntak No.19, Terban, Gondokusuman,<br />Kota Yogyakarta, Daerah Istimewa Yogyakarta 55223</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-khff-cream/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-khff-cream/60">
          <p>© 2026 Kotabaru Heritage Film Festival. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-khff-yellow transition-colors font-bold">Privacy Policy</a>
            <a href="#" className="hover:text-khff-yellow transition-colors font-bold">Terms of Festival</a>
            <a href="#" className="hover:text-khff-yellow transition-colors font-bold">Press Kit</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
