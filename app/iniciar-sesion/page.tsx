import { LoginForm } from '@/features/auth/components/LoginForm'
import { NervHead, NervPanel } from '@/shared/components/ui/NervPanel'

export default function LoginPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-(--bg) px-6'>
      <div className='flex flex-col items-center gap-8'>
        <div className='flex flex-col items-center gap-2'>
          <span className='font-[family-name:var(--font-garage)] text-4xl tracking-[-0.01em] uppercase'>
            <span className='text-(--brand-ink)'>EMI</span>
            <span className='text-(--text-primary)'>TOYS</span>
          </span>
          <p className='text-sm text-(--text-secondary)'>
            Panel de administración
          </p>
        </div>

        <NervPanel cut={18} className='w-full max-w-md'>
          <NervHead label='Acceso // Admin' />
          <div className='flex flex-col items-center p-8'>
            <h1 className='m-0 mb-6 text-center text-xl font-extrabold tracking-tight text-(--text-primary)'>
              Iniciar sesión
            </h1>
            <LoginForm />
          </div>
        </NervPanel>

        <p className='text-xs text-(--text-secondary)'>
          © {new Date().getFullYear()} EmiToys 
        </p>
      </div>
    </div>
  )
}
