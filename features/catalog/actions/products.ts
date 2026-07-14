'use server'

import { createClient } from '@/shared/lib/supabase/server'
import { cookies } from 'next/headers'
import type { CatalogFilters, Product } from '@/shared/types'

export type ProductWithBrand = Product & {
  marca: {
    id: string
    nombre: string
    slug: string
    color_hex: string
    logo_url: string | null
  } | null
  imagenes: { id: string; url: string; orden: number }[]
}

export interface GetProductsResult {
  products: ProductWithBrand[]
  maxPrice: number
}

export async function getProducts(
  filters: CatalogFilters
): Promise<GetProductsResult> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  let query = supabase
    .from('productos')
    .select(
      `
      *,
      marcas:id,marcas(nombre,slug,color_hex,logo_url),
      imagenes_producto(id,url,orden)
    `
    )
    .in('estado', ['disponible', 'pre_venta', 'agotado'])

  if (filters.marca && filters.marca.length > 0) {
    query = query.in('marca.slug', filters.marca)
  }

  if (filters.escala && filters.escala.length > 0) {
    query = query.in('escala', filters.escala)
  }

  if (filters.precio_min !== undefined) {
    query = query.gte('precio', filters.precio_min)
  }
  if (filters.precio_max !== undefined) {
    query = query.lte('precio', filters.precio_max)
  }

  console.log(filters.estado)
  if (filters.estado) {
    query = query.eq('estado', filters.estado)
  }

  if (filters.solo_en_stock) {
    query = query.gt('stock', 0)
  }

  switch (filters.sort) {
    case 'precio_asc':
      query = query.order('precio', { ascending: true })
      break
    case 'precio_desc':
      query = query.order('precio', { ascending: false })
      break
    case 'nombre':
      query = query.order('nombre', { ascending: true })
      break
    case 'reciente':
    default:
      query = query.order('created_at', { ascending: false })
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return { products: [], maxPrice: 100 }
  }

  const { data: maxPriceData } = await supabase
    .from('productos')
    .select('precio')
    .in('estado', ['disponible', 'pre_venta', 'agotado'])
    .order('precio', { ascending: false })
    .limit(1)
    .single()

  const maxPrice = maxPriceData?.precio ?? 100

  const products = (data ?? []).map((item: Record<string, unknown>) => ({
    id: item.id as string,
    marca_id: item.marca_id as string,
    marca: item.marcas as ProductWithBrand['marca'],
    nombre: item.nombre as string,
    codigo: item.codigo as string | null,
    slug: item.slug as string,
    descripcion: item.descripcion as string | null,
    escala: item.escala as string | null,
    precio: item.precio as number,
    precio_oferta: item.precio_oferta as number | null,
    stock: item.stock as number,
    estado: item.estado as 'disponible' | 'pre_venta' | 'agotado',
    pre_venta_fecha_cierre: item.pre_venta_fecha_cierre as string | null,
    pre_venta_cupo_total: item.pre_venta_cupo_total as number | null,
    es_destacado: item.es_destacado as boolean,
    es_nuevo: item.es_nuevo as boolean,
    created_at: item.created_at as string,
    imagenes: (item.imagenes_producto as ProductWithBrand['imagenes']) || []
  }))
  return {
    products,
    maxPrice
  }
}
