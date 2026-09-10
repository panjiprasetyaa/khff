import { AtSign, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="font-sans">
      {/* Supported By & Official Media Partners (Custom Illustrated Landscape Background) */}
      <div className="relative py-12 sm:py-16 md:py-24 overflow-hidden bg-[#f39920] bg-[url('/assets/sponsors/sponsor-bg.png')] bg-cover bg-bottom bg-no-repeat text-khff-navy">
        <div className="container mx-auto px-4 sm:px-8 md:px-12 max-w-7xl relative z-10 text-center">
          {/* Section Heading Badge */}
          <span className="text-xs md:text-sm font-mono tracking-[0.3em] uppercase text-khff-navy font-black mb-8 sm:mb-12 md:mb-14 inline-block px-5 py-2 rounded-full bg-khff-navy/10 border border-khff-navy/20 shadow-xs backdrop-blur-xs">
            Didukung Oleh & Mitra Media Resmi
          </span>

          {/* Logos Display */}
          <div className="flex flex-col items-center justify-center gap-5 sm:gap-7 md:gap-9 w-full max-w-6xl mx-auto">
            {/* Top Official Row: 5 Logos (3 + 2 on Mobile, 5 on Desktop) */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3.5 sm:gap-6 md:gap-8 lg:gap-10 w-full">
              <div className="flex justify-center items-center gap-3.5 sm:gap-6 md:gap-8">
                <img
                  src="/assets/sponsors/dinas-pendidikan.png"
                  alt="Dinas Pendidikan Kota Yogyakarta"
                  className="h-14 sm:h-16 md:h-20 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                />
                <img
                  src="/assets/sponsors/270-yk-official.png?v=4"
                  alt="HUT Kota Yogyakarta 270"
                  className="h-14 sm:h-16 md:h-20 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                />
                <img
                  src="/assets/sponsors/jogja-istimewa.png"
                  alt="Jogja Istimewa"
                  className="h-[34px] sm:h-10 md:h-12 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                />
              </div>
              <div className="flex justify-center items-center gap-5 sm:gap-6 md:gap-8">
                <img
                  src="/assets/sponsors/dana-keistimewaan.png?v=5"
                  alt="Dana Keistimewaan"
                  className="h-10 sm:h-11 md:h-14 lg:h-15 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
                />
                <img
                  src="/assets/sponsors/kemenbud.png"
                  alt="Kementerian Kebudayaan Republik Indonesia"
                  className="h-10 sm:h-11 md:h-14 lg:h-15 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
                />
              </div>
            </div>

            {/* Bottom Official Row: 4 Logos (2 + 2 on Mobile, 4 on Desktop) */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3.5 sm:gap-8 md:gap-10 lg:gap-12 w-full">
              <div className="flex justify-center items-center gap-6 sm:gap-8 md:gap-10">
                <img
                  src="/assets/sponsors/kotabaru.png"
                  alt="Kotabaru Heritage"
                  className="h-10 sm:h-12 md:h-15 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                />
                <img
                  src="/assets/sponsors/teh-pucuk-official.png?v=4"
                  alt="Teh Pucuk Harum"
                  className="h-12 sm:h-14 md:h-18 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                />
              </div>
              <div className="flex justify-center items-center gap-6 sm:gap-8 md:gap-10">
                <img
                  src="/assets/sponsors/dinas-diy-official.png?v=4"
                  alt="Dinas Pemerintah Daerah DIY"
                  className="h-14 sm:h-16 md:h-20 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                />
                <img
                  src="/assets/sponsors/pdin-official.png?v=5"
                  alt="PDIN Pusat Desain Industri Nasional"
                  className="h-9 sm:h-11 md:h-14 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                />
              </div>
            </div>

            {/* Garis Divider */}
            <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-khff-navy/25 to-transparent my-1 sm:my-2" />

            {/* Hotel Hospitality Sponsors: 5 Logos (2 + 3 on Mobile, 5 on Desktop) */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 md:gap-8 lg:gap-10 w-full">
              <div className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8">
                <img
                  src="/assets/sponsors/harper-malioboro.png"
                  alt="Harper Malioboro Yogyakarta"
                  className="h-6 sm:h-8 md:h-10 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
                />
                <img
                  src="/assets/sponsors/the-101-hotel.png?v=2"
                  alt="THE 1O1 Hotel Yogyakarta Tugu"
                  className="h-7 sm:h-11 md:h-13 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
                />
              </div>
              <div className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8">
                <img
                  src="/assets/sponsors/aston-gejayan.png?v=3"
                  alt="ASTON Gejayan Yogyakarta"
                  className="h-7 sm:h-11 md:h-13 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
                />
                <img
                  src="/assets/sponsors/nueve-hotel.png"
                  alt="Nueve Jogja Hotel"
                  className="h-8 sm:h-11 md:h-13 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
                />
                <img
                  src="/assets/sponsors/aveon-hotel.png"
                  alt="Aveon Hotel Yogyakarta"
                  className="h-8 sm:h-12 md:h-14 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
                />
              </div>
            </div>

            {/* Garis Divider Bawah Sponsor Hotel */}
            <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-khff-navy/25 to-transparent my-1 sm:my-2" />

            {/* Media & Community Partners: 11 Logos */}
            {/* Mobile View: 3 Balanced Rows (4 + 4 + 3) */}
            <div className="flex flex-col sm:hidden items-center justify-center gap-3.5 w-full">
              {/* Row 1: 4 Logos */}
              <div className="flex justify-center items-center gap-3.5 w-full">
                <img
                  src="/assets/sponsors/info-festival-film.png"
                  alt="Info Festival Film ID"
                  className="h-7 w-auto object-contain rounded-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                />
                <img
                  src="/assets/sponsors/jogja-punya-acara.png"
                  alt="Jogja Punya Acara"
                  className="h-6 w-auto object-contain rounded-md drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                />
                <img
                  src="/assets/sponsors/acara-kita.png"
                  alt="AcaraKita.net"
                  className="h-7 w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                />
                <img
                  src="/assets/sponsors/radio-q.png"
                  alt="88.3 FM Radio Q Jogja"
                  className="h-6 w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                />
              </div>

              {/* Row 2: 4 Logos */}
              <div className="flex justify-center items-center gap-3.5 w-full">
                <img
                  src="/assets/sponsors/avikom.png"
                  alt="Avikom UPN Veteran Yogyakarta"
                  className="h-7 w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                />
                <img
                  src="/assets/sponsors/rtdj.png"
                  alt="Ruang Tengah DJ"
                  className="h-7 w-auto object-contain rounded-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                />
                <img
                  src="/assets/sponsors/suryakanta.png"
                  alt="Suryakanta Akademi Film Yogyakarta"
                  className="h-7 w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                />
                <img
                  src="/assets/sponsors/mm-kine-klub.png"
                  alt="MM Kine Klub"
                  className="h-7 w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                />
              </div>

              {/* Row 3: 3 Logos */}
              <div className="flex justify-center items-center gap-4 w-full">
                <img
                  src="/assets/sponsors/kamisinema.png"
                  alt="Kamisinema"
                  className="h-[18px] w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                />
                <img
                  src="/assets/sponsors/seling-selasa-screening.png"
                  alt="Seling Selasa Screening"
                  className="h-7 w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                />
                <img
                  src="/assets/sponsors/wanu-sinema.png"
                  alt="Wanu Sinema"
                  className="h-7 w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                />
              </div>
            </div>

            {/* Desktop / Tablet View (sm:flex): 2 Balanced Rows (5 + 6) */}
            <div className="hidden sm:flex flex-col items-center justify-center gap-5 sm:gap-6 md:gap-7 w-full max-w-5xl mx-auto">
              {/* Row 1: 5 Media Partners */}
              <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 w-full">
                <img
                  src="/assets/sponsors/info-festival-film.png"
                  alt="Info Festival Film ID"
                  className="h-10 sm:h-12 md:h-14 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] rounded-xl"
                />
                <img
                  src="/assets/sponsors/jogja-punya-acara.png"
                  alt="Jogja Punya Acara"
                  className="h-8 sm:h-9 md:h-11 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] rounded-lg"
                />
                <img
                  src="/assets/sponsors/acara-kita.png"
                  alt="AcaraKita.net"
                  className="h-10 sm:h-12 md:h-14 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                />
                <img
                  src="/assets/sponsors/radio-q.png"
                  alt="88.3 FM Radio Q Jogja"
                  className="h-9 sm:h-11 md:h-13 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                />
                <img
                  src="/assets/sponsors/avikom.png"
                  alt="Avikom UPN Veteran Yogyakarta"
                  className="h-10 sm:h-12 md:h-14 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                />
              </div>

              {/* Row 2: 6 Media & Community Partners */}
              <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 w-full">
                <img
                  src="/assets/sponsors/rtdj.png"
                  alt="Ruang Tengah DJ"
                  className="h-10 sm:h-12 md:h-14 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] rounded-xl"
                />
                <img
                  src="/assets/sponsors/suryakanta.png"
                  alt="Suryakanta Akademi Film Yogyakarta"
                  className="h-10 sm:h-12 md:h-14 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                />
                <img
                  src="/assets/sponsors/mm-kine-klub.png"
                  alt="MM Kine Klub"
                  className="h-10 sm:h-12 md:h-14 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                />
                <img
                  src="/assets/sponsors/kamisinema.png"
                  alt="Kamisinema"
                  className="h-6 sm:h-7 md:h-8 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                />
                <img
                  src="/assets/sponsors/seling-selasa-screening.png"
                  alt="Seling Selasa Screening"
                  className="h-10 sm:h-12 md:h-14 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                />
                <img
                  src="/assets/sponsors/wanu-sinema.png"
                  alt="Wanu Sinema"
                  className="h-10 sm:h-12 md:h-14 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Info (Navy Background) */}
      <div className="bg-khff-navy text-khff-cream py-20 relative overflow-hidden">
        {/* Decorative asset overlay */}
        <div className="hidden md:block absolute -bottom-10 -right-10 opacity-10 pointer-events-none w-80">
          <img
            src="/assets/illustrations/gong.png"
            alt="Gong"
            className="w-full h-auto"
          />
        </div>
        <div className="hidden md:block absolute top-10 left-10 opacity-10 pointer-events-none w-64">
          <img
            src="/assets/illustrations/kendhang.png"
            alt="Kendhang"
            className="w-full h-auto"
          />
        </div>

        <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
          {/* Footer Info */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 text-left mb-16">
            <div className="md:col-span-4 space-y-6">
              <div className="inline-block">
                <img
                  src="/assets/logo-orange.png"
                  alt="Kotabaru Heritage Film Festival Logo"
                  className="h-20 sm:h-24 w-auto object-contain drop-shadow-md mb-2"
                />
              </div>
              <p className="text-base text-khff-cream/80 max-w-sm font-medium leading-relaxed">
                “Menjaga Warisan, Merayakan Imajinasi”
              </p>
            </div>

            <div className="md:col-span-4 space-y-4 flex flex-col items-start w-full overflow-hidden">
              <h4 className="text-khff-yellow font-mono font-black mb-2 uppercase tracking-widest text-sm">
                Kontak
              </h4>
              <a
                href="mailto:kotabaruheritagefilmfestival@gmail.com"
                className="flex items-start gap-3 text-khff-cream/90 hover:text-khff-pink transition-colors font-medium w-full"
              >
                <Mail size={18} className="text-khff-pink shrink-0 mt-1" />
                <span className="break-all sm:break-normal text-left">
                  kotabaruheritagefilmfestival@gmail.com
                </span>
              </a>
              <a
                href="https://instagram.com/kotabaruheritagefilmfestival"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-khff-cream/90 hover:text-khff-pink transition-colors font-medium w-full"
              >
                <AtSign size={18} className="text-khff-yellow shrink-0 mt-1" />
                <span className="break-all sm:break-normal text-left">
                  @kotabaruheritagefilmfestival
                </span>
              </a>
            </div>

            <div className="md:col-span-4 space-y-4 flex flex-col items-start w-full">
              <h4 className="text-khff-yellow font-mono font-black mb-2 uppercase tracking-widest text-sm">
                Lokasi Festival
              </h4>
              <div className="space-y-4 text-sm text-khff-cream/90 font-medium leading-relaxed w-full">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="shrink-0 mt-1 text-khff-pink" />
                  <div>
                    <p className="font-bold text-white">Pasar Terban</p>
                    <p className="opacity-80">
                      Jl. C. Simanjuntak No. 21, Terban, Gondokusuman,
                      <br />
                      Kota Yogyakarta, Daerah Istimewa Yogyakarta 55223
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="shrink-0 mt-1 text-khff-pink" />
                  <div>
                    <p className="font-bold text-white">PDIN Kotabaru</p>
                    <p className="opacity-80">
                      Jl. C. Simanjuntak No. 19, Terban, Gondokusuman,
                      <br />
                      Kota Yogyakarta, Daerah Istimewa Yogyakarta 55223
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-khff-cream/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-khff-cream/60">
            <p>© 2026 Kotabaru Heritage Film Festival. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
