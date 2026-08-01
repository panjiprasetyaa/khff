import Link from "next/link";
import { ArrowRight, Film, Calendar, Users, Sparkles } from "lucide-react";

export default function ProgramList() {
  const mainCategories = [
    {
      id: "kompetisi",
      title: "Program Kompetisi",
      subtitle: "Mahaditya • Purwaseswa • Karyanagri",
      description: "Ajang apresiasi karya sinema pendek pilihan dari seluruh Nusantara. Menampilkan film-film fiksi maupun dokumenter dengan penceritaan kuat, inovasi visual, serta kearifan lokal yang mendalam.",
      bgClass: "bg-khff-yellow text-khff-navy border-khff-yellow",
      tagClass: "bg-khff-navy text-khff-yellow",
      asset: "/assets/karakter/terompet.png",
      cta: "Lihat Daftar Karya Kompetisi",
      icon: <Film size={32} />
    },
    {
      id: "non-kompetisi",
      title: "Program Non-Kompetisi",
      subtitle: "Opening Film • International Heritage • National Heritage • Closing Film",
      description: "Kurasi penayangan eksklusif yang merayakan persilangan sinema dan sejarah. Dari film pembuka dan penutup festival, hingga screening restorasi arsip sinema nasional dan internasional.",
      bgClass: "bg-khff-pink text-white border-khff-pink",
      tagClass: "bg-white text-khff-pink",
      asset: "/assets/karakter/genigeni.png",
      cta: "Jelajahi Penayangan Khusus",
      icon: <Sparkles size={32} />
    },
    {
      id: "non-pemutaran",
      title: "Program Non-Pemutaran",
      subtitle: "Workshop • Public Lecture",
      description: "Ruang temu, lokakarya edukatif, dan kuliah terbuka bersama praktisi serta pakar film terkemuka Nusantara. Wadah pertukaran ilmu dan jejaring kolaborasi sineas masa depan.",
      bgClass: "bg-white text-khff-navy border-white",
      tagClass: "bg-khff-navy text-white",
      asset: "/assets/karakter/kendhang.png",
      cta: "Lihat Detail & Pendaftaran",
      icon: <Users size={32} />
    }
  ];

  return (
    <main className="min-h-screen bg-khff-yellow text-khff-navy font-sans relative overflow-hidden">
      
      {/* HEADER SECTION (YELLOW BACKGROUND WITH GREEN TEXT) */}
      <section className="pt-36 pb-24 px-6 relative z-10 container mx-auto max-w-6xl">
        <div className="text-center md:text-left">
          <span className="inline-block px-4 py-1.5 rounded-full bg-khff-navy text-khff-yellow text-xs md:text-sm uppercase tracking-[0.3em] font-mono font-black mb-6 shadow-md">
            Kotabaru Heritage Film Festival 2026
          </span>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-black text-khff-navy mb-8 tracking-tight">
            Programs.
          </h1>
          <p className="text-khff-navy/90 text-lg md:text-2xl max-w-3xl font-medium leading-relaxed">
            Eksplorasi tiga pilar utama festival kami: kompetisi karya sineas muda Nusantara, kurasi penayangan warisan budaya, serta ruang kolaborasi edukatif.
          </p>
        </div>
      </section>

      {/* CATEGORIES SECTION (NAVY GREEN BACKGROUND) */}
      <section className="bg-khff-navy text-khff-cream rounded-t-[3.5rem] py-24 shadow-2xl relative z-20 border-t-8 border-khff-pink overflow-hidden">
        <div className="absolute top-20 -right-10 opacity-10 pointer-events-none w-96">
          <img src="/assets/karakter/gong.png" alt="Gong" className="w-full h-auto" />
        </div>

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 gap-12">
            {mainCategories.map((category) => (
              <Link key={category.id} href={`/program/${category.id}`} className="block group">
                <div className={`rounded-3xl p-8 md:p-14 transition-all duration-500 relative overflow-hidden shadow-2xl border-4 group-hover:-translate-y-2 ${category.bgClass}`}>
                  
                  {/* Floating Character Asset */}
                  <div className="absolute right-8 bottom-4 opacity-25 w-48 md:w-64 pointer-events-none group-hover:scale-110 group-hover:opacity-40 transition-all duration-700">
                    <img src={category.asset} alt="" className="w-full h-auto object-contain" />
                  </div>

                  <div className="relative z-10 max-w-4xl">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <div className="p-3 rounded-2xl bg-black/10 backdrop-blur-md">
                        {category.icon}
                      </div>
                      <span className={`text-xs font-mono font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-sm ${category.tagClass}`}>
                        {category.subtitle}
                      </span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-serif font-black mb-6 leading-tight">
                      {category.title}
                    </h2>
                    
                    <p className="text-lg md:text-xl font-medium max-w-2xl mb-10 opacity-90 leading-relaxed">
                      {category.description}
                    </p>

                    <div className="inline-flex items-center gap-4 text-base md:text-lg font-mono font-black py-4 px-8 rounded-2xl bg-black/10 hover:bg-black/20 backdrop-blur-md transition-all shadow-md">
                      <span>{category.cta}</span>
                      <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
