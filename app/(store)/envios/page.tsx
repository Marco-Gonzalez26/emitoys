import { getConfiguracion } from '@/features/settings/actions/settings'
import { WhatsApp } from '@/shared/components/icons/Whastapp'
import { Mail } from 'lucide-react'

export default async function EnviosPage() {
  const config = await getConfiguracion()

  return (
    <div className='px-6 py-12 md:px-10 max-w-3xl mx-auto'>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-2'>
          <span className='text-[11px] font-bold tracking-[0.25em]  text-(--text-secondary)'>
            EmiToys
          </span>
          <h1 className='text-3xl md:text-4xl font-extrabold tracking-tight text-(--text-primary)'>
            Envíos
          </h1>
        </div>

        {config.envios_contenido ? (
          <p className='text-(--text-secondary) leading-relaxed whitespace-pre-wrap text-base'>
            {config.envios_contenido}
          </p>
        ) : (
          <p className='text-(--text-secondary) italic'>Próximamente...</p>
        )}

        {/* Contacto si está configurado */}
        {(config.whatsapp || config.correo) && (
          <div className='flex flex-col gap-3 pt-4 border-t border-border'>
            <span className='text-sm font-bold text-(--text-primary)'>
              ¿Tienes dudas sobre tu envío?
            </span>
            <div className='flex flex-wrap gap-3'>
              {config.whatsapp && (
                <a
                  href={`https://wa.me/${config.whatsapp.replace(/\D/g, '')}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='self-start px-5 py-2.5 rounded-full bg-white  border border-green-500 text-green-500 text-sm font-bold hover:scale-105 transition-transform no-underline flex items-center justify-center gap-2'>
                  <WhatsApp className='size-7' />
                  WhatsApp
                </a>
              )}
              {config.correo && (
                <a
                  href={`mailto:${config.correo}`}
                  className='px-5 py-2.5 rounded-full border border-border text-sm font-bold text-(--text-primary) hover:scale-105 transition-transform  no-underline flex justify-center items-center gap-2'>
                  <Mail className='size-7' />
                  Correo
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
