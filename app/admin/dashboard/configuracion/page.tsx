// app/admin/dashboard/configuracion/page.tsx
import { getConfiguracion } from '@/features/settings/actions/settings'
import { ConfigForm } from '@/features/settings/components/ConfigForm'

export default async function ConfiguracionPage() {
  const config = await getConfiguracion()

  return (
    <div className='px-6 py-8 md:px-10 max-w-2xl w-full justify-center mx-auto'>
      <h1 className='text-2xl font-extrabold tracking-tight text-(--text-primary) mb-8'>
        Configuración
      </h1>
      <ConfigForm config={config} />
    </div>
  )
}
