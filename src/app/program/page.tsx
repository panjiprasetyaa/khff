import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ProgramList() {
  const mainCategories = [
    {
      id: "kompetisi",
      title: "Program Kompetisi",
      subtitle: ["Mahaditya", "Purwaseswa", "Karyanagri"],
      description:
        "Pemutaran film hasil submisi terbuka yang telah melalui proses kurasi, sekaligus menjadi ruang kompetisi bagi sineas untuk memperebutkan penghargaan dalam berbagai kategori.",
      bgClass: "bg-khff-yellow text-khff-navy border-khff-yellow",
      tagClass: "bg-khff-navy text-khff-yellow",
      asset: "/assets/illustrations/terompet.png",
      cta: "Lihat Daftar Karya Kompetisi",
    },
    {
      id: "non-kompetisi",
      title: "Program Non-Kompetisi",
      subtitle: [
        "Opening Film",
        "International Heritage",
        "National Heritage",
        "Closing Film",
      ],
      description:
        "Pemutaran film pilihan yang mengeksplorasi cerita, tradisi, dan kehidupan yang membentuk warisan budaya.",
      bgClass: "bg-khff-pink text-white border-khff-pink",
      tagClass: "bg-white text-khff-pink",
      asset: "/assets/illustrations/bendera.png",
      cta: "Jelajahi Penayangan Khusus",
    },
    {
      id: "non-pemutaran",
      title: "Program Non-Pemutaran",
      subtitle: ["Workshop", "Public Lecture"],
      description:
        "Ruang interaksi yang menghadirkan berbagai kegiatan untuk belajar, berdiskusi, dan merayakan keberagaman budaya melalui film.",
      bgClass: "bg-white text-khff-navy border-white",
      tagClass: "bg-khff-navy text-white",
      asset: "/assets/illustrations/kendhang.png",
      cta: "Lihat Detail & Pendaftaran",
    },
  ];

  return (
    <main className="min-h-screen bg-khff-navy text-khff-cream font-sans relative overflow-hidden">
      {/* HEADER SECTION (CINEMATIC GREEN TO YELLOW GRADIENT) */}
      <section className="pt-36 pb-28 px-6 bg-gradient-to-b from-khff-navy via-[#23585a] to-khff-yellow text-khff-cream relative z-10 w-full">
        <div className="container mx-auto max-w-6xl text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black text-khff-cream mb-8 tracking-tight drop-shadow-lg">
            Program
          </h1>
          <p className="text-khff-cream/95 text-lg md:text-2xl max-w-3xl font-medium leading-relaxed drop-shadow">
            Eksplorasi tiga program utama festival kami: kompetisi karya sineas
            muda Nusantara, kurasi penayangan warisan budaya, serta ruang
            kolaborasi edukatif.
          </p>
        </div>
      </section>

      {/* CATEGORIES SECTION (NAVY GREEN BACKGROUND) */}
      <section className="bg-khff-navy text-khff-cream rounded-t-[3.5rem] py-24 shadow-2xl relative z-20 border-t-8 border-khff-pink overflow-hidden -mt-12">
        <div className="absolute top-20 -right-10 opacity-10 pointer-events-none w-96">
          <img
            src="/assets/illustrations/gong.png"
            alt="Gong"
            className="w-full h-auto"
          />
        </div>

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 gap-12">
            {mainCategories.map((category) => (
              <Link
                key={category.id}
                href={`/program/${category.id}`}
                className="block group"
              >
                <div
                  className={`rounded-3xl p-8 md:p-14 transition-all duration-500 relative overflow-hidden shadow-2xl border-4 group-hover:-translate-y-2 active:scale-[0.98] ${category.bgClass}`}
                >
                  {/* Floating Character Asset */}
                  <div className="absolute right-8 bottom-4 opacity-35 w-48 md:w-72 pointer-events-none group-hover:scale-105 group-hover:opacity-50 transition-all duration-700 animate-[pulse_4s_ease-in-out_infinite]">
                    <img
                      src={category.asset}
                      alt=""
                      className="w-full h-auto object-contain drop-shadow-lg"
                    />
                  </div>

                  <div className="relative z-10 max-w-4xl">
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-6">
                      {category.subtitle.map((item, idx) => (
                        <span
                          key={idx}
                          className={`text-[10px] md:text-xs font-mono font-black uppercase tracking-widest px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-sm ${category.tagClass}`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-4xl md:text-6xl font-serif font-black mb-6 leading-tight">
                      {category.title}
                    </h2>

                    <p className="text-lg md:text-xl font-medium max-w-2xl mb-10 opacity-90 leading-relaxed">
                      {category.description}
                    </p>

                    <div className="inline-flex items-center gap-4 text-base md:text-lg font-mono font-black py-4 px-8 rounded-2xl bg-black/10 hover:bg-black/20 backdrop-blur-md transition-all shadow-md">
                      <span>{category.cta}</span>
                      <ArrowRight
                        size={22}
                        className="group-hover:translate-x-2 transition-transform duration-300"
                      />
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
