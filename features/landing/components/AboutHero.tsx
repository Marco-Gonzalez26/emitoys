'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Image from 'next/image'
import { NervPanel } from '@/shared/components/ui/NervPanel'

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
    <div ref={ref} className='w-full'>
      <NervPanel
        cut={28}
        innerClassName='flex h-100 items-center justify-center md:h-125'>
        <Image
          width={2000}
          height={800}
          src='/sobre-nosotros.jpeg'
          alt='EmiToys - Pasión por el coleccionismo'
          className='absolute inset-0 w-full h-full  z-0 object-cover '
        />
        <div className='absolute inset-0 z-10 bg-(--eva-black)/35' />
        <h1 className='relative z-20 m-0 mx-6 bg-(--eva-black) px-5 py-3 text-center text-3xl font-extrabold tracking-tight text-white md:text-5xl'>
          Pasión por el coleccionismo
        </h1>
      </NervPanel>
    </div>
  )
}
