import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Camera, Play, Images, Youtube } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import videosData from "@/content/videos.json";

// ── Tipos ──────────────────────────────────────────────────────────────────

type PhotoItem = {
  id: number;
  src: string;
  thumb: string;
  title: string;
  category: string;
};

type VideoItem = {
  year: number;
  title: string;
  youtubeId: string;
  category: string;
};

type Tab = "fotos" | "videos";

// ── Fotos (geradas por contagem de arquivos) ───────────────────────────────

const makePhotos = (year: number, count: number, ext: string): PhotoItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    src: `/fotos/${year}/${i + 1}.${ext}`,
    thumb: `/fotos/${year}/${i + 1}.${ext}`,
    title: `Foto ${i + 1}`,
    category: "Evento",
  }));

const photosByYear: Record<number, PhotoItem[]> = {
  2023: makePhotos(2023, 123, "jpg"),
  2025: makePhotos(2025, 42, "png"),
};

// ── Cores das categorias ───────────────────────────────────────────────────

const categoryColors: Record<string, string> = {
  Evento: "bg-primary/10 text-primary",
  Oficina: "bg-blue-100 text-blue-700",
  Apresentação: "bg-purple-100 text-purple-700",
  Atividade: "bg-amber-100 text-amber-700",
  Debate: "bg-teal-100 text-teal-700",
  Exposição: "bg-rose-100 text-rose-700",
  Palestra: "bg-indigo-100 text-indigo-700",
};

// ── Props ──────────────────────────────────────────────────────────────────

type PhotoGalleryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  year: number;
};

// ── Componente ─────────────────────────────────────────────────────────────

export function PhotoGalleryModal({ isOpen, onClose, year }: PhotoGalleryModalProps) {
  const photos = photosByYear[year] ?? [];
  const videos: VideoItem[] = videosData.videos.filter((v) => v.year === year);

  const hasPhotos = photos.length > 0;
  const hasVideos = videos.length > 0;
  const showTabs = hasPhotos && hasVideos;

  const defaultTab: Tab = hasPhotos ? "fotos" : "videos";
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const isEmpty = !hasPhotos && !hasVideos;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const goPrev = () => setLightboxIndex((i) => (i !== null ? (i - 1 + photos.length) % photos.length : 0));
  const goNext = () => setLightboxIndex((i) => (i !== null ? (i + 1) % photos.length : 0));
  const currentPhoto = lightboxIndex !== null ? photos[lightboxIndex] : null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-5xl w-full max-h-[90vh] p-0 overflow-hidden rounded-2xl">
          <DialogTitle className="sr-only">Fotos e Vídeos {year}</DialogTitle>

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

          {/* Abas */}
          {showTabs && (
            <div className="flex border-b border-border px-6">
              <button
                onClick={() => setActiveTab("fotos")}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === "fotos"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Images className="w-4 h-4" />
                Fotos ({photos.length})
              </button>
              <button
                onClick={() => setActiveTab("videos")}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === "videos"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Youtube className="w-4 h-4" />
                Vídeos ({videos.length})
              </button>
            </div>
          )}

          {/* Conteúdo */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">

            {isEmpty && (
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
            )}

            {/* Grade de fotos */}
            {(!showTabs || activeTab === "fotos") && hasPhotos && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.map((photo, index) => (
                  <motion.button
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => openLightbox(index)}
                    className="group relative rounded-xl overflow-hidden aspect-video bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    <img
                      src={photo.thumb}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                      <p className="text-white text-sm font-semibold leading-tight">{photo.title}</p>
                      <span className={`mt-1 self-start text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[photo.category] ?? "bg-white/20 text-white"}`}>
                        {photo.category}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Grade de vídeos YouTube */}
            {(!showTabs || activeTab === "videos") && hasVideos && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {videos.map((video, index) => (
                  <motion.button
                    key={video.youtubeId}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setActiveVideoId(video.youtubeId)}
                    className="group relative rounded-xl overflow-hidden aspect-video bg-black focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                      loading="lazy"
                    />
                    {/* Botão play */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-white fill-white ml-1" />
                      </div>
                    </div>
                    {/* Legenda */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                      <p className="text-white text-sm font-semibold leading-tight text-left">{video.title}</p>
                      <span className={`mt-1 self-start text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[video.category] ?? "bg-white/20 text-white"}`}>
                        {video.category}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

          </div>
        </DialogContent>
      </Dialog>

      {/* Lightbox de fotos */}
      <AnimatePresence>
        {currentPhoto && (
          <Dialog open={lightboxIndex !== null} onOpenChange={(open) => !open && closeLightbox()}>
            <DialogContent className="max-w-4xl w-full p-0 overflow-hidden rounded-2xl bg-black border-0">
              <DialogTitle className="sr-only">{currentPhoto.title}</DialogTitle>
              <div className="relative w-full">
                <motion.img
                  key={lightboxIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  src={currentPhoto.src}
                  alt={currentPhoto.title}
                  className="w-full max-h-[75vh] object-contain"
                />
                {photos.length > 1 && (
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
                <button
                  onClick={closeLightbox}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                  aria-label="Fechar"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="px-5 py-4 bg-black flex items-center justify-between gap-3">
                  <div>
                    <p className="text-white font-semibold">{currentPhoto.title}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${categoryColors[currentPhoto.category] ?? "bg-white/20 text-white"}`}>
                      {currentPhoto.category}
                    </span>
                  </div>
                  {lightboxIndex !== null && (
                    <span className="text-white/50 text-sm shrink-0">
                      {lightboxIndex + 1} / {photos.length}
                    </span>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Player YouTube */}
      <AnimatePresence>
        {activeVideoId && (
          <Dialog open={!!activeVideoId} onOpenChange={(open) => !open && setActiveVideoId(null)}>
            <DialogContent className="max-w-4xl w-full p-0 overflow-hidden rounded-2xl bg-black border-0">
              <DialogTitle className="sr-only">Vídeo do YouTube</DialogTitle>
              <div className="relative w-full">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="aspect-video w-full"
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </motion.div>
                <button
                  onClick={() => setActiveVideoId(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                  aria-label="Fechar vídeo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
