'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ProductCard } from '@/shared/components/cards/ProductCard'
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

    gsap.fromTo(
      titleRef.current,
      { x: -32, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'cubic-bezier(0.23,1,0.32,1)',
        clearProps: 'opacity,transform',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 85%',
          once: true
        }
      }
    )

    const cards = rowRef.current.querySelectorAll('article')
    gsap.fromTo(
      cards,
      { x: 48, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.07,
        ease: 'cubic-bezier(0.23,1,0.32,1)',
        clearProps: 'opacity,transform',
        scrollTrigger: {
          trigger: rowRef.current,
          start: 'top 85%',
          once: true
        }
      }
    )
  }, [])

  return (
    <section className='flex flex-col gap-5'>
      <div
        ref={titleRef}
        className='flex items-center justify-between px-6 md:px-10'>
        <div className='flex items-center gap-3'>
          <div className='w-1 h-8 rounded-full bg-(--brand)' />
          <h2 className='text-xl md:text-2xl font-bold text-(--text-primary) tracking-tight m-0 font-(family-name:--font-display)'>
            {marca.nombre}
          </h2>
        </div>

        <Link
          href={`/catalogo?marca=${marca.slug}`}
          className='text-sm font-semibold no-underline transition-colors duration-200 text-(--brand) hover:text-(--brand-hover)'>
          Ver todos <ArrowRight className='inline-block w-4 h-4' />
        </Link>
      </div>

      <div
        ref={rowRef}
        className='flex gap-4 overflow-x-auto px-6 md:px-10 pb-4 no-scrollbar snap-x snap-mandatory'>
        {productos.map((p) => (
          <div key={p.id} className='snap-start'>
            <ProductCard
              product={p}
              whatsappNumero={whatsappNumero}
              className='w-70 shrink-0'
            />
          </div>
        ))}
      </div>
    </section>
  )
}
