'use server'

import { createClient } from '@/shared/lib/supabase/server'
import { cookies } from 'next/headers'

interface FeaturedProduct {
  id: string
  nombre: string
  slug: string
  escala: string | null
  precio: number
  precio_oferta: number | null
  estado: 'disponible' | 'pre_venta' | 'agotado'
  marca_id: string
  marca: {
    id: string
    nombre: string
    slug: string
    color_hex: string
    logo_url: string | null
  } | null
  imagenes: { url: string; orden: number }[]
}

interface BrandWithProducts {
  marca: FeaturedProduct['marca'] & { id: string }
  productos: FeaturedProduct[]
}

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
      marcas:id,marcas(nombre,slug,color_hex,logo_url),
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
    const marca = item.marcas as FeaturedProduct['marca']
    const marcaId = item.marca_id as string

    if (!marca || !grouped.has(marcaId)) {
      if (marca && !grouped.has(marcaId)) {
        grouped.set(marcaId, {
          marca: { ...marca, id: marcaId },
          productos: []
        })
      }
    }

    const group = grouped.get(marcaId)
    if (!group) continue

    const imagenes = (item.imagenes_producto as FeaturedProduct['imagenes']) || []

    group.productos.push({
      id: item.id as string,
      nombre: item.nombre as string,
      slug: item.slug as string,
      escala: item.escala as string | null,
      precio: item.precio as number,
      precio_oferta: item.precio_oferta as number | null,
      estado: item.estado as FeaturedProduct['estado'],
      marca_id: marcaId,
      marca,
      imagenes
    })
  }

  return Array.from(grouped.values())
}
