'use client'

import { Truck, ShieldCheck, BadgeCheck, Users } from 'lucide-react'
import { NervPanel } from '@/shared/components/ui/NervPanel'

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

// Each prop takes one role color from the NGE palette, black icon on top
const CHIP = ['nerv-tag--go', '', 'nerv-tag--info', 'nerv-tag--alert']

export function ValueProps() {
  return (
    <section className='w-full px-6 py-8 md:px-10 md:py-12'>
      <NervPanel innerClassName='grid grid-cols-1 gap-[2px] [--panel-fill:var(--edge)] sm:grid-cols-2 lg:grid-cols-4'>
        {PROPS.map((p, i) => (
          <div
            key={p.title}
            className='flex items-start gap-4 bg-(--surface) px-6 py-5'>
            <span className={`nerv-tag h-10 w-10 shrink-0 justify-center p-0 [--cut:7px] ${CHIP[i]}`}>
              <p.icon className='h-5 w-5' />
            </span>
            <div className='flex flex-col gap-1'>
              <span className='text-sm font-bold text-(--text-primary)'>
                {p.title}
              </span>
              <span className='text-xs leading-relaxed text-(--text-secondary)'>
                {p.line}
              </span>
            </div>
          </div>
        ))}
      </NervPanel>
    </section>
  )
}

export default ValueProps
