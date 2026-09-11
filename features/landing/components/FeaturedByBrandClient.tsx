'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { BrandRow } from './BrandRow'
import type { BrandWithProducts } from '../constants/featured-data'

gsap.registerPlugin(ScrollTrigger)

interface FeaturedByBrandClientProps {
  brandsWithProducts: BrandWithProducts[]
  whatsappNumero: string
}

export function FeaturedByBrandClient({
  brandsWithProducts,
  whatsappNumero
}: FeaturedByBrandClientProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.featured-heading', { clearProps: 'all' })
      })
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.featured-heading',
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'cubic-bezier(0.23,1,0.32,1)',
            clearProps: 'opacity,transform',
            scrollTrigger: {
              trigger: '.featured-heading',
              start: 'top 85%',
              once: true
            }
          }
        )
      })
      return () => mm.revert()
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className='w-full py-20 md:py-24 flex flex-col gap-14'>
      <div className='featured-heading flex flex-col gap-3 px-6 md:px-10'>
        <span className='text-[11px] font-bold tracking-[0.3em] uppercase text-(--text-secondary)'>
          Colección
        </span>
        <h2 className='text-3xl md:text-5xl font-extrabold text-(--text-primary) tracking-[-0.02em] m-0 font-[family-name:var(--font-display)]'>
          Destacados por marca
        </h2>
      </div>

      {brandsWithProducts.map(({ marca, productos }) => (
        <BrandRow
          key={marca.id}
          marca={marca}
          productos={productos}
          whatsappNumero={whatsappNumero}
        />
      ))}
    </section>
  )
}
