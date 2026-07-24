import Link from 'next/link'
import type { Metadata } from 'next'

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
    <div className='flex flex-col items-center justify-center min-h-[60vh] px-6 text-center'>
      <h1 className='text-6xl font-extrabold tracking-tight text-[var(--text-primary)] mb-4'>
        404
      </h1>
      <p className='text-lg text-[var(--text-secondary)] mb-8 max-w-md'>
        La página que buscas no existe o fue movida.
      </p>
      <Link
        href='/'
        className='px-6 py-3 rounded-full bg-[var(--brand)] text-white font-semibold hover:bg-[var(--brand-hover)] transition-colors no-underline'>
        Volver al inicio
      </Link>
    </div>
  )
}
