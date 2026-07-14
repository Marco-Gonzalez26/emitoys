import { getBrands } from '@/features/brand/actions/brands'
import { ProductForm } from '@/features/admin/components/ProductForm'

export default async function NuevoProductoPage() {
  const brands = await getBrands()
  return <ProductForm brands={brands} />
}
