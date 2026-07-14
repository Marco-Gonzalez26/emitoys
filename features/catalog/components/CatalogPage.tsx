'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useCatalogFilters } from '../hooks/useCatalogFilters'
import type { Brand, CatalogFilters } from '@/shared/types'
import type { ProductWithBrand } from '../actions/products'
import { FilterSidebar } from './FilterSidebar'
import { FilterDrawer } from './FilterDrawer'
import { ProductGrid } from './ProductGrid'

interface CatalogPageProps {
  products: ProductWithBrand[]
  maxPrice: number
  brands: Brand[]
}

const INITIAL_DISPLAY_COUNT = 12
const LOAD_MORE_COUNT = 12

const SORT_OPTIONS: { value: CatalogFilters['sort']; label: string }[] = [
  { value: 'reciente', label: 'Recientes' },
  { value: 'precio_asc', label: 'Precio: Menor a Mayor' },
  { value: 'precio_desc', label: 'Precio: Mayor a Menor' },
  { value: 'nombre', label: 'Nombre A-Z' }
]

export function CatalogPage({ products, maxPrice, brands }: CatalogPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { filters, setSort, clearFilters } = useCatalogFilters()

 
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (filters.marca && filters.marca.length > 0) {
        if (!product.marca || !filters.marca.includes(product.marca.slug))
          return false
      }
      if (filters.escala && filters.escala.length > 0) {
        if (!product.escala || !filters.escala.includes(product.escala))
          return false
      }
      if (
        filters.precio_min !== undefined &&
        product.precio < filters.precio_min
      )
        return false
      if (
        filters.precio_max !== undefined &&
        product.precio > filters.precio_max
      )
        return false
      return true
    })
  }, [
    products,
    filters.marca,
    filters.escala,
    filters.precio_min,
    filters.precio_max
  ])

  // Sort client-side
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts]
    switch (filters.sort) {
      case 'precio_asc':
        return sorted.sort((a, b) => a.precio - b.precio)
      case 'precio_desc':
        return sorted.sort((a, b) => b.precio - a.precio)
      case 'nombre':
        return sorted.sort((a, b) => a.nombre.localeCompare(b.nombre))
      default:
        return sorted.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    }
  }, [filteredProducts, filters.sort])

  // Infinite scroll
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayCount < sortedProducts.length) {
          setDisplayCount((prev) =>
            Math.min(prev + LOAD_MORE_COUNT, sortedProducts.length)
          )
        }
      },
      { threshold: 0.1 }
    )
    if (loadMoreRef.current) observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [displayCount, sortedProducts.length])

  const displayedProducts = sortedProducts.slice(0, displayCount)
  const hasMore = displayCount < sortedProducts.length

  // Un solo handler para aplicar todos los filtros de una vez
  const handleApplyFilters = useCallback(
    (
      marcas: string[],
      escalas: string[],
      min: number | undefined,
      max: number | undefined
    ) => {
      const params = new URLSearchParams()
      if (marcas.length > 0) params.set('marca', marcas.join(','))
      if (escalas.length > 0) params.set('escala', escalas.join(','))
      if (min !== undefined) params.set('precio_min', String(min))
      if (max !== undefined) params.set('precio_max', String(max))
      if (filters.sort && filters.sort !== 'reciente')
        params.set('sort', filters.sort)
      router.push(`${pathname}?${params.toString()}`)
    },
    [filters.sort, router, pathname]
  )

  return (
    <div className='flex flex-col lg:flex-row gap-6'>
      {/* Desktop Sidebar */}
      <div className='hidden lg:block'>
        <FilterSidebar
          brands={brands}
          selectedMarcas={filters.marca ?? []}
          selectedEscalas={filters.escala ?? []}
          precioMin={filters.precio_min}
          precioMax={filters.precio_max}
          maxPrice={maxPrice}
          onApply={handleApplyFilters}
          onClear={clearFilters}
        />
      </div>

      {/* Main Content */}
      <div key={JSON.stringify({ marca: filters.marca, escala: filters.escala, precio_min: filters.precio_min, precio_max: filters.precio_max })} className='flex-grow'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-extrabold tracking-tight text-[var(--text-primary)]'>
            Catálogo Completo
          </h1>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-[var(--text-secondary)]'>
              Ordenar por:
            </span>
            <select
              value={filters.sort}
              onChange={(e) =>
                setSort(e.target.value as CatalogFilters['sort'])
              }
              className='bg-[var(--surface)] border border-[var(--border)] rounded-lg py-2 pl-3 pr-8 text-sm focus:outline-none focus:border-[var(--brand)]'>
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ProductGrid
          products={displayedProducts}
          totalCount={sortedProducts.length}
          hasMore={hasMore}
          loadMoreRef={loadMoreRef}
          onClearFilters={clearFilters}
        />
      </div>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        brands={brands}
        selectedMarcas={filters.marca ?? []}
        selectedEscalas={filters.escala ?? []}
        precioMin={filters.precio_min}
        precioMax={filters.precio_max}
        maxPrice={maxPrice}
        onApply={handleApplyFilters}
        onClear={clearFilters}
      />
    </div>
  )
}
