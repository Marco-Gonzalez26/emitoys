'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Brand } from '@/shared/types'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

type Slide = {
  image: string
  brand: Brand
}

type Props = {
  slides: Slide[]
  interval?: number
}

export function HeroCarousel({ slides, interval = 5000 }: Props) {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const badgeRef = useRef<HTMLDivElement>(null)
  const isAnimating = useRef(false)

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating.current || index === current) return
      isAnimating.current = true
      setPrev(current)
      setCurrent(index)
    },
    [current]
  )

  const next = useCallback(() => {
    goTo(current === slides.length - 1 ? 0 : current + 1)
  }, [current, slides.length, goTo])

  const previous = useCallback(() => {
    goTo(current === 0 ? slides.length - 1 : current - 1)
  }, [current, slides.length, goTo])

  
  useGSAP(
    () => {
      if (prev === null) return

      const incoming = slideRefs.current[current]
      const outgoing = slideRefs.current[prev]

      if (!incoming || !outgoing) return

      gsap.set(incoming, { opacity: 0, scale: 1.05 })

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating.current = false
        }
      })

      tl.to(outgoing, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut'
      }).to(
        incoming,
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out'
        },
        '-=0.3'
      )

      
      if (badgeRef.current) {
        gsap.fromTo(
          badgeRef.current,
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', delay: 0.3 }
        )
      }
    },
    { dependencies: [current], scope: containerRef }
  )

  useEffect(() => {
    const timer = setInterval(next, interval)
    return () => clearInterval(timer)
  }, [next, interval])

  useGSAP(
    () => {
      const first = slideRefs.current[0]
      if (!first) return
      gsap.fromTo(
        first,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
      )
    },
    { scope: containerRef }
  )

  const slide = slides[current]

  return (
    <div ref={containerRef} className='relative flex-1 min-w-0 overflow-hidden'>

      {slides.map((s, i) => (
        <div
          key={s.brand.id}
          ref={(el) => {
            slideRefs.current[i] = el
          }}
          className='absolute inset-0'
          style={{ opacity: i === 0 ? 1 : 0 }}>
          <img
            src={s.image}
            alt={s.brand.nombre}
            className='w-full h-full object-cover'
          />
        </div>
      ))}





      <div
        ref={badgeRef}
        className='absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20'>
        <span
          className='w-2 h-2 rounded-full shrink-0 transition-colors duration-300'
          style={{ background: slide.brand.color_hex }}
        />
        <span className='text-white text-xs font-bold tracking-wide'>
          {slide.brand.nombre}
        </span>
      </div>


      <button
        onClick={previous}
        className='absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/50 transition-all duration-200 cursor-pointer z-10'>
        ←
      </button>
      <button
        onClick={next}
        className='absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/50 transition-all duration-200 cursor-pointer z-10'>
        →
      </button>

  
      <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10'>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer border-none ${
              i === current
                ? 'w-6 bg-white'
                : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
