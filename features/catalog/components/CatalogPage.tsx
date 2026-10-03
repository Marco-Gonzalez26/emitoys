'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useCatalogFilters } from '../hooks/useCatalogFilters'
import type { Brand, CatalogFilters } from '@/shared/types'
import type { ProductWithBrand } from '@/shared/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select'
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

const SORT_OPTIONS: {
  value: NonNullable<CatalogFilters['sort']>
  label: string
}[] = [
  { value: 'reciente', label: 'Recientes' },
  { value: 'precio_asc', label: 'Precio: Menor a Mayor' },
  { value: 'precio_desc', label: 'Precio: Mayor a Menor' },
  { value: 'nombre', label: 'Nombre A-Z' }
]

export function CatalogPage({ products, maxPrice, brands }: CatalogPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { filters, setSort, clearFilters } = useCatalogFilters()
  const whatsappNumero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''

 
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
      <div key={JSON.stringify({ marca: filters.marca, escala: filters.escala, precio_min: filters.precio_min, precio_max: filters.precio_max })} className='grow'>
        <div className='mb-8 flex flex-wrap items-end justify-between gap-4'>
          <div className='flex flex-col gap-2'>
            <h1 className='m-0 font-[family-name:var(--font-garage)] text-4xl tracking-[-0.01em] text-(--text-primary) uppercase md:text-5xl'>
              Catálogo
            </h1>
            <p className='m-0 font-mono text-xs font-semibold tracking-[0.14em] text-(--text-secondary) uppercase tabular-nums'>
              {sortedProducts.length}{' '}
              {sortedProducts.length === 1 ? 'producto' : 'productos'}
            </p>
          </div>
          <span aria-hidden='true' className='nerv-rule mb-5 hidden flex-1 sm:block' />
          <Select
            value={filters.sort}
            onValueChange={(value) => setSort(value as CatalogFilters['sort'])}>
            <SelectTrigger className='h-10 rounded-none border-2 border-(--edge) bg-(--bg) px-4 text-sm font-bold text-(--text-primary) shadow-none'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='rounded-none border-2 border-(--edge) bg-(--bg) shadow-none'>
              {SORT_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className='cursor-pointer rounded-none text-(--text-primary) focus:bg-(--info)'>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ProductGrid
          products={displayedProducts}
          hasMore={hasMore}
          loadMoreRef={loadMoreRef}
          onClearFilters={clearFilters}
          whatsappNumero={whatsappNumero}
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
