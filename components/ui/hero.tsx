import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { sendMetaEvent } from "../../services/metaEventService";
import { useUserTracking } from "@/app/context/traking-context";
import { useState } from "react";

export function Hero() {
  const [isLoading, setIsLoading] = useState(false);
  const { sendTrackingData } = useUserTracking();

  // Función para manejar el registro y enviar evento a Meta
  const handleRegistration = async () => {
    setIsLoading(true);
    try {
      // Generar un email temporal para el evento (en producción esto vendría del formulario de registro)
      const tempEmail = `user_${Date.now()}@example.com`;
      
      // Enviar evento a Meta
      const success = await sendMetaEvent(tempEmail, "10");
      
      if (success) {
        console.log('Evento de registro enviado exitosamente a Meta');
      } else {
        console.warn('No se pudo enviar el evento a Meta');
      }

      try {
        await sendTrackingData();
        console.log('Datos de tracking enviados exitosamente');
      } catch (error) {
        console.warn('Error enviando datos de tracking:', error);
      }
      
      // Redirigir al usuario a la URL de registro
      const registerUrl = process.env.NEXT_PUBLIC_REGISTER_URL;
      if (registerUrl) {
        window.location.href = registerUrl;
      }
    } catch (error) {
      console.error('Error en el proceso de registro:', error);
      // Aún redirigir al usuario aunque falle el evento
      const registerUrl = process.env.NEXT_PUBLIC_REGISTER_URL;
      if (registerUrl) {
        window.location.href = registerUrl;
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-start mt-10 justify-center bg-gradient-to-b from-black to-gray-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent" />
        {/* <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-20" /> */}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <motion.h1 
            className="font-bebas text-6xl md:text-8xl text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            CONTROL TOTAL
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Gestioná tu diversión de forma simple y rápida. Sin intermediarios, sin esperas.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              onClick={handleRegistration}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white font-bebas text-2xl rounded-full hover:bg-green-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed z-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 w-6 h-6 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  Empezar Ahora
                  <ArrowRight className="ml-2 w-6 h-6" />
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
      
      {/* Oso para desktop - versión original */}
      <div className="hidden md:block absolute left-1/2 -translate-x-1/2 bottom-0 z-20">
        <img
          src="/new2.png"
          alt="MooneyMaker Mascot"
          className="w-96 h-96 object-contain drop-shadow-[0_0_20px_#008f39] select-none pointer-events-none"
          style={{ marginBottom: '-2px' }}
        />
      </div>

      {/* Oso para mobile - versión pequeña al final */}
      <div className="md:hidden absolute left-1/2 -translate-x-1/2 bottom-0 z-20">
        <img
          src="/new2.png"
          alt="MooneyMaker Mascot"
          className="w-64 h-64 object-contain drop-shadow-[0_0_10px_#008f39] select-none pointer-events-none"
          style={{ marginBottom: '-2px' }}
        />
      </div>
    </section>
  );
} 