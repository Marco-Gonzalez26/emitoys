import { BrandsTable } from '@/features/admin/components/BrandsTable'
import { getBrands } from '@/features/brand/actions/brands'
export default async function MarcasPage() {
  const brands = await getBrands()
  console.log(brands)
  return (
    <div className='px-6 py-8 md:px-10'>
      <BrandsTable initialBrands={brands ?? []} />
    </div>
  )
}
