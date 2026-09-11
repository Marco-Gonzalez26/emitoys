import type { MetadataRoute } from 'next'
import { createClient } from '@/shared/lib/supabase/server'
import { cookies } from 'next/headers'
import { SITE_URL } from '@/shared/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const resolveUrl = (path: string) => new URL(path, SITE_URL).toString()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: resolveUrl('/'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1
    },
    {
      url: resolveUrl('/catalogo'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: resolveUrl('/sobre-nosotros'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: resolveUrl('/comunidad'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6
    },
    {
      url: resolveUrl('/envios'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    }
  ]

  const { data: products } = await supabase
    .from('productos')
    .select('slug, created_at')
    .in('estado', ['disponible', 'pre_venta'])
    .order('created_at', { ascending: false })

  const productPages: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: resolveUrl(`/producto/${p.slug}`),
    lastModified: new Date(p.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }))

  return [...staticPages, ...productPages]
}
