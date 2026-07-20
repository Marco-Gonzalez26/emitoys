'use server'

import { createClient } from '@/shared/lib/supabase/server'
import { cookies } from 'next/headers'
import type { Brand } from '@/shared/types'

export async function getBrands(): Promise<Brand[]> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: session } = await supabase.auth.getClaims()
  if (!session?.claims) return []

  const { data, error } = await supabase
    .from('marcas')
    .select('*')
    .order('nombre')

  if (error) {
    console.error('Error fetching brands:', error)
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

export async function updateBrand(
  id: string,
  brand: {
    nombre: string
    slug: string
    color_hex: string
    logo_url?: string
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
      logo_url: brand.logo_url ?? null
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating brand:', error)
    return { error: error.message }
  }

  return { data: data as Brand }
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

  const { error } = await supabase
    .from('marcas')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting brand:', error)
    return { error: error.message }
  }

  return { success: true }
}
