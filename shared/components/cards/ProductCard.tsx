'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { GlowCard } from '@/shared/components/ui/GlowCard'
import { buildWhatsAppUrl } from '@/shared/lib/whatsapp'
import { getOptimizedImage } from '@/shared/lib/image'

export interface ProductCardItem {
  slug: string
  nombre: string
  precio: number
  precio_oferta: number | null
  estado: 'disponible' | 'pre_venta' | 'agotado'
  escala: string | null
  marca?: { slug: string; color_hex: string } | null
  imagenes?: { url: string; orden: number }[]
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80'

const ESTADO_LABEL: Record<ProductCardItem['estado'], string> = {
  disponible: 'Disponible',
  pre_venta: 'Pre-venta',
  agotado: 'Agotado'
}

export function ProductCard({
  product,
  whatsappNumero,
  className
}: {
  product: ProductCardItem
  whatsappNumero: string
  className?: string
}) {
  const agotado = product.estado === 'agotado'
  const enOferta =
    !agotado &&
    typeof product.precio_oferta === 'number' &&
    product.precio_oferta < product.precio
  const precioFinal = enOferta ? product.precio_oferta! : product.precio
  const isHotWheels = product.marca?.slug === 'hot-wheels'

  const imagenUrl = getOptimizedImage(
    product.imagenes?.find((img) => img.orden === 0)?.url ??
      product.imagenes?.[0]?.url ??
      FALLBACK_IMAGE
  )

  return (
    <GlowCard
      glowColor={product.marca?.color_hex}
      className={cn(
        'group flex flex-col overflow-hidden border border-border bg-(--surface) transition-all duration-300 will-change-transform hover:-translate-y-1 hover:shadow-(--shadow-lift) mt-2',
        className
      )}>
      <div className='flex h-full flex-col'>
        <Link href={`/producto/${product.slug}`} className='block'>
          <div className='relative aspect-4/3 overflow-hidden bg-(--surface-2)'>
            <Image
              src={imagenUrl}
              alt={product.nombre}
              fill
              sizes='(min-width: 768px) 33vw, 50vw'
              quality={90}
              className={cn(
                'transition-transform duration-300 group-hover:scale-105',
                isHotWheels ? 'object-contain p-4' : 'object-cover',
                { 'opacity-40 grayscale': agotado }
              )}
            />

            <div className='absolute left-3 top-3 z-20 flex flex-col items-start gap-1.5'>
              {product.escala && (
                <span className='w-max rounded-full bg-(--brand) px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white'>
                  Escala {product.escala}
                </span>
              )}
              <span
                className={cn(
                  'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest',
                  {
                    'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300':
                      product.estado === 'disponible',
                    'bg-(--brand) text-white font-extrabold':
                      product.estado === 'pre_venta',
                    'pointer-events-none bg-(--surface-3) text-(--text-secondary)':
                      agotado
                  }
                )}>
                {ESTADO_LABEL[product.estado]}
              </span>
              {enOferta && (
                <span className='rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white'>
                  Oferta
                </span>
              )}
            </div>
          </div>
        </Link>

        <div className='flex flex-1 flex-col gap-3 bg-(--surface) p-4'>
          <div className='flex flex-col gap-1'>
            <Link href={`/producto/${product.slug}`} className='no-underline'>
              <h3 className='m-0 line-clamp-2 text-sm font-bold leading-snug text-(--text-primary) font-[family-name:var(--font-display)]'>
                {product.nombre}
              </h3>
            </Link>
            <div className='flex flex-col gap-0.5'>
              {enOferta && (
                <span className='text-xs text-(--text-secondary) line-through'>
                  ${product.precio.toFixed(2)}
                </span>
              )}
              <span className='text-lg font-extrabold leading-none text-(--text-primary)'>
                ${precioFinal.toFixed(2)}
              </span>
            </div>
          </div>

          {!agotado ? (
            <a
              href={buildWhatsAppUrl(
                whatsappNumero,
                product.nombre,
                product.escala ?? '',
                precioFinal
              )}
              target='_blank'
              rel='noopener noreferrer'
              className='mt-auto inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-(--surface-2) px-4 py-2.5 text-sm font-bold tracking-wide text-(--brand) no-underline transition-colors duration-300 hover:bg-(--brand) hover:text-white active:scale-[0.97]'>
              Quiero este <ArrowRight className='h-4 w-4' />
            </a>
          ) : (
            <span className='mt-auto inline-flex w-full items-center justify-center rounded-full bg-(--surface-2) px-4 py-2.5 text-sm font-medium text-(--text-secondary)'>
              Sin stock
            </span>
          )}
        </div>
      </div>
    </GlowCard>
  )
}