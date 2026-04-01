import { motion } from "framer-motion";
import { Heart, Users, ShieldCheck, Ban } from "lucide-react";

const items = [
  {
    icon: Heart,
    title: "Direitos e Dignidade",
    description:
      "Fomentar o respeito pelos direitos, dignidade e inclusão das pessoas com necessidades específicas.",
    className: "gradient-card-teal",
  },
  {
    icon: Users,
    title: "Conscientização",
    description:
      "Desenvolver ações de conscientização para garantir o êxito e a permanência de estudantes do público de inclusão.",
    className: "gradient-card-warm",
  },
  {
    icon: ShieldCheck,
    title: "Acesso à Informação",
    description:
      "Romper barreiras atitudinais por meio do acesso à informação.",
    className: "gradient-card-purple",
  },
  {
    icon: Ban,
    title: "Prevenção à Violência",
    description:
      "Prevenir tipos de violência (bullying, discriminação e preconceito) no ambiente escolar.",
    className: "gradient-card-teal",
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
            Objetivos do <span className="text-primary">Projeto</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            O IF Inclusão, em sua 14ª edição, é um evento anual promovido pela Coordenadoria do Núcleo de Atendimento às Pessoas com Necessidades Específicas (NAPNE) do IFPR – Campus Telêmaco Borba.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
