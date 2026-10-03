import { ProductsTable } from '@/features/admin/components/ProductsTable'
import { getBrands } from '@/features/brand/actions/brands'

export default async function ProductosPage() {
  const brands = await getBrands()
  return <ProductsTable brands={brands} />
}
