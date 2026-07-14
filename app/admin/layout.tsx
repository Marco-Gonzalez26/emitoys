import { createClient } from '@/shared/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { TooltipProvider } from '@/shared/components/ui/tooltip'
import { SidebarProvider, SidebarInset } from '@/shared/components/ui/sidebar'
import { AdminSidebar } from '@/features/admin/components/AdminSidebar'

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    redirect('/iniciar-sesion')
  }

  const { data: profile } = await supabase
    .from('usuarios')
    .select('nombre, tipo_usuario')
    .eq('id', data.claims.sub)
    .single()

  if (profile?.tipo_usuario !== 'admin') {
    redirect('/')
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AdminSidebar userName={profile?.nombre ?? 'Admin'} />
        <SidebarInset>
          <main className='flex-1 p-8 bg-[var(--bg)]'>
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
