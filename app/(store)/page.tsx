import { createClient } from '@/shared/lib/supabase/server'
import { cookies } from 'next/headers'
import type { Brand } from '@/shared/types'
import { HeroSection } from '@/features/landing/components/HeroSection'
import FeaturedByBrand from '@/features/landing/components/FeaturedByBrand'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80'

export default async function Home() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: brands } = (await supabase
    .from('marcas')
    .select('id, nombre, slug, color_hex, created_at, logo_url')
    .order('nombre')) as { data: Brand[] }

  const slides = (brands ?? []).map((brand: Brand) => ({
    image: brand.logo_url ?? FALLBACK_IMAGE,
    brand
  }))

  return (
    <section className='px-4 py-4 md:px-6 md:py-6 lg:px-12'>
      <HeroSection slides={slides} brands={brands} />
      <FeaturedByBrand />
    </section>
  )
}
