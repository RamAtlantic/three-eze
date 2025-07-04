"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function AnimatedGif() {
  return (
    <motion.div
      className="absolute z-10 w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64"
      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{
        duration: 0.8,
        type: "spring",
        stiffness: 100,
      }}
      style={{
        filter: "drop-shadow(0 0 15px rgba(0,143,57,0.5))",
      }}
    >
      <Image
        src="https://firebasestorage.googleapis.com/v0/b/mayoristakaurymdp.appspot.com/o/regist%2FHistoria%20de%20Instagram%20de%20descuento%20tienda%20neo%CC%81n%20rosa%20y%20azul%20(Facebook%20Post).gif?alt=media&token=8f474de3-dbb2-4ecf-96ea-c543cc750735"
        alt="Animación neón"
        width={250}
        height={250}
        className="object-contain"
      />

      {/* Efecto de brillo alrededor del GIF */}
      <div className="absolute inset-0 -z-10 bg-custom-green/10 blur-xl rounded-full"></div>
    </motion.div>
  )
}
