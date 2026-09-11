'use client'

import { useRef, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'

gsap.registerPlugin(ScrollTrigger)

export function Reveal({
  children,
  className,
  delay = 0
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(ref.current, { clearProps: 'all' })
      })
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          ref.current,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay,
            ease: 'cubic-bezier(0.23,1,0.32,1)',
            clearProps: 'opacity,transform',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 88%',
              once: true
            }
          }
        )
      })
      return () => mm.revert()
    },
    { scope: ref }
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
