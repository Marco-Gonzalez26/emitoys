'use server'

import { createClient } from '@/shared/lib/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { uploadToCloudinary } from '@/shared/lib/cloudinary'
import type { Testimonial } from '@/shared/types'

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

export async function getTestimonialsPublic(): Promise<Testimonial[]> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('testimonios')
    .select('*')
    .eq('activo', true)
    .order('orden', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching testimonials:', error)
    return []
  }

  return (data ?? []) as Testimonial[]
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  if (!(await verifyAdmin(supabase))) return []

  const { data, error } = await supabase
    .from('testimonios')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching testimonials:', error)
    return []
  }

  return (data ?? []) as Testimonial[]
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  if (!(await verifyAdmin(supabase))) return null

  const { data, error } = await supabase
    .from('testimonios')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching testimonial:', error)
    return null
  }

  return data as Testimonial
}

export type TestimonialInput = {
  nombre_cliente: string
  comentario: string
  foto_url?: string | null
  estrellas: number
  activo?: boolean
}

export async function createTestimonial(testimonial: TestimonialInput) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  if (!(await verifyAdmin(supabase))) return { error: 'No autorizado' }

  const { data, error } = await supabase
    .from('testimonios')
    .insert({
      nombre_cliente: testimonial.nombre_cliente,
      comentario: testimonial.comentario,
      foto_url: testimonial.foto_url ?? null,
      estrellas: testimonial.estrellas,
      activo: testimonial.activo ?? true
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating testimonial:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/dashboard/testimonios')
  return { data: data as Testimonial }
}

export async function updateTestimonial(id: string, testimonial: TestimonialInput) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  if (!(await verifyAdmin(supabase))) return { error: 'No autorizado' }

  const { data, error } = await supabase
    .from('testimonios')
    .update({
      nombre_cliente: testimonial.nombre_cliente,
      comentario: testimonial.comentario,
      foto_url: testimonial.foto_url ?? null,
      estrellas: testimonial.estrellas,
      activo: testimonial.activo ?? true
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating testimonial:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/dashboard/testimonios')
  return { data: data as Testimonial }
}

export async function deleteTestimonial(id: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  if (!(await verifyAdmin(supabase))) return { error: 'No autorizado' }

  const { error } = await supabase
    .from('testimonios')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting testimonial:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/dashboard/testimonios')
  return { success: true }
}

export async function toggleTestimonialActive(id: string, activo: boolean) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  if (!(await verifyAdmin(supabase))) return { error: 'No autorizado' }

  const { error } = await supabase
    .from('testimonios')
    .update({ activo })
    .eq('id', id)

  if (error) {
    console.error('Error toggling testimonial:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/dashboard/testimonios')
  return { success: true }
}

export async function uploadTestimonialImage(
  file: File
): Promise<{ url: string; error?: string }> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  if (!(await verifyAdmin(supabase))) {
    return { url: '', error: 'No autorizado' }
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  try {
    const result = await uploadToCloudinary(buffer, 'emitoys/testimonios')
    return { url: result.secure_url }
  } catch (err) {
    console.error('Cloudinary upload error:', err)
    return { url: '', error: 'Error al subir imagen' }
  }
}