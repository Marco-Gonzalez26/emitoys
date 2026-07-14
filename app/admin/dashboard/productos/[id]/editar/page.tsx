import { notFound } from 'next/navigation'
import { getAdminProducts } from '@/features/admin/actions/products'
import { getBrands } from '@/features/brand/actions/brands'
import { ProductForm } from '@/features/admin/components/ProductForm'

export default async function EditarProductoPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [products, brands] = await Promise.all([
    getAdminProducts(),
    getBrands()
  ])

  const product = products.find((p) => p.id === id)
  if (!product) notFound()

  return <ProductForm product={product} brands={brands} />
}
