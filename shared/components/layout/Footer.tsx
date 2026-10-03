import Image from 'next/image'
import Link from 'next/link'
import { WhatsApp } from '@/shared/components/icons/Whastapp'
import { Instagram } from '@/shared/components/icons/Instagram'
import { TikTok } from '@/shared/components/icons/Tiktok'
import Facebook from '@/shared/components/icons/Facebook'
import { Mail } from 'lucide-react'
import { NervHead } from '@/shared/components/ui/NervPanel'
import type { Configuracion } from '@/shared/types'

export function Footer({ config }: { config: Configuracion }) {
  return (
    <footer className='z-50 flex w-full flex-col gap-6 border-t-2 border-(--edge) bg-(--surface) px-10 pt-8'>
      <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
        <div className='flex items-center gap-3'>
          <Image src='/logo.png' alt='Logo' width={50} height={50} />
          <span className='font-[family-name:var(--font-garage)] text-2xl tracking-[-0.01em] text-(--text-primary) uppercase'>
            EmiToys
          </span>
        </div>

        <div className='flex gap-6'>
          <Link
            href='/sobre-nosotros'
            className='font-mono text-xs font-semibold tracking-[0.14em] text-(--text-secondary) uppercase no-underline underline-offset-4 transition-colors duration-200 hover:text-(--brand-ink) hover:underline'>
            Sobre nosotros
          </Link>
          <Link
            href='/catalogo'
            className='font-mono text-xs font-semibold tracking-[0.14em] text-(--text-secondary) uppercase no-underline underline-offset-4 transition-colors duration-200 hover:text-(--brand-ink) hover:underline'>
            Catálogo
          </Link>
          <Link
            href='/comunidad'
            className='font-mono text-xs font-semibold tracking-[0.14em] text-(--text-secondary) uppercase no-underline underline-offset-4 transition-colors duration-200 hover:text-(--brand-ink) hover:underline'>
            Comunidad
          </Link>
        </div>
      </div>

      {/* Social media icons */}
      <div className='flex flex-col flex-wrap items-center justify-center gap-3'>
        <div>
          <span className='font-mono text-xs font-semibold tracking-[0.14em] text-(--text-secondary) uppercase'>Síguenos</span>
        </div>
        <div className='flex gap-3 flex-wrap'>
          {config.whatsapp && (
            <a
              href={`https://chat.whatsapp.com/DHElpltb1DFEIIrFtOJ1CO`}
              target='_blank'
              rel='noopener noreferrer'
              className='nerv-tag h-9 w-9 justify-center p-0 [--cut:7px] bg-green-500 text-white flex items-center justify-center transition-transform duration-200 hover:-translate-y-0.5 border border-green-500'
              aria-label='WhatsApp'>
              <WhatsApp className='w-4 h-4' />
            </a>
          )}
          {config.instagram && (
            <a
              href={config.instagram}
              target='_blank'
              rel='noopener noreferrer'
              className='nerv-tag h-9 w-9 justify-center p-0 [--cut:7px] bg-linear-to-tr from-purple-600 via-pink-500 to-orange-400 text-white flex items-center justify-center transition-transform duration-200 hover:-translate-y-0.5'
              aria-label='Instagram'>
              <Instagram className='w-4 h-4' />
            </a>
          )}
          {config.tiktok && (
            <a
              href={config.tiktok}
              target='_blank'
              rel='noopener noreferrer'
              className='nerv-tag h-9 w-9 justify-center p-0 [--cut:7px] bg-(--eva-black) text-white flex items-center justify-center transition-transform duration-200 hover:-translate-y-0.5'
              aria-label='TikTok'>
              <TikTok className='w-4 h-4' />
            </a>
          )}
          {config.facebook && (
            <a
              href={config.facebook}
              target='_blank'
              rel='noopener noreferrer'
              className='nerv-tag h-9 w-9 justify-center p-0 [--cut:7px] bg-blue-800 text-white flex items-center justify-center transition-transform duration-200 hover:-translate-y-0.5'
              aria-label='Facebook'>
              <Facebook className='w-4 h-4' />
            </a>
          )}
          {config.correo && (
            <a
              href={`mailto:${config.correo}`}
              className='nerv-tag h-9 w-9 justify-center p-0 [--cut:7px] bg-(--brand) text-(--brand-on) flex items-center justify-center transition-transform duration-200 hover:-translate-y-0.5'
              aria-label='Correo'>
              <Mail className='w-4 h-4' />
            </a>
          )}
        </div>
      </div>
      <NervHead label={`© ${new Date().getFullYear()} EmiToys`} className='-mx-10' />
    </footer>
  )
}
