import { motion } from "framer-motion";
import { DollarSign, Clock, Eye, CheckCircle, Smartphone, Check } from "lucide-react";

const features = [
  {
    icon: <DollarSign className="w-8 h-8 text-green-500" />,
    title: "Carga Instantánea",
    description: "Cargá saldo en tu cuenta al instante, sin esperas ni complicaciones."
  },
  {
    icon: <Clock className="w-8 h-8 text-green-500" />,
    title: "Retiros Rápidos",
    description: "Retirá tus ganancias directo a tu cuenta bancaria en menos de 3 minutos."
  },
  {
    icon: <Eye className="w-8 h-8 text-green-500" />,
    title: "Control Total",
    description: "Ves todo lo que ganás y cargás en tiempo real, con total transparencia."
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-green-500" />,
    title: "Sin Intermediarios",
    description: "Sin esperar a nadie, ni hacer filas ni mandar mensajes. Todo lo manejás vos."
  },
  {
    icon: <Smartphone className="w-8 h-8 text-green-500" />,
    title: "Acceso Total",
    description: "Accedé desde cualquier dispositivo, en cualquier momento y lugar."
  },
  {
    icon: <Check className="w-8 h-8 text-green-500" />,
    title: "Todo en Uno",
    description: "Todo desde un solo lugar. Fácil, claro y rápido."
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-bebas text-5xl md:text-6xl text-white mb-4">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Una experiencia única diseñada para darte el control total de tu diversión
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-green-500/50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="font-bebas text-2xl text-white mb-2">{feature.title}</h3>
              <p className="text-white/60">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 