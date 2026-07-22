import { createClient } from '@/shared/lib/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Package, Tag, ShoppingCart } from 'lucide-react'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const [productos, marcas, ordenes] = await Promise.all([
    supabase.from('productos').select('id', { count: 'exact', head: true }),
    supabase.from('marcas').select('id', { count: 'exact', head: true }),
    supabase.from('ordenes').select('id', { count: 'exact', head: true })
  ])

  const stats = [
    { label: 'Productos', count: productos.count ?? 0, icon: Package, href: '/admin/dashboard/productos' },
    { label: 'Marcas', count: marcas.count ?? 0, icon: Tag, href: '/admin/dashboard/marcas' },
    { label: 'Órdenes', count: ordenes.count ?? 0, icon: ShoppingCart, href: '/admin/dashboard/ordenes' }
  ]

  return (
    <div>
      <h1 className='text-2xl font-extrabold tracking-tight text-(--text-primary) mb-8'>
        Dashboard
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className='bg-(--surface) border border-border rounded-2xl p-6 flex flex-col gap-3 hover:border-(--brand) transition-colors no-underline'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-semibold text-(--text-secondary)'>{stat.label}</span>
              <stat.icon className='w-5 h-5 text-(--text-secondary)' />
            </div>
            <span className='text-3xl font-extrabold text-(--text-primary)'>{stat.count}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
