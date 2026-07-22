// features/settings/actions/settings.ts
'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/shared/lib/supabase/server'

export type ConfigKey =
  | 'whatsapp'
  | 'correo'
  | 'instagram'
  | 'tiktok'
  | 'facebook'
  | 'comunidad_contenido'
  | 'envios_contenido'

export type Configuracion = Record<ConfigKey, string>

export async function getConfiguracion(): Promise<Configuracion> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data } = await supabase.from('configuracion').select('clave, valor')

  const config = {} as Configuracion
  for (const row of data ?? []) {
    config[row.clave as ConfigKey] = row.valor ?? ''
  }

  return config
}

export async function updateConfiguracion(config: Partial<Configuracion>) {
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

  const updates = Object.entries(config).map(([clave, valor]) =>
    supabase.from('configuracion').update({ valor }).eq('clave', clave)
  )

  await Promise.all(updates)

  revalidatePath('/admin/dashboard/configuracion')
  revalidatePath('/comunidad')
  revalidatePath('/envios')
}
