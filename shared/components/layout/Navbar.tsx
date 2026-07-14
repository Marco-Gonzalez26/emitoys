'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Brand } from '@/shared/types'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger
} from '@/shared/components/ui/sheet'
import { MenuIcon } from 'lucide-react'
import Image from 'next/image'

type NavbarProps = {
  brands: Pick<Brand, 'nombre' | 'id' | 'slug' | 'color_hex'>[]
}

export const Navbar = ({ brands }: NavbarProps) => {
  const [dropDownOpen, setDropDownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobile = () => setMobileOpen(false)

  return (
    <nav className='sticky top-0 z-50 h-16 flex items-center gap-4 md:gap-8 px-4 md:px-10 bg-(--bg) border-b border-border backdrop-blur-xl'>
      <Link href='/' className='flex items-center gap-2 text-xl font-semibold'>
      <Image src="/logo.png" alt="Logo" width={50} height={50} />
       
      </Link>

      <div className='hidden md:flex items-center flex-1'>
        <Link
          href='/'
          className='h-16 px-5 flex items-center text-(--text-secondary) hover:text-(--text-primary) no-underline font-semibold text-xs tracking-widest uppercase transition-colors duration-200'>
          Inicio
        </Link>
        <div
          className='relative'
          onMouseEnter={() => setDropDownOpen(true)}
          onMouseLeave={() => setDropDownOpen(false)}>
          <button className='h-16 px-5 bg-transparent border-none text-(--text-secondary) hover:text-(--text-primary) text-xs tracking-widest uppercase cursor-pointer transition-colors duration-200 font-semibold'>
            Productos
          </button>
          {dropDownOpen && (
            <div className='absolute top-16 left-0 min-w-50 bg-(--bg) border border-border border-t-0 rounded-b-xl overflow-hidden shadow-lg'>
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/catalogo?marca=${brand.slug}`}
                  className='flex items-center gap-3 px-5 py-3 text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--surface) no-underline text-xs font-semibold transition-all duration-150'
                  style={{ borderLeft: '3px solid transparent' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderLeftColor = brand.color_hex
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderLeftColor = 'transparent'
                  }}>
                  <span
                    className='w-2 h-2 rounded-full shrink-0'
                    style={{ background: brand.color_hex }}
                  />
                  {brand.nombre}
                </Link>
              ))}
              <Link
                href='/catalogo'
                className='block px-5 py-3 text-(--brand) no-underline text-xs font-bold border-t border-border hover:bg-(--surface) transition-colors duration-150'>
                Ver todo el catálogo
              </Link>
            </div>
          )}
        </div>
        <Link
          href='/sobre-nosotros'
          className='h-16 px-5 flex items-center text-(--text-secondary) hover:text-(--text-primary) no-underline font-semibold text-xs tracking-widest uppercase transition-colors duration-200'>
          Sobre nosotros
        </Link>
      </div>

      <div className='hidden md:flex items-center gap-3'>
        {/* Cart / Theme toggles go here */}
      </div>

      <div className='flex md:hidden items-center ml-auto'>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger className='h-10 w-10 flex items-center justify-center rounded-full border border-border bg-(--surface) text-(--text-primary) hover:border-(--brand) transition-colors duration-200 cursor-pointer'>
            <MenuIcon className='w-5 h-5' />
            <span className='sr-only'>Abrir menú</span>
          </SheetTrigger>
          <SheetContent side='left' showCloseButton={false} className='w-72 p-0 bg-(--bg) border-border'>
            <SheetTitle className='sr-only'>Menú de navegación</SheetTitle>
            <div className='flex flex-col pt-16'>
              <Link
                href='/'
                onClick={closeMobile}
                className='px-6 py-4 text-sm font-semibold text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--surface) no-underline transition-colors duration-150'>
                Inicio
              </Link>
              <div className='px-6 py-2'>
                <p className='text-xs font-semibold text-(--text-secondary) uppercase tracking-widest mb-2'>
                  Productos
                </p>
                <div className='flex flex-col'>
                  {brands.map((brand) => (
                    <Link
                      key={brand.id}
                      href={`/catalogo?marca=${brand.slug}`}
                      onClick={closeMobile}
                      className='flex items-center gap-3 py-2.5 text-sm text-(--text-secondary) hover:text-(--text-primary) no-underline transition-colors duration-150'>
                      <span
                        className='w-2 h-2 rounded-full shrink-0'
                        style={{ background: brand.color_hex }}
                      />
                      {brand.nombre}
                    </Link>
                  ))}
                  <Link
                    href='/catalogo'
                    onClick={closeMobile}
                    className='py-2.5 text-sm font-bold text-(--brand) no-underline'>
                    Ver todo el catálogo
                  </Link>
                </div>
              </div>
              <Link
                href='/sobre-nosotros'
                onClick={closeMobile}
                className='px-6 py-4 text-sm font-semibold text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--surface) no-underline transition-colors duration-150'>
                Sobre nosotros
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
