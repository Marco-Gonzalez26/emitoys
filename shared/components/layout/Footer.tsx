import Image from 'next/image'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className='border-t border-border bg-(--surface) px-10 py-8 flex justify-between items-center w-full'>
      <Image src="/logo.png" alt="Logo" width={50} height={50} />
      <span className='text-xs text-(--text-secondary)'>
        © {new Date().getFullYear()} EmiToys Garage 
      </span>
      <div className='flex gap-6'>
        {[ 'Sobre nosotros'].map((item) => (
          <Link
            key={item}
            href='/sobre-nosotros'
            className='text-xs text-(--text-secondary) hover:text-(--text-primary) no-underline transition-colors duration-200'>
            {item}
          </Link>
        ))}
      </div>
    </footer>
  )
}
