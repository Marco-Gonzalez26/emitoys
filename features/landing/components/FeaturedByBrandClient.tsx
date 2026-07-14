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

  useGSAP(() => {
    gsap.from('.featured-heading', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.featured-heading',
        start: 'top 85%',
        once: true
      }
    })
  }, [])

  return (
    <section ref={sectionRef} className='w-full py-20 flex flex-col gap-14'>
      <div className='featured-heading flex flex-col gap-2'>
        <span className='text-[11px] font-bold tracking-[0.25em] uppercase text-neutral-900/35'>
          Colección
        </span>
        <h2 className='text-3xl md:text-4xl font-extrabold text-brand tracking-tight m-0'>
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
