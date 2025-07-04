"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ChevronLeft, 
  ChevronRight,
  UserPlus,
  LogIn,
  CheckCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

type Step = {
  src: string
  alt: string
  title: string
  description: string
  icon: React.ReactNode
}

export default function RegistrationStepsSlider() {
  const steps: Step[] = [
    {
      src: "/payment4.png",
      alt: "Paso 1 - Llená el formulario",
      title: "1. Llená el formulario con tus datos",
      description: "Proporcioná tu información básica para crear tu cuenta de forma segura.",
      icon: <UserPlus className="w-6 h-6 text-[#008F39]" />,
    },
    {
      src: "/payment3.png",
      alt: "Paso 2 - Accedé a tu cuenta",
      title: "2. Accedé a tu cuenta",
      description: "Ingresá con tus credenciales y explorá la plataforma.",
      icon: <LogIn className="w-6 h-6 text-[#008F39]" />
    },
    {
      src: "/payment1.png",
      alt: "Paso 3 - Jugá y Ganá",
      title: "3. ¡Y listo! Jugá y Ganá",
      description: "Cargá saldo, elegí tus juegos favoritos y retirá tus ganancias cuando quieras.",
      icon: <CheckCircle className="w-6 h-6 text-[#008F39]" />,
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const nextSlide = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % steps.length)
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating, steps.length])

  const prevSlide = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + steps.length) % steps.length)
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating, steps.length])

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 7000)
    return () => clearInterval(interval)
  }, [nextSlide])

  return (
    <section className="py-12 lg:py-16 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute -top-16 -left-16 w-52 h-52 bg-custom-green/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-16 -right-16 w-52 h-52 bg-custom-green/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="container mx-auto px-2 sm:px-4">
        <div className="text-center mb-10 lg:mb-12 px-3 lg:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Así de Fácil es Empezar
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-xl lg:max-w-2xl mx-auto">
            En solo tres pasos estarás disfrutando de la experiencia completa.
          </p>
        </div>

        <div className="relative max-w-4xl lg:max-w-5xl mx-auto">
          <div className="overflow-hidden rounded-2xl shadow-2xl bg-gray-800/60 backdrop-blur-md border border-gray-700/80">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="w-full lg:w-3/5 p-3 lg:p-6">
                <div
                  className="relative aspect-[9/16] sm:aspect-[4/3] md:aspect-[16/10] lg:aspect-[4/3.5] overflow-hidden rounded-xl border-2 border-[#008F39]/30"
                  style={{ boxShadow: "0 0 25px rgba(0, 143, 57, 0.25)" }}
                >
                  <img
                    key={steps[currentIndex].src}
                    src={steps[currentIndex].src || "/placeholder.svg"}
                    alt={steps[currentIndex].alt}
                    className={cn(
                      "absolute inset-0 w-full h-full object-contain transition-all duration-500 ease-in-out transform",
                      isAnimating ? "opacity-0 scale-90" : "opacity-100 scale-100",
                    )}
                  />
                </div>
              </div>

              <div className="w-full lg:w-2/5 p-3 lg:p-6">
                <Card className="bg-gray-900/70 border-none shadow-lg">
                  <CardContent className="p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-3 sm:mb-4">
                      <div className="bg-[#008F39]/20 p-2 sm:p-3 rounded-full flex items-center justify-center">
                        {steps[currentIndex].icon}
                      </div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#008F39]">{steps[currentIndex].title}</h3>
                    </div>
                    <p className="text-sm sm:text-base md:text-md lg:text-lg text-gray-300 mb-5 sm:mb-7 min-h-[60px] sm:min-h-[80px]">
                      {steps[currentIndex].description}
                    </p>

                    <div className="flex justify-between items-center mb-5">
                      <div className="flex gap-2">
                        {steps.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              if (isAnimating) return;
                              setIsAnimating(true);
                              setCurrentIndex(index);
                              setTimeout(() => setIsAnimating(false), 500);
                            }}
                            className={cn(
                              "w-2.5 h-2.5 rounded-full transition-all duration-300 ease-in-out",
                              index === currentIndex ? "bg-[#008F39] scale-125 w-6" : "bg-gray-600 hover:bg-gray-500",
                            )}
                            aria-label={`Ir al paso ${index + 1}`}
                          />
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={prevSlide}
                          disabled={isAnimating}
                          className="rounded-full border-gray-600 hover:bg-[#008F39]/20 hover:border-[#008F39] text-gray-300 hover:text-white"
                        >
                          <ChevronLeft className="h-5 w-5" />
                          <span className="sr-only">Anterior</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={nextSlide}
                          disabled={isAnimating}
                          className="rounded-full border-gray-600 hover:bg-[#008F39]/20 hover:border-[#008F39] text-gray-300 hover:text-white"
                        >
                          <ChevronRight className="h-5 w-5" />
                          <span className="sr-only">Siguiente</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
