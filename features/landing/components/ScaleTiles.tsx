'use client'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { NervPanel } from '@/shared/components/ui/NervPanel'
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
      <div className='flex items-center gap-6 px-6 md:px-10'>
        <h2 className='m-0 text-2xl md:text-3xl font-extrabold text-(--text-primary) tracking-[-0.02em] font-(family-name:--font-display)'>
          Compra por escala
        </h2>
        <span aria-hidden='true' className='nerv-rule flex-1' />
      </div>

      <div className='scale-grid grid auto-rows-[240px] grid-cols-2 gap-3 px-6 md:auto-rows-[260px] md:gap-4 md:px-10 lg:auto-rows-[280px] lg:grid-cols-3'>
        {/* Featured scale cell */}
        <NervPanel
          key={big.escala}
          href={`/catalogo?escala=${encodeURIComponent(big.escala)}`}
          glow='var(--brand)'
          glowSize={320}
          className='scale-tile group col-span-2 [--cut:22px] lg:row-span-2'>
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
          <span className='nerv-tag nerv-tag--black absolute top-4 right-6 h-10 w-10 justify-center p-0 group-hover:[--tag-fill:var(--cta)] group-hover:[--tag-ink:var(--eva-black)]'>
            <ArrowUpRight className='h-5 w-5' />
          </span>
          <div className='absolute bottom-0 left-0 right-0 flex flex-col gap-1.5 p-6 md:p-7'>
            <span className='text-4xl font-extrabold tracking-tight text-white md:text-5xl font-(family-name:--font-display)'>
              {big.escala}
            </span>
            <span className='text-sm text-white/85 leading-relaxed'>
              {SCALE_LINE[big.escala]}
            </span>
            <span className='font-mono text-xs font-semibold tracking-[0.14em] text-(--eva-lime) uppercase tabular-nums'>
              {big.count} modelos
            </span>
          </div>
        </NervPanel>

        {/* Small scale cells */}
        {smalls.map((s, i) => (
          <NervPanel
            key={s.escala}
            href={`/catalogo?escala=${encodeURIComponent(s.escala)}`}
            glow='var(--brand)'
            className={[
              'scale-tile group',
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
              <span className='text-2xl font-extrabold tracking-tight text-white md:text-3xl font-(family-name:--font-display)'>
                {s.escala}
              </span>
              <span className='font-mono text-xs font-semibold tracking-[0.14em] text-(--eva-lime) uppercase tabular-nums'>
                {s.count} modelos
              </span>
            </div>
          </NervPanel>
        ))}

        {/* CTA cell */}
        <NervPanel
          href='/catalogo'
          glow='var(--paper)'
          className='scale-tile group col-span-2 [--panel-fill:var(--brand)] hover:[--panel-fill:var(--brand-hover)] lg:col-span-2 lg:col-start-2 lg:row-start-3'
          innerClassName='flex flex-col justify-between p-5'>
          <span className='nerv-tag nerv-tag--black h-9 w-9 justify-center self-end p-0 group-hover:[--tag-fill:var(--cta)] group-hover:[--tag-ink:var(--eva-black)]'>
            <ArrowUpRight className='h-4 w-4' />
          </span>
          <div className='flex flex-col gap-1'>
            <span className='text-xl font-extrabold leading-snug tracking-tight text-(--brand-on) md:text-2xl font-(family-name:--font-display)'>
              Ver todo
              <br />
              el catálogo
            </span>
            <span className='font-mono text-xs font-semibold tracking-[0.14em] text-(--brand-on) uppercase'>
              Todas las escalas y marcas
            </span>
          </div>
        </NervPanel>
      </div>
    </section>
  )
}

export default ScaleTiles