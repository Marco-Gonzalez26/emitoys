import { getConfiguracion } from '@/features/settings/actions/settings'
import { WhatsApp } from '@/shared/components/icons/Whastapp'
import { Mail, ArrowUpRight } from 'lucide-react'
import { GlowCard } from '@/shared/components/ui/GlowCard'
import { Reveal } from '@/shared/components/ui/Reveal'
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
          <div className='flex flex-col gap-2'>
            <span className='text-xs font-semibold uppercase tracking-widest text-(--brand)'>
              EmiToys
            </span>
            <h1 className='m-0 text-3xl font-extrabold tracking-tight text-(--text-primary) md:text-4xl'>
              Envíos
            </h1>
          </div>
        </Reveal>

        {config.envios_contenido ? (
          <Reveal delay={0.05}>
            <p className='whitespace-pre-wrap text-base leading-relaxed text-(--text-secondary)'>
              {config.envios_contenido}
            </p>
          </Reveal>
        ) : (
          <p className='text-(--text-secondary) italic'>Próximamente...</p>
        )}

        {(config.whatsapp || config.correo) && (
          <Reveal delay={0.1}>
            <div className='flex flex-col gap-4 pt-4'>
              <span className='text-sm font-bold text-(--text-primary)'>
                ¿Tienes dudas sobre tu envío?
              </span>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                {config.whatsapp && (
                  <GlowCard
                    href={`https://wa.me/${config.whatsapp.replace(/\D/g, '')}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    glowColor='#25D366'
                    className='border border-(--border) bg-(--surface)'>
                    <div className='flex h-full flex-col gap-4 p-6'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white'>
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
                      <ArrowUpRight className='ml-auto h-5 w-5 text-(--text-secondary)' />
                    </div>
                  </GlowCard>
                )}
                {config.correo && (
                  <GlowCard
                    href={`mailto:${config.correo}`}
                    glowColor='var(--brand)'
                    className='border border-(--border) bg-(--surface)'>
                    <div className='flex h-full flex-col gap-4 p-6'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-(--surface-2) text-(--brand)'>
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
                      <ArrowUpRight className='ml-auto h-5 w-5 text-(--text-secondary)' />
                    </div>
                  </GlowCard>
                )}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  )
}