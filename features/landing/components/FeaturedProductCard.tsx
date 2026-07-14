'use client'

import { ArrowRight } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { buildWhatsAppUrl } from '@/shared/lib/whatsapp'
import type { FeaturedProduct } from '../constants/featured-data'
import { ESTADO_LABEL } from '../constants/featured-data'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80'

export function FeaturedProductCard({
  producto,
  whatsappNumero
}: {
  producto: FeaturedProduct
  whatsappNumero: string
}) {
  const agotado = producto.estado === 'agotado'

  const imagenUrl =
    producto.imagenes?.find((img) => img.orden === 0)?.url ??
    producto.imagenes?.[0]?.url ??
    FALLBACK_IMAGE

  return (
    <article className='group relative shrink-0 w-55 md:w-65 rounded-2xl bg-neutral-50 border border-(--brand)/30 overflow-hidden transition-transform duration-300 hover:-translate-y-1'>
      <div className='relative h-40 bg-neutral-100 flex items-center justify-center p-4 overflow-hidden'>
        <div className='absolute inset-0 opacity-10 blur-2xl scale-75 transition-opacity duration-300 group-hover:opacity-20 bg-(--brand)' />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imagenUrl}
          alt={producto.nombre}
          draggable={false}
          className={cn(
            'relative z-10 w-full h-full object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105',
            { 'opacity-40 grayscale': agotado }
          )}
        />

        <span
          className={cn(
            'absolute top-3 right-3 z-20 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full',
            {
              'bg-green-300 text-green-900': producto.estado === 'disponible',
              'text-white font-extrabold': producto.estado === 'pre_venta',
              'bg-white/10 text-white/30': producto.estado === 'agotado'
            }
          )}
          style={
            producto.estado === 'pre_venta'
              ? { background: 'var(--brand)' }
              : undefined
          }>
          {ESTADO_LABEL[producto.estado]}
        </span>
      </div>

      <div className='p-4 flex flex-col gap-3'>
        <div className='flex flex-col gap-0.5'>
          <span className='text-[11px] font-bold tracking-widest uppercase text-neutral-900/35'>
            {producto.escala}
          </span>
          <h3 className='text-sm font-bold text-neutral-900 leading-snug line-clamp-2 m-0'>
            {producto.nombre}
          </h3>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-lg font-extrabold text-neutral-900'>
            ${producto.precio.toFixed(2)}
          </span>

          {!agotado ? (
            <a
              href={buildWhatsAppUrl(
                whatsappNumero,
                producto.nombre,
                producto.escala ?? '',
                producto.precio
              )}
              target='_blank'
              rel='noopener noreferrer'
              className='text-[11px] font-bold tracking-wide px-3 py-1.5 rounded-full border no-underline transition-colors hover:bg-(--brand) hover:text-white border-(--brand) text-(--brand) duration-300'>
              Quiero este <ArrowRight className='inline-block w-4 h-4' />
            </a>
          ) : (
            <span className='text-[11px] text-(--brand)/25 font-medium'>
              Sin stock
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
