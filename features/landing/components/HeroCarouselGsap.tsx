'use client'

import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Mousewheel, Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { cn } from '@/shared/lib/utils'
import { useGSAP } from '@gsap/react'
import { buildWhatsAppUrl } from '@/shared/lib/whatsapp'
import type { Brand } from '@/shared/types'

interface HeroProduct {
  id: string
  nombre: string
  escala: string
  edicion: string
  precio: number
  estado: 'disponible' | 'pre_venta' | 'agotado'
  imagen_url: string
  marca: Brand
  whatsapp_numero: string
}

const PRODUCTOS_DESTACADOS: HeroProduct[] = [
  {
    id: '1',
    nombre: 'Honda Civic EK9 Type R',
    escala: '1:64',
    edicion: 'Edición Limitada 2024',
    precio: 18.99,
    estado: 'pre_venta',
    imagen_url: '/honda.png',
    marca: {
      id: '1',
      nombre: 'Mini GT',
      color_hex: '#C8A2C8',
      slug: 'mini-gt',
      logo_url: null,
      created_at: ''
    },
    whatsapp_numero: '593999999999'
  },
  {
    id: '2',
    nombre: 'Nissan Skyline GT-R R34',
    escala: '1:64',
    edicion: 'Tomica Limited Vintage Neo',
    precio: 24.5,
    estado: 'disponible',
    imagen_url: '/nissan.png',
    marca: {
      id: '2',
      nombre: 'Tarmac Works',
      color_hex: '#00E5FF',
      slug: 'tarmac-works',
      logo_url: null,
      created_at: ''
    },
    whatsapp_numero: '593999999999'
  },
  {
    id: '3',
    nombre: 'Toyota Supra MK4',
    escala: '1:64',
    edicion: 'Fast & Furious Series',
    precio: 15.0,
    estado: 'disponible',
    imagen_url: '/toyota.png',
    marca: {
      id: '3',
      nombre: 'Hot Wheels',
      color_hex: '#FF3D3D',
      slug: 'hot-wheels',
      logo_url: null,
      created_at: ''
    },
    whatsapp_numero: '593999999999'
  }
]

const ESTADO_LABEL: Record<HeroProduct['estado'], string> = {
  disponible: 'Disponible',
  pre_venta: 'Pre-venta',
  agotado: 'Agotado'
}

