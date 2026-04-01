import { motion } from "framer-motion";
import { Accessibility, BookOpen, BrainCircuit, HeartHandshake, Scale, Megaphone } from "lucide-react";

const pillars = [
  {
    icon: Accessibility,
    title: "Acessibilidade",
    description: "Adaptação de espaços físicos e digitais para garantir autonomia e independência.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: BookOpen,
    title: "Educação Inclusiva",
    description: "Práticas pedagógicas que respeitam as diferenças e potencializam o aprendizado de todos.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: Scale,
    title: "Direitos e Legislação",
    description: "Divulgação de leis e políticas que protegem os direitos das pessoas com deficiência.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: BrainCircuit,
    title: "Tecnologias Assistivas",
    description: "Recursos e ferramentas tecnológicas que auxiliam na inclusão e participação social.",
    color: "text-green",
    bg: "bg-green/10",
  },
  {
    icon: HeartHandshake,
    title: "Apoio e Acolhimento",
    description: "Rede de suporte emocional e prático para estudantes e comunidade.",
    color: "text-warm",
    bg: "bg-warm/10",
  },
  {
    icon: Megaphone,
    title: "Conscientização",
    description: "Campanhas e eventos para sensibilizar sobre a importância da inclusão.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

const PillarsSection = () => {
  return (
    <section className="py-24 gradient-warm">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Pilares de <span className="text-primary">Atuação</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Nossas áreas de ação para construir um ambiente verdadeiramente inclusivo.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group"
            >
              <div className={`w-12 h-12 rounded-xl ${pillar.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <pillar.icon className={`w-6 h-6 ${pillar.color}`} />
              </div>
              <h3 className="text-lg font-bold mb-2">{pillar.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PillarsSection;
