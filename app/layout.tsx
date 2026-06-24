import type { Metadata } from 'next'
import { Manrope, Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/shared/lib/utils'
import { Navbar } from '@/shared/components/layout/Navbar'
import { Footer } from '@/shared/components/layout/Footer'
import { createClient } from '@/shared/lib/supabase/server'
import { cookies } from 'next/headers'
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope'
})

export const metadata: Metadata = {
  title: 'EmiToys — De coleccionistas para coleccionistas',
  description:
    'Coleccionables de autos a escala en Ecuador. Hot Wheels, Tarmac Works, Inno64 y más.'
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)
  const { data: brands } = await supabase
    .from('marcas')
    .select('id, nombre, slug, color_hex')
    .order('nombre')
  return (
    <html
      lang='es'
      data-theme='light'
      suppressHydrationWarning
      className={manrope.variable}>
      <body className={cn('relative ', manrope.variable)}>
        <Navbar brands={brands ?? []} />
        <main className='min-h-screen'>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
