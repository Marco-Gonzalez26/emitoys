'use client'

import { Truck, ShieldCheck, BadgeCheck, Users } from 'lucide-react'

const PROPS = [
  {
    icon: Truck,
    title: 'Envíos a todo Ecuador',
    line: 'Empaques seguros en cada entrega.'
  },
  {
    icon: ShieldCheck,
    title: 'Pago seguro',
    line: 'Transacciones protegidas con Payphone.'
  },
  {
    icon: BadgeCheck,
    title: 'Piezas verificadas',
    line: 'Cada modelo pasa control de calidad.'
  },
  {
    icon: Users,
    title: 'Comunidad de coleccionistas',
    line: 'Pre-ventas y novedades cada semana.'
  }
]

export function ValueProps() {
  return (
    <section className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 py-8 md:py-10'>
      {PROPS.map((p, i) => (
        <div
          key={p.title}
          className={`flex items-start gap-4 px-6 md:px-8 py-5 lg:py-3 ${
            i % 2 === 1 ? 'sm:border-l sm:border-(--border)' : ''
          } ${i > 0 ? 'lg:border-l lg:border-(--border)' : ''}`}>
          <span className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-(--brand-soft) text-(--brand-ink) shrink-0'>
            <p.icon className='w-5 h-5' />
          </span>
          <div className='flex flex-col gap-1'>
            <span className='text-sm font-bold text-(--text-primary)'>
              {p.title}
            </span>
            <span className='text-xs text-(--text-secondary) leading-relaxed'>
              {p.line}
            </span>
          </div>
        </div>
      ))}
    </section>
  )
}

export default ValueProps
