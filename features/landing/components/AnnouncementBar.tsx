'use client'

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const MESSAGES = [
  'Pre-ventas desde 10% de apartado',
  'Nuevos modelos cada semana',
  'Envíos a todo Ecuador',
  'Únete al grupo WhatsApp de coleccionistas'
]

export function AnnouncementBar() {
  const [current, setCurrent] = useState(0)
  const textRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      if (!textRef.current) return
      const reduce =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) {
        gsap.set(textRef.current, { opacity: 1, y: 0 })
        return
      }
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 6 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'cubic-bezier(0.23,1,0.32,1)'
        }
      )
    },
    { dependencies: [current], scope: textRef }
  )

  useGSAP(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % MESSAGES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className='sticky top-16 z-40 flex h-9 items-center justify-center gap-2 overflow-hidden border-b border-white/15 bg-(--brand)/75 px-4 text-white text-xs font-bold tracking-[0.08em] uppercase backdrop-blur-md'>
      <span
        key={current}
        ref={textRef}
        className='whitespace-nowrap truncate max-w-[90vw] text-center'>
        {MESSAGES[current]}
      </span>
    </div>
  )
}

export default AnnouncementBar