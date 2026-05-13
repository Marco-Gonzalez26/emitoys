import { createClient } from '@/shared/lib/supabase/server'
import { cookies } from 'next/headers'

export default async function Home() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data, error } = await supabase.from('marcas').select('*')

  if (error) {
    console.log(error)
    return <div>Error</div>
  }
  return (
    <div className='flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans '>
      <main className='flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white'>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </main>
    </div>
  )
}
