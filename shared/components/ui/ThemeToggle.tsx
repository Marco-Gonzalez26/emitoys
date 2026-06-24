'use client'

import { useState } from 'react'

function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem('emitoys-theme') as
    | 'light'
    | 'dark'
    | null
  return stored ?? 'light'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme)

  function toggle() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('emitoys-theme', next)
  }

  return (
    <button
      onClick={toggle}
      aria-label='Cambiar tema'
      className='w-10 h-10 rounded-full border border-border bg-(--surface) flex items-center justify-center text-base cursor-pointer hover:border-(--brand) transition-colors duration-200'>
      {/* Add icons */}
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
