'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Tag, LogOut } from 'lucide-react'
import { logout } from '@/features/auth/actions/auth'
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarSeparator,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/shared/components/ui/sidebar'
import { Button } from '@/shared/components/ui/button'

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard
  },
  {
    label: 'Productos',
    href: '/admin/dashboard/productos',
    icon: Package
  },
  {
    label: 'Marcas',
    href: '/admin/dashboard/marcas',
    icon: Tag
  }
]

interface AdminSidebarProps {
  userName: string
}

export function AdminSidebar({ userName }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <Link href='/' className='flex items-center gap-2 no-underline px-2 py-1'>
          <span className='font-extrabold text-lg tracking-tight'>
            <span className='text-[var(--brand)]'>EMI</span>
            <span className='text-[var(--text-primary)]'>TOYS</span>
          </span>
          <span className='text-[10px] font-semibold tracking-widest uppercase text-[var(--text-secondary)] bg-[var(--surface-2)] px-2 py-0.5 rounded-full'>
            Admin
          </span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarMenu>
          {NAV_ITEMS.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
                tooltip={item.label}>
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <div className='flex items-center gap-3 px-2 py-1'>
          <div className='w-8 h-8 rounded-full bg-[var(--brand)] flex items-center justify-center text-white text-xs font-bold shrink-0'>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className='flex-1 min-w-0 group-data-[collapsible=icon]:hidden'>
            <p className='text-sm font-semibold text-[var(--text-primary)] truncate m-0'>{userName}</p>
          </div>
        </div>
        <form action={logout}>
          <Button
            type='submit'
            variant='ghost'
            className='w-full justify-start gap-3 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2'>
            <LogOut className='w-5 h-5 shrink-0' />
            <span className='group-data-[collapsible=icon]:hidden'>Cerrar sesión</span>
          </Button>
        </form>
      </SidebarFooter>
    </Sidebar>
  )
}
