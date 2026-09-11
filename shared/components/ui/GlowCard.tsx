'use client'

import Link from 'next/link'
import { useCallback, type MouseEvent, type ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

interface GlowCardProps {
  href?: string
  glowColor?: string
  glowSize?: number
  className?: string
  children: ReactNode
  ariaLabel?: string
  target?: string
  rel?: string
  onClick?: () => void
}

export function GlowCard({
  href,
  glowColor,
  glowSize = 200,
  className,
  children,
  ariaLabel,
  target,
  rel,
  onClick
}: GlowCardProps) {
  const handlePointerMove = useCallback((e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--glow-x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--glow-y', `${e.clientY - rect.top}px`)
  }, [])

  const classes = cn('glow-card relative overflow-hidden rounded-2xl', className)
  const content = <div className='relative z-10 h-full'>{children}</div>

  if (href) {
    return (
      <Link
        href={href}
        aria-label={ariaLabel}
        target={target}
        rel={rel}
        onClick={onClick}
        onMouseMove={handlePointerMove}
        className={classes}
        style={
          {
            '--glow-color': glowColor ?? 'var(--brand)',
            '--glow-size': `${glowSize}px`
          } as React.CSSProperties
        }>
        {content}
      </Link>
    )
  }

  return (
    <div
      onMouseMove={handlePointerMove}
      className={classes}
      style={
        {
          '--glow-color': glowColor ?? 'var(--brand)',
          '--glow-size': `${glowSize}px`
        } as React.CSSProperties
      }>
      {content}
    </div>
  )
}
