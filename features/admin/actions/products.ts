'use server'

import { createClient } from '@/shared/lib/supabase/server'
import { cookies } from 'next/headers'
import { v2 as cloudinary } from 'cloudinary'
import type { Product } from '@/shared/types'
import type { ProductWithBrand } from '@/features/catalog/actions/products'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

async function verifyAdmin(supabase: ReturnType<typeof createClient>) {
  const { data: auth } = await supabase.auth.getClaims()
  if (!auth?.claims) return false

  const { data: profile } = await supabase
    .from('usuarios')
    .select('tipo_usuario')
    .eq('id', auth.claims.sub)
    .single()

  return profile?.tipo_usuario === 'admin'
}

export async function getAdminProducts(): Promise<ProductWithBrand[]> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('productos')
    .select(`
      *,
      marcas:id,marcas(nombre,slug,color_hex),
      imagenes_producto(id,url,orden)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
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

export async function uploadImage(file: File): Promise<{ url: string; error?: string }> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  if (!(await verifyAdmin(supabase))) {
    return { url: '', error: 'No autorizado' }
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  try {
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'emitoys/products',
          transformation: [{ width: 800, height: 800, crop: 'limit' }, { quality: 'auto' }]
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result as { secure_url: string })
        }
      ).end(buffer)
    })

    return { url: result.secure_url }
  } catch (err) {
    console.error('Cloudinary upload error:', err)
    return { url: '', error: 'Error al subir imagen' }
  }
}

export async function deleteImage(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (err) {
    console.error('Cloudinary delete error:', err)
  }
}

export async function createProduct(product: {
  nombre: string
  slug: string
  codigo?: string
  descripcion?: string
  marca_id: string
  escala?: string
  precio: number
  precio_oferta?: number
  stock: number
  estado: 'disponible' | 'pre_venta' | 'agotado'
  es_destacado?: boolean
  es_nuevo?: boolean
  pre_venta_fecha_cierre?: string
  pre_venta_cupo_total?: number
  imagenes?: { url: string; orden: number }[]
}) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  if (!(await verifyAdmin(supabase))) return { error: 'No autorizado' }

  const { imagenes, ...productData } = product

  const { data, error } = await supabase
    .from('productos')
    .insert({
      ...productData,
      precio_oferta: product.precio_oferta ?? null,
      escala: product.escala ?? null,
      descripcion: product.descripcion ?? null,
      es_destacado: product.es_destacado ?? false,
      es_nuevo: product.es_nuevo ?? false,
      pre_venta_fecha_cierre: product.pre_venta_fecha_cierre ?? null,
      pre_venta_cupo_total: product.pre_venta_cupo_total ?? null
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating product:', error)
    return { error: error.message }
  }

  if (imagenes && imagenes.length > 0) {
    const imageRecords = imagenes.map((img) => ({
      producto_id: data.id,
      url: img.url,
      orden: img.orden
    }))

    const { error: imgError } = await supabase
      .from('imagenes_producto')
      .insert(imageRecords)

    if (imgError) {
      console.error('Error creating product images:', imgError)
    }
  }

  return { data: data as Product }
}

export async function updateProduct(
  id: string,
  product: {
    nombre: string
    slug: string
    codigo?: string
    descripcion?: string
    marca_id: string
    escala?: string
    precio: number
    precio_oferta?: number
    stock: number
    estado: 'disponible' | 'pre_venta' | 'agotado'
    es_destacado?: boolean
    es_nuevo?: boolean
    pre_venta_fecha_cierre?: string
    pre_venta_cupo_total?: number
    imagenes?: { id?: string; url: string; orden: number }[]
  }
) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  if (!(await verifyAdmin(supabase))) return { error: 'No autorizado' }

  const { imagenes, ...productData } = product

  const { data, error } = await supabase
    .from('productos')
    .update({
      ...productData,
      precio_oferta: product.precio_oferta ?? null,
      escala: product.escala ?? null,
      descripcion: product.descripcion ?? null,
      es_destacado: product.es_destacado ?? false,
      es_nuevo: product.es_nuevo ?? false,
      pre_venta_fecha_cierre: product.pre_venta_fecha_cierre ?? null,
      pre_venta_cupo_total: product.pre_venta_cupo_total ?? null
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating product:', error)
    return { error: error.message }
  }

  if (imagenes) {
    await supabase
      .from('imagenes_producto')
      .delete()
      .eq('producto_id', id)

    if (imagenes.length > 0) {
      const imageRecords = imagenes.map((img) => ({
        producto_id: id,
        url: img.url,
        orden: img.orden
      }))

      const { error: imgError } = await supabase
        .from('imagenes_producto')
        .insert(imageRecords)

      if (imgError) {
        console.error('Error updating product images:', imgError)
      }
    }
  }

  return { data: data as Product }
}

export async function deleteProduct(id: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  if (!(await verifyAdmin(supabase))) return { error: 'No autorizado' }

  const { error } = await supabase
    .from('productos')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting product:', error)
    return { error: error.message }
  }

  return { success: true }
}
