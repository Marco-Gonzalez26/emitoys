'use client'

import { useState } from 'react'
import { login } from '../actions/auth'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Button } from '@/shared/components/ui/button'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full max-w-sm'>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder='admin@emitoys.com'
        />
      </div>

      <div className='flex flex-col gap-2'>
        <Label htmlFor='password'>Contraseña</Label>
        <Input
          id='password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder='••••••••'
        />
      </div>

      {error && (
        <p className='text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2'>
          {error}
        </p>
      )}

      <Button
        type='submit'
        disabled={loading}
        className='mt-2'>
        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </Button>
    </form>
  )
}
