import type { Metadata } from 'next'
import { Manrope, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { cn } from '@/shared/lib/utils'
import { SITE_URL } from '@/shared/lib/site'
import { OrganizationJsonLd } from '@/shared/components/JsonLd'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope'
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display'
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'EmiToys — De coleccionistas para coleccionistas',
    template: '%s | EmiToys'
  },
  description:
    'Coleccionables de autos a escala en Ecuador. Hot Wheels, Tarmac Works, Inno64, Mini GT y más. Envíos para todo el Ecuador.',
  keywords: [
    'coleccionables', 'coleccionistas', 'hot wheels ecuador', 'tarmac works',
    'inno64', 'mini gt', 'diecast ecuador', 'autos a escala',
    'comprar hot wheels', 'tienda de coleccionables', 'modelos a escala en venta',
    '1:64', 'preventa hot wheels', 'ecuador'
  ],
  authors: [{ name: 'EmiToys' }],
  creator: 'EmiToys',
  publisher: 'EmiToys',
  formatDetection: { telephone: false },
  alternates: {
    canonical: SITE_URL
  },
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
      className={cn(manrope.variable, plusJakartaSans.variable)}>
      <body className={cn('relative', manrope.variable)}>
        <OrganizationJsonLd />
        {children}
      </body>
    </html>
  )
}
