import Link from "next/link";
import { AtSign, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const sponsors = [
    { id: 1, name: "Sponsor 1" },
    { id: 2, name: "Sponsor 2" },
    { id: 3, name: "Sponsor 3" },
    { id: 4, name: "Media Partner 1" },
    { id: 5, name: "Media Partner 2" },
  ];

  return (
    <footer className="bg-black text-gray-400 py-16 border-t border-white/10">
      <div className="container mx-auto px-6 md:px-12">
        {/* Sponsors & Partners */}
        <div className="mb-16 text-center">
          <h3 className="text-sm tracking-widest uppercase text-white/50 mb-8 font-semibold">
            Supported By & Media Partners
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className="w-32 h-16 bg-white/5 rounded flex items-center justify-center transition-all duration-500 filter grayscale opacity-50 hover:grayscale-0 hover:opacity-100 hover:bg-white/10 hover:-translate-y-1 cursor-pointer"
              >
                <span className="text-xs font-bold text-white/70">{sponsor.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-white tracking-wider">KHFF.</h2>
            <p className="text-sm text-gray-500 max-w-xs mx-auto md:mx-0">
              Kotabaru Heritage Film Festival. Merayakan sinema dan sejarah di jantung Yogyakarta.
            </p>
          </div>

          <div className="space-y-4 flex flex-col items-center md:items-start">
            <h4 className="text-white font-medium mb-2 uppercase tracking-wider text-sm">Contact Us</h4>
            <a href="mailto:info@khff.id" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail size={16} /> info@khff.id
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-white transition-colors">
              <AtSign size={16} /> @khff.jogja
            </a>
          </div>

          <div className="space-y-4 flex flex-col items-center md:items-start">
            <h4 className="text-white font-medium mb-2 uppercase tracking-wider text-sm">Location</h4>
            <p className="flex items-start gap-2 text-sm text-left">
              <MapPin size={18} className="shrink-0 mt-0.5" />
              <span>
                Kawasan Kotabaru,<br />
                Gondokusuman, Kota Yogyakarta,<br />
                Daerah Istimewa Yogyakarta 55224
              </span>
            </p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} Kotabaru Heritage Film Festival. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
