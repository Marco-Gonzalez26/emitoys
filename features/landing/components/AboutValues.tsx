'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { BadgeCheck, Award, Handshake } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const VALUES = [
  {
    icon: BadgeCheck,
    title: 'Autenticidad',
    description:
      'Garantizamos el origen y la originalidad de cada modelo que ingresa a nuestro catálogo.'
  },
  {
    icon: Award,
    title: 'Exclusividad',
    description:
      'Acceso prioritario a ediciones limitadas y pre-ventas de marcas internacionales reconocidas.'
  },
  {
    icon: Handshake,
    title: 'Compromiso',
    description:
      'Atención personalizada y soporte continuo para ayudarte a expandir tu colección de manera inteligente.'
  }
]

export function AboutValues() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!ref.current) return
    const items = ref.current.querySelectorAll('.value-item')
    gsap.from(items, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        once: true
      }
    })
  }, [])

  return (
    <div ref={ref} className='w-full border-t-2 border-(--edge) py-12'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {VALUES.map(({ icon: Icon, title, description }, i) => (
          <div
            key={title}
            className='value-item flex flex-col items-center text-center p-6'>
            <div
              className={`nerv-tag mb-6 h-16 w-16 justify-center p-0 [--cut:10px] ${
                ['', 'nerv-tag--go', 'nerv-tag--alert'][i]
              }`}>
              <Icon className='h-8 w-8' />
            </div>
            <h3 className='text-xl md:text-2xl font-extrabold tracking-tight text-[var(--text-primary)] mb-3 m-0'>
              {title}
            </h3>
            <p className='text-base text-[var(--text-secondary)] m-0'>
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
