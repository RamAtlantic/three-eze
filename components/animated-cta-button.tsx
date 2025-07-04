"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion, RepeatType } from "framer-motion"
import { ArrowRight, Sparkles, Loader2 } from "lucide-react"

interface AnimatedCtaButtonProps {
  href: string
  text: string
  icon?: React.ReactNode
  size?: "default" | "large"
  variant?: "default" | "white"
  showLoadingOnClick?: boolean
}

export default function AnimatedCtaButton({
  href,
  text,
  icon,
  size = "default",
  variant = "default",
  showLoadingOnClick = false,
}: AnimatedCtaButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Configuración de estilos basados en las props
  const sizeClasses = size === "large" ? "py-3 px-5 text-base" : "py-2 px-4 text-sm"
  const iconSize = size === "large" ? "h-5 w-5" : "h-4 w-4"

  // Colores basados en la variante
  const currentTextColor = variant === "white" ? "text-custom-green" : "text-white"
  const bgColor = variant === "white" ? "bg-white" : "bg-custom-green"
  const glowColor = variant === "white" ? "from-white to-custom-green/50" : "from-custom-green to-white/50"

  // Icono predeterminado o personalizado
  const defaultIconNode = <ArrowRight className={`ml-2 ${iconSize} ${currentTextColor}`} />
  let displayIconNode: React.ReactNode
  if (icon) {
    if (React.isValidElement(icon)) {
      displayIconNode = React.cloneElement(icon as React.ReactElement<any>, { 
        className: `ml-2 ${iconSize} ${currentTextColor}` 
      })
    } else {
      displayIconNode = icon
    }
  } else {
    displayIconNode = defaultIconNode
  }

  const handleClick = () => {
    if (showLoadingOnClick) {
      setIsLoading(true)
      // La redirección la maneja el componente Link.
      // Podríamos añadir un timeout para resetear isLoading si la página no se desmonta (ej. error de red)
      // setTimeout(() => setIsLoading(false), 5000); // Ejemplo de reseteo
    }
  }

  // Animaciones condicionales
  const buttonAnimateProps = isLoading ? {} : { y: [0, -4, 0] }
  const buttonTransitionProps = isLoading ? {} : {
    y: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as RepeatType,
      ease: "easeInOut",
    },
  }
  const glowAnimateProps = isLoading ? { opacity: 0, scale: 1 } : {
    scale: [1, 1.05, 1],
    opacity: [0.5, 0.8, 0.5],
  }
  const glowTransitionProps = isLoading ? {} : {
    duration: 2,
    repeat: Infinity,
    repeatType: "reverse" as RepeatType,
    ease: "easeInOut",
  }

  return (
    <motion.div
      className="relative inline-block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Efecto de brillo simplificado */}
      <motion.div
        className={`absolute -inset-0.5 rounded-lg blur-md bg-gradient-to-r ${glowColor} opacity-70`}
        animate={glowAnimateProps}
        transition={glowTransitionProps}
      />

      <Link href={href} target="_blank" rel="noopener noreferrer" passHref legacyBehavior>
        <motion.button
          onClick={handleClick}
          disabled={isLoading}
          className={`relative z-10 ${bgColor} ${currentTextColor} font-bold rounded-lg border-2 border-custom-green shadow-lg ${sizeClasses} flex items-center justify-center ${isLoading ? 'cursor-wait' : ''}`}
          whileHover={isLoading ? {} : {
            scale: 1.03,
            boxShadow: "0 10px 25px -5px rgba(0, 143, 57, 0.4)",
          }}
          whileTap={isLoading ? {} : { scale: 0.98 }}
          animate={buttonAnimateProps}
          transition={buttonTransitionProps}
        >
          {isLoading ? (
            <>
              <Loader2 className={`mr-2 ${iconSize} animate-spin ${currentTextColor}`} />
              Cargando...
            </>
          ) : (
            <>
              {text}
              {displayIconNode}
            </>
          )}
        </motion.button>
      </Link>
    </motion.div>
  )
}
