import { motion } from "framer-motion";
import { FileText, Download, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import materialsData from "@/content/materials.json";

const categoryColors: Record<string, string> = {
  Cartilha: "bg-blue-100 text-blue-700",
  Artigo: "bg-purple-100 text-purple-700",
  Guia: "bg-primary/10 text-primary",
  Glossário: "bg-amber-100 text-amber-700",
  Legislação: "bg-rose-100 text-rose-700",
  Educativo: "bg-teal-100 text-teal-700",
  Acadêmico: "bg-indigo-100 text-indigo-700",
};

type MaterialsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  year: number;
};

export function MaterialsModal({ isOpen, onClose, year }: MaterialsModalProps) {
  const materials = materialsData.materials;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl w-full max-h-[85vh] p-0 overflow-hidden rounded-2xl">
        <DialogTitle className="sr-only">Materiais Gerais sobre Inclusão {year}</DialogTitle>

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border bg-card">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Materiais Gerais sobre Inclusão</h2>
            <p className="text-sm text-muted-foreground">IF Inclusão Conectada</p>
          </div>
          <Badge className="ml-1 bg-primary/10 text-primary border-0 font-semibold">
            {year}
          </Badge>
        </div>

        {/* List */}
        <div className="overflow-y-auto max-h-[calc(85vh-80px)] p-4">
          {materials.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
                <FileText className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-lg font-semibold">Em breve</p>
              <p className="text-muted-foreground text-sm">Os materiais de {year} serão disponibilizados em breve.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {materials.map((mat, i) => (
                <motion.a
                  key={mat.file}
                  href={mat.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="group flex items-center justify-between gap-3 rounded-xl px-4 py-3 border border-border hover:border-primary/30 hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {mat.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full hidden sm:inline-block ${categoryColors[mat.category] ?? "bg-muted text-muted-foreground"}`}>
                      {mat.category}
                    </span>
                    <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </motion.a>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