export default function HeroCarouselGSAP() {
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<SwiperType | null>(null)
  const rootRef = useRef<HTMLElement>(null)

  const producto = PRODUCTOS_DESTACADOS[activeIndex]
  const colorMarca = producto?.marca.color_hex ?? '#C8A2C8'

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.from('.hero-panel-left', {
        y: -1000,
        duration: 1.6,
        ease: 'power4.out'
      })
        .from(
          '.hero-panel-right',
          { y: 1000, duration: 1.6, ease: 'power4.out' },
          '<'
        )
        .from(
          '.hero-car-img',
          { x: 800, opacity: 0, duration: 1.4, ease: 'power3.out' },
          '-=1'
        )
        .from(
          '.hero-eyebrow',
          { y: 40, opacity: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        )
        .from(
          '.hero-title',
          { y: 60, opacity: 0, duration: 0.7, ease: 'power2.out' },
          '-=0.3'
        )
        .from(
          '.hero-spec',
          { y: 30, opacity: 0, stagger: 0.1, duration: 0.5 },
          '-=0.3'
        )
        .from('.hero-cta', { y: 20, opacity: 0, duration: 0.4 }, '-=0.2')
    }, rootRef)
    return () => ctx.revert()
  }, [])

  const animateSlideIn = () => {
    gsap.fromTo(
      '.hero-car-img',
      { x: 200, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    )
    gsap.fromTo(
      ['.hero-eyebrow', '.hero-title', '.hero-spec', '.hero-cta'],
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out' }
    )
  }

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex)
    animateSlideIn()
  }

  if (!producto) return null

  return (
    <section
      ref={rootRef}
      className='relative h-screen overflow-hidden font-[Manrope]'
      style={{ '--color-marca': colorMarca } as React.CSSProperties}>
      <div className='absolute inset-0 z-10 pointer-events-none'>
        <div className='absolute bottom-7 left-10 flex-col items-center gap-3 pointer-events-auto md:flex hidden'>
          <div className='w-px h-64 bg-white/20 mb-10' />
          {['IG', 'TK', 'FB'].map((red) => (
            <a
              key={red}
              href='#'
              aria-label={red}
              className='-rotate-90 text-[11px] font-bold tracking-widest text-white/50 hover:text-(--color-marca) transition-colors no-underline'>
              {red}
            </a>
          ))}
        </div>
      </div>

      <Swiper
        modules={[Mousewheel, Pagination]}
        direction='vertical'
        slidesPerView={1}
        mousewheel
        speed={1800}
        pagination={{
          el: '.emitoys-pagination',
          clickable: true,
          renderBullet: (_i: number, cls: string) =>
            `<span class="${cls}"><span>${String(_i + 1).padStart(2, '0')}</span></span>`
        }}
        onSwiper={(s) => (swiperRef.current = s)}
        onSlideChange={handleSlideChange}
        className='w-full! h-full!'>
        {PRODUCTOS_DESTACADOS.map((p) => (
          <SwiperSlide
            key={p.id}
            className='relative! flex! items-center! justify-center! border rounded-2xl'>
            <div
              className='hero-panel-left absolute inset-y-0 left-0 w-[38%] transition-[background] duration-500 z-0'
              style={{ background: p.marca.color_hex }}
            />
            <div className='hero-panel-right absolute inset-y-0 right-0 w-[62%] z-0' />

            <div className='hero-car-img absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] max-w-170 z-2 pointer-events-none mt-10'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.imagen_url}
                alt={p.nombre}
                draggable={false}
                className='w-full h-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]'
              />
            </div>

            <div className='absolute inset-0 z-3 flex flex-col justify-between p-14 md:p-[60px_56px]'>
              <div className='flex flex-col gap-2'>
                <p
                  className='hero-eyebrow m-0 text-[13px] font-bold tracking-[0.2em] uppercase'
                  style={{ color: 'var(--color-marca)' }}>
                  {p.marca.nombre}
                </p>
                <h1 className='hero-title m-0 text-white font-extrabold leading-[1.05] tracking-tight max-w-130 [text-shadow:0_2px_20px_rgba(0,0,0,0.4)] text-[clamp(36px,5vw,72px)]'>
                  {p.nombre}
                </h1>
              </div>

              <div className='flex items-end gap-12 flex-wrap'>
                <div className='hero-spec flex flex-col gap-0.5'>
                  <b className='text-white text-[22px] font-extrabold leading-none'>
                    {p.escala}
                  </b>
                  <small className='text-white/45 text-[11px] tracking-[0.12em] uppercase'>
                    Escala
                  </small>
                </div>

                <div className='hero-spec flex flex-col gap-0.5'>
                  <b className='text-white text-[22px] font-extrabold leading-none'>
                    ${p.precio.toFixed(2)}
                  </b>
                  <small className='text-white/45 text-[11px] tracking-[0.12em] uppercase'>
                    USD
                  </small>
                </div>

                <div className='hero-spec flex flex-col gap-0.5'>
                  <b
                    className={cn('text-[22px] font-extrabold leading-none', {
                      'text-white': p.estado === 'disponible',
                      'text-(--color-marca)': p.estado === 'pre_venta',
                      'text-white/30': p.estado === 'agotado'
                    })}>
                    {ESTADO_LABEL[p.estado]}
                  </b>
                  <small className='text-white/45 text-[11px] tracking-[0.12em] uppercase'>
                    {p.edicion}
                  </small>
                </div>

                {p.estado !== 'agotado' && (
                  <a
                    href={buildWhatsAppUrl(p.whatsapp_numero, p.nombre, p.escala, p.precio)}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hero-cta self-end mb-1 inline-flex items-center gap-2 px-7 py-3 rounded-full border-[1.5px] text-sm font-bold tracking-wide no-underline bg-transparent transition-colors duration-200 whitespace-nowrap hover:bg-(--color-marca) hover:text-[#0D0D0F]'
                    style={{
                      borderColor: 'var(--color-marca)',
                      color: 'var(--color-marca)'
                    }}>
                    Quiero este
                  </a>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className='emitoys-pagination swiper-pagination absolute right-10 top-1/2 -translate-y-1/2 z-10' />
    </section>
  )
}
