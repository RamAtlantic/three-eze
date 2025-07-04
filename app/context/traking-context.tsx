'use client'

import React, { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react'
import axios from 'axios'

export interface UserTrackingData {
  // UID único de la visita
  visitUid: string
  
  // Información del navegador
  userAgent: string
  language: string
  platform: string
  cookieEnabled: boolean
  doNotTrack: string | null
  
  // Información de la pantalla
  screenWidth: number
  screenHeight: number
  viewportWidth: number
  viewportHeight: number
  colorDepth: number
  pixelRatio: number
  
  // Información de la conexión
  connectionType?: string
  effectiveType?: string
  downlink?: number
  rtt?: number
  
  // Información de ubicación
  ipAddress?: string
  country?: string
  city?: string
  timezone: string
  
  // Información de tiempo
  sessionStartTime: number
  totalActiveTime: number
  lastActivityTime: number
  
  // Información de interacciones
  pageViews: number
  clicks: number
  scrollDepth: number
  mouseMovements: number
  
  // Información de la página
  referrer: string
  currentUrl: string
  pageLoadTime?: number
  
  // Información del dispositivo
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  touchSupport: boolean
  
  // Información adicional
  sessionId: string
  timestamp: number
}

export interface TrackingEvent {
  type: 'page_view' | 'click' | 'scroll' | 'focus' | 'blur' | 'session_end'
  data: Partial<UserTrackingData>
  timestamp: number
  visitUid: string
}

interface TrackingContextType {
  trackingData: UserTrackingData | null
  sendTrackingData: () => Promise<any>
  sendInitTracking: () => Promise<any>
  incrementPageViews: () => void
  getSessionId: () => string
  getVisitUid: () => string
  getEvents: () => TrackingEvent[]
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined)

export const TrackingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [trackingData, setTrackingData] = useState<UserTrackingData | null>(null)
  const [events, setEvents] = useState<TrackingEvent[]>([])
  
  // Referencias para tracking (UNA SOLA INSTANCIA)
  const startTime = useRef<number>(Date.now())
  const totalActiveTime = useRef<number>(0)
  const lastActivityTime = useRef<number>(Date.now())
  const isActive = useRef<boolean>(true)
  const sessionId = useRef<string>(`${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
  const visitUid = useRef<string>(`visit_${Date.now()}_${Math.random().toString(36).substr(2, 15)}`)
  const mouseMovementCount = useRef<number>(0)
  const clickCount = useRef<number>(0)
  const scrollDepth = useRef<number>(0)
  const pageViews = useRef<number>(1)
  const isSending = useRef<boolean>(false)
  const isInitialized = useRef<boolean>(false) // Evitar múltiples inicializaciones
  const hasSentBeforeUnload = useRef<boolean>(false) // Evitar envíos duplicados en beforeunload
  const hasSentInitTracking = useRef<boolean>(false) // Evitar envíos duplicados de init tracking

  // Función para obtener IP
  const getIPAddress = async (): Promise<string | undefined> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip
    } catch (error) {
      console.warn('No se pudo obtener la IP:', error)
      return undefined
    }
  }

  // Función para obtener información de conexión
  const getConnectionInfo = () => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      return {
        connectionType: connection.effectiveType || connection.type,
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      }
    }
    return {}
  }

  // Función para detectar dispositivo
  const getDeviceInfo = () => {
    const userAgent = navigator.userAgent
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(userAgent)
    const isDesktop = !isMobile && !isTablet

    return {
      isMobile,
      isTablet,
      isDesktop,
      touchSupport: 'ontouchstart' in window
    }
  }

  // Función para obtener datos completos de tracking
  const getTrackingData = async (): Promise<UserTrackingData> => {
    const ipAddress = await getIPAddress()
    
    return {
      // UID único de la visita
      visitUid: visitUid.current,
      
      // Información del navegador
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      
      // Información de la pantalla
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      
      // Información de la conexión
      ...getConnectionInfo(),
      
      // Información de ubicación
      ipAddress,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      
      // Información de tiempo
      sessionStartTime: startTime.current,
      totalActiveTime: isActive.current ? totalActiveTime.current + (Date.now() - lastActivityTime.current) : totalActiveTime.current,
      lastActivityTime: lastActivityTime.current,
      
      // Información de interacciones
      pageViews: pageViews.current,
      clicks: clickCount.current,
      scrollDepth: scrollDepth.current,
      mouseMovements: mouseMovementCount.current,
      
      // Información de la página
      referrer: document.referrer,
      currentUrl: window.location.href,
      
      // Información del dispositivo
      ...getDeviceInfo(),
      
      // Información adicional
      sessionId: sessionId.current,
      timestamp: Date.now()
    }
  }

  // Función para enviar datos de tracking
  const sendTrackingData = async () => {
    // Evitar llamadas duplicadas
    if (isSending.current) {
      console.log('Ya hay una llamada de tracking en progreso, saltando...')
      return
    }

    try {
      isSending.current = true
      hasSentBeforeUnload.current = true // Marcar que ya se envió
      
      // Resetear el flag después de 5 segundos
      setTimeout(() => {
        hasSentBeforeUnload.current = false
        console.log('Flag hasSentBeforeUnload reseteado')
      }, 5000)
      
      const data = await getTrackingData()
      
      const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT
      const accessToken = process.env.NEXT_PUBLIC_META_ACCESS_TOKEN
      const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
      
      if (!endpoint) {
        throw new Error('Endpoint no configurado')
      }

      if (!accessToken) {
        throw new Error('Access Token no configurado')
      }

      if (!pixelId) {
        throw new Error('Pixel ID no configurado')
      }

      const payload = {
        trackingData: data,
        events: events,
        access_token: accessToken,
        pixel_id: pixelId
      }

      const response = await axios.post(`${endpoint}/tracking`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      })

      console.log('Datos de tracking enviados exitosamente:', response.data)
      return response.data
    } catch (error) {
      console.error('Error enviando datos de tracking:', error)
      // Fallback: guardar en localStorage
      saveToLocalStorage()
      throw error
    } finally {
      isSending.current = false
    }
  }

  // Función para guardar en localStorage como fallback
  const saveToLocalStorage = () => {
    try {
      getTrackingData().then(trackingData => {
        const existingData = localStorage.getItem('trackingData')
        const data = existingData ? JSON.parse(existingData) : []
        data.push({
          trackingData,
          events,
          timestamp: Date.now()
        })
        localStorage.setItem('trackingData', JSON.stringify(data))
      })
    } catch (error) {
      console.error('Error guardando en localStorage:', error)
    }
  }

  // Función para enviar init tracking
  const sendInitTracking = async () => {
    // Evitar envíos duplicados
    if (hasSentInitTracking.current) {
      console.log('Init tracking ya fue enviado, saltando...')
      return
    }

    try {
      hasSentInitTracking.current = true
      
      const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT
      const accessToken = process.env.NEXT_PUBLIC_META_ACCESS_TOKEN
      const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
      
      if (!endpoint) {
        throw new Error('Endpoint no configurado')
      }

      const payload = {
        visitUid: visitUid.current,
        sessionId: sessionId.current,
        page_id: pixelId || null,
        timestamp: Date.now(),
        access_token: accessToken || null,
        pixel_id: pixelId || null
      }

      const response = await axios.post(`${endpoint}/init-tracking`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      })

      console.log('Init tracking enviado exitosamente:', response.data)
      return response.data
    } catch (error) {
      console.error('Error enviando init tracking:', error)
      // Fallback: guardar en localStorage
      saveInitToLocalStorage()
      throw error
    }
  }

  // Función para guardar init tracking en localStorage como fallback
  const saveInitToLocalStorage = () => {
    try {
const accessToken = process.env.NEXT_PUBLIC_META_ACCESS_TOKEN
      const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
      
      const initData = {
        visitUid: visitUid.current,
        sessionId: sessionId.current,
        page_id: pixelId || null,
        timestamp: Date.now(),
        access_token: accessToken || null,
        pixel_id: pixelId || null
      }
      
      const existingData = localStorage.getItem('initTrackingData')
      const data = existingData ? JSON.parse(existingData) : []
      data.push({
        ...initData,
        created_at: new Date().toISOString()
      })
      localStorage.setItem('initTrackingData', JSON.stringify(data))
      console.log('Init tracking guardado en localStorage como fallback')
    } catch (error) {
      console.error('Error guardando init tracking en localStorage:', error)
    }
  }

  // Función para agregar evento
  const addEvent = (type: TrackingEvent['type'], data: Partial<UserTrackingData> = {}) => {
    const event: TrackingEvent = {
      type,
      data,
      timestamp: Date.now(),
      visitUid: visitUid.current
    }
    setEvents(prev => [...prev, event])
  }

  // Función para incrementar page views
  const incrementPageViews = () => {
    pageViews.current++
  }

  // Función para obtener session ID
  const getSessionId = () => {
    return sessionId.current
  }

  // Función para obtener visit UID
  const getVisitUid = () => {
    return visitUid.current
  }

  // Función para obtener eventos
  const getEvents = () => {
    return events
  }

  // Timer functions
  const startTimer = () => {
    if (!isActive.current) {
      isActive.current = true
      lastActivityTime.current = Date.now()
    }
  }

  const stopTimer = () => {
    if (isActive.current) {
      totalActiveTime.current += Date.now() - lastActivityTime.current
      isActive.current = false
    }
  }

  // Update scroll depth
  const updateScrollDepth = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercent = (scrollTop / docHeight) * 100
    scrollDepth.current = Math.max(scrollDepth.current, scrollPercent)
  }

  useEffect(() => {
    // Evitar múltiples inicializaciones
    if (isInitialized.current) {
      return
    }
    isInitialized.current = true

    console.log('Inicializando Tracking Provider...')

    // Enviar init tracking inmediatamente cuando el usuario entra
    sendInitTracking().catch(error => {
      console.error('Error en init tracking:', error)
    })

    // Obtener datos iniciales
    getTrackingData().then(setTrackingData)

    // Timer events
    const handleFocus = () => {
      startTimer()
      addEvent('focus')
    }

    const handleBlur = () => {
      stopTimer()
      addEvent('blur')
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        stopTimer()
      } else {
        startTimer()
      }
    }

    // Scroll tracking
    let scrollTimeout: NodeJS.Timeout
    const handleScroll = () => {
      updateScrollDepth()
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        addEvent('scroll', { scrollDepth: scrollDepth.current })
      }, 100)
    }

    // Click tracking
    const handleClick = () => {
      clickCount.current++
      addEvent('click', { clicks: clickCount.current })
    }

    // Mouse movement tracking (throttled)
    let mouseTimeout: NodeJS.Timeout
    const handleMouseMove = () => {
      mouseMovementCount.current++
      clearTimeout(mouseTimeout)
      mouseTimeout = setTimeout(() => {
        if (mouseMovementCount.current % 10 === 0) {
          addEvent('scroll', { mouseMovements: mouseMovementCount.current })
        }
      }, 1000)
    }

    // Before unload
    const handleBeforeUnload = () => {
      stopTimer()
      // Solo enviar si no se está enviando ya Y no se ha enviado recientemente
      if (!isSending.current && !hasSentBeforeUnload.current) {
        console.log('Enviando tracking data en beforeunload...')
        sendTrackingData()
      } else {
        console.log('Saltando envío en beforeunload (ya se envió recientemente)')
      }
    }

    // Page load time
    const handleLoad = () => {
      if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart
        addEvent('page_view', { pageLoadTime: loadTime })
      }
    }

    // Event listeners
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('click', handleClick)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('load', handleLoad)

    // Actualizar datos cada 30 segundos
    const interval = setInterval(async () => {
      const data = await getTrackingData()
      setTrackingData(data)
    }, 30000)

    return () => {
      console.log('Limpiando Tracking Provider...')
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('load', handleLoad)
      
      // Solo enviar datos al desmontar si no se está enviando ya Y no se ha enviado recientemente
      if (!isSending.current && !hasSentBeforeUnload.current) {
        console.log('Enviando tracking data en cleanup...')
        sendTrackingData()
      } else {
        console.log('Saltando envío en cleanup (ya se envió recientemente)')
      }
    }
  }, [])

  const value: TrackingContextType = {
    trackingData,
    sendTrackingData,
    sendInitTracking,
    incrementPageViews,
    getSessionId,
    getVisitUid,
    getEvents
  }

  return (
    <TrackingContext.Provider value={value}>
      {children}
    </TrackingContext.Provider>
  )
}

// Hook simplificado que usa el context
export const useUserTracking = (): TrackingContextType => {
  const context = useContext(TrackingContext)
  if (context === undefined) {
    throw new Error('useUserTracking debe ser usado dentro de TrackingProvider')
  }
  return context
} 