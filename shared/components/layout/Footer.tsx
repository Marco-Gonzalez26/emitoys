import Link from 'next/link'

export function Footer() {
  return (
    <footer className='border-t border-border bg-(--surface) px-10 py-8 flex justify-between items-center w-full'>
      <span className='font-extrabold text-sm text-(--brand)'>EMITOYS</span>
      <span className='text-xs text-(--text-secondary)'>
        © {new Date().getFullYear()} EmiToys Garage · Distribuidor autorizado
      </span>
      <div className='flex gap-6'>
        {['Políticas de envío', 'Términos', 'Contacto'].map((item) => (
          <Link
            key={item}
            href='#'
            className='text-xs text-(--text-secondary) hover:text-(--text-primary) no-underline transition-colors duration-200'>
            {item}
          </Link>
        ))}
      </div>
    </footer>
  )
}
