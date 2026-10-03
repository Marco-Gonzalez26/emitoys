'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { buildWhatsAppUrl } from '@/shared/lib/whatsapp'
import { getOptimizedImage } from '@/shared/lib/image'
import { NervPanel } from '@/shared/components/ui/NervPanel'
import { ESTADO_LABEL, type FeaturedProduct } from '../constants/featured-data'

type Props = {
  product: FeaturedProduct
  whatsappNumero: string
}

export function GarageHero({ product, whatsappNumero }: Props) {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const reduce =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return

      const tl = gsap.timeline({ defaults: { ease: 'cubic-bezier(0.23,1,0.32,1)' } })
      tl.fromTo(
        '.garage-tube',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.7, transformOrigin: 'left center' }
      )
        .fromTo(
          '.garage-photo',
          { opacity: 0, scale: 1.04 },
          { opacity: 1, scale: 1, duration: 0.9 },
          '-=0.45'
        )
        .fromTo(
          '.garage-line',
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
          '-=0.6'
        )
        .fromTo(
          '.garage-meta',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, clearProps: 'opacity,transform' },
          '-=0.4'
        )
    },
    { scope: sectionRef }
  )

  const rawImageUrl =
    product.imagenes?.find((img) => img.orden === 0)?.url ??
    product.imagenes?.[0]?.url ??
    null
  const imageUrl = rawImageUrl ? getOptimizedImage(rawImageUrl) : null
  const enOferta =
    typeof product.precio_oferta === 'number' &&
    product.precio_oferta < product.precio
  const precioFinal = enOferta ? product.precio_oferta! : product.precio
  const stockSegments: string[] = []
  if (product.estado === 'pre_venta') {
    if (product.pre_venta_cupo_total) {
      stockSegments.push(`Cupo total ${product.pre_venta_cupo_total}`)
    }
    stockSegments.push('Aparta con 10%')
  } else if (typeof product.stock === 'number') {
    stockSegments.push(`${product.stock} en stock`)
  }
  const hasNumero = whatsappNumero.trim() !== ''

  return (
    <section
      ref={sectionRef}
      className='relative w-full overflow-hidden bg-(--bg) bg-[repeating-linear-gradient(-45deg,rgba(26,26,26,0.025)_0_2px,transparent_2px_10px)]'>
      <span
        aria-hidden='true'
        className='pointer-events-none absolute -top-4 right-0 hidden font-[family-name:var(--font-garage)] text-[5rem] leading-none text-(--text-primary)/5 select-none md:block md:text-[6rem]'>
        {product.escala ?? '1:64'}
      </span>

      <div className='mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 pt-10 pb-12 md:grid-cols-12 md:gap-10 md:px-6 md:pt-16 md:pb-20'>
        <div className='garage-photo relative order-first md:order-last md:col-span-7'>
          <NervPanel cut={22} innerClassName='aspect-[4/3] bg-(--surface-2)'>
            <span
              aria-hidden='true'
              className='absolute top-0 bottom-0 left-0 z-10 w-1'
              style={{ background: product.marca?.color_hex ?? 'var(--brand)' }}
            />
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.nombre}
                fill
                priority
                quality={90}
                sizes='(min-width: 768px) 55vw, 100vw'
                className={
                  product.marca?.slug === 'hot-wheels'
                    ? 'object-contain p-6 md:p-10'
                    : 'object-cover'
                }
                draggable={false}
              />
            ) : (
              <div className='absolute inset-0 flex items-center justify-center'>
                <span
                  aria-hidden='true'
                  className='font-[family-name:var(--font-garage)] text-7xl text-(--text-secondary)/30 uppercase select-none'>
                  {product.marca?.nombre.slice(0, 2) ?? 'ET'}
                </span>
              </div>
            )}
            <div className='garage-tube neon-tube absolute inset-x-6 top-4 z-10 md:inset-x-10' />
            <div className='absolute bottom-4 left-4 flex items-center gap-2 md:bottom-5 md:left-5'>
              <span className='nerv-tag nerv-tag--light'>
                <span
                  aria-hidden='true'
                  className='h-2 w-2'
                  style={{ background: product.marca?.color_hex ?? 'var(--brand)' }}
                />
                {product.marca?.nombre}
              </span>
              <span
                className={
                  product.estado === 'pre_venta'
                    ? 'nerv-tag nerv-tag--alert'
                    : 'nerv-tag nerv-tag--info'
                }>
                {ESTADO_LABEL[product.estado]}
              </span>
            </div>
          </NervPanel>
        </div>

        <div className='flex flex-col items-start gap-5 md:col-span-5 md:gap-6'>
          <h1 className='garage-line m-0 font-[family-name:var(--font-garage)] text-[clamp(2.75rem,7vw,5.25rem)] leading-[0.95] tracking-[-0.01em] text-(--text-primary) uppercase'>
            {product.nombre}
          </h1>

          <p className='garage-line m-0 font-mono text-xs font-semibold tracking-[0.14em] text-(--text-secondary) uppercase tabular-nums'>
            Escala {product.escala ?? '—'} · ${precioFinal.toFixed(2)}
            {stockSegments.length > 0 ? ` · ${stockSegments.join(' · ')}` : ''}
          </p>

          <div className='garage-meta flex flex-wrap items-center gap-3'>
            {hasNumero ? (
              <a
                href={buildWhatsAppUrl(
                  whatsappNumero,
                  product.nombre,
                  product.escala ?? '',
                  precioFinal
                )}
                target='_blank'
                rel='noopener noreferrer'
                className='nerv-btn nerv-btn--go'>
                Quiero este por WhatsApp <ArrowUpRight className='h-4 w-4' />
              </a>
            ) : null}
            <Link
              href='/catalogo?estado=pre_venta'
              className='nerv-btn'>
              Ver pre-ventas
            </Link>
          </div>

          <p className='garage-meta m-0 flex items-center gap-3 text-base font-extrabold tracking-tight text-(--text-primary) md:text-lg'>
            <span aria-hidden='true' className='h-2 w-2 shrink-0 bg-(--brand)' />
            De coleccionistas para coleccionistas
            <span aria-hidden='true' className='h-2 w-2 shrink-0 bg-(--brand)' />
          </p>

          <p className='garage-meta m-0 text-sm leading-relaxed text-(--text-secondary)'>
            Te confirmamos stock y envío en el chat.
          </p>
        </div>
      </div>
    </section>
  )
}

export default GarageHero