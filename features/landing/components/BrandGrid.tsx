import { Brand } from '@/shared/types'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80'

const BrandGrid = ({ brands }: { brands: Brand[] }) => {
  return (
    <>
      {brands?.map((brand: Brand, index: number) => (
        <Link
          key={brand.id}
          href={`/catalogo?marca=${brand.slug}`}
          className='relative col-span-1 rounded-2xl overflow-hidden border border-[var(--border)] min-h-40 md:min-h-55 group no-underline box'>
          <img
            src={brand.logo_url ?? FALLBACK_IMAGE}
            alt={brand.nombre}
            className='absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
          />
          <div className='absolute inset-0 bg-black/40' />
          <span className='absolute top-4 left-4 text-xs font-bold text-white bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/20'>
            0{index + 1}
          </span>
          <div
            className='absolute top-4 right-4 w-2.5 h-2.5 rounded-full'
            style={{ background: brand.color_hex }}
          />
          <div className='absolute bottom-0 left-0 right-0 p-5 bg-linear-to-t from-black/80 to-transparent'>
            <span className='text-white font-extrabold text-xl tracking-tight'>
              {brand.nombre}
            </span>
          </div>
          <div
            className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'
            style={{ background: `${brand.color_hex}33` }}>
            <span className='bg-white text-[var(--text-primary)] text-xs font-bold px-4 py-2 rounded-full shadow-lg'>
              Ver catálogo <ArrowRight className='inline-block w-4 h-4' />
            </span>
          </div>
        </Link>
      ))}
    </>
  )
}

export default BrandGrid
