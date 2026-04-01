import { motion } from "framer-motion";
import { Target, Eye, Handshake } from "lucide-react";

const items = [
  {
    icon: Target,
    title: "Missão",
    description:
      "Promover a inclusão plena de pessoas com deficiência no ambiente educacional e social, eliminando barreiras e criando oportunidades igualitárias.",
    className: "gradient-card-teal",
  },
  {
    icon: Eye,
    title: "Visão",
    description:
      "Ser referência em práticas inclusivas, construindo uma comunidade onde a diversidade é celebrada e todos têm acesso às mesmas oportunidades.",
    className: "gradient-card-warm",
  },
  {
    icon: Handshake,
    title: "Valores",
    description:
      "Respeito à diversidade, empatia, acessibilidade, equidade, colaboração e compromisso com os direitos humanos.",
    className: "gradient-card-purple",
  },
];

const AboutSection = () => {
  return (
    <section id="sobre" className="py-24 bg-card">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Sobre o <span className="text-primary">Projeto</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            O IF Inclusão atua na promoção de políticas e ações que garantam a participação efetiva
            de pessoas com deficiência em todos os espaços.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`${item.className} rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
