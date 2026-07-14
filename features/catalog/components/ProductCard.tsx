'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import type { ProductWithBrand } from '../actions/products'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600&q=80'

function getProductImage(product: ProductWithBrand): string {
  const primary = product.imagenes?.find((img) => img.orden === 0)
  if (primary) return primary.url
  const first = product.imagenes?.[0]
  if (first) return first.url
  if (product.marca?.logo_url) return product.marca.logo_url
  return FALLBACK_IMAGE
}

const ESTADO_CONFIG: Record<
  string,
  {
    label: string
    variant: 'default' | 'secondary' | 'outline' | 'destructive'
    className?: string
  }
> = {
  disponible: {
    label: 'Disponible',
    variant: 'secondary',
    className: 'bg-green-300 text-green-900 border-transparent'
  },
  pre_venta: {
    label: 'Pre-venta',
    variant: 'default',
    className: 'bg-[var(--brand)] text-white border-transparent font-extrabold'
  },
  agotado: {
    label: 'Agotado',
    variant: 'outline',
    className: 'bg-white/10 text-white/30 border-transparent'
  }
}

interface ProductCardProps {
  product: ProductWithBrand
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getProductImage(product)
  const price = product.precio_oferta ?? product.precio
  const badge = ESTADO_CONFIG[product.estado]
  const agotado = product.estado === 'agotado'

  return (
    <Link
      href={`/producto/${product.slug}`}
      className='group relative shrink-0 rounded-2xl bg-[var(--surface)] border border-(--brand)/30 overflow-hidden transition-transform duration-300 hover:-translate-y-1'>
      <div className='relative h-40 bg-[var(--surface-2)] flex items-center justify-center p-4 overflow-hidden'>
        <div className='absolute inset-0 opacity-10 blur-2xl scale-75 transition-opacity duration-300 group-hover:opacity-20 bg-(--brand)' />
        <Image
          src={imageUrl}
          alt={product.nombre}
          fill
          draggable={false}
          className={cn(
            'relative z-10 w-full h-full object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105',
            agotado && 'opacity-40 grayscale'
          )}
          sizes='(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw'
        />

        <Badge
          className={cn(
            'absolute top-3 right-3 z-20 text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full h-auto',
            badge?.className
          )}>
          {badge?.label} 
        </Badge>

        {product.es_nuevo && (
          <Badge className='absolute top-3 left-3 z-20 text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full h-auto bg-[var(--brand)] text-white border-transparent'>
            Nuevo
          </Badge>
        )}
      </div>

      <div className='p-4 flex flex-col gap-3'>
        <div className='flex flex-col gap-0.5'>
          <span className='text-[11px] font-bold tracking-widest uppercase text-[var(--text-secondary)]'>
            {product.escala ?? product.marca?.nombre ?? 'Unknown'}
          </span>
          <h3 className='text-sm font-bold text-[var(--text-primary)] leading-snug line-clamp-2 m-0'>
            {product.nombre}
          </h3>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-lg font-extrabold text-[var(--brand)]'>
            {price.toFixed(2)}$
          </span>

          <Button
            size='icon'
            // onClick={handleAddToCart}
            className='w-10 h-10 rounded-full bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] active:scale-95'
            aria-label='Añadir al carrito'>
            <ArrowUpRight className='w-4 h-4' />
          </Button>
        </div>
      </div>
    </Link>
  )
}
