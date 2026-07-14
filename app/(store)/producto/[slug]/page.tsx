import { notFound } from 'next/navigation'
import { getProductBySlug, getRelatedProducts } from '@/features/product/actions/product'
import { ProductDetail } from '@/features/product/components/ProductDetail'

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = product.marca_id
    ? await getRelatedProducts(product.marca_id, product.id)
    : []

  return (
    <ProductDetail
      product={product}
      relatedProducts={relatedProducts}
    />
  )
}
