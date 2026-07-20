import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import { cn } from '@/shared/lib/utils'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope'
})

const SITE_URL = 'https://emitoys.shop'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'EmiToys — De coleccionistas para coleccionistas',
    template: '%s | EmiToys'
  },
  description:
    'Coleccionables de autos a escala en Ecuador. Hot Wheels, Tarmac Works, Inno64, Mini GT y más. Envíos para todo el Ecuador.',
  keywords: [
    'coleccionables', 'coleccionistas', 'hot wheels', 'tarmac works',
    'inno64', 'mini gt', 'emitoys', 'ecuador', 'modelos a escala',
    'diecast', 'autos en miniatura', 'colecciones', 'envíos'
  ],
  authors: [{ name: 'EmiToys' }],
  creator: 'EmiToys',
  publisher: 'EmiToys',
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    locale: 'es_EC',
    url: SITE_URL,
    siteName: 'EmiToys',
    title: 'EmiToys — De coleccionistas para coleccionistas',
    description:
      'Coleccionables de autos a escala en Ecuador. Hot Wheels, Tarmac Works, Inno64, Mini GT y más.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'EmiToys — Coleccionables de autos a escala'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EmiToys — De coleccionistas para coleccionistas',
    description:
      'Coleccionables de autos a escala en Ecuador. Hot Wheels, Tarmac Works, Inno64, Mini GT y más.',
    images: ['/logo.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  }
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
