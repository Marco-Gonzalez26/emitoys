import { AboutHero } from '@/features/landing/components/AboutHero'
import { AboutBento } from '@/features/landing/components/AboutBento'
import { AboutValues } from '@/features/landing/components/AboutValues'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre nosotros',
  description:
    'Conoce EmiToys: emprendimiento familiar ecuatoriano dedicado a coleccionables de autos a escala. Hot Wheels, Mini GT, Tarmac Works y más.',
  openGraph: {
    title: 'Sobre nosotros | EmiToys',
    description:
      'Conoce EmiToys: emprendimiento familiar ecuatoriano dedicado a coleccionables de autos a escala.'
  }
}

export default function SobreNosotrosPage() {
  return (
    <section className='px-4 py-4 md:px-6 md:py-6 lg:px-12 flex flex-col gap-6'>
      <AboutHero />
      <AboutBento />
      <AboutValues />
    </section>
  )
}
