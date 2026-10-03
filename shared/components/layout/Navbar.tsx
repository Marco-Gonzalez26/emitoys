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
          ? 'text-(--brand-ink)'
          : 'text-(--text-secondary) hover:text-(--text-primary)'
      )}>
      {children}
      <span
        className={cn(
          'absolute bottom-3 left-5 right-5 h-1 origin-center scale-x-0 bg-(--brand) transition-transform duration-300 group-hover:scale-x-100',
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
    <nav className='sticky top-0 z-50 flex h-16 items-center gap-4 border-b-2 border-(--edge) bg-(--bg) px-4 md:gap-8 md:px-10'>
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
                ? 'text-(--brand-ink)'
                : 'text-(--text-secondary) hover:text-(--text-primary)'
            )}>
            Productos
            <span
              className={cn(
                'absolute bottom-3 left-5 right-5 h-1 bg-(--brand) transition-transform duration-300',
                isCatalogActive ? 'scale-x-100' : 'scale-x-0'
              )}
            />
          </button>
          {dropDownOpen && (
            <div className='absolute top-16 left-0 w-56 border-2 border-(--edge) bg-(--bg) p-2'>
              <p className='px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-(--text-secondary)'>
                Marcas
              </p>
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/catalogo?marca=${brand.slug}`}
                  className='flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-(--text-secondary) no-underline transition-colors duration-150 hover:bg-(--info) hover:text-(--eva-black)'>
                  <span
                    className='h-2 w-2 shrink-0'
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
                    className='px-3 py-2 text-center text-xs font-semibold text-(--text-secondary) no-underline transition-colors duration-150 hover:bg-(--info) hover:text-(--eva-black)'>
                    {escala}
                  </Link>
                ))}
              </div>
              <Link
                href='/catalogo'
                className='mt-1 flex items-center justify-between bg-(--brand) px-3 py-2.5 text-xs font-bold tracking-wide text-(--brand-on) uppercase no-underline transition-colors duration-150 hover:bg-(--brand-hover)'>
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
        <span className='relative inline-flex'>
          <button aria-label='Carrito de compras' className='nerv-btn nerv-btn--icon'>
            <ShoppingCart className='h-5 w-5' />
          </button>
          {cartCount > 0 && (
            <span className='nerv-tag nerv-tag--alert pointer-events-none absolute -top-1.5 -right-1.5 min-w-5 justify-center px-1'>
              {cartCount}
            </span>
          )}
        </span>
      </div>

      <div className='ml-auto flex items-center md:hidden'>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger className='nerv-btn nerv-btn--icon'>
            <MenuIcon className='h-5 w-5' />
            <span className='sr-only'>Abrir menú</span>
          </SheetTrigger>
          <SheetContent
            side='left'
            showCloseButton={false}
            className='w-72 border-r-2 border-(--edge) bg-(--bg) p-0'>
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
                          className='h-2 w-2 shrink-0'
                          style={{ background: brand.color_hex }}
                        />
                        {brand.nombre}
                      </Link>
                    ))}
                    <Link
                      href='/catalogo'
                      onClick={closeMobile}
                      className='py-2.5 text-sm font-bold text-(--brand-ink) no-underline'>
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
                <span className='relative inline-flex'>
                  <button aria-label='Carrito de compras' className='nerv-btn nerv-btn--icon'>
                    <ShoppingCart className='h-5 w-5' />
                  </button>
                  {cartCount > 0 && (
                    <span className='nerv-tag nerv-tag--alert pointer-events-none absolute -top-1.5 -right-1.5 min-w-5 justify-center px-1'>
                      {cartCount}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}