"use client"

import { useEffect, useRef } from "react"

export default function BackgroundGraphics() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ajustar el tamaño del canvas al tamaño de la ventana
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    // Crear partículas
    const particles: Particle[] = []
    const particleCount = Math.min(70, Math.floor(window.innerWidth / 25)) // Aumentamos un poco la densidad

    // Definimos tipos de formas para las partículas
    type ParticleShape = "circle" | "square" | "rectangle"

    interface Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      opacity: number
      rotation: number
      rotationSpeed: number
      shape: ParticleShape
      aspectRatio?: number // Para rectángulos (ancho/alto)
    }

    const shapes: ParticleShape[] = ["circle", "square", "rectangle"]

    for (let i = 0; i < particleCount; i++) {
      const shape = shapes[Math.floor(Math.random() * shapes.length)]
      let aspectRatio
      if (shape === "rectangle") {
        aspectRatio = Math.random() * 0.5 + 0.5 // Rectángulos más parecidos a cartas (e.g., 0.5 a 1.0 de ancho/alto)
      }

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 2, // Un poco más grandes y variadas
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        color: `hsl(${Math.random() * 20 + 30}, 100%, ${Math.random() * 20 + 50}%)`, // Tonos dorados y ámbar
        opacity: Math.random() * 0.4 + 0.1, // Un poco menos opacas para sutileza
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01, // Rotación más lenta
        shape,
        aspectRatio,
      })
    }

    // Dibujar líneas de conexión entre partículas cercanas
    const drawConnections = (particles: Particle[]) => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) { // Reducimos un poco la distancia para menos líneas
            ctx.beginPath()
            ctx.strokeStyle = `rgba(245, 158, 11, ${0.08 * (1 - distance / 120)})` // Más sutiles
            ctx.lineWidth = 0.3
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    // Dibujar gráficos de fondo
    const drawGraphics = () => {
      // Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Dibujar partículas
      particles.forEach((particle) => {
        ctx.save()
        ctx.translate(particle.x, particle.y)
        ctx.rotate(particle.rotation)

        // Dibujar partícula
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = particle.color

        switch (particle.shape) {
          case "circle":
            ctx.beginPath()
            ctx.arc(0, 0, particle.size, 0, Math.PI * 2)
            ctx.fill()
            break
          case "square":
            ctx.beginPath()
            ctx.rect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
            ctx.fill()
            break
          case "rectangle":
            const rectHeight = particle.size
            const rectWidth = particle.size * (particle.aspectRatio || 0.7) // default aspect ratio si no está definido
            ctx.beginPath()
            ctx.rect(-rectWidth / 2, -rectHeight / 2, rectWidth, rectHeight)
            ctx.fill()
            break
        }

        // Actualizar posición
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.rotation += particle.rotationSpeed

        // Rebote en los bordes
        if (particle.x < -particle.size || particle.x > canvas.width + particle.size) particle.speedX *= -1
        if (particle.y < -particle.size || particle.y > canvas.height + particle.size) particle.speedY *= -1
        
        // Reiniciar posición si se alejan demasiado para mantenerlas en pantalla
        if (particle.x > canvas.width + particle.size * 2) particle.x = -particle.size * 2;
        if (particle.x < -particle.size * 2) particle.x = canvas.width + particle.size * 2;
        if (particle.y > canvas.height + particle.size * 2) particle.y = -particle.size * 2;
        if (particle.y < -particle.size * 2) particle.y = canvas.height + particle.size * 2;

        ctx.restore()
      })

      // Dibujar conexiones
      drawConnections(particles)

      // Continuar animación
      requestAnimationFrame(drawGraphics)
    }

    // Iniciar animación
    drawGraphics()

    // Limpiar al desmontar
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" style={{ opacity: 0.35 }} />
  )
}
