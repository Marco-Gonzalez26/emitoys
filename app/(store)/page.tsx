import { GarageHero } from '@/features/landing/components/GarageHero'
import { PreventaRow } from '@/features/landing/components/PreventaRow'
import { BrandGrid } from '@/features/landing/components/BrandGrid'
import FeaturedByBrand from '@/features/landing/components/FeaturedByBrand'
import { ScaleTiles } from '@/features/landing/components/ScaleTiles'
import type { ScaleTileData } from '@/features/landing/components/ScaleTiles'
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

  const heroPick = heroProducts[0]

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
      {heroPick && (
        <GarageHero product={heroPick} whatsappNumero={whatsappNumero} />
      )}
      <PreventaRow products={heroProducts} whatsappNumero={whatsappNumero} />
      <BrandGrid brands={brands} />
      <div className='max-w-7xl mx-auto w-full'>
        <ScaleTiles scales={scaleTiles} />
        <FeaturedByBrand groups={featuredGroups} />
        <TestimonialsSection testimonials={testimonials} />
        <ValueProps />
      </div>
    </>
  )
}
