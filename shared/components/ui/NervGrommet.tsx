'use client'

import type { ReactNode } from 'react'
import { Grommet, type ThemeType } from 'grommet'

/**
 * Grommet scoped to an island (`plain`: no global styles), themed with
 * the NGE tokens so its components read as part of the NERV retro kit.
 */
const nervTheme: ThemeType = {
  global: {
    font: { family: 'var(--font-manrope), sans-serif' },
    colors: {
      brand: 'var(--brand)',
      focus: 'var(--edge)',
      text: { light: 'var(--text-primary)', dark: 'var(--text-primary)' },
      border: { light: 'var(--edge)', dark: 'var(--edge)' }
    },
    focus: {
      border: { color: 'var(--edge)' },
      outline: { color: 'var(--edge)', size: '2px', offset: '2px' },
      shadow: undefined
    },
    edgeSize: { xsmall: '6px', small: '12px', medium: '20px' }
  },
  clock: {
    digital: {
      text: {
        small: { size: '13px', height: 1 },
        medium: { size: '16px', height: 1 }
      }
    }
  },
  accordion: {
    border: undefined,
    panel: { border: undefined },
    icons: { color: 'var(--text-primary)' }
  }
}

export function NervGrommet({ children }: { children: ReactNode }) {
  return (
    <Grommet plain theme={nervTheme} background='transparent'>
      {children}
    </Grommet>
  )
}
