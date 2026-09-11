'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/shared/store/cartStore'
import { cn } from '@/shared/lib/utils'
import { buildWhatsAppUrl } from '@/shared/lib/whatsapp'
import type { ProductWithBrand } from '@/features/catalog/actions/products'
import { GlowCard } from '@/shared/components/ui/GlowCard'
import { ProductCard } from '@/shared/components/cards/ProductCard'
import { getOptimizedImage } from '@/shared/lib/image'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/shared/components/ui/tooltip'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { WhatsApp } from '@/shared/components/icons/Whastapp'

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

const ESTADO_LABEL: Record<string, { label: string; className: string }> = {
  disponible: {
    label: 'Disponible',
    className: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300'
  },
  pre_venta: { label: 'Pre-venta', className: 'text-white font-extrabold' },
  agotado: { label: 'Agotado', className: 'bg-(--surface-3) text-(--text-secondary)' }
}

interface ProductDetailProps {
  product: ProductWithBrand
  relatedProducts: ProductWithBrand[]
}

export function ProductDetail({
  product,
  relatedProducts
}: ProductDetailProps) {
  const add = useCartStore((state) => state.add)
  const [selectedImage, setSelectedImage] = useState(0)
  const imageRef = useRef<HTMLImageElement>(null)
  const images =
    product.imagenes && product.imagenes.length > 0
      ? product.imagenes
          .sort((a, b) => a.orden - b.orden)
          .map((img) => getOptimizedImage(img.url))
      : [getOptimizedImage(getProductImage(product))]

  const price = product.precio_oferta ?? product.precio
  const badge = ESTADO_LABEL[product.estado]
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '593999999999'
  const isHotWheels = product.marca?.slug === 'hot-wheels'

  const handleAddToCart = () => {
    add(product)
  }

  useGSAP(() => {
    if (!imageRef.current) return

    gsap.fromTo(
      imageRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power2.out' }
    )
  }, [selectedImage])

  return (
    <div className='mx-auto max-w-6xl px-6 py-8 md:px-10'>
      <nav className='mb-8 text-xs text-(--text-secondary)'>
        <Link
          href='/'
          className='no-underline text-(--text-secondary) transition-colors hover:text-(--brand)'>
          Inicio
        </Link>
        <span className='mx-2'>/</span>
        <Link
          href='/catalogo'
          className='no-underline text-(--text-secondary) transition-colors hover:text-(--brand)'>
          Catálogo
        </Link>
        {product.marca && (
          <>
            <span className='mx-2'>/</span>
            <Link
              href={`/catalogo?marca=${product.marca.slug}`}
              className='no-underline text-(--text-secondary) transition-colors hover:text-(--brand)'>
              {product.marca.nombre}
            </Link>
          </>
        )}
        <span className='mx-2'>/</span>
        <span className='text-(--text-primary)'>{product.nombre}</span>
      </nav>

      <div className='mb-16 grid grid-cols-1 gap-10 lg:grid-cols-2'>
        <div className='flex flex-col gap-4'>
          <GlowCard
            glowColor={product.marca?.color_hex}
            glowSize={260}
            className='border border-border bg-(--surface)'>
            <div className='relative aspect-square overflow-hidden rounded-2xl bg-(--surface-2)'>
              <Image
                src={images[selectedImage]}
                alt={product.nombre}
                fill
                ref={imageRef}
                quality={90}
                className={cn(
                  'relative z-10 transition-transform duration-500',
                  isHotWheels ? 'object-contain p-8 md:p-12' : 'object-cover'
                )}
                sizes='(max-width: 1024px) 100vw, 50vw'
                priority
              />

              <span
                className={cn(
                  'absolute right-4 top-4 z-20 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest',
                  badge?.className
                )}
                style={
                  product.estado === 'pre_venta'
                    ? { background: 'var(--brand)' }
                    : undefined
                }>
                {badge?.label}
              </span>

              {product.es_nuevo && (
                <span className='absolute left-4 top-4 z-20 rounded-full bg-(--brand) px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white'>
                  Nuevo
                </span>
              )}
            </div>
          </GlowCard>

          {images.length > 1 && (
            <div className='flex gap-3 overflow-x-auto pb-2 no-scrollbar'>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  aria-label={`Imagen ${i + 1} de ${product.nombre}`}
                  className={cn(
                    'relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 bg-(--surface) transition-colors',
                    selectedImage === i
                      ? 'border-(--brand)'
                      : 'border-(--border) hover:border-(--brand)/50'
                  )}>
                  <Image
                    src={img}
                    alt={`${product.nombre} ${i + 1}`}
                    fill
                    loading='eager'
                    className={cn(
                      isHotWheels ? 'object-contain p-2' : 'object-cover'
                    )}
                    sizes='80px'
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className='flex flex-col gap-6'>
          {product.marca && (
            <div className='flex items-center gap-2'>
              <span
                className='h-2.5 w-2.5 rounded-full'
                style={{ background: product.marca.color_hex }}
              />
              <span className='text-xs font-semibold uppercase tracking-widest text-(--text-secondary)'>
                {product.marca.nombre}
              </span>
            </div>
          )}

          <h1 className='m-0 text-3xl font-extrabold tracking-tight text-(--text-primary) md:text-4xl'>
            {product.nombre}
          </h1>

          <div className='flex flex-wrap items-center gap-3'>
            {product.escala && (
              <span className='rounded-full border border-(--border) bg-(--surface) px-3 py-1 text-sm font-semibold text-(--text-primary)'>
                {product.escala}
              </span>
            )}
            {product.codigo && (
              <span className='text-sm text-(--text-secondary)'>
                Código: {product.codigo}
              </span>
            )}
          </div>

          <div className='flex items-baseline gap-3'>
            <span className='text-4xl font-extrabold text-(--brand)'>
              ${price.toFixed(2)}
            </span>
            {product.precio_oferta && (
              <span className='text-lg text-(--text-secondary) line-through'>
                ${product.precio.toFixed(2)}
              </span>
            )}
          </div>

          {product.descripcion && (
            <p className='m-0 text-sm leading-relaxed text-(--text-secondary)'>
              {product.descripcion}
            </p>
          )}

          <div className='flex items-center gap-2 text-sm'>
            <span
              className={cn(
                'h-2 w-2 rounded-full',
                product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
              )}
            />
            <span className='text-(--text-secondary)'>
              {product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
            </span>
          </div>

          <div className='mt-2 flex gap-3'>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  onClick={handleAddToCart}
                  className='flex-1 cursor-pointer rounded-full border border-(--border) bg-(--surface) px-4 py-3.5 text-xs font-semibold uppercase tracking-widest text-(--text-secondary) opacity-60 transition-colors duration-200 pointer-events-none'>
                  Añadir al carrito
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className='text-sm text-white'>
                  Estamos trabajando en esta funcionalidad
                </p>
              </TooltipContent>
            </Tooltip>

            {product.estado !== 'agotado' && (
              <a
                href={buildWhatsAppUrl(
                  whatsappNumber,
                  product.nombre,
                  product.escala ?? 'N/A',
                  price
                )}
                target='_blank'
                rel='noopener noreferrer'
                className='flex flex-1 items-center justify-center gap-2 rounded-full bg-(--brand) px-4 py-3.5 text-xs font-bold uppercase tracking-widest text-white no-underline transition-colors duration-200 hover:bg-(--brand-hover) active:scale-[0.97]'>
                <WhatsApp className='h-4 w-4' />
                Pedir en WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section>
          <h2 className='mb-6 m-0 text-2xl font-extrabold tracking-tight text-(--text-primary)'>
            Te puede gustar
          </h2>
          <div
            className='flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory'>
            {relatedProducts.map((rp) => (
              <div key={rp.id} className='snap-start'>
                <ProductCard
                  product={rp}
                  whatsappNumero={whatsappNumber}
                  className='w-[280px] shrink-0'
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}