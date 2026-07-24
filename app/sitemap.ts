import type { MetadataRoute } from 'next'
import { createClient } from '@/shared/lib/supabase/server'
import { cookies } from 'next/headers'
import { SITE_URL } from '@/shared/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1
    },
    {
      url: `${SITE_URL}/catalogo`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: `${SITE_URL}/sobre-nosotros`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: `${SITE_URL}/comunidad`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6
    },
    {
      url: `${SITE_URL}/envios`,
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
    url: `${SITE_URL}/producto/${p.slug}`,
    lastModified: new Date(p.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }))

  return [...staticPages, ...productPages]
}
