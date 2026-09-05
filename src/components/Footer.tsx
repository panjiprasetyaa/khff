import { AtSign, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="font-sans">
      {/* Supported By & Official Media Partners (KHFF Yellow Background Section) */}
      <div className="relative py-16 md:py-20 overflow-hidden bg-khff-yellow text-khff-navy border-t border-khff-yellow/40 shadow-inner">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10 text-center">
          {/* Section Heading Badge */}
          <span className="text-xs md:text-sm font-mono tracking-[0.3em] uppercase text-khff-navy font-black mb-10 md:mb-14 inline-block px-6 py-2 rounded-full bg-khff-navy/10 border border-khff-navy/20 shadow-xs">
            Didukung Oleh & Mitra Media Resmi
          </span>

          {/* Logos Display (5 logos top, 4 logos bottom) */}
          <div className="flex flex-col items-center justify-center gap-10 md:gap-14 w-full max-w-6xl mx-auto px-4">
            {/* Top Row: 5 Logos */}
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 w-full">
              <img
                src="/assets/sponsors/dinas-pendidikan.png"
                alt="Dinas Pendidikan Kota Yogyakarta"
                className="h-16 sm:h-20 md:h-22 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
              />
              <img
                src="/assets/sponsors/yk-kota.png"
                alt="Kota Yogyakarta"
                className="h-14 sm:h-18 md:h-20 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
              />
              <img
                src="/assets/sponsors/jogja-istimewa.png"
                alt="Jogja Istimewa"
                className="h-9 sm:h-12 md:h-13 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
              />
              <img
                src="/assets/sponsors/dana-keistimewaan.png"
                alt="Dana Keistimewaan"
                className="h-10 sm:h-13 md:h-15 lg:h-16 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
              />
              <img
                src="/assets/sponsors/05-pemda-diy.png"
                alt="Pemerintah Daerah Daerah Istimewa Yogyakarta"
                className="h-16 sm:h-20 md:h-22 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
              />
            </div>

            {/* Bottom Row: 4 Logos */}
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 md:gap-14 lg:gap-16 w-full">
              <img
                src="/assets/sponsors/kotabaru.png"
                alt="Kotabaru Heritage"
                className="h-12 sm:h-15 md:h-17 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
              />
              <img
                src="/assets/sponsors/07-teh-pucuk-harum.png"
                alt="Teh Pucuk Harum"
                className="h-14 sm:h-18 md:h-19 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
              />
              <img
                src="/assets/sponsors/270-yk-official.png?v=3"
                alt="HUT Kota Yogyakarta 270"
                className="h-16 sm:h-20 md:h-22 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
              />
              <img
                src="/assets/sponsors/pdin-official.png?v=3"
                alt="PDIN Pusat Desain Industri Nasional"
                className="h-11 sm:h-13 md:h-15 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
              />
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
