import { createClient } from '@/shared/lib/supabase/server'
import { cookies } from 'next/headers'
import { getProducts } from '@/features/catalog/actions/products'
import { CatalogPage } from '@/features/catalog/components/CatalogPage'
import type { Brand, CatalogFilters } from '@/shared/types'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Catálogo',
  description:
    'Explora nuestra colección de autos a escala: Hot Wheels, Tarmac Works, Inno64, Mini GT y más. Filtra por marca, escala y precio.',
  openGraph: {
    title: 'Catálogo | EmiToys',
    description:
      'Explora nuestra colección de autos a escala: Hot Wheels, Tarmac Works, Inno64, Mini GT y más.'
  }
}

interface SearchParams {
  marca?: string
  escala?: string
  precio_min?: string
  precio_max?: string
  sort?: string
  estado?: string
}

export default async function CatalogoPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: brands } = await supabase
    .from('marcas')
    .select('id, nombre, slug, color_hex')
    .order('nombre')

  // Parse filters from URL (for sorting)
  const sort =
    (params.sort as 'reciente' | 'precio_asc' | 'precio_desc' | 'nombre') ??
    'reciente'

  // Fetch ALL products (client-side filtering)
  const { products, maxPrice } = await getProducts({
    sort,
    estado: (params.estado as CatalogFilters['estado']) ?? undefined
  })

  return (
    <div className='px-6 py-8 md:px-10'>
      <CatalogPage
        products={products}
        maxPrice={maxPrice}
        brands={(brands ?? []) as Brand[]}
      />
    </div>
  )
}
