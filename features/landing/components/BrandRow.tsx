'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { FeaturedProductCard } from './FeaturedProductCard'
import type { FeaturedProduct } from '../constants/featured-data'
import type { Brand } from '@/shared/types'

gsap.registerPlugin(ScrollTrigger)

export function BrandRow({
  marca,
  productos,
  whatsappNumero
}: {
  marca: Brand
  productos: FeaturedProduct[]
  whatsappNumero: string
}) {
  const rowRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!titleRef.current || !rowRef.current) return

    gsap.from(titleRef.current, {
      x: -40,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: titleRef.current,
        start: 'top 85%',
        once: true
      }
    })

    const cards = rowRef.current.querySelectorAll('article')
    gsap.from(cards, {
      x: 60,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: rowRef.current,
        start: 'top 85%',
        once: true
      }
    })
  }, [])

  return (
    <section className='flex flex-col gap-5'>
      <div
        ref={titleRef}
        className='flex items-center justify-between px-6 md:px-14'>
        <div className='flex items-center gap-3'>
          <div
            className='w-1 h-8 rounded-full'
            style={{ background: marca.color_hex }}
          />
          <h2 className='text-xl md:text-2xl font-extrabold text-brand tracking-tight m-0'>
            {marca.nombre}
          </h2>
        </div>

        <Link
          href={`/catalogo?marca=${marca.slug}`}
          className='text-sm font-semibold no-underline transition-colors duration-200'
          style={{ color: marca.color_hex }}>
          Ver todos <ArrowRight className='inline-block w-4 h-4' />
        </Link>
      </div>

      <div
        ref={rowRef}
        className='flex gap-4 overflow-x-auto px-6 md:px-14 pb-4 scrollbar-none snap-x snap-mandatory'
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
        {productos.map((p) => (
          <div key={p.id} className='snap-start'>
            <FeaturedProductCard
              producto={p}
              whatsappNumero={whatsappNumero}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
