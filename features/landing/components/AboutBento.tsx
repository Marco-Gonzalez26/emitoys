'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Flag, Truck, Users } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const CALIDAD_IMAGE = '/logo-no-bg.png'

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
    <div
      ref={gridRef}
      className='grid grid-cols-1 md:grid-cols-12 gap-4 w-full'>
      {/* Nuestra Historia */}
      <div className='bento-cell col-span-1 md:col-span-8 p-8 md:p-12 flex flex-col justify-center rounded-2xl border border-[var(--border)] '>
        <span className='text-xs font-bold tracking-widest uppercase text-[var(--brand)] mb-4'>
          Nuestra Historia
        </span>
        <h2 className='text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--text-primary)] mb-4 m-0'>
          De una pasión compartida a la colección de tus sueños
        </h2>
        <p className='text-base md:text-lg leading-relaxed text-[var(--text-secondary)] max-w-2xl m-0'>
          Emi Toys nació en 2023 en Quito, capital del Ecuador, como un
          emprendimiento familiar fundado por los hermanos Andrés Hurtado y
          Emilia Hurtado. Unidos por su pasión por el coleccionismo de autos a
          escala y motivados por la creciente demanda de modelos de alta calidad
          a precios asequibles, decidieron convertir ese entusiasmo en un
          proyecto dedicado a acercar piezas únicas a coleccionistas de todo el
          país. Desde nuestros inicios, nos hemos enfocado en ofrecer productos
          auténticos que reflejen la esencia y personalidad de cada
          coleccionista. Creemos que cada modelo cuenta una historia y
          representa una pasión, por lo que trabajamos para brindar una
          experiencia de compra basada en la confianza, la calidad y una
          atención personalizada.
        </p>
      </div>

      {/* Calidad Curada */}
      <div className='bento-cell col-span-1 md:col-span-4 relative overflow-hidden min-h-75 flex flex-col justify-end p-6 rounded-2xl border border-border'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={CALIDAD_IMAGE}
          alt='Calidad  Calidad Excepcional de modelos a escala'
          className='absolute inset-0 w-full h-full object-cover z-0'
        />

        <div className='relative z-20'>
          <h3 className='text-xl md:text-2xl font-extrabold tracking-tight text-neutral-900 mb-2 m-0'>
            Calidad Excepcional
          </h3>
          <p className='text-sm md:text-base text-neutral-700 m-0'>
            Solo seleccionamos piezas exclusivas para ti.
          </p>
        </div>
      </div>

      {/* Nuestra Misión */}
      <div className='bento-cell col-span-1 md:col-span-6 p-8 flex flex-col justify-center rounded-2xl border border-[var(--border)] bg-white/90 backdrop-blur-sm'>
        <div className='flex items-center gap-4 mb-4'>
          <div className='w-12 h-12 rounded-full bg-[var(--brand)]/10 flex items-center justify-center text-[var(--brand)]'>
            <Flag className='w-6 h-6' />
          </div>
          <h2 className='text-xl md:text-2xl font-extrabold tracking-tight text-[var(--text-primary)] m-0 '>
            El Motor Detrás de Emi Toys
          </h2>
        </div>
        <p className='text-base text-[var(--text-secondary)] m-0'>
          Somos un emprendimiento familiar especializado en la importación y
          comercialización de autos a escala, figuras coleccionables, accesorios
          inspirados en la cultura pop y mucho más. Nuestro objetivo es ofrecer
          productos auténticos y de alta calidad que satisfagan las expectativas
          de coleccionistas y aficionados de todas las edades. En nuestro
          catálogo encontrarás una cuidada selección de las marcas más
          reconocidas del mercado, como Hot Wheels, Mini GT, Pop Race, Inno64,
          Tarmac Works, Tomica, Kaido House, PGM, Ignition Model, entre muchas
          otras. Trabajamos constantemente para incorporar nuevos lanzamientos y
          piezas exclusivas, brindando una experiencia de compra confiable,
          cercana y orientada a quienes comparten nuestra pasión por el
          coleccionismo.
        </p>
      </div>

      {/* Envíos Seguros */}
      <div className='bento-cell col-span-1 md:col-span-3 p-6 flex flex-col items-center justify-center text-center rounded-2xl border border-[var(--border)] bg-white/90 backdrop-blur-sm'>
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
      <div className='bento-cell col-span-1 md:col-span-3 p-6 flex flex-col items-center justify-center text-center rounded-2xl border border-[var(--border)] bg-white/90 backdrop-blur-sm'>
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
