import { notFound } from 'next/navigation'
import { getBrandById } from '@/features/brand/actions/brands'
import { BrandForm } from '@/features/admin/components/BrandForm'

export default async function EditarMarcaPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const brand = await getBrandById(id)
  if (!brand) notFound()

  return (
    <div className='px-6 py-8 md:px-10 flex justify-center w-full'>
      <BrandForm brand={brand} />
    </div>
  )
}
