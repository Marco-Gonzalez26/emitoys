// app/(public)/comunidad/page.tsx
import { getConfiguracion } from '@/features/settings/actions/settings'
import Facebook from '@/shared/components/icons/Facebook'
import { Instagram } from '@/shared/components/icons/Instagram'
import { TikTok } from '@/shared/components/icons/Tiktok'
import { WhatsApp } from '@/shared/components/icons/Whastapp'

export default async function ComunidadPage() {
  const config = await getConfiguracion()

  return (
    <div className='px-6 py-12 md:px-10 max-w-3xl mx-auto'>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-2'>
          <span className='text-[11px] font-bold tracking-[0.25em]  text-[var(--text-secondary)]'>
            EmiToys
          </span>
          <h1 className='text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]'>
            Comunidad
          </h1>
        </div>

        {config.comunidad_contenido ? (
          <p className='text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap text-base'>
            {config.comunidad_contenido}
          </p>
        ) : (
          <p className='text-[var(--text-secondary)] italic'>Próximamente...</p>
        )}

        {/* Links de redes si están configurados */}
        {(config.instagram || config.tiktok || config.facebook) && (
          <div className='flex flex-col gap-3 pt-4 border-t border-[var(--border)]'>
            <span className='text-sm font-bold text-[var(--text-primary)]'>
              Síguenos
            </span>
            <div className='flex flex-wrap gap-3'>
              {config.instagram && (
                <a
                  href={config.instagram}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='px-4 py-2 rounded-full border border-border text-sm font-semibold text-white  hover:scale-105 transition-transform  no-underline flex gap-2 bg-linear-to-tr from-purple-600 via-pink-500 to-orange-400 items-center justify-center'>
                  <Instagram className='size-7' />
                  Instagram
                </a>
              )}
              {config.tiktok && (
                <a
                  href={config.tiktok}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='px-4 py-2 rounded-full border border-[var(--border)] text-sm font-semibold text-[var(--text-primary)] 
                  hover:scale-105 transition-transform no-underline flex items-center justify-center gap-2 bg-black text-white'>
                  <TikTok className='size-7' />
                  TikTok
                </a>
              )}
              {config.facebook && (
                <a
                  href={config.facebook}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='px-4 py-2 rounded-full border border-border text-sm font-semibold  hover:scale-105 transition-transform no-underline flex items-center justify-center gap-2 bg-blue-800 text-white'>
                  <Facebook className='size-7' />
                  Facebook
                </a>
              )}
            </div>
          </div>
        )}

        {/* WhatsApp si está configurado */}
        {config.whatsapp && (
          <a
            href={`https://chat.whatsapp.com/DHElpltb1DFEIIrFtOJ1CO`}
            target='_blank'
            rel='noopener noreferrer'
            className='self-start px-5 py-2.5 rounded-full bg-white  border border-green-500 text-green-500 text-sm font-bold hover:scale-105 transition-transform no-underline flex items-center justify-center gap-2'>
            <WhatsApp className='size-7' />
            Únete al grupo de WhatsApp
          </a>
        )}
      </div>
    </div>
  )
}
