import { getConfiguracion } from '@/features/settings/actions/settings'
import { WhatsApp } from '@/shared/components/icons/Whastapp'
import { Mail, ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/shared/components/ui/Reveal'
import { NervPanel } from '@/shared/components/ui/NervPanel'
import { ShippingInfo } from '@/features/settings/components/ShippingInfo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Envíos',
  description:
    'Conoce las opciones de envío de EmiToys. Enviamos coleccionables de autos a escala a todo Ecuador.',
  alternates: {
    canonical: '/envios'
  },
  openGraph: {
    title: 'Envíos | EmiToys',
    description:
      'Conoce las opciones de envío de EmiToys. Enviamos coleccionables a todo Ecuador.'
  }
}

export default async function EnviosPage() {
  const config = await getConfiguracion()

  return (
    <div className='mx-auto max-w-3xl px-6 py-12 md:px-10'>
      <div className='flex flex-col gap-6'>
        <Reveal>
          <div className='flex items-center gap-6'>
            <h1 className='m-0 font-[family-name:var(--font-garage)] text-4xl tracking-[-0.01em] text-(--text-primary) uppercase md:text-5xl'>
              Envíos
            </h1>
            <span aria-hidden='true' className='nerv-rule flex-1' />
          </div>
        </Reveal>

        {config.envios_contenido ? (
          <Reveal delay={0.05}>
            <ShippingInfo content={config.envios_contenido} />
          </Reveal>
        ) : (
          <p className='text-(--text-secondary) italic'>Próximamente...</p>
        )}

        {(config.whatsapp || config.correo) && (
          <Reveal delay={0.1}>
            <div className='flex flex-col gap-4 pt-4'>
              <span className='font-mono text-xs font-semibold tracking-[0.14em] text-(--text-secondary) uppercase'>
                ¿Tienes dudas sobre tu envío?
              </span>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                {config.whatsapp && (
                  <NervPanel
                    href={`https://wa.me/${config.whatsapp.replace(/\D/g, '')}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    glow='#25D366'
                    className='group transition-transform duration-200 hover:-translate-y-0.5'
                    innerClassName='flex flex-col gap-4 p-6'>
                    <div className='nerv-tag h-12 w-12 justify-center p-0 [--cut:8px] bg-green-500 text-white'>
                      <WhatsApp className='h-6 w-6' />
                    </div>
                    <div className='flex flex-col gap-1'>
                      <span className='text-lg font-extrabold tracking-tight text-(--text-primary)'>
                        WhatsApp
                      </span>
                      <span className='text-sm text-(--text-secondary)'>
                        Respuesta rápida
                      </span>
                    </div>
                    <ArrowUpRight className='ml-auto h-5 w-5 text-(--text-secondary) transition-transform duration-200 group-hover:translate-x-0.5' />
                  </NervPanel>
                )}
                {config.correo && (
                  <NervPanel
                    href={`mailto:${config.correo}`}
                    glow='var(--brand)'
                    className='group transition-transform duration-200 hover:-translate-y-0.5'
                    innerClassName='flex flex-col gap-4 p-6'>
                    <div className='nerv-tag h-12 w-12 justify-center p-0 [--cut:8px] bg-(--brand) text-(--brand-on)'>
                      <Mail className='h-6 w-6' />
                    </div>
                    <div className='flex flex-col gap-1'>
                      <span className='text-lg font-extrabold tracking-tight text-(--text-primary)'>
                        Correo
                      </span>
                      <span className='text-sm text-(--text-secondary)'>
                        {config.correo}
                      </span>
                    </div>
                    <ArrowUpRight className='ml-auto h-5 w-5 text-(--text-secondary) transition-transform duration-200 group-hover:translate-x-0.5' />
                  </NervPanel>
                )}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  )
}