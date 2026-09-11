'use client'

import Link from 'next/link'
import { useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { MenuIcon, ShoppingCart, ArrowRight } from 'lucide-react'
import type { Brand } from '@/shared/types'
import { cn } from '@/shared/lib/utils'
import { useCartStore } from '@/shared/store/cartStore'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger
} from '@/shared/components/ui/sheet'

type NavbarProps = {
  brands: Pick<Brand, 'nombre' | 'id' | 'slug' | 'color_hex'>[]
}

const ESCALAS = ['1:64', '1:43', '1:18', '1:12']

function NavLink({
  href,
  children,
  onClick
}: {
  href: string
  children: ReactNode
  onClick?: () => void
}) {
  const pathname = usePathname()
  const isActive =
    href === '/' ? pathname === '/' : pathname.startsWith(href)
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'group relative flex h-16 items-center px-5 no-underline text-xs font-semibold uppercase tracking-widest transition-colors duration-200',
        isActive
          ? 'text-(--brand)'
          : 'text-(--text-secondary) hover:text-(--text-primary)'
      )}>
      {children}
      <span
        className={cn(
          'absolute bottom-3 left-5 right-5 h-0.5 origin-center scale-x-0 rounded-full bg-(--brand) transition-transform duration-300 group-hover:scale-x-100',
          isActive && 'scale-x-100'
        )}
      />
    </Link>
  )
}

export const Navbar = ({ brands }: NavbarProps) => {
  const [dropDownOpen, setDropDownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const cartCount = useCartStore((s) => s.totalItems())
  const pathname = usePathname()
  const closeMobile = () => setMobileOpen(false)
  const isCatalogActive = pathname.startsWith('/catalogo')

  return (
    <nav className='sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-border bg-(--bg) px-4 backdrop-blur-xl md:gap-8 md:px-10'>
      <Link href='/' className='flex items-center gap-2'>
        <Image src='/logo.png' alt='EmiToys' width={50} height={50} />
      </Link>

      <div className='hidden flex-1 items-center md:flex'>
        <NavLink href='/'>Inicio</NavLink>
        <div
          className='relative'
          onMouseEnter={() => setDropDownOpen(true)}
          onMouseLeave={() => setDropDownOpen(false)}>
          <button
            className={cn(
              'flex h-16 cursor-pointer items-center gap-1 bg-transparent px-5 text-xs font-semibold uppercase tracking-widest transition-colors duration-200',
              isCatalogActive
                ? 'text-(--brand)'
                : 'text-(--text-secondary) hover:text-(--text-primary)'
            )}>
            Productos
            <span
              className={cn(
                'absolute bottom-3 left-5 right-5 h-0.5 rounded-full bg-(--brand) transition-transform duration-300',
                isCatalogActive ? 'scale-x-100' : 'scale-x-0'
              )}
            />
          </button>
          {dropDownOpen && (
            <div className='absolute top-16 left-0 w-56 rounded-2xl border border-border bg-(--bg) p-2 shadow-(--shadow-lift)'>
              <p className='px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-(--text-secondary)'>
                Marcas
              </p>
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/catalogo?marca=${brand.slug}`}
                  className='flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-(--text-secondary) no-underline transition-colors duration-150 hover:bg-(--surface) hover:text-(--text-primary)'>
                  <span
                    className='h-2 w-2 shrink-0 rounded-full'
                    style={{ background: brand.color_hex }}
                  />
                  {brand.nombre}
                </Link>
              ))}
              <p className='border-t border-border px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-(--text-secondary)'>
                Escalas
              </p>
              <div className='grid grid-cols-2 gap-1'>
                {ESCALAS.map((escala) => (
                  <Link
                    key={escala}
                    href={`/catalogo?escala=${encodeURIComponent(escala)}`}
                    className='rounded-xl px-3 py-2 text-center text-xs font-semibold text-(--text-secondary) no-underline transition-colors duration-150 hover:bg-(--surface) hover:text-(--text-primary)'>
                    {escala}
                  </Link>
                ))}
              </div>
              <Link
                href='/catalogo'
                className='mt-1 flex items-center justify-between rounded-xl  border-border px-3 py-2.5 text-xs font-bold text-(--brand)
                bg-(--brand)/5 no-underline transition-colors duration-150 hover:bg-(--brand)/10'>
                Ver todo el catálogo
                <ArrowRight className='h-3.5 w-3.5' />
              </Link>
            </div>
          )}
        </div>
        <NavLink href='/sobre-nosotros'>Sobre nosotros</NavLink>
        <NavLink href='/comunidad'>Comunidad</NavLink>
        <NavLink href='/envios'>Envíos</NavLink>
      </div>

      <div className='hidden items-center gap-2 md:flex'>
        <button
          aria-label='Carrito de compras'
          className='relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-(--border) bg-(--surface) text-(--text-primary) transition-colors duration-200 hover:border-(--brand)'>
          <ShoppingCart className='h-5 w-5' />
          {cartCount > 0 && (
            <span className='absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-(--brand) px-1 text-[10px] font-bold text-white'>
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <div className='ml-auto flex items-center md:hidden'>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-(--border) bg-(--surface) text-(--text-primary) transition-colors duration-200 hover:border-(--brand)'>
            <MenuIcon className='h-5 w-5' />
            <span className='sr-only'>Abrir menú</span>
          </SheetTrigger>
          <SheetContent
            side='left'
            showCloseButton={false}
            className='w-72 border-border bg-(--bg) p-0'>
            <SheetTitle className='sr-only'>Menú de navegación</SheetTitle>
            <div className='flex h-full flex-col overflow-y-auto pb-6'>
              <div className='flex flex-col pt-16'>
                <NavLink href='/' onClick={closeMobile}>
                  Inicio
                </NavLink>
                <div className='px-6 py-2'>
                  <p className='mb-2 text-xs font-semibold uppercase tracking-widest text-(--text-secondary)'>
                    Productos
                  </p>
                  <div className='flex flex-col'>
                    {brands.map((brand) => (
                      <Link
                        key={brand.id}
                        href={`/catalogo?marca=${brand.slug}`}
                        onClick={closeMobile}
                        className='flex items-center gap-3 py-2.5 text-sm text-(--text-secondary) no-underline transition-colors duration-150 hover:text-(--text-primary)'>
                        <span
                          className='h-2 w-2 shrink-0 rounded-full'
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
                <NavLink href='/sobre-nosotros' onClick={closeMobile}>
                  Sobre nosotros
                </NavLink>
                <NavLink href='/comunidad' onClick={closeMobile}>
                  Comunidad
                </NavLink>
                <NavLink href='/envios' onClick={closeMobile}>
                  Envíos
                </NavLink>
              </div>

              <div className='mt-auto flex items-center justify-between border-t border-(--border) px-6 pt-4'>
                <button
                  aria-label='Carrito de compras'
                  className='relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-(--border) bg-(--surface) text-(--text-primary) transition-colors duration-200 hover:border-(--brand)'>
                  <ShoppingCart className='h-5 w-5' />
                  {cartCount > 0 && (
                    <span className='absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-(--brand) px-1 text-[10px] font-bold text-white'>
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}