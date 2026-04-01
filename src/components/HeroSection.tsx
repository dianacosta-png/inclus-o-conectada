import { motion } from "framer-motion";
import { Heart, Users, ArrowDown } from "lucide-react";
import InclusionShapes from "./InclusionShapes";
import heroImage from "@/assets/hero-inclusion.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-warm">
      <InclusionShapes />
      <div className="container relative z-10 flex flex-col lg:flex-row items-center gap-12 py-20">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6">
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Promovendo acessibilidade e igualdade</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
            <span className="text-foreground">IF</span>{" "}
            <span className="text-primary">Inclusão</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 leading-relaxed">
            Um projeto dedicado a promover a inclusão de pessoas com deficiência, garantindo acesso à informação, 
            direitos e oportunidades para todos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a
              href="#sobre"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              <Users className="w-5 h-5" />
              Conheça o Projeto
            </a>
            <a
              href="#links"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-primary text-primary font-semibold text-lg hover:bg-primary/5 transition-colors"
            >
              Links Úteis
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 flex justify-center"
        >
          <img
            src={heroImage}
            alt="Ilustração representando a inclusão de pessoas com diferentes deficiências, unidas em círculo"
            className="w-full max-w-lg drop-shadow-xl"
          />
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#sobre" aria-label="Rolar para baixo">
          <ArrowDown className="w-6 h-6 text-muted-foreground animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
