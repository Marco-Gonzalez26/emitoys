import { getConfiguracion } from '@/features/settings/actions/settings'
import Facebook from '@/shared/components/icons/Facebook'
import { Instagram } from '@/shared/components/icons/Instagram'
import { TikTok } from '@/shared/components/icons/Tiktok'
import { WhatsApp } from '@/shared/components/icons/Whastapp'
import { ArrowUpRight } from 'lucide-react'
import { GlowCard } from '@/shared/components/ui/GlowCard'
import { Reveal } from '@/shared/components/ui/Reveal'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comunidad',
  description:
    'Únete a la comunidad de coleccionistas EmiToys. Síguenos en redes sociales y entérate de las últimas novedades.',
  alternates: {
    canonical: '/comunidad'
  },
  openGraph: {
    title: 'Comunidad | EmiToys',
    description:
      'Únete a la comunidad de coleccionistas EmiToys. Síguenos en redes sociales.'
  }
}

export default async function ComunidadPage() {
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
              Comunidad
            </h1>
          </div>
        </Reveal>

        {config.comunidad_contenido ? (
          <Reveal delay={0.05}>
            <p className='whitespace-pre-wrap text-base leading-relaxed text-(--text-secondary)'>
              {config.comunidad_contenido}
            </p>
          </Reveal>
        ) : (
          <p className='text-(--text-secondary) italic'>Próximamente...</p>
        )}

        {(config.instagram || config.tiktok || config.facebook) && (
          <Reveal delay={0.1}>
            <div className='flex flex-col gap-4 pt-4'>
              <span className='text-sm font-bold text-(--text-primary)'>
                Síguenos
              </span>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                {config.instagram && (
                  <GlowCard
                    href={config.instagram}
                    target='_blank'
                    rel='noopener noreferrer'
                    glowColor='#E4405F'
                    className='border border-border bg-(--surface)'>
                    <div className='flex h-full flex-col gap-4 p-6'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-tr from-purple-600 via-pink-500 to-orange-400 text-white'>
                        <Instagram className='h-6 w-6' />
                      </div>
                      <div className='flex flex-col gap-1'>
                        <span className='text-lg font-extrabold tracking-tight text-(--text-primary)'>
                          Instagram
                        </span>
                        <span className='text-sm text-(--text-secondary)'>
                          Novedades y stories
                        </span>
                      </div>
                      <ArrowUpRight className='ml-auto h-5 w-5 text-(--text-secondary)' />
                    </div>
                  </GlowCard>
                )}
                {config.tiktok && (
                  <GlowCard
                    href={config.tiktok}
                    target='_blank'
                    rel='noopener noreferrer'
                    glowColor='#00F2EA'
                    className='border border-(--border) bg-(--surface)'>
                    <div className='flex h-full flex-col gap-4 p-6'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-black text-white'>
                        <TikTok className='h-6 w-6' />
                      </div>
                      <div className='flex flex-col gap-1'>
                        <span className='text-lg font-extrabold tracking-tight text-(--text-primary)'>
                          TikTok
                        </span>
                        <span className='text-sm text-(--text-secondary)'>
                          Unboxings y reels
                        </span>
                      </div>
                      <ArrowUpRight className='ml-auto h-5 w-5 text-(--text-secondary)' />
                    </div>
                  </GlowCard>
                )}
                {config.facebook && (
                  <GlowCard
                    href={config.facebook}
                    target='_blank'
                    rel='noopener noreferrer'
                    glowColor='#1877F2'
                    className='border border-(--border) bg-(--surface)'>
                    <div className='flex h-full flex-col gap-4 p-6'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-blue-800 text-white'>
                        <Facebook className='h-6 w-6' />
                      </div>
                      <div className='flex flex-col gap-1'>
                        <span className='text-lg font-extrabold tracking-tight text-(--text-primary)'>
                          Facebook
                        </span>
                        <span className='text-sm text-(--text-secondary)'>
                          Comunicados y eventos
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

        {config.whatsapp && (
          <a
            href='https://chat.whatsapp.com/DHElpltb1DFEIIrFtOJ1CO'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center justify-center gap-2 self-start rounded-full border border-green-500 bg-green-500 px-5 py-2.5 text-sm font-bold text-white no-underline transition-colors duration-200 hover:bg-green-600 active:scale-[0.97]'>
            <WhatsApp className='size-7' />
            Únete al grupo de WhatsApp
          </a>
        )}
      </div>
    </div>
  )
}