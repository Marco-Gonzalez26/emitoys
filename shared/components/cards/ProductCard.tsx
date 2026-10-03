'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { NervHead, NervPanel } from '@/shared/components/ui/NervPanel'
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
  const headLabel = [product.marca?.slug.replace(/-/g, ' '), product.escala]
    .filter(Boolean)
    .join(' // ')

  return (
    <NervPanel
      as='article'
      glow={product.marca?.color_hex ?? 'var(--brand)'}
      className={cn(
        'group mt-2 h-full transition-transform duration-200 hover:-translate-y-0.5',
        className
      )}
      innerClassName='flex h-full flex-col'>
      <NervHead
        label={headLabel || 'EmiToys'}
        swatch={product.marca?.color_hex}
        className='group-hover:text-(--eva-amber)'
      />
      <Link href={`/producto/${product.slug}`} className='block'>
        <div className='relative aspect-4/3 overflow-hidden border-b-2 border-(--edge) bg-(--surface-2)'>
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
            <span
              className={cn('nerv-tag', {
                'nerv-tag--info': product.estado === 'disponible',
                'nerv-tag--alert': product.estado === 'pre_venta',
                'nerv-tag--muted pointer-events-none': agotado
              })}>
              {ESTADO_LABEL[product.estado]}
            </span>
            {enOferta && <span className='nerv-tag nerv-tag--black'>Oferta</span>}
          </div>
        </div>
      </Link>

      <div className='flex flex-1 flex-col gap-3 p-4'>
        <div className='flex flex-col gap-1.5'>
          <Link href={`/producto/${product.slug}`} className='no-underline'>
            <h3 className='m-0 line-clamp-2 min-h-[2.75em] text-base leading-snug tracking-[0.01em] text-(--text-primary) uppercase font-[family-name:var(--font-garage)]'>
              {product.nombre}
            </h3>
          </Link>
          <div className='flex items-baseline gap-2'>
            <span className='font-mono text-lg font-extrabold leading-none text-(--text-primary) tabular-nums'>
              ${precioFinal.toFixed(2)}
            </span>
            {enOferta && (
              <span className='font-mono text-xs text-(--text-secondary) line-through tabular-nums'>
                ${product.precio.toFixed(2)}
              </span>
            )}
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
            className='nerv-btn nerv-btn--go nerv-btn--block mt-auto'>
            Quiero este <ArrowRight className='h-4 w-4' />
          </a>
        ) : (
          <span aria-disabled='true' className='nerv-btn nerv-btn--off nerv-btn--block mt-auto'>
            Sin stock
          </span>
        )}
      </div>
    </NervPanel>
  )
}
