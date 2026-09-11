'use client'
import Link from 'next/link'
import Image from 'next/image'

import type { FeaturedProduct } from '../constants/featured-data'
import { Button } from '@/shared/components/ui/button'
import { getOptimizedImage } from '@/shared/lib/image'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import gsap from 'gsap'

interface HeroSectionProps {
  products: FeaturedProduct[]
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80'

const productImage = (p?: FeaturedProduct) =>
  getOptimizedImage(
    p?.imagenes?.find((img) => img.orden === 0)?.url ??
      p?.imagenes?.[0]?.url ??
      FALLBACK_IMAGE
  )

export const HeroSection = ({ products }: HeroSectionProps) => {
  const containerRef = useRef<HTMLElement>(null)
  const [tall, squareA, squareB] = products

  const inlineImage = (p?: FeaturedProduct, key?: string) =>
    p ? (
      <Image
        key={key}
        src={productImage(p)}
        alt=''
        width={96}
        height={64}
        quality={90}
        className='mx-1.5 hidden h-10 w-14 rounded-xl object-cover align-middle md:inline-block md:h-12 md:w-16 lg:h-14 lg:w-20'
        aria-hidden
      />
    ) : null

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.hero-fade', { clearProps: 'all' })
      })
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.hero-fade',
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.09,
            ease: 'cubic-bezier(0.23,1,0.32,1)',
            clearProps: 'opacity,transform'
          }
        )
        gsap.fromTo(
          '.hero-bento-cell',
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.08,
            ease: 'cubic-bezier(0.23,1,0.32,1)',
            clearProps: 'opacity,transform'
          }
        )
      })
      return () => mm.revert()
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      className='w-full py-12 md:py-20'>
      <div className='grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12'>
        <div className='hero-fade flex flex-col items-start gap-6 lg:col-span-7'>
          <span className='inline-flex w-max items-center gap-2 text-[11px] font-bold tracking-[0.3em] uppercase text-(--text-secondary)'>
            <span className='h-2 w-2 rounded-full bg-(--brand)' />
            Coleccionables a escala · Ecuador
          </span>

          <h1 className='m-0 text-[2.5rem] leading-[1.08] sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-[-0.03em] text-(--text-primary) font-[family-name:var(--font-display)]'>
            De coleccionistas{inlineImage(products[4], 'w1')}
            <br />
            para{' '}
            {inlineImage(products[3], 'w2')}
            <span className='text-(--brand)'>coleccionistas</span>
          </h1>

          <p className='max-w-md text-base leading-relaxed text-(--text-secondary) md:text-lg'>
            Piezas únicas y pre-ventas de las marcas que llenan tu vitrina, con
            envíos a todo Ecuador.
          </p>

          <div className='flex flex-wrap items-center gap-3 pt-1'>
            <Button
              asChild
              size='lg'
              className='rounded-full bg-(--brand) text-white font-bold tracking-wide px-8 transition-colors duration-200 hover:bg-(--brand-hover) active:scale-[0.97]'>
              <Link href='/catalogo'>Explorar catálogo</Link>
            </Button>
            <Button
              asChild
              size='lg'
              className='rounded-full border border-(--border) bg-(--surface) text-(--text-primary) font-bold tracking-wide px-8 transition-colors duration-200 hover:bg-(--surface-2) active:scale-[0.97]'>
              <Link href='/catalogo?estado=pre_venta'>Ver pre-ventas</Link>
            </Button>
          </div>
        </div>

        <div className='hero-bento grid grid-cols-2 gap-3 md:gap-4 lg:col-span-5'>
          {tall && (
            <Link
              href={`/producto/${tall.slug}`}
              className='hero-bento-cell group relative col-span-2 aspect-[16/9] overflow-hidden rounded-2xl border border-(--border) bg-(--surface) no-underline will-change-transform'>
              <Image
                src={productImage(tall)}
                alt={tall.nombre}
                fill
                quality={90}
                sizes='(min-width: 1024px) 45vw, 100vw'
                className='object-cover transition-transform duration-500 group-hover:scale-105'
                loading='eager'
              />
              <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent' />
              <div className='absolute bottom-0 left-0 right-0 flex flex-col gap-1 p-5'>
                <span className='text-white text-sm font-bold leading-snug line-clamp-1 font-[family-name:var(--font-display)]'>
                  {tall.nombre}
                </span>
                <span className='text-white/85 text-sm font-extrabold'>
                  ${tall.precio.toFixed(2)}
                </span>
              </div>
            </Link>
          )}

          {squareA && (
            <Link
              href={`/producto/${squareA.slug}`}
              className='hero-bento-cell group relative aspect-square overflow-hidden rounded-2xl border border-(--border) bg-(--surface) no-underline will-change-transform'>
              <Image
                src={productImage(squareA)}
                alt={squareA.nombre}
                fill
                quality={90}
                sizes='(min-width: 1024px) 22vw, 50vw'
                className='object-cover transition-transform duration-500 group-hover:scale-105'
                loading='lazy'
              />
              <div className='absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
              <div className='absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'>
                <span className='block text-white text-sm font-bold leading-snug line-clamp-1 font-[family-name:var(--font-display)]'>
                  {squareA.nombre}
                </span>
              </div>
            </Link>
          )}

          {squareB && (
            <Link
              href={`/producto/${squareB.slug}`}
              className='hero-bento-cell group relative aspect-square overflow-hidden rounded-2xl border border-(--border) bg-(--surface) no-underline will-change-transform'>
              <Image
                src={productImage(squareB)}
                alt={squareB.nombre}
                fill
                quality={90}
                sizes='(min-width: 1024px) 22vw, 50vw'
                className='object-cover transition-transform duration-500 group-hover:scale-105'
                loading='lazy'
              />
              <div className='absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
              <div className='absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'>
                <span className='block text-white text-sm font-bold leading-snug line-clamp-1 font-[family-name:var(--font-display)]'>
                  {squareB.nombre}
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export default HeroSection