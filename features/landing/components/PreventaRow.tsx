import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { buildWhatsAppUrl } from '@/shared/lib/whatsapp'
import { getOptimizedImage } from '@/shared/lib/image'
import { NervHead, NervPanel } from '@/shared/components/ui/NervPanel'
import { PreventaCountdown } from './PreventaCountdown'
import type { FeaturedProduct } from '../constants/featured-data'

type Props = {
  products: FeaturedProduct[]
  whatsappNumero: string
}

function closingLabel(fecha: string | null): string | null {
  if (!fecha) return null
  const date = new Date(fecha)
  if (Number.isNaN(date.getTime())) return null
  return `Cierra ${date.toLocaleDateString('es-EC', {
    day: 'numeric',
    month: 'short'
  })}`
}

export function PreventaRow({ products, whatsappNumero }: Props) {
  const preventas = products
    .filter((p) => p.estado === 'pre_venta')
    .sort((a, b) => {
      if (!a.pre_venta_fecha_cierre) return 1
      if (!b.pre_venta_fecha_cierre) return -1
      return (
        new Date(a.pre_venta_fecha_cierre).getTime() -
        new Date(b.pre_venta_fecha_cierre).getTime()
      )
    })
    .slice(0, 8)

  if (preventas.length === 0) return null

  return (
    <section className='mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-16'>
      <div className='mb-6 flex items-end justify-between gap-4 md:mb-8'>
        <div className='flex flex-col gap-2'>
          <h2 className='m-0 font-[family-name:var(--font-garage)] text-3xl tracking-[-0.01em] text-(--text-primary) uppercase md:text-5xl'>
            Pre-venta abierta
          </h2>
          <p className='m-0 font-mono text-xs font-semibold tracking-[0.14em] text-(--text-secondary) uppercase'>
            Aparta con 10%
          </p>
        </div>
        <span aria-hidden='true' className='nerv-rule mb-3 hidden flex-1 sm:block' />
        <Link
          href='/catalogo?estado=pre_venta'
          className='inline-flex shrink-0 items-center gap-1 text-sm font-bold text-(--brand-ink) no-underline underline-offset-4 transition-colors duration-200 hover:underline'>
          Ver pre-ventas <ArrowRight className='h-4 w-4' />
        </Link>
      </div>

      <div className='no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 md:gap-4'>
        {preventas.map((p) => {
          const rawImageUrl =
            p.imagenes?.find((img) => img.orden === 0)?.url ??
            p.imagenes?.[0]?.url ??
            null
          const imageUrl = rawImageUrl ? getOptimizedImage(rawImageUrl) : null
          const cierre = closingLabel(p.pre_venta_fecha_cierre)
          const readout = [
            p.pre_venta_cupo_total
              ? `Cupo total ${p.pre_venta_cupo_total}`
              : null,
            'Aparta con 10%'
          ]
            .filter(Boolean)
            .join(' · ')
          const hasNumero = whatsappNumero.trim() !== ''
          return (
            <NervPanel
              as='article'
              key={p.id}
              glow={p.marca.color_hex}
              className='group w-[240px] shrink-0 snap-start transition-transform duration-200 hover:-translate-y-0.5 md:w-[280px]'
              innerClassName='flex flex-col'>
              <div aria-hidden='true' className='nerv-hazard' />
              <NervHead
                label={[p.marca.nombre, p.escala].filter(Boolean).join(' // ')}
                swatch={p.marca.color_hex}
                className='group-hover:text-(--eva-amber)'
              />
              <Link
                href={`/producto/${p.slug}`}
                aria-label={p.nombre}
                className='relative block aspect-[4/3] overflow-hidden border-b-2 border-(--edge) bg-(--surface-2)'>
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={p.nombre}
                    fill
                    quality={90}
                    sizes='280px'
                    loading='lazy'
                    className='object-cover transition-transform duration-500 hover:scale-105'
                  />
                ) : (
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <span
                      aria-hidden='true'
                      className='font-[family-name:var(--font-garage)] text-5xl text-(--text-secondary)/30 uppercase select-none'>
                      {p.marca.nombre.slice(0, 2)}
                    </span>
                  </div>
                )}
              </Link>
              <div className='flex flex-1 flex-col gap-2 p-4'>
                <Link
                  href={`/producto/${p.slug}`}
                  className='line-clamp-2 text-sm leading-snug font-bold text-(--text-primary) no-underline font-[family-name:var(--font-display)]'>
                  {p.nombre}
                </Link>
                {p.pre_venta_fecha_cierre && cierre ? (
                  <PreventaCountdown
                    closesAt={p.pre_venta_fecha_cierre}
                    label={cierre}
                  />
                ) : null}
                <p className='m-0 font-mono text-[11px] font-semibold tracking-[0.14em] text-(--text-secondary) uppercase tabular-nums'>
                  {readout}
                </p>
                <div className='mt-auto flex items-center justify-between gap-2 pt-1'>
                  <span className='font-mono text-lg font-extrabold text-(--text-primary) tabular-nums'>
                    ${p.precio.toFixed(2)}
                  </span>
                  {hasNumero ? (
                    <a
                      href={buildWhatsAppUrl(
                        whatsappNumero,
                        p.nombre,
                        p.escala ?? '',
                        p.precio
                      )}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='nerv-btn nerv-btn--go nerv-btn--sm'>
                      Apartar <ArrowUpRight className='h-3.5 w-3.5' />
                    </a>
                  ) : (
                    <Link
                      href={`/producto/${p.slug}`}
                      className='nerv-btn nerv-btn--sm'>
                      Ver pieza
                    </Link>
                  )}
                </div>
              </div>
            </NervPanel>
          )
        })}
      </div>
    </section>
  )
}

export default PreventaRow