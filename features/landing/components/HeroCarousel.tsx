'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/shared/lib/utils'
import { buildWhatsAppUrl } from '@/shared/lib/whatsapp'
import { getOptimizedImage } from '@/shared/lib/image'
import type { FeaturedProduct } from '../constants/featured-data'
import { ESTADO_LABEL } from '../constants/featured-data'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80'

type Props = {
  products: FeaturedProduct[]
  whatsappNumero: string
  interval?: number
}

const productImage = (p: FeaturedProduct) =>
  getOptimizedImage(
    p.imagenes?.find((img) => img.orden === 0)?.url ??
      p.imagenes?.[0]?.url ??
      FALLBACK_IMAGE
  )

export function HeroCarousel({ products, whatsappNumero, interval = 5500 }: Props) {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
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
    goTo(current === products.length - 1 ? 0 : current + 1)
  }, [current, products.length, goTo])

  const previous = useCallback(() => {
    goTo(current === 0 ? products.length - 1 : current - 1)
  }, [current, products.length, goTo])

  useGSAP(
    () => {
      if (prev === null) return
      const incoming = slideRefs.current[current]
      const outgoing = slideRefs.current[prev]
      if (!incoming || !outgoing) return

      const reduce =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reduce) {
        gsap.set(incoming, { opacity: 0 })
        const tl = gsap.timeline({
          onComplete: () => {
            isAnimating.current = false
          }
        })
        tl.to(outgoing, { opacity: 0, duration: 0.3 }).to(incoming, {
          opacity: 1,
          duration: 0.3
        })
        return
      }

      gsap.set(incoming, { opacity: 0, scale: 1.04 })

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
          duration: 0.7,
          ease: 'cubic-bezier(0.23,1,0.32,1)'
        },
        '-=0.3'
      )
    },
    { dependencies: [current], scope: containerRef }
  )

  useEffect(() => {
    if (!products.length) return
    const timer = setInterval(next, interval)
    return () => clearInterval(timer)
  }, [next, interval, products.length])

  useGSAP(
    () => {
      const first = slideRefs.current[0]
      if (!first) return
      const reduce =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reduce) {
        gsap.set(first, { opacity: 1 })
        return
      }

      gsap.fromTo(
        first,
        { opacity: 0, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 0.9, ease: 'cubic-bezier(0.23,1,0.32,1)' }
      )
    },
    { scope: containerRef }
  )

  if (!products.length) return null

  const product = products[current]
  const agotado = product.estado === 'agotado'
  const enOferta =
    !agotado &&
    typeof product.precio_oferta === 'number' &&
    product.precio_oferta < product.precio
  const precioFinal = enOferta ? product.precio_oferta! : product.precio

  return (
    <div
      ref={containerRef}
      className='relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-(--border) bg-(--surface)'>
      {/* Image stage */}
      <div className='relative h-64 shrink-0 overflow-hidden bg-(--surface-2) md:h-[26rem]'>
        {products.map((p, i) => (
          <div
            key={p.id}
            ref={(el) => {
              slideRefs.current[i] = el
            }}
            className='absolute inset-0 flex items-center justify-center'
            style={{ opacity: i === 0 ? 1 : 0 }}>
            <Image
              width={1600}
              height={1600}
              src={productImage(p)}
              alt={p.nombre}
              quality={90}
              sizes='(min-width: 1024px) 45vw, 100vw'
              className={cn(
                'h-full w-full',
                p.marca?.slug === 'hot-wheels'
                  ? 'object-contain p-6 md:p-10'
                  : 'object-cover',
                p.estado === 'agotado' && 'opacity-40 grayscale'
              )}
              draggable={false}
              priority={i === 0}
            />
          </div>
        ))}

        {/* Badges */}
        <div className='absolute left-4 top-4 z-20 flex flex-col items-start gap-1.5'>
          <span
            className={cn(
              'text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full',
              {
                'bg-green-100 text-green-800': product.estado === 'disponible',
                'text-white font-extrabold': product.estado === 'pre_venta',
                'bg-(--surface-3) text-(--text-secondary) pointer-events-none': agotado
              }
            )}
            style={
              product.estado === 'pre_venta' ? { background: 'var(--brand)' } : undefined
            }>
            {ESTADO_LABEL[product.estado]}
          </span>
          {enOferta && (
            <span className='text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-red-500 text-white'>
              Oferta
            </span>
          )}
        </div>

        {/* Dots */}
        <div className='absolute right-4 top-4 z-20 flex items-center gap-1.5'>
          {products.map((_, i) => (
            <button
              key={i}
              aria-label={`Ir a ${i + 1}`}
              onClick={() => goTo(i)}
              className={cn(
                'h-1.5 rounded-full border-none transition-all duration-300 cursor-pointer',
                i === current
                  ? 'w-6 bg-(--brand)'
                  : 'w-1.5 bg-(--text-secondary)/40 hover:bg-(--text-secondary)/70'
              )}
            />
          ))}
        </div>

        {/* Arrows */}
        <button
          aria-label='Anterior'
          onClick={previous}
          className='absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 w-9 h-9 items-center justify-center rounded-full border border-(--border) bg-(--surface) text-(--text-primary) shadow-[var(--shadow-lift)] transition-all duration-200 hover:bg-(--surface-2) cursor-pointer active:scale-[0.97] md:flex'>
          <ChevronLeft className='w-4 h-4' />
        </button>
        <button
          aria-label='Siguiente'
          onClick={next}
          className='absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 w-9 h-9 items-center justify-center rounded-full border border-(--border) bg-(--surface) text-(--text-primary) shadow-[var(--shadow-lift)] transition-all duration-200 hover:bg-(--surface-2) cursor-pointer active:scale-[0.97] md:flex'>
          <ChevronRight className='w-4 h-4' />
        </button>
      </div>

      {/* Body */}
      <div className='flex flex-col gap-4 p-5 md:p-6'>
        <div className='flex flex-col gap-1.5'>
          <h3 className='m-0 text-lg md:text-xl font-extrabold tracking-tight text-(--text-primary) leading-snug line-clamp-1 font-[family-name:var(--font-display)]'>
            {product.nombre}
          </h3>
          <div className='flex items-center gap-2 text-xs font-semibold text-(--text-secondary)'>
            <span>{product.marca?.nombre}</span>
            {product.escala && (
              <>
                <span className='text-(--text-secondary)/40'>·</span>
                <span>Escala {product.escala}</span>
              </>
            )}
          </div>
        </div>

        <div className='flex items-center justify-between gap-4'>
          <div className='flex flex-col gap-0.5'>
            {enOferta && (
              <span className='text-xs text-(--text-secondary) line-through'>
                ${product.precio.toFixed(2)}
              </span>
            )}
            <span className='text-xl md:text-2xl font-extrabold text-(--text-primary) leading-none'>
              ${precioFinal.toFixed(2)}
            </span>
          </div>

          {!agotado && (
            <a
              href={buildWhatsAppUrl(
                whatsappNumero,
                product.nombre,
                product.escala ?? '',
                precioFinal
              )}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex w-max items-center gap-1.5 rounded-full bg-(--brand) text-white text-sm font-bold px-6 py-2.5 tracking-wide no-underline transition-colors duration-200 hover:bg-(--brand-hover) active:scale-[0.97]'>
              Quiero este <ArrowUpRight className='w-4 h-4' />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default HeroCarousel