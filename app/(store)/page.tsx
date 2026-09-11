import { HeroSection } from '@/features/landing/components/HeroSection'
import { HeroCarousel } from '@/features/landing/components/HeroCarousel'
import FeaturedByBrand from '@/features/landing/components/FeaturedByBrand'
import { AnnouncementBar } from '@/features/landing/components/AnnouncementBar'
import { ScaleTiles } from '@/features/landing/components/ScaleTiles'
import type { ScaleTileData } from '@/features/landing/components/ScaleTiles'
import { BrandMarquee } from '@/features/landing/components/BrandMarquee'
import { ValueProps } from '@/features/landing/components/ValueProps'
import { TestimonialsSection } from '@/features/testimonials/components/TestimonialsSection'
import { getBrandsPublic } from '@/features/brand/actions/brands'
import {
  getFeaturedByBrand,
  getScales
} from '@/features/landing/actions/products'
import { getTestimonialsPublic } from '@/features/testimonials/actions/testimonials'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  description:
    'Coleccionables de autos a escala en Ecuador. Hot Wheels, Tarmac Works, Inno64, Mini GT y más. Envíos para todo el Ecuador.',
  alternates: {
    canonical: '/'
  }
}

export default async function Home() {
  const [brands, featuredGroups, scales, testimonials] = await Promise.all([
    getBrandsPublic(),
    getFeaturedByBrand(),
    getScales(),
    getTestimonialsPublic()
  ])

  const whatsappNumero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''

  const heroProducts = featuredGroups
    .flatMap((g) => g.productos)
    .slice(0, 6)

  const productImage = (p: { imagenes: { url: string; orden: number }[] }) =>
    p.imagenes?.find((img) => img.orden === 0)?.url ??
    p.imagenes?.[0]?.url

  const scaleTiles: ScaleTileData[] = scales.map((s) => {
    const sample = featuredGroups
      .flatMap((g) => g.productos)
      .find((p) => p.escala === s.escala)
    return { ...s, image: sample ? productImage(sample) : undefined }
  })

  return (
    <>
      <AnnouncementBar />
      <div className='max-w-7xl mx-auto w-full px-4 md:px-6'>
        <HeroSection products={heroProducts} />
      </div>
      <div className='max-w-7xl mx-auto w-full px-4 md:px-6'>
        <section className='w-full flex flex-col gap-8 pb-16 md:pb-20'>
          <h2 className='m-0 text-2xl md:text-3xl font-extrabold text-(--text-primary) tracking-[-0.02em] font-[family-name:var(--font-display)]'>
            Destacado de la semana
          </h2>
          <HeroCarousel
            products={heroProducts}
            whatsappNumero={whatsappNumero}
          />
        </section>
      </div>
      <BrandMarquee brands={brands} />
      <div className='max-w-7xl mx-auto w-full'>
        <ScaleTiles scales={scaleTiles} />
        <FeaturedByBrand />
        <TestimonialsSection testimonials={testimonials} />
        <ValueProps />
      </div>
    </>
  )
}