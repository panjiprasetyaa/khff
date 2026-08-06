import { AtSign, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const sponsorBanner = "/assets/sponsor-revisi.png";

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
          <div className="flex justify-center items-center px-4 w-full">
            <img
              src={sponsorBanner}
              alt="Supported By & Official Media Partners"
              className="w-full max-w-4xl h-auto object-contain filter drop-shadow-md hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        </div>

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
                  <p className="opacity-80">Jl. C. Simanjuntak No. 21, Terban, Gondokusuman,<br />Kota Yogyakarta, Daerah Istimewa Yogyakarta 55223</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={20} className="shrink-0 mt-1 text-khff-pink" />
                <div>
                  <p className="font-bold text-white">PDIN Kotabaru</p>
                  <p className="opacity-80">Jl. C. Simanjuntak No. 19, Terban, Gondokusuman,<br />Kota Yogyakarta, Daerah Istimewa Yogyakarta 55223</p>
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
