import { LoginForm } from '@/features/auth/components/LoginForm'

export default function LoginPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-(--bg) px-6'>
      <div className='flex flex-col items-center gap-8'>
        <div className='flex flex-col items-center gap-2'>
          <span className='font-extrabold text-3xl tracking-tight'>
            <span className='text-(--brand)'>EMI</span>
            <span className='text-(--text-primary)'>TOYS</span>
          </span>
          <p className='text-sm text-(--text-secondary)'>
            Panel de administración
          </p>
        </div>

        <div className='bg-(--surface) border border-border rounded-2xl p-8 w-full max-w-md'>
          <h1 className='text-xl font-extrabold tracking-tight text-(--text-primary) mb-6 text-center'>
            Iniciar sesión
          </h1>
          <LoginForm />
        </div>

        <p className='text-xs text-(--text-secondary)'>
          © {new Date().getFullYear()} EmiToys 
        </p>
      </div>
    </div>
  )
}
