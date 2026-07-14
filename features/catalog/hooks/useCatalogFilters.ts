'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import type { CatalogFilters } from '@/shared/types'

export function useCatalogFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const filters = useMemo<CatalogFilters>(() => {
    const marca = searchParams.get('marca')?.split(',').filter(Boolean) ?? []
    const escala = searchParams.get('escala')?.split(',').filter(Boolean) ?? []
    const precio_min = searchParams.get('precio_min')
    const precio_max = searchParams.get('precio_max')
    const sort =
      (searchParams.get('sort') as CatalogFilters['sort']) ?? 'reciente'
    const estado =
      (searchParams.get('estado') as CatalogFilters['estado']) ?? undefined

    return {
      marca: marca.length > 0 ? marca : undefined,
      escala: escala.length > 0 ? escala : undefined,
      precio_min: precio_min ? parseFloat(precio_min) : undefined,
      precio_max: precio_max ? parseFloat(precio_max) : undefined,
      sort,
      estado
    }
  }, [searchParams])

  const setFilter = useCallback(
    (
      key: keyof CatalogFilters,
      value: string | string[] | number | undefined
    ) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value === undefined || (Array.isArray(value) && value.length === 0)) {
        params.delete(key)
      } else if (key === 'marca' || key === 'escala') {
        params.set(key, (value as string[]).join(','))
      } else {
        params.set(key, String(value))
      }

      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, router, pathname]
  )

  const setMarca = useCallback(
    (marcas: string[]) => {
      setFilter('marca', marcas)
    },
    [setFilter]
  )

  const setEscala = useCallback(
    (escalas: string[]) => {
      setFilter('escala', escalas)
    },
    [setFilter]
  )

  const setPrecioRange = useCallback(
    (min: number | undefined, max: number | undefined) => {
      const params = new URLSearchParams(searchParams.toString())
      if (min !== undefined) {
        params.set('precio_min', String(min))
      } else {
        params.delete('precio_min')
      }
      if (max !== undefined) {
        params.set('precio_max', String(max))
      } else {
        params.delete('precio_max')
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, router, pathname]
  )

  const setSort = useCallback(
    (sort: CatalogFilters['sort']) => {
      setFilter('sort', sort)
    },
    [setFilter]
  )

  const clearFilters = useCallback(() => {
    router.push(pathname)
  }, [router, pathname])

  const hasActiveFilters = useMemo(() => {
    return (
      (filters.marca && filters.marca.length > 0) ||
      (filters.escala && filters.escala.length > 0) ||
      filters.precio_min !== undefined ||
      filters.precio_max !== undefined
    )
  }, [filters])

  return {
    filters,
    setMarca,
    setEscala,
    setPrecioRange,
    setSort,
    clearFilters,
    hasActiveFilters
  }
}
