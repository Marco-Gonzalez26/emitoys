import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import { cn } from '@/shared/lib/utils'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope'
})

export const metadata: Metadata = {
  title: 'EmiToys — De coleccionistas para coleccionistas',
  description:
    'Coleccionables de autos a escala en Ecuador. Hot Wheels, Tarmac Works, Inno64 y más. Envios para todo el Ecuador',
  keywords:
    'coleccionables, coleccionistas, hot wheels, tarmac works, inno64, emitoys, emi, toys, ecuador, colecciones, envios, productos, modelos, modelo, coleccion, colecciones, hot wheels, tarmac works, inno64, emitoys, emi, toys, ecuador, colecciones, envios, productos, modelos, modelo',
    
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang='es'
      data-theme='light'
      suppressHydrationWarning
      className={manrope.variable}>
      <body className={cn('relative ', manrope.variable)}>{children}</body>
    </html>
  )
}
