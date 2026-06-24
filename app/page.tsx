import Link from 'next/link'
import { createClient } from '@/shared/lib/supabase/server'
import { cookies } from 'next/headers'
import { HeroCarousel } from '@/features/catalog/components/HeroCarousel'
import type { Brand } from '@/shared/types'

const BRAND_IMAGES: Record<string, string> = {
  'hot-wheels':
    'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=800&q=80',
  'tarmac-works':
    'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&q=80',
  inno64:
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80',
  'mini-gt':
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80'
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80'

export default async function Home() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: brands } = await supabase
    .from('marcas')
    .select('id, nombre, slug, color_hex, created_at, logo_url')
    .order('nombre')

  const slides = (brands ?? []).map((brand: Brand) => ({
    image: BRAND_IMAGES[brand.slug] ?? FALLBACK_IMAGE,
    brand
  }))

  return (
    <section className='px-6 py-6 md:px-10'>
      <div className='grid grid-cols-4 grid-rows-2 gap-4'>

        <div className='relative col-span-4 row-span-1 rounded-2xl overflow-hidden border border-border min-h-85 flex'>
     
          <HeroCarousel slides={slides} interval={5000} />

          <div className='relative bg-(--surface) p-10 flex flex-col justify-center gap-6 w-[55%] shrink-0'>
            <div className='flex flex-col gap-3'>
              <h1 className='text-5xl font-extrabold tracking-tight leading-[0.95] text-(--text-primary)'>
                De coleccionistas
                <br />
                <span className='text-(--brand)'>para coleccionistas</span>
              </h1>
              <p className='text-(--text-secondary) text-base max-w-sm leading-relaxed'>
                Queremos acompañarte en cada momento ayudando a crecer tu
                colección. ¡Mira los modelos que tenemos para ti!
              </p>
            </div>

            <div className='flex flex-wrap gap-3'>
              <Link
                href='/catalogo?estado=pre_venta'
                className='px-5 py-2.5 rounded-full bg-(--brand) text-white text-sm font-bold tracking-wide hover:opacity-90 transition-opacity duration-200 no-underline'>
                Pre-ventas
              </Link>
              <Link
                href='/catalogo'
                className='px-5 py-2.5 rounded-full border border-border bg-(--surface-2) text-(--text-primary) text-sm font-bold tracking-wide hover:border-(--brand) hover:text-(--brand) transition-all duration-200 no-underline'>
                Catálogo
              </Link>
              <Link
                href='/catalogo?estado=subasta'
                className='px-5 py-2.5 rounded-full border border-border bg-(--surface-2) text-(--text-primary) text-sm font-bold tracking-wide hover:border-(--brand) hover:text-(--brand) transition-all duration-200 no-underline'>
                Subastas
              </Link>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                target='_blank'
                rel='noopener noreferrer'
                className='px-5 py-2.5 rounded-full bg-green-600 text-white text-sm font-bold tracking-wide hover:opacity-90 transition-opacity duration-200 no-underline'>
                Grupo WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* CELDAS INFERIORES — Marcas */}
        {brands?.map((brand: Brand, index: number) => (
          <Link
            key={brand.id}
            href={`/catalogo/${brand.slug}`}
            className='relative col-span-1 rounded-2xl overflow-hidden border border-border min-h-55 group no-underline'>
            <img
              src={BRAND_IMAGES[brand.slug] ?? FALLBACK_IMAGE}
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
              <span className='bg-white text-(--text-primary) text-xs font-bold px-4 py-2 rounded-full shadow-lg'>
                Ver catálogo →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
