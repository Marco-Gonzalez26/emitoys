'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ProductCard } from '@/shared/components/cards/ProductCard'
import { EmptyState } from './EmptyState'
import type { ProductWithBrand } from '../actions/products'

gsap.registerPlugin(ScrollTrigger)

interface ProductGridProps {
  products: ProductWithBrand[]
  totalCount: number
  hasMore: boolean
  loadMoreRef: React.RefObject<HTMLDivElement | null>
  onClearFilters: () => void
  whatsappNumero: string
}

export function ProductGrid({
  products,
  totalCount,
  hasMore,
  loadMoreRef,
  onClearFilters,
  whatsappNumero
}: ProductGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.catalog-card', { clearProps: 'all' })
      })
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.catalog-card',
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: 'cubic-bezier(0.23,1,0.32,1)',
            clearProps: 'opacity,transform',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 90%',
              once: true
            }
          }
        )
      })
      return () => mm.revert()
    },
    { scope: gridRef }
  )

  if (products.length === 0) {
    return <EmptyState onClearFilters={onClearFilters} />
  }

  return (
    <div ref={gridRef} className='grow'>
      <div className='mb-6 text-sm text-(--text-secondary)'>
        {totalCount} {totalCount === 1 ? 'producto' : 'productos'}
      </div>

      <div className='grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6'>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            whatsappNumero={whatsappNumero}
            className='catalog-card h-full'
          />
        ))}
      </div>

      {hasMore && (
        <div ref={loadMoreRef} className='flex h-20 items-center justify-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-2 border-(--brand) border-t-transparent' />
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <div className='mt-8 text-center text-sm text-(--text-secondary)'>
          No hay más productos
        </div>
      )}
    </div>
  )
}