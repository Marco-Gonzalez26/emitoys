import Link from 'next/link'
import type { Metadata } from 'next'
import { NervHead, NervPanel } from '@/shared/components/ui/NervPanel'

export const metadata: Metadata = {
  title: {
    absolute: 'Página no encontrada'
  },
  robots: {
    index: false
  }
}

export default function NotFound() {
  return (
    <div className='flex min-h-[60vh] items-center justify-center px-6 py-16'>
      <NervPanel cut={22} className='w-full max-w-lg'>
        <div aria-hidden='true' className='nerv-hazard' />
        <NervHead label='Error // 404' />
        <div className='flex flex-col items-center px-6 py-12 text-center'>
          <h1 className='m-0 mb-4 font-[family-name:var(--font-garage)] text-8xl leading-none text-(--text-primary)'>
            404
          </h1>
          <p className='m-0 mb-8 max-w-md text-lg text-(--text-secondary)'>
            La página que buscas no existe o fue movida.
          </p>
          <Link href='/' className='nerv-btn nerv-btn--go'>
            Volver al inicio
          </Link>
        </div>
      </NervPanel>
    </div>
  )
}
