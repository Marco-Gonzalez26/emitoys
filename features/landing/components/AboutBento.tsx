'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Flag, Truck, Users } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const CALIDAD_IMAGE =
  'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80'

export function AboutBento() {
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!gridRef.current) return
    const cells = gridRef.current.querySelectorAll('.bento-cell')
    gsap.from(cells, {
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: gridRef.current,
        start: 'top 85%',
        once: true
      }
    })
  }, [])

  return (
    <div ref={gridRef} className='grid grid-cols-1 md:grid-cols-12 gap-4 w-full'>
      {/* Nuestra Historia */}
      <div className='bento-cell col-span-1 md:col-span-8 p-8 md:p-12 flex flex-col justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)]'>
        <span className='text-xs font-bold tracking-widest uppercase text-[var(--brand)] mb-4'>
          Nuestra Historia
        </span>
        <h2 className='text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--text-primary)] mb-4 m-0'>
          De un &apos;Collector&apos;s Garage&apos; al Mundo
        </h2>
        <p className='text-base md:text-lg leading-relaxed text-[var(--text-secondary)] max-w-2xl m-0'>
          EmiToys nació en Ecuador impulsado por la pura pasión por el automovilismo
          y el detalle en miniatura. Lo que comenzó como un pequeño garaje para
          intercambiar modelos exclusivos, evolucionó rápidamente hacia una plataforma
          dedicada a ofrecer a los verdaderos entusiastas acceso a las piezas más
          codiciadas a nivel global.
        </p>
      </div>

      {/* Calidad Curada */}
      <div className='bento-cell col-span-1 md:col-span-4 relative overflow-hidden min-h-[300px] flex flex-col justify-end p-6 rounded-2xl border border-[var(--border)]'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={CALIDAD_IMAGE}
          alt='Calidad curada de modelos a escala'
          className='absolute inset-0 w-full h-full object-cover z-0'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10' />
        <div className='relative z-20'>
          <h3 className='text-xl md:text-2xl font-extrabold tracking-tight text-white mb-2 m-0'>
            Calidad Curada
          </h3>
          <p className='text-sm md:text-base text-white/90 m-0'>
            Solo seleccionamos piezas premium.
          </p>
        </div>
      </div>

      {/* Nuestra Misión */}
      <div className='bento-cell col-span-1 md:col-span-6 p-8 flex flex-col justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)]'>
        <div className='flex items-center gap-4 mb-4'>
          <div className='w-12 h-12 rounded-full bg-[var(--brand)]/10 flex items-center justify-center text-[var(--brand)]'>
            <Flag className='w-6 h-6' />
          </div>
          <h2 className='text-xl md:text-2xl font-extrabold tracking-tight text-[var(--text-primary)] m-0'>
            Nuestra Misión
          </h2>
        </div>
        <p className='text-base text-[var(--text-secondary)] m-0'>
          Acercar las escalas más exclusivas y detalladas del mundo a los coleccionistas
          locales. Queremos ser el puente entre los fabricantes premium y tu vitrina,
          asegurando autenticidad y pasión en cada entrega.
        </p>
      </div>

      {/* Envíos Seguros */}
      <div className='bento-cell col-span-1 md:col-span-3 p-6 flex flex-col items-center justify-center text-center rounded-2xl border border-[var(--border)] bg-[var(--surface)]'>
        <div className='w-12 h-12 rounded-full bg-[var(--brand)]/10 flex items-center justify-center text-[var(--brand)] mb-4'>
          <Truck className='w-6 h-6' />
        </div>
        <h3 className='text-base font-bold text-[var(--text-primary)] mb-2 m-0'>
          Envíos Seguros
        </h3>
        <p className='text-sm text-[var(--text-secondary)] m-0'>
          Empaque reforzado para piezas delicadas.
        </p>
      </div>

      {/* Comunidad */}
      <div className='bento-cell col-span-1 md:col-span-3 p-6 flex flex-col items-center justify-center text-center rounded-2xl border border-[var(--border)] bg-[var(--surface)]'>
        <div className='w-12 h-12 rounded-full bg-[var(--brand)]/10 flex items-center justify-center text-[var(--brand)] mb-4'>
          <Users className='w-6 h-6' />
        </div>
        <h3 className='text-base font-bold text-[var(--text-primary)] mb-2 m-0'>
          Comunidad
        </h3>
        <p className='text-sm text-[var(--text-secondary)] m-0'>
          Únete a nuestra red de coleccionistas.
        </p>
      </div>
    </div>
  )
}
