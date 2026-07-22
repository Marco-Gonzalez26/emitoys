'use server'

import { createClient } from '@/shared/lib/supabase/server'
import { cookies } from 'next/headers'
import type { Brand } from '@/shared/types'
import { revalidatePath } from 'next/cache'

export async function getBrands(): Promise<Brand[]> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: session } = await supabase.auth.getClaims()
  if (!session?.claims) return []

  const { data, error } = await supabase
    .from('marcas')
    .select('*')
    .order('orden', { ascending: true })

  if (error) {
    return []
  }

  return (data ?? []) as Brand[]
}

export async function getBrandById(id: string): Promise<Brand | null> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: session } = await supabase.auth.getClaims()
  if (!session?.claims) return null

  const { data, error } = await supabase
    .from('marcas')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching brand:', error)
    return null
  }

  return data as Brand
}

export async function updateBrand(
  id: string,
  brand: {
    nombre: string
    slug: string
    color_hex: string
    logo_url?: string
    orden?: number
  }
) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: auth } = await supabase.auth.getClaims()
  if (!auth?.claims) return { error: 'No autorizado' }

  const { data: profile } = await supabase
    .from('usuarios')
    .select('tipo_usuario')
    .eq('id', auth.claims.sub)
    .single()

  if (profile?.tipo_usuario !== 'admin') return { error: 'No autorizado' }

  const { data, error } = await supabase
    .from('marcas')
    .update({
      nombre: brand.nombre,
      slug: brand.slug,
      color_hex: brand.color_hex,
      logo_url: brand.logo_url ?? null,
      orden: brand.orden
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating brand:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/dashboard/marcas')
  return { data: data as Brand }
}

export async function createBrand(brand: {
  nombre: string
  slug: string
  color_hex: string
  logo_url?: string
}) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: auth } = await supabase.auth.getClaims()
  if (!auth?.claims) return { error: 'No autorizado' }

  const { data: profile } = await supabase
    .from('usuarios')
    .select('tipo_usuario')
    .eq('id', auth.claims.sub)
    .single()

  if (profile?.tipo_usuario !== 'admin') return { error: 'No autorizado' }

  const { data, error } = await supabase
    .from('marcas')
    .insert({
      nombre: brand.nombre,
      slug: brand.slug,
      color_hex: brand.color_hex,
      logo_url: brand.logo_url ?? null
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating brand:', error)
    return { error: error.message }
  }

  return { data: data as Brand }
}

export async function updateBrandsOrder(
  updates: { id: string; orden: number }[]
) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: auth } = await supabase.auth.getClaims()
  if (!auth?.claims) return { error: 'No autorizado' }

  const { data: profile } = await supabase
    .from('usuarios')
    .select('tipo_usuario')
    .eq('id', auth.claims.sub)
    .single()

  if (profile?.tipo_usuario !== 'admin') return { error: 'No autorizado' }

  const { error } = await supabase.rpc('update_brands_order', {
    updates: updates
  })

  if (error) {
    console.error('Error updating brands order:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/dashboard/marcas')
}

export async function deleteBrand(id: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: auth } = await supabase.auth.getClaims()
  if (!auth?.claims) return { error: 'No autorizado' }

  const { data: profile } = await supabase
    .from('usuarios')
    .select('tipo_usuario')
    .eq('id', auth.claims.sub)
    .single()

  if (profile?.tipo_usuario !== 'admin') return { error: 'No autorizado' }

  const { error } = await supabase.from('marcas').delete().eq('id', id)

  if (error) {
    console.error('Error deleting brand:', error)
    return { error: error.message }
  }
  revalidatePath('/admin/dashboard/marcas')
  return { success: true }
}
