'use server'

import { createClient } from '@/shared/lib/supabase/server'
import { cookies } from 'next/headers'
import type { FeaturedProduct, BrandWithProducts } from '../constants/featured-data'

export async function getFeaturedByBrand(): Promise<BrandWithProducts[]> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: products, error } = await supabase
    .from('productos')
    .select(`
      id,
      nombre,
      slug,
      escala,
      precio,
      precio_oferta,
      estado,
      marca_id,
      marcas:id,marcas(nombre,slug,color_hex,logo_url,created_at),
      imagenes_producto(url,orden)
    `)
    .eq('es_destacado', true)
    .neq('estado', 'agotado')
    .order('created_at', { ascending: false })

  if (error || !products) {
    console.error('Error fetching featured products:', error)
    return []
  }

  const grouped = new Map<string, BrandWithProducts>()

  for (const item of products as Record<string, unknown>[]) {
    const rawMarca = item.marcas as { nombre: string; slug: string; color_hex: string; logo_url: string | null; created_at: string } | null
    const marcaId = item.marca_id as string

    if (!rawMarca) continue

    if (!grouped.has(marcaId)) {
      grouped.set(marcaId, {
        marca: { ...rawMarca, id: marcaId },
        productos: []
      })
    }

    const group = grouped.get(marcaId)!
    const imagenes = (item.imagenes_producto as { url: string; orden: number }[]) || []

    group.productos.push({
      id: item.id as string,
      nombre: item.nombre as string,
      slug: item.slug as string,
      escala: item.escala as string | null,
      precio: item.precio as number,
      precio_oferta: item.precio_oferta as number | null,
      estado: item.estado as FeaturedProduct['estado'],
      marca_id: marcaId,
      marca: group.marca,
      imagenes
    })
  }

  return Array.from(grouped.values())
}
