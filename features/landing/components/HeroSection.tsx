'use client'
import Link from 'next/link'

import { HeroCarousel } from './HeroCarousel'
import BrandGrid from './BrandGrid'
import { Brand } from '@/shared/types'
import { Button } from '@/shared/components/ui/button'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
interface HeroSectionProps {
  slides: { image: string; brand: Brand }[]
  brands: Brand[]
}

export const HeroSection = ({ slides, brands }: HeroSectionProps) => {
  const sortedBrands = [...brands].sort((a, b) => {
    if (a.slug === 'mini-gt') return -1
    if (b.slug === 'mini-gt') return 1
    return 0
  })

  useGSAP(() => {
    gsap.from('.box', {
      y: 30,
      opacity: 0,
   
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out'
    })
  }, [])

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-4'>
      <div className='relative col-span-1 md:col-span-2 lg:col-span-4 row-span-1 rounded-2xl overflow-hidden border border-[var(--border)] min-h-64 md:min-h-85 flex flex-col lg:flex-row'>
        <HeroCarousel slides={slides} interval={5000} />

        <div className='relative bg-[var(--surface)] p-6 md:p-10 flex flex-col justify-center gap-6 w-full lg:w-[55%] shrink-0 box'>
          <div className='flex flex-col gap-3'>
            <h1 className='text-3xl md:text-5xl font-extrabold tracking-tight leading-[0.95] text-[var(--text-primary)] '>
              De coleccionistas
              <br />
              <span className='text-[var(--brand)]'>para coleccionistas</span>
            </h1>
            <p className='text-[var(--text-secondary)] text-base max-w-sm leading-relaxed'>
              Queremos acompañarte en cada momento ayudando a crecer tu
              colección. ¡Mira los modelos que tenemos para ti!
            </p>
          </div>

          <div className='flex flex-wrap gap-3'>
            <Button
              asChild
              size='lg'
              className='rounded-full bg-[var(--brand)] text-white font-bold tracking-wide hover:bg-[var(--brand-hover)]'>
              <Link href='/catalogo?estado=pre_venta'>Pre-ventas</Link>
            </Button>
            <Button
              asChild
              variant='outline'
              size='lg'
              className='rounded-full border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] font-bold tracking-wide hover:border-[var(--brand)] hover:text-[var(--brand)]'>
              <Link href='/catalogo'>Catálogo</Link>
            </Button>
            <Button
              asChild
              variant='outline'
              size='lg'
              className='rounded-full border-border bg-(--surface-2) text-(--text-primary) font-bold tracking-wide hover:border-(--brand) hover:text-(--brand) pointer-events-none! opacity-45'>
              <Link href='/catalogo?estado=subasta'>Subastas</Link>
            </Button>
            <Button
              asChild
              size='lg'
              className='rounded-full bg-green-600 text-white font-bold tracking-wide hover:bg-green-700'>
              <a
                href='https://chat.whatsapp.com/DHElpltb1DFEIIrFtOJ1CO'
                target='_blank'
                rel='noopener noreferrer'>
                Grupo WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
      <BrandGrid brands={sortedBrands} />
    </div>
  )
}
