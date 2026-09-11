'use client'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GlowCard } from '@/shared/components/ui/GlowCard'
import { getOptimizedImage } from '@/shared/lib/image'
import type { ScaleStat } from '../actions/products'

gsap.registerPlugin(ScrollTrigger)

const SCALE_LINE: Record<string, string> = {
  '1:64': 'El formato que llena vitrinas',
  '1:43': 'Precisión en formato medio',
  '1:18': 'Modelos de exhibición',
  '1:12': 'Ediciones de lujo'
}

export type ScaleTileData = ScaleStat & { image?: string | null }

export function ScaleTiles({ scales }: { scales: ScaleTileData[] }) {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.scale-tile', { clearProps: 'all' })
      })
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.scale-tile',
          { clipPath: 'inset(0 0 100% 0)', y: 24 },
          {
            clipPath: 'inset(0 0 0% 0)',
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: 'cubic-bezier(0.23,1,0.32,1)',
            clearProps: 'clip-path,opacity,transform',
            scrollTrigger: {
              trigger: '.scale-grid',
              start: 'top 88%',
              once: true
            }
          }
        )
      })
      return () => mm.revert()
    },
    { scope: sectionRef }
  )

  if (scales.length === 0) return null

  const [big, ...smalls] = scales

  return (
    <section
      ref={sectionRef}
      className='w-full flex flex-col gap-8 py-16 md:py-24'>
      <h2 className='m-0 px-6 text-2xl md:px-10 md:text-3xl font-extrabold text-(--text-primary) tracking-[-0.02em] font-(family-name:--font-display)'>
        Compra por escala
      </h2>

      <div className='scale-grid grid auto-rows-[240px] grid-cols-2 gap-3 px-6 md:auto-rows-[260px] md:gap-4 md:px-10 lg:auto-rows-280px] lg:grid-cols-3'>
        {/* Featured scale cell */}
        <GlowCard
          key={big.escala}
          href={`/catalogo?escala=${encodeURIComponent(big.escala)}`}
          glowColor='var(--brand)'
          className='scale-tile group relative col-span-2 overflow-hidden rounded-2xl border border-border no-underline will-change-transform lg:row-span-2'>
          <div className='absolute inset-0 bg-(--surface-2)'>
            {big.image && (
              <Image
                src={getOptimizedImage(big.image)}
                alt={`Modelos escala ${big.escala}`}
                fill
                quality={90}
                sizes='(min-width: 1024px) 60vw, 100vw'
                className='object-cover transition-transform duration-500 group-hover:scale-105'
                loading='lazy'
              />
            )}
          </div>
          <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent' />
          <span className='absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-transform duration-300 group-hover:rotate-45'>
            <ArrowUpRight className='h-5 w-5' />
          </span>
          <div className='absolute bottom-0 left-0 right-0 flex flex-col gap-1.5 p-6 md:p-7'>
            <span className='text-4xl md:text-5xl font-extrabold tracking-tight text-white font-(family-name:--font-display)'>
              {big.escala}
            </span>
            <span className='text-sm text-white/85 leading-relaxed'>
              {SCALE_LINE[big.escala]}
            </span>
            <span className='text-xs font-semibold text-white/70'>
              {big.count} modelos
            </span>
          </div>
        </GlowCard>

        {/* Small scale cells */}
        {smalls.map((s, i) => (
          <GlowCard
            key={s.escala}
            href={`/catalogo?escala=${encodeURIComponent(s.escala)}`}
            glowColor='var(--brand)'
            className={[
              'scale-tile group relative overflow-hidden rounded-2xl border border-border no-underline will-change-transform',
              i === 0
                ? 'lg:col-start-3 lg:row-start-1'
                : i === 1
                  ? 'lg:col-start-3 lg:row-start-2'
                  : 'lg:col-start-1 lg:row-start-3'
            ].join(' ')}>
            <div className='absolute inset-0 bg-(--surface-2)'>
              {s.image && (
                <Image
                  src={getOptimizedImage(s.image)}
                  alt={`Modelos escala ${s.escala}`}
                  fill
                  quality={90}
                  sizes='(min-width: 1024px) 33vw, 50vw'
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                  loading='lazy'
                />
              )}
            </div>
            <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent' />
            <div className='absolute bottom-0 left-0 right-0 flex flex-col gap-1 p-5'>
              <span className='text-2xl md:text-3xl font-extrabold tracking-tight text-white font-(family-name:--font-display)'>
                {s.escala}
              </span>
              <span className='text-xs font-semibold text-white/70'>
                {s.count} modelos
              </span>
            </div>
          </GlowCard>
        ))}

        {/* CTA cell */}
        <GlowCard
          href='/catalogo'
          glowColor='#ffffff'
          className='scale-tile group relative rounded-2xl bg-(--brand) p-5 no-underline transition-colors duration-300 will-change-transform hover:bg-(--brand-hover) lg:col-span-2 lg:col-start-2 lg:row-start-3 col-span-2 lg:col-span'>
          <div className='flex h-full flex-col justify-between'>
            <span className='inline-flex h-9 w-9 items-center justify-center self-end rounded-full bg-white/20 text-white transition-transform duration-300 group-hover:rotate-45'>
              <ArrowUpRight className='h-4 w-4' />
            </span>
            <div className='flex flex-col gap-1'>
              <span className='text-xl md:text-2xl font-extrabold tracking-tight text-white leading-snug font-(family-name:--font-display)'>
                Ver todo
                <br />
                el catálogo
              </span>
              <span className='text-xs font-semibold text-white/70'>
                Todas las escalas y marcas
              </span>
            </div>
          </div>
        </GlowCard>
      </div>
    </section>
  )
}

export default ScaleTiles