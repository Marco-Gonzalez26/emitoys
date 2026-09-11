'use client'
import Image from 'next/image'
import { ArrowUpRight, Quote, Star, BadgeCheck } from 'lucide-react'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/shared/lib/utils'
import { getOptimizedImage } from '@/shared/lib/image'
import type { Testimonial } from '@/shared/types'

gsap.registerPlugin(ScrollTrigger)

const STAR_COUNT = 5

function Stars({ value }: { value: number }) {
  return (
    <div
      className='flex items-center gap-0.5'
      role='img'
      aria-label={`${value} de ${STAR_COUNT} estrellas`}>
      {Array.from({ length: STAR_COUNT }, (_, i) => (
        <Star
          key={i}
          className={cn(
            'w-4 h-4',
            i < value
              ? 'fill-(--brand) text-(--brand)'
              : 'fill-(--surface-2) text-(--surface-2)'
          )}
        />
      ))}
    </div>
  )
}

function TestimonialAvatar({ testimonial }: { testimonial: Testimonial }) {
  if (testimonial.foto_url) {
    return (
      <Image
        src={getOptimizedImage(testimonial.foto_url, { width: 160 })}
        alt={`Foto de ${testimonial.nombre_cliente}`}
        width={44}
        height={44}
        className='h-11 w-11 rounded-full object-cover border border-(--border) shrink-0'
      />
    )
  }

  return (
    <div className='h-11 w-11 shrink-0 rounded-full bg-(--brand) text-white flex items-center justify-center text-sm font-extrabold'>
      {testimonial.nombre_cliente.charAt(0).toUpperCase()}
    </div>
  )
}

export function TestimonialsSection({
  testimonials
}: {
  testimonials: Testimonial[]
}) {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const reduce =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return

      gsap.fromTo(
        '.testimonial-card',
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.06,
          ease: 'cubic-bezier(0.23,1,0.32,1)',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: '.testimonial-card',
            start: 'top 92%',
            once: true
          }
        }
      )
    },
    { scope: sectionRef }
  )

  if (testimonials.length === 0) return null

  const cards = testimonials.slice(0, 6)

  return (
    <section
      ref={sectionRef}
      className='w-full flex flex-col gap-10 py-16 md:py-24 px-6 md:px-10'>
      <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-6'>
        <div className='flex flex-col gap-3'>
          <h2 className='text-3xl md:text-5xl font-extrabold text-(--text-primary) tracking-[-0.02em] m-0 font-[family-name:var(--font-display)]'>
            Lo que dicen nuestros clientes
          </h2>
          <p className='text-(--text-secondary) text-base max-w-md leading-relaxed'>
            Fotos y reseñas reales de coleccionistas que ya compraron con
            nosotros.
          </p>
        </div>

        <a
          href='https://chat.whatsapp.com/DHElpltb1DFEIIrFtOJ1CO'
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex w-max items-center gap-1.5 rounded-full bg-(--brand) text-white font-bold px-7 py-3 tracking-wide no-underline transition-colors duration-200 hover:bg-(--brand-hover) active:scale-[0.97]'>
          Grupo WhatsApp <ArrowUpRight className='w-4 h-4' />
        </a>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4'>
        {cards.map((t) => (
          <article
            key={t.id}
            className='testimonial-card flex flex-col gap-4 rounded-2xl border border-(--border) bg-(--surface) p-6 transition-colors duration-200 hover:border-(--brand)'>
            <div className='flex items-start justify-between gap-4'>
              <Stars value={t.estrellas} />
              <Quote className='w-6 h-6 text-(--brand) opacity-60 shrink-0' />
            </div>

            <p className='m-0 flex-1 text-sm md:text-base leading-relaxed text-(--text-primary)'>
              &ldquo;{t.comentario}&rdquo;
            </p>

            <div className='flex items-center gap-3 border-t border-(--border) pt-4'>
              <TestimonialAvatar testimonial={t} />
              <div className='flex flex-col gap-0.5 min-w-0'>
                <span className='text-sm font-bold text-(--text-primary) truncate'>
                  {t.nombre_cliente}
                </span>
                <span className='flex items-center gap-1 text-xs font-semibold text-(--cyan)'>
                  <BadgeCheck className='w-3.5 h-3.5' />
                  Compra verificada
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default TestimonialsSection