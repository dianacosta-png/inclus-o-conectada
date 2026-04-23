import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink, FileText, Building2, GraduationCap, Globe,
  BookMarked, Camera, Newspaper, ChevronDown, type LucideIcon,
} from "lucide-react";
import { PhotoGalleryModal } from "./PhotoGalleryModal";
import { MaterialsModal } from "./MaterialsModal";
import linksData from "@/content/links.json";

const iconMap: Record<string, LucideIcon> = {
  FileText,
  BookMarked,
  Globe,
  GraduationCap,
  Building2,
  Camera,
  Newspaper,
};

// Converte yearUrls de array [{year, url}] para Record<number, string>
const categories = linksData.categories.map((cat) => ({
  ...cat,
  icon: iconMap[cat.icon] ?? FileText,
  yearUrls: Object.fromEntries(
    cat.yearUrls.map(({ year, url }) => [year, url])
  ) as Record<number, string>,
}));

const years = linksData.years;

const LinksSection = () => {
  const [openYears, setOpenYears] = useState<Set<number>>(new Set([years[0]]));
  const [galleryYear, setGalleryYear] = useState<number | null>(null);
  const [materialsYear, setMaterialsYear] = useState<number | null>(null);

  const toggleYear = (year: number) => {
    setOpenYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) {
        next.delete(year);
      } else {
        next.add(year);
      }
      return next;
    });
  };

  return (
    <section id="links" className="py-24 bg-card">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Links de <span className="text-primary">Consulta</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Recursos essenciais sobre o projeto, inclusão, legislação e acessibilidade.
          </p>
        </motion.div>

        {years.map((year) => {
          const isOpen = openYears.has(year);
          return (
            <div key={year} className="mb-6 last:mb-0">
              <button
                onClick={() => toggleYear(year)}
                className="w-full flex items-center justify-between text-3xl font-bold text-primary border-b border-border pb-4 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
              >
                {year}
                <ChevronDown
                  className={`w-7 h-7 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
                      {categories
                        .filter((link) => {
                          if (year === years[0]) return true;
                          if (link.tag === "Inscrição" || link.tag === "Guia") return false;
                          if (link.tag === "Mídia") return [2023, 2025].includes(year);
                          if (link.tag === "Material") return [2023, 2024, 2025].includes(year);
                          return !!(link.yearUrls?.[year] || (link.url !== "#"));
                        })
                        .map((link, i) => {
                          const isGallery = link.tag === "Mídia";
                          const isMaterials = link.tag === "Material";
                          const isComingSoon = year === years[0];

                          const cardContent = (
                            <>
                              {isComingSoon && (
                                <div className="absolute top-3 left-3">
                                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                                    Em breve
                                  </span>
                                </div>
                              )}
                              <div className={`flex items-start justify-between mb-4 ${isComingSoon ? "mt-6" : ""}`}>
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                  <link.icon className={`w-6 h-6 ${isComingSoon ? "text-muted-foreground" : "text-primary"}`} />
                                </div>
                                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-muted text-muted-foreground">
                                  {link.tag}
                                </span>
                              </div>
                              <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${isComingSoon ? "text-muted-foreground" : "group-hover:text-primary transition-colors"}`}>
                                {link.title}
                                {!isComingSoon && !isGallery && !isMaterials && (
                                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                              </h3>
                              <p className="text-muted-foreground text-sm leading-relaxed">{link.description}</p>
                            </>
                          );

                          if (isComingSoon) {
                            return (
                              <motion.div
                                key={`${year}-${link.title}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="relative bg-muted/40 rounded-2xl p-6 border border-border/50 opacity-60 cursor-not-allowed select-none"
                              >
                                {cardContent}
                              </motion.div>
                            );
                          }

                          if (isGallery || isMaterials) {
                            return (
                              <motion.button
                                key={`${year}-${link.title}`}
                                onClick={() => isGallery ? setGalleryYear(year) : setMaterialsYear(year)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="relative group bg-background rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all hover:-translate-y-1 text-left w-full cursor-pointer"
                              >
                                {cardContent}
                              </motion.button>
                            );
                          }

                          return (
                            <motion.a
                              key={`${year}-${link.title}`}
                              href={link.yearUrls?.[year] || link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="relative group bg-background rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all hover:-translate-y-1"
                            >
                              {cardContent}
                            </motion.a>
                          );
                        })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {galleryYear !== null && (
        <PhotoGalleryModal
          isOpen={galleryYear !== null}
          onClose={() => setGalleryYear(null)}
          year={galleryYear}
        />
      )}

      {materialsYear !== null && (
        <MaterialsModal
          isOpen={materialsYear !== null}
          onClose={() => setMaterialsYear(null)}
          year={materialsYear}
        />
      )}
    </section>
  );
};

export default LinksSection;
