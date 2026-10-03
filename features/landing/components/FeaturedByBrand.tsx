import { getFeaturedByBrand } from '../actions/products'
import type { BrandWithProducts } from '../constants/featured-data'
import { FeaturedByBrandClient } from './FeaturedByBrandClient'

export default async function FeaturedByBrand({
  groups
}: {
  groups?: BrandWithProducts[]
}) {
  const brandsWithProducts = groups ?? (await getFeaturedByBrand())
  const whatsappNumero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''

  if (brandsWithProducts.length === 0) return null

  return (
    <FeaturedByBrandClient
      brandsWithProducts={brandsWithProducts}
      whatsappNumero={whatsappNumero}
    />
  )
}
