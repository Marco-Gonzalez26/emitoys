import { notFound } from 'next/navigation'
import { getAdminProducts } from '@/features/admin/actions/products'
import { getBrands } from '@/features/brand/actions/brands'
import { ProductForm } from '@/features/admin/components/ProductForm'

export default async function EditarProductoPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const [[products, brands], { id }] = await Promise.all([
    Promise.all([getAdminProducts(), getBrands()]),
    params
  ])

  const product = products.find((p) => p.id === id)
  if (!product) notFound()

  return <ProductForm product={product} brands={brands} />
}
