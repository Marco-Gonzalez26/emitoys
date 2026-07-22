import Image from 'next/image'
import Link from 'next/link'
import { getConfiguracion } from '@/features/settings/actions/settings'
import { WhatsApp } from '@/shared/components/icons/Whastapp'
import { Instagram } from '@/shared/components/icons/Instagram'
import { TikTok } from '@/shared/components/icons/Tiktok'
import Facebook from '@/shared/components/icons/Facebook'
import { Mail } from 'lucide-react'

export async function Footer() {
  const config = await getConfiguracion()

  return (
    <footer className='border-t border-border bg-(--surface) px-10 py-8 flex flex-col gap-6 w-full z-50'>
      <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
        <div className='flex items-center gap-3'>
          <Image src='/logo.png' alt='Logo' width={50} height={50} />
          <span className='text-lg text-(--text-secondary) font-bold'>
            EmiToys
          </span>
        </div>

        <div className='flex gap-6'>
          <Link
            href='/sobre-nosotros'
            className='text-xs text-(--text-secondary) hover:text-(--text-primary) no-underline transition-colors duration-200'>
            Sobre nosotros
          </Link>
          <Link
            href='/catalogo'
            className='text-xs text-(--text-secondary) hover:text-(--text-primary) no-underline transition-colors duration-200'>
            Catálogo
          </Link>
          <Link
            href='/comunidad'
            className='text-xs text-(--text-secondary) hover:text-(--text-primary) no-underline transition-colors duration-200'>
            Comunidad
          </Link>
        </div>
      </div>

      {/* Social media icons */}
      <div className='flex flex-col flex-wrap items-center justify-center gap-3'>
        <div>
          <span className='text-(--text-secondary) text-lg font-bold'>Síguenos</span>
        </div>
        <div className='flex gap-3 flex-wrap'>
          {config.whatsapp && (
            <a
              href={`https://chat.whatsapp.com/DHElpltb1DFEIIrFtOJ1CO`}
              target='_blank'
              rel='noopener noreferrer'
              className='w-9 h-9 rounded-full bg-white text-white flex items-center justify-center hover:scale-110 transition-transform border border-green-500 '
              aria-label='WhatsApp'>
              <WhatsApp className='w-4 h-4' />
            </a>
          )}
          {config.instagram && (
            <a
              href={config.instagram}
              target='_blank'
              rel='noopener noreferrer'
              className='w-9 h-9 rounded-full bg-linear-to-tr from-purple-600 via-pink-500 to-orange-400 text-white flex items-center justify-center hover:scale-110 transition-transform'
              aria-label='Instagram'>
              <Instagram className='w-4 h-4' />
            </a>
          )}
          {config.tiktok && (
            <a
              href={config.tiktok}
              target='_blank'
              rel='noopener noreferrer'
              className='w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform'
              aria-label='TikTok'>
              <TikTok className='w-4 h-4' />
            </a>
          )}
          {config.facebook && (
            <a
              href={config.facebook}
              target='_blank'
              rel='noopener noreferrer'
              className='w-9 h-9 rounded-full bg-blue-800 text-white flex items-center justify-center hover:scale-110 transition-transform'
              aria-label='Facebook'>
              <Facebook className='w-4 h-4' />
            </a>
          )}
          {config.correo && (
            <a
              href={`mailto:${config.correo}`}
              className='w-9 h-9 rounded-full bg-(--brand) text-white flex items-center justify-center hover:scale-110 transition-transform'
              aria-label='Correo'>
              <Mail className='w-4 h-4' />
            </a>
          )}
        </div>
      </div>
      <span className='text-xs text-(--text-secondary) text-center'>
        © {new Date().getFullYear()} EmiToys
      </span>
    </footer>
  )
}
