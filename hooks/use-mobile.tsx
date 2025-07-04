"use client"

import { useState, useEffect } from "react"

export function useMobileDetector() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Función para verificar si es móvil basado en el ancho de la pantalla
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px es el breakpoint típico para tablets/móviles
    }

    // Verificar al cargar
    checkMobile()

    // Agregar listener para cambios de tamaño
    window.addEventListener("resize", checkMobile)

    // Limpiar listener
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}
