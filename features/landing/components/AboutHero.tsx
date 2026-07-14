'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1600&q=80'

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
      className='w-full relative h-[400px] md:h-[500px] overflow-hidden rounded-2xl flex items-center justify-center'>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_IMAGE}
        alt='EmiToys - Pasión por la Precisión'
        className='absolute inset-0 w-full h-full object-cover z-0'
      />
      <div className='absolute inset-0 bg-black/40 z-10' />
      <h1 className='relative z-20 text-center px-6 text-3xl md:text-5xl font-extrabold tracking-tight text-white m-0'>
        Pasión por la Precisión
      </h1>
    </div>
  )
}
