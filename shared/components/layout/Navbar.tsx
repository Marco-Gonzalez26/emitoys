'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCartStore } from '@/features/cart/store/cartStore'
import type { Brand } from '@/shared/types'
import { ThemeToggle } from '../ui/ThemeToggle'

type NavbarProps = {
  brands: Pick<Brand, 'nombre' | 'id' | 'slug' | 'color_hex'>[]
}

export const Navbar = ({ brands }: NavbarProps) => {
  const [dropDownOpen, setDropDownOpen] = useState(false)
  const totalItems = useCartStore((state) => state.totalItems())
  return (
    <nav className='sticky top-0 z-50 h-16 flex items-center gap-8 px-10 bg-(--bg) border-b border-border backdrop-blur-xl'>
      <Link href='/' className='flex items-center gap-2 text-xl font-semibold'>
        <span className='font-extrabold text-lg tracking-tight'>
          {/** TODO: Add logo */}
          <span className='text-(--brand)'>EMI</span>
          <span className='text-(--text-primary)'>TOYS</span>
        </span>
      </Link>
      <div className='flex items-center flex-1'>
        <div
          className='relative'
          onMouseEnter={() => setDropDownOpen(true)}
          onMouseLeave={() => setDropDownOpen(false)}>
          <button className='h-16 px-5 bg-transparent border-none text-(--text-secondary) hover:text-(--text-primary) text-xs tracking-widest uppercase cursor-pointer transition-colors duration-200 font-(--font-manrope)'>
            Productos
          </button>
          {dropDownOpen ? (
            <div className='absolute top-16 left-0 min-w-50 bg-(--bg) border border-border border-t-0 rounded-b-xl overflow-hidden shadow-lg'>
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/catalogo/${brand.slug}`}
                  className='flex items-center gap-3 px-5 py-3 text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--surface) no-underline text-xs font-semibold transition-all duration-150'
                  style={{ borderLeft: `3px solid transparent` }}
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
          ) : null}
        </div>
        <Link
          href='/ofertas'
          className='h-16 px-5 flex items-center text-(--text-secondary) hover:text-(--text-primary) no-underline font-semibold text-xs tracking-widest uppercase transition-colors duration-200'>
          Ofertas
        </Link>

        <Link
          href='/contacto'
          className='h-16 px-5 flex items-center text-(--text-secondary) hover:text-(--text-primary) no-underline font-semibold text-xs tracking-widest uppercase transition-colors duration-200'>
          Contacto
        </Link>
      </div>
      <div className='flex items-center gap-3'>
        <ThemeToggle />

        <Link
          href='/checkout'
          className='relative w-10 h-10 rounded-full border border-border bg-(--surface) flex items-center justify-center no-underline text-base hover:border-(--brand) transition-colors duration-200'>
          {totalItems > 0 && (
            <span className='absolute -top-1 -right-1 w-4 h-4 rounded-full bg-(--brand) text-white text-[9px] font-extrabold flex items-center justify-center'>
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  )
}
