import { AboutHero } from '@/features/landing/components/AboutHero'
import { AboutBento } from '@/features/landing/components/AboutBento'
import { AboutValues } from '@/features/landing/components/AboutValues'

export default function SobreNosotrosPage() {
  return (
    <section className='px-4 py-4 md:px-6 md:py-6 lg:px-12 flex flex-col gap-6'>
      <AboutHero />
      <AboutBento />
      <AboutValues />
    </section>
  )
}
