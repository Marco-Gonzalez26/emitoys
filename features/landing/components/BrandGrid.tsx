import Image from 'next/image'
import Link from 'next/link'
import { NervPanel } from '@/shared/components/ui/NervPanel'
import { ArrowUpRight } from 'lucide-react'
import type { Brand } from '@/shared/types'

type Props = {
  brands: Pick<Brand, 'id' | 'nombre' | 'slug' | 'color_hex' | 'logo_url'>[]
}

export function BrandGrid({ brands }: Props) {
  if (brands.length === 0) return null

  return (
    <section className='mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-16'>
      <div className='mb-6 flex items-end justify-between gap-4 md:mb-8'>
        <div className='flex flex-col gap-2'>
          <h2 className='m-0 font-[family-name:var(--font-garage)] text-3xl tracking-[-0.01em] text-(--text-primary) uppercase md:text-5xl'>
            Marcas
          </h2>
          <p className='m-0 font-mono text-xs font-semibold tracking-[0.14em] text-(--text-secondary) uppercase'>
            {brands.map((b) => b.nombre).join(' · ')}
          </p>
        </div>
        <span aria-hidden='true' className='nerv-rule mb-3 hidden flex-1 sm:block' />
        <Link
          href='/catalogo'
          className='inline-flex shrink-0 items-center gap-1 text-sm font-bold text-(--brand-ink) no-underline underline-offset-4 hover:underline'>
          Ver catálogo <ArrowUpRight className='h-4 w-4' />
        </Link>
      </div>

      <div className='grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4'>
        {brands.map((brand) => (
          <NervPanel
            key={brand.id}
            href={`/catalogo?marca=${brand.slug}`}
            ariaLabel={`Ver modelos ${brand.nombre}`}
            glow={brand.color_hex}
            className='group transition-transform duration-200 hover:-translate-y-0.5'
            innerClassName='flex min-h-[132px] flex-col justify-between gap-4 p-5 md:min-h-[156px]'>
            <span
              aria-hidden='true'
              className='absolute inset-y-0 left-0 w-1'
              style={{ background: brand.color_hex }}
            />
            <span className='flex items-center justify-between gap-2'>
              {brand.logo_url ? (
                <span className='relative block h-10 w-24 overflow-hidden rounded md:h-12 md:w-28'>
                  <Image
                    src={brand.logo_url}
                    alt=''
                    fill
                    loading='lazy'
                    sizes='112px'
                    className='object-cover'
                  />
                </span>
              ) : (
                <span
                  aria-hidden='true'
                  className='font-(family-name:--font-garage) text-3xl text-(--text-primary) uppercase select-none md:text-4xl'>
                  {brand.nombre.slice(0, 2)}
                </span>
              )}
              <span className='nerv-tag nerv-tag--black h-8 w-8 shrink-0 justify-center p-0 group-hover:[--tag-fill:var(--cta)] group-hover:[--tag-ink:var(--eva-black)]'>
                <ArrowUpRight className='h-4 w-4' />
              </span>
            </span>
            <span className='text-sm font-bold text-(--text-primary) md:text-base'>
              {brand.nombre}
            </span>
          </NervPanel>
        ))}
      </div>
    </section>
  )
}

export default BrandGrid