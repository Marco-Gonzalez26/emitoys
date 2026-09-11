'use client'

import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'
import { GlowCard } from '@/shared/components/ui/GlowCard'
import type { Brand } from '@/shared/types'

gsap.registerPlugin(ScrollTrigger)

export function BrandMarquee({ brands }: { brands: Brand[] }) {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.marca-card, .marcas-heading', { clearProps: 'all' })
      })
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.marcas-heading',
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'cubic-bezier(0.23,1,0.32,1)',
            clearProps: 'opacity,transform',
            scrollTrigger: {
              trigger: '.marcas-heading',
              start: 'top 88%',
              once: true
            }
          }
        )
        gsap.fromTo(
          '.marca-card',
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.06,
            ease: 'cubic-bezier(0.23,1,0.32,1)',
            clearProps: 'opacity,transform',
            scrollTrigger: {
              trigger: '.marcas-track',
              start: 'top 90%',
              once: true
            }
          }
        )
      })
      return () => mm.revert()
    },
    { scope: sectionRef }
  )

  if (brands.length === 0) return null

  return (
    <section
      ref={sectionRef}
      className='w-full max-w-7xl mx-auto flex flex-col gap-8 px-6 py-16 md:px-10 md:py-24 snap-x snap-mandatory'>
      <h2 className='marcas-heading m-0 text-2xl md:text-3xl font-extrabold text-(--text-primary) tracking-[-0.02em] font-[family-name:var(--font-display)]'>
        Marcas oficiales
      </h2>

      <div
        className='marcas-track flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory md:gap-4'>
        {brands.map((brand) => (
          <GlowCard
            key={brand.id}
            href={`/catalogo?marca=${brand.slug}`}
            glowColor={brand.color_hex}
            className='marca-card group relative w-40 md:w-44 shrink-0 snap-start rounded-2xl border border-(--border) bg-(--surface) p-5 no-underline transition-all duration-200 will-change-transform hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] active:scale-[0.97]'>
            <div className='flex h-full flex-col items-start justify-between gap-6'>
              <span className='inline-flex h-7 w-7 items-center justify-center rounded-full bg-(--surface-2) text-(--text-secondary) transition-colors duration-200 group-hover:bg-(--surface-3)'>
                <ArrowUpRight className='h-4 w-4' />
              </span>

              <span className='flex flex-col items-start gap-2.5'>
                <span className='text-lg md:text-xl font-extrabold tracking-tight text-(--text-primary) font-[family-name:var(--font-display)]'>
                  {brand.nombre}
                </span>
                <span
                  className='h-1 w-10 origin-left scale-x-0 rounded-full transition-transform duration-300 group-hover:scale-x-100'
                  style={{ background: brand.color_hex }}
                />
              </span>
            </div>
          </GlowCard>
        ))}
      </div>
    </section>
  )
}

export default BrandMarquee