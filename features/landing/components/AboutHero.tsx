'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

export function AboutHero() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!ref.current) return
    gsap.from(ref.current.querySelector('h1'), {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        once: true
      }
    })
  }, [])

  return (
    <div
      ref={ref}
      className='w-full relative h-100 md:h-125 overflow-hidden rounded-2xl flex items-center justify-center'>
      <Image
        width={2000}
        height={800}
        src='/sobre-nosotros.jpeg'
        alt='EmiToys - Pasión por el coleccionismo'
        className='absolute inset-0 w-full h-full  z-0 object-cover '
      />
      <div className='absolute inset-0 bg-black/40 z-10' />
      <h1 className='relative z-20 text-center px-6 text-3xl md:text-5xl font-extrabold tracking-tight text-white m-0'>
        Pasión por el coleccionismo
      </h1>
    </div>
  )
}
