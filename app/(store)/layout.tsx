import { createClient } from '@/shared/lib/supabase/server'
import { cookies } from 'next/headers'
import { Navbar } from '@/shared/components/layout/Navbar'
import { Footer } from '@/shared/components/layout/Footer'
import { TooltipProvider } from '@/shared/components/ui/tooltip'

export default async function StoreLayout({
  children
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: brands } = await supabase
    .from('marcas')
    .select('id, nombre, slug, color_hex, logo_url')
    .order('nombre')

  return (
    <TooltipProvider>
      <>
        <Navbar brands={brands ?? []} />
        <main className='min-h-screen'>{children}</main>
        <Footer />
      </>
    </TooltipProvider>
  )
}
