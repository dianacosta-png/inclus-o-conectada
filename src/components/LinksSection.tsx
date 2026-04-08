import { motion } from "framer-motion";
import { ExternalLink, FileText, Building2, GraduationCap, Globe, BookMarked, Camera, Newspaper } from "lucide-react";

const categories = [
  {
    icon: FileText,
    title: "Formulário de Inscrição",
    description: "Preencha o formulário para participar do projeto IF Inclusão",
    url: "#",
    tag: "Inscrição",
  },
  {
    icon: BookMarked,
    title: "Regulamento",
    description: "Regras e diretrizes para participação no projeto",
    url: "#",
    tag: "Documento",
  },
  {
    icon: Globe,
    title: "Guia de Inclusão e Acessibilidade",
    description: "Orientações práticas sobre inclusão e acessibilidade",
    url: "#",
    tag: "Guia",
  },
  {
    icon: GraduationCap,
    title: "Apresentação da Oficina Preparatória",
    description: "Material da oficina preparatória do projeto",
    url: "#",
    tag: "Oficina",
  },
  {
    icon: Building2,
    title: "Materiais Gerais sobre Inclusão",
    description: "Recursos e referências sobre inclusão e diversidade",
    url: "#",
    tag: "Material",
  },
  {
    icon: Camera,
    title: "Fotos e Vídeos",
    description: "Galeria de fotos e vídeos do projeto",
    url: "#",
    tag: "Mídia",
  },
  {
    icon: Newspaper,
    title: "Notícias",
    description: "Notícias e novidades sobre o projeto IF Inclusão",
    url: "#",
    tag: "Notícia",
  },
];

const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020];

const LinksSection = () => {
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
            Recursos essenciais sobre inclusão, legislação e acessibilidade.
          </p>
        </motion.div>

        {years.map((year) => (
          <div key={year} className="mb-16 last:mb-0">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-8 text-primary border-b border-border pb-4"
            >
              {year}
            </motion.h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((link, i) => (
                <motion.a
                  key={`${year}-${link.title}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-background rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <link.icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      {link.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                    {link.title}
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{link.description}</p>
                </motion.a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LinksSection;
