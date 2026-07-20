'use client'

import { ProductCard } from './ProductCard'
import { EmptyState } from './EmptyState'
import type { ProductWithBrand } from '../actions/products'

interface ProductGridProps {
  products: ProductWithBrand[]
  totalCount: number
  hasMore: boolean
  loadMoreRef: React.RefObject<HTMLDivElement | null>
  onClearFilters: () => void
}

export function ProductGrid({
  products,
  totalCount,
  hasMore,
  loadMoreRef,
  onClearFilters
}: ProductGridProps) {
  if (products.length === 0) {
    return <EmptyState onClearFilters={onClearFilters} />
  }

  return (
    <div className="grow">
      {/* Results count */}
      <div className="text-sm text-(--text-secondary) mb-6">
        {totalCount} {totalCount === 1 ? 'producto' : 'productos'}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      {hasMore && (
        <div 
          ref={loadMoreRef} 
          className="h-20 flex items-center justify-center"
        >
          <div className="w-8 h-8 border-2 border-(--brand) border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* End of list */}
      {!hasMore && products.length > 0 && (
        <div className="mt-8 text-center text-(--text-secondary) text-sm">
          No hay más productos
        </div>
      )}
    </div>
  )
}