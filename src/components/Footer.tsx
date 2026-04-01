import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 bg-foreground">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-background">
              IF <span className="text-primary">Inclusão</span>
            </h3>
            <p className="text-background/60 mt-1 text-sm">
              Construindo um futuro mais inclusivo para todos.
            </p>
          </div>
          <div className="flex items-center gap-1 text-background/60 text-sm">
            Feito com <Heart className="w-4 h-4 text-secondary fill-secondary mx-1" /> pelo projeto IF Inclusão
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-background/10 text-center">
          <p className="text-background/40 text-xs">
            © {new Date().getFullYear()} IF Inclusão. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
