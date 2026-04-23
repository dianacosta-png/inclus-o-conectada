import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Camera, Play, Images } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

type MediaType = "foto" | "video";

type GalleryItem = {
  id: number;
  src: string;
  thumb: string;
  title: string;
  category: string;
  type: MediaType;
};

const makeGallery = (year: number, count: number, ext: string): GalleryItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    src: `/fotos/${year}/${i + 1}.${ext}`,
    thumb: `/fotos/${year}/${i + 1}.${ext}`,
    title: `Foto ${i + 1}`,
    category: "Evento",
    type: "foto" as MediaType,
  }));

const galleryByYear: Record<number, GalleryItem[]> = {
  2023: makeGallery(2023, 123, "jpg"),
  2025: makeGallery(2025, 42, "png"),
};


const categoryColors: Record<string, string> = {
  Evento: "bg-primary/10 text-primary",
  Oficina: "bg-blue-100 text-blue-700",
  Apresentação: "bg-purple-100 text-purple-700",
  Atividade: "bg-amber-100 text-amber-700",
  Debate: "bg-teal-100 text-teal-700",
  Exposição: "bg-rose-100 text-rose-700",
  Palestra: "bg-indigo-100 text-indigo-700",
};

type PhotoGalleryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  year: number;
};

export function PhotoGalleryModal({ isOpen, onClose, year }: PhotoGalleryModalProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const items = galleryByYear[year] ?? [];

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const goPrev = () => setLightboxIndex((i) => (i !== null ? (i - 1 + items.length) % items.length : 0));
  const goNext = () => setLightboxIndex((i) => (i !== null ? (i + 1) % items.length : 0));

  const currentItem = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-5xl w-full max-h-[90vh] p-0 overflow-hidden rounded-2xl">
          <DialogTitle className="sr-only">Galeria de Fotos e Vídeos {year}</DialogTitle>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Camera className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Fotos e Vídeos</h2>
                <p className="text-sm text-muted-foreground">IF Inclusão Conectada</p>
              </div>
              <Badge className="ml-2 bg-primary/10 text-primary border-0 font-semibold">
                {year}
              </Badge>
            </div>
          </div>

          {/* Gallery grid */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                  <Images className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">Em breve</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    As fotos e vídeos de {year} serão disponibilizados em breve.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {items.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => openLightbox(index)}
                    className="group relative rounded-xl overflow-hidden aspect-video bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    <img
                      src={item.thumb}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                        </div>
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                      <p className="text-white text-sm font-semibold leading-tight">{item.title}</p>
                      <span
                        className={`mt-1 self-start text-xs font-medium px-2 py-0.5 rounded-full ${
                          categoryColors[item.category] ?? "bg-white/20 text-white"
                        }`}
                      >
                        {item.category}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Lightbox */}
      <AnimatePresence>
        {currentItem && (
          <Dialog open={lightboxIndex !== null} onOpenChange={(open) => !open && closeLightbox()}>
            <DialogContent className="max-w-4xl w-full p-0 overflow-hidden rounded-2xl bg-black border-0">
              <DialogTitle className="sr-only">{currentItem.title}</DialogTitle>
              <div className="relative w-full">
                {/* Image */}
                <motion.img
                  key={lightboxIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  src={currentItem.src}
                  alt={currentItem.title}
                  className="w-full max-h-[75vh] object-contain"
                />

                {/* Nav buttons */}
                {items.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); goPrev(); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                      aria-label="Foto anterior"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); goNext(); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                      aria-label="Próxima foto"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Close */}
                <button
                  onClick={closeLightbox}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                  aria-label="Fechar"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Caption */}
                <div className="px-5 py-4 bg-black flex items-center justify-between gap-3">
                  <div>
                    <p className="text-white font-semibold">{currentItem.title}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${categoryColors[currentItem.category] ?? "bg-white/20 text-white"}`}>
                      {currentItem.category}
                    </span>
                  </div>
                  {lightboxIndex !== null && (
                    <span className="text-white/50 text-sm shrink-0">
                      {lightboxIndex + 1} / {items.length}
                    </span>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
