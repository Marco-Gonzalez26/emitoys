import { createClient } from '@/shared/lib/supabase/server'
import { cookies } from 'next/headers'
import type { Brand } from '@/shared/types'
import { HeroSection } from '@/features/landing/components/HeroSection'
import FeaturedByBrand from '@/features/landing/components/FeaturedByBrand'
import { getBrands } from '@/features/brand/actions/brands'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80'

export default async function Home() {
  const brands = await getBrands()

  const slides = (brands ?? []).map((brand: Brand) => ({
    image: brand.logo_url ?? FALLBACK_IMAGE,
    brand
  }))

  return (
    <section className='px-4 py-4 md:px-6 md:py-6 max-w-7xl mx-auto'>
      <HeroSection slides={slides} brands={brands} />
      <FeaturedByBrand />
    </section>
  )
}
