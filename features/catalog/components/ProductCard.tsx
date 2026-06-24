'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/features/cart/store/cartStore'
import type { ProductWithBrand } from '../actions/products'

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600&q=80',
  'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=600&q=80',
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80',
  'https://images.unsplash.com/photo-1542362567-b07e54358753?w=600&q=80',
  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80',
  'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=80'
]

function getProductImage(product: ProductWithBrand): string {
  // TODO: Replace with real images from DB
  // const primaryImage = product.imagenes?.find(img => img.orden === 0)
  // return primaryImage?.url ?? PLACEHOLDER_IMAGES[product.id.charCodeAt(0) % PLACEHOLDER_IMAGES.length]

  return PLACEHOLDER_IMAGES[
    product.id.charCodeAt(0) % PLACEHOLDER_IMAGES.length
  ]
}

interface ProductCardProps {
  product: ProductWithBrand
}

export function ProductCard({ product }: ProductCardProps) {
  const add = useCartStore((state) => state.add)

  const imageUrl = getProductImage(product)
  const price = product.precio_oferta ?? product.precio

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    add(product)
  }

  console.log({ product })

  return (
    <Link
      href={`/producto/${product.slug}`}
      className='bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden group flex flex-col hover:border-[var(--brand)] transition-colors duration-300'>
      <div className='bg-[var(--bg)] p-6 flex items-center justify-center h-64 relative'>
        <Image
          src={imageUrl}
          alt={product.nombre}
          fill
          className='object-contain w-full h-full group-hover:scale-105 transition-transform duration-500'
          sizes='(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw'
        />
        {product.escala && (
          <div className='absolute top-4 left-4 bg-[var(--surface-2)] text-[var(--text-secondary)] text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full border border-[var(--border)]'>
            {product.escala}
          </div>
        )}
        {product.es_nuevo && (
          <div className='absolute top-4 right-4 bg-[var(--brand)] text-white text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full'>
            Nuevo
          </div>
        )}
      </div>
      <div className='p-6 flex flex-col grow border-t border-border'>
        <div className='text-xs font-semibold tracking-wider uppercase text-[var(--text-secondary)] mb-1'>
          {product.marca?.nombre ?? 'Unknown'}
        </div>
        <h3 className='text-lg font-extrabold tracking-tight text-[var(--text-primary)] mb-2 line-clamp-2'>
          {product.nombre}
        </h3>
        <div className='mt-auto flex items-center justify-between'>
          <span className='text-lg font-extrabold tracking-tight text-[var(--brand)]'>
            ${price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className='w-12 h-12 bg-[var(--brand)] text-white rounded-full flex items-center justify-center hover:bg-[var(--brand-hover)] transition-colors duration-200 active:scale-95'
            aria-label='Añadir al carrito'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={2}
              stroke='currentColor'
              className='w-5 h-5'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 4.5v15m7.5-7.5h-15'
              />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  )
}
