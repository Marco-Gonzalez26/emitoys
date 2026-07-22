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
        <main className='min-h-screen '>
          <div className='fixed bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#960DF911,#ffffff66)] -z-50'></div>
          {children}
        </main>
        <Footer />
      </>
    </TooltipProvider>
  )
}
