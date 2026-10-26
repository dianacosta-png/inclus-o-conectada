import { motion } from "framer-motion";
import { Newspaper, ExternalLink, CalendarDays } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import newsData from "@/content/news.json";

type NewsItem = {
  year: number;
  title: string;
  source: string;
  url: string;
};

const newsByYear: Record<number, NewsItem[]> = {};
for (const item of newsData.news) {
  (newsByYear[item.year] ??= []).push(item);
}

export const newsYears = new Set(Object.keys(newsByYear).map(Number));

export const hasNewsFor = (year: number) => (newsByYear[year]?.length ?? 0) > 0;

type NewsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  year: number;
};

export function NewsModal({ isOpen, onClose, year }: NewsModalProps) {
  const news = newsByYear[year] ?? [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl w-full max-h-[85vh] p-0 overflow-hidden rounded-2xl">
        <DialogTitle className="sr-only">Notícias {year}</DialogTitle>

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border bg-card">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Newspaper className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Notícias</h2>
            <p className="text-sm text-muted-foreground">
              Escolha a notícia que deseja abrir
            </p>
          </div>
          <Badge className="ml-1 bg-primary/10 text-primary border-0 font-semibold">
            {year}
          </Badge>
        </div>

        {/* List */}
        <div className="overflow-y-auto max-h-[calc(85vh-80px)] p-4">
          {news.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
                <Newspaper className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-lg font-semibold">Em breve</p>
              <p className="text-muted-foreground text-sm">
                As notícias de {year} serão disponibilizadas em breve.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {news.map((item, i) => (
                <motion.a
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group flex items-start justify-between gap-3 rounded-xl px-4 py-3 border border-border hover:border-primary/30 hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CalendarDays className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {item.source}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 shrink-0 mt-1 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.a>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
