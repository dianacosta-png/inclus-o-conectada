import { motion } from "framer-motion";
import { Heart, Users, ShieldCheck, Ban, type LucideIcon } from "lucide-react";
import aboutData from "@/content/about.json";

const iconMap: Record<string, LucideIcon> = {
  Heart,
  Users,
  ShieldCheck,
  Ban,
};

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
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            {aboutData.description}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {aboutData.items.map((item, i) => {
            const Icon = iconMap[item.icon] ?? Heart;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`${item.className} rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
