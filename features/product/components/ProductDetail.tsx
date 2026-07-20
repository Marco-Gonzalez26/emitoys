'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/shared/store/cartStore'
import { cn } from '@/shared/lib/utils'
import { buildWhatsAppUrl } from '@/shared/lib/whatsapp'
import type { ProductWithBrand } from '@/features/catalog/actions/products'
import { Button } from '@/shared/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/shared/components/ui/tooltip'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

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
  disponible: { label: 'Disponible', className: 'bg-green-300 text-green-900' },
  pre_venta: { label: 'Pre-venta', className: 'text-white font-extrabold' },
  agotado: { label: 'Agotado', className: 'bg-white/10 text-white/30' }
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

  const images =
    product.imagenes && product.imagenes.length > 0
      ? product.imagenes.sort((a, b) => a.orden - b.orden).map((img) => img.url)
      : [getProductImage(product)]

  const price = product.precio_oferta ?? product.precio
  const badge = ESTADO_LABEL[product.estado]
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '593999999999'

  const handleAddToCart = () => {
    add(product)
  }

  useGSAP(() => {
    gsap.from('.product-image', {
    
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    })
    
  }, [selectedImage])

  return (
    <div className='px-6 py-8 md:px-10 max-w-6xl mx-auto'>
      <nav className='text-xs text-[var(--text-secondary)] mb-8'>
        <Link
          href='/'
          className='hover:text-[var(--brand)] transition-colors no-underline text-[var(--text-secondary)]'>
          Inicio
        </Link>
        <span className='mx-2'>/</span>
        <Link
          href='/catalogo'
          className='hover:text-[var(--brand)] transition-colors no-underline text-[var(--text-secondary)]'>
          Catálogo
        </Link>
        <span className='mx-2'>/</span>
        {product.marca && (
          <>
            <Link
              href={`/catalogo?marca=${product.marca.slug}`}
              className='hover:text-[var(--brand)] transition-colors no-underline text-[var(--text-secondary)]'>
              {product.marca.nombre}
            </Link>
            <span className='mx-2'>/</span>
          </>
        )}
        <span className='text-[var(--text-primary)]'>{product.nombre}</span>
      </nav>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16'>
        <div className='flex flex-col gap-4'>
          <div className='relative aspect-square bg-(--surface)  rounded-2xl overflow-hidden flex items-center justify-center'>
            <div className='absolute inset-0 opacity-10 blur-2xl scale-75 bg-(--brand)' />
            <Image
              src={images[selectedImage]}
              alt={product.nombre}
              fill
              className='relative z-10 object-cover drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] rounded product-image opacity-100'
              sizes='(max-width: 1024px) 100vw, 50vw'
              priority
            />

            <span
              className={cn(
                'absolute top-4 right-4 z-20 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full',
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
              <span className='absolute top-4 left-4 z-20 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-[var(--brand)] text-white'>
                Nuevo
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className='flex gap-3 overflow-x-auto pb-2'>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    'relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-colors bg-[var(--surface)] cursor-pointer',
                    selectedImage === i
                      ? 'border-[var(--brand)]'
                      : 'border-[var(--border)] hover:border-[var(--brand)]/50'
                  )}>
                  <Image
                    src={img}
                    alt={`${product.nombre} ${i + 1}`}
                    fill
                    loading='eager'
                    className='object-cover'
                    sizes='(max-width: 1024px) 100vw, 80px'
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
                className='w-2.5 h-2.5 rounded-full'
                style={{ background: product.marca.color_hex }}
              />
              <span className='text-xs font-bold tracking-widest uppercase text-[var(--text-secondary)]'>
                {product.marca.nombre}
              </span>
            </div>
          )}

          <h1 className='text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--text-primary)] m-0'>
            {product.nombre}
          </h1>

          <div className='flex items-center gap-4'>
            {product.escala && (
              <span className='text-sm font-semibold text-[var(--text-secondary)] bg-[var(--surface)] border border-[var(--border)] rounded-full px-3 py-1'>
                {product.escala}
              </span>
            )}
            {product.codigo && (
              <span className='text-sm text-[var(--text-secondary)]'>
                Código: {product.codigo}
              </span>
            )}
          </div>

          <div className='flex items-baseline gap-3'>
            <span className='text-4xl font-extrabold text-[var(--brand)]'>
              ${price.toFixed(2)}
            </span>
            {product.precio_oferta && (
              <span className='text-lg text-[var(--text-secondary)] line-through'>
                ${product.precio.toFixed(2)}
              </span>
            )}
          </div>

          {product.descripcion && (
            <p className='text-sm text-[var(--text-secondary)] leading-relaxed m-0'>
              {product.descripcion}
            </p>
          )}

          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2 text-sm'>
              <span
                className={cn(
                  'w-2 h-2 rounded-full',
                  product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                )}
              />
              <span className='text-[var(--text-secondary)]'>
                {product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
              </span>
            </div>
          </div>

          <div className='flex gap-3 mt-2'>
            <Tooltip>
              <TooltipTrigger>
                <div
                  // onClick={handleAddToCart}

                  className='flex-1 py-3.5 rounded-full bg-(--brand) text-white text-xs font-semibold uppercase tracking-widest hover:bg-(--brand-hover) transition-colors duration-200 active:scale-[0.98] cursor-pointer border-none px-4 opacity-45 pointer-events-none'>
                  Añadir al carrito
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className='text-sm text-white'>
                  Estamos trabajando en esta funcionalidad :)
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
                className='flex-1 py-3.5 rounded-full border border-green-600 bg-green-600 text-white text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity no-underline text-center'>
                Pedir en WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section>
          <h2 className='text-xl font-extrabold tracking-tight text-(--text-primary) mb-6'>
            Productos relacionados
          </h2>
          <div
            className='flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory'
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {relatedProducts.map((rp) => (
              <Link
                key={rp.id}
                href={`/producto/${rp.slug}`}
                className='group shrink-0 w-55 md:w-65 snap-start bg-[var(--surface)] border border-(--brand)/30 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-(--brand) no-underline'>
                <div className='relative h-40 bg-[var(--surface-2)] flex items-center justify-center p-4 overflow-hidden'>
                  <div className='absolute inset-0 opacity-10 blur-2xl scale-75 bg-(--brand)' />
                  <Image
                    src={rp.imagenes?.[0]?.url ?? getProductImage(rp)}
                    alt={rp.nombre}
                    fill
                    className='relative z-10 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105'
                    sizes='260px'
                  />
                </div>
                <div className='p-4 flex flex-col gap-2'>
                  <span className='text-[11px] font-bold tracking-widest uppercase text-[var(--text-secondary)]'>
                    {rp.escala ?? rp.marca?.nombre}
                  </span>
                  <h3 className='text-sm font-bold text-[var(--text-primary)] line-clamp-2 m-0'>
                    {rp.nombre}
                  </h3>
                  <span className='text-lg font-extrabold text-[var(--brand)]'>
                    ${(rp.precio_oferta ?? rp.precio).toFixed(2)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
