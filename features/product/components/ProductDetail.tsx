'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/shared/store/cartStore'
import { cn } from '@/shared/lib/utils'
import { buildWhatsAppUrl } from '@/shared/lib/whatsapp'
import type { ProductWithBrand } from '@/shared/types'
import { NervHead, NervPanel } from '@/shared/components/ui/NervPanel'
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
    className: 'nerv-tag--info'
  },
  pre_venta: { label: 'Pre-venta', className: 'nerv-tag--alert' },
  agotado: { label: 'Agotado', className: 'nerv-tag--muted' }
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
          className='no-underline text-(--text-secondary) transition-colors hover:text-(--brand-ink)'>
          Inicio
        </Link>
        <span className='mx-2'>/</span>
        <Link
          href='/catalogo'
          className='no-underline text-(--text-secondary) transition-colors hover:text-(--brand-ink)'>
          Catálogo
        </Link>
        {product.marca && (
          <>
            <span className='mx-2'>/</span>
            <Link
              href={`/catalogo?marca=${product.marca.slug}`}
              className='no-underline text-(--text-secondary) transition-colors hover:text-(--brand-ink)'>
              {product.marca.nombre}
            </Link>
          </>
        )}
        <span className='mx-2'>/</span>
        <span className='text-(--text-primary)'>{product.nombre}</span>
      </nav>

      <div className='mb-16 grid grid-cols-1 gap-10 lg:grid-cols-2'>
        <div className='flex flex-col gap-4'>
          <NervPanel
            cut={22}
            glow={product.marca?.color_hex ?? 'var(--brand)'}
            glowSize={260}>
            <NervHead
              label={[product.marca?.nombre, product.escala, product.codigo]
                .filter(Boolean)
                .join(' // ') || 'EmiToys'}
              swatch={product.marca?.color_hex}
            />
            <div className='relative aspect-square overflow-hidden bg-(--surface-2)'>
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
                  'nerv-tag absolute right-4 top-4 z-20',
                  badge?.className
                )}>
                {badge?.label}
              </span>

              {product.es_nuevo && (
                <span className='nerv-tag absolute left-4 top-4 z-20'>
                  Nuevo
                </span>
              )}
            </div>
          </NervPanel>

          {images.length > 1 && (
            <div className='flex gap-3 overflow-x-auto pb-2 no-scrollbar'>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  aria-label={`Imagen ${i + 1} de ${product.nombre}`}
                  aria-pressed={selectedImage === i}
                  className={cn(
                    'nerv-panel h-20 w-20 shrink-0 cursor-pointer border-0 [--cut:8px]',
                    selectedImage === i
                      ? ''
                      : '[--edge:var(--border)] hover:[--edge:var(--text-secondary)]'
                  )}>
                  <span className='nerv-panel__inner block'>
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
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className='flex flex-col gap-6'>
          {product.marca && (
            <div className='flex items-center gap-2'>
              <span
                className='h-2.5 w-2.5'
                style={{ background: product.marca.color_hex }}
              />
              <span className='text-xs font-semibold uppercase tracking-widest text-(--text-secondary)'>
                {product.marca.nombre}
              </span>
            </div>
          )}

          <h1 className='m-0 font-[family-name:var(--font-garage)] text-3xl tracking-[-0.01em] text-(--text-primary) uppercase md:text-4xl'>
            {product.nombre}
          </h1>

          <div className='flex flex-wrap items-center gap-3'>
            {product.escala && (
              <span className='nerv-tag'>
                Escala {product.escala}
              </span>
            )}
            {product.codigo && (
              <span className='text-sm text-(--text-secondary)'>
                Código: {product.codigo}
              </span>
            )}
          </div>

          <div className='flex items-baseline gap-3'>
            <span className='font-mono text-4xl font-extrabold text-(--text-primary) tabular-nums'>
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
                'h-2.5 w-2.5 border border-(--edge)',
                product.stock > 0 ? 'bg-(--cta)' : 'bg-(--surface-3)'
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
                    aria-disabled='true'
                  className='nerv-btn nerv-btn--off pointer-events-none flex-1 text-xs'>
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
                className='nerv-btn nerv-btn--go flex-1 text-xs'>
                <WhatsApp className='h-4 w-4' />
                Pedir en WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section>
          <h2 className='mb-6 m-0 font-[family-name:var(--font-garage)] text-2xl tracking-[-0.01em] text-(--text-primary) uppercase'>
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