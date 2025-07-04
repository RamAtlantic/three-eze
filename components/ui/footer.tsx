import { motion } from "framer-motion";

export function Footer() {
  return (
    <motion.footer
      className="bg-black/90 border-t border-white/10 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} MooneyMaker. Todos los derechos reservados.
          </p>
          <p className="text-white/40 text-xs mt-2">
            Juega con responsabilidad. Solo para mayores de 18 años.
          </p>
        </div>
      </div>
    </motion.footer>
  );
} 