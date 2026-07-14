'use server'

import { createClient } from '@/shared/lib/supabase/server'
import { cookies } from 'next/headers'
import type { ProductWithBrand } from '@/features/catalog/actions/products'

export async function getProductBySlug(slug: string): Promise<ProductWithBrand | null> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('productos')
    .select(`
      *,
      marcas:id,marcas(nombre,slug,color_hex,logo_url),
      imagenes_producto(id,url,orden)
    `)
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return {
    id: data.id as string,
    marca_id: data.marca_id as string,
    marca: data.marcas as ProductWithBrand['marca'],
    nombre: data.nombre as string,
    codigo: data.codigo as string | null,
    slug: data.slug as string,
    descripcion: data.descripcion as string | null,
    escala: data.escala as string | null,
    precio: data.precio as number,
    precio_oferta: data.precio_oferta as number | null,
    stock: data.stock as number,
    estado: data.estado as 'disponible' | 'pre_venta' | 'agotado',
    pre_venta_fecha_cierre: data.pre_venta_fecha_cierre as string | null,
    pre_venta_cupo_total: data.pre_venta_cupo_total as number | null,
    es_destacado: data.es_destacado as boolean,
    es_nuevo: data.es_nuevo as boolean,
    created_at: data.created_at as string,
    imagenes: (data.imagenes_producto as ProductWithBrand['imagenes']) || []
  }
}

export async function getRelatedProducts(marcaId: string, currentProductId: string): Promise<ProductWithBrand[]> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('productos')
    .select(`
      *,
      marcas:id,marcas(nombre,slug,color_hex,logo_url),
      imagenes_producto(id,url,orden)
    `)
    .eq('marca_id', marcaId)
    .neq('id', currentProductId)
    .eq('estado', 'disponible')
    .limit(4)

  if (error) {
    console.error('Error fetching related products:', error)
    return []
  }

  return (data ?? []).map((item: Record<string, unknown>) => ({
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
}
