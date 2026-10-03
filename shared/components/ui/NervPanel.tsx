import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'
import { GlowCard } from '@/shared/components/ui/GlowCard'

interface NervPanelProps {
  as?: 'div' | 'article' | 'section' | 'aside'
  cut?: number
  className?: string
  innerClassName?: string
  /** Cursor-glow color. Passing it (or href) renders GlowCard as the fill layer. */
  glow?: string
  glowSize?: number
  href?: string
  target?: string
  rel?: string
  ariaLabel?: string
  children: ReactNode
}

/**
 * Chamfered retro-cel panel: a black edge layer with the fill inset,
 * corners cut top-right / bottom-left. Styles live in globals.css.
 */
export function NervPanel({
  as: Tag = 'div',
  cut,
  className,
  innerClassName,
  glow,
  glowSize,
  href,
  target,
  rel,
  ariaLabel,
  children
}: NervPanelProps) {
  const style = cut ? ({ '--cut': `${cut}px` } as CSSProperties) : undefined

  if (glow !== undefined || href) {
    return (
      <Tag className={cn('nerv-panel', className)} style={style}>
        <GlowCard
          href={href}
          target={target}
          rel={rel}
          ariaLabel={ariaLabel}
          glowColor={glow}
          glowSize={glowSize}
          className='nerv-panel__inner rounded-none'>
          <div className={cn('h-full', innerClassName)}>{children}</div>
        </GlowCard>
      </Tag>
    )
  }

  return (
    <Tag className={cn('nerv-panel', className)} style={style}>
      <div className={cn('nerv-panel__inner', innerClassName)}>{children}</div>
    </Tag>
  )
}

interface NervHeadProps {
  label: string
  swatch?: string | null
  className?: string
}

/** Black instrument strip: mono label, marca swatch, amber code block. */
export function NervHead({ label, swatch, className }: NervHeadProps) {
  return (
    <div className={cn('nerv-head', className)}>
      <span className='flex min-w-0 items-center gap-2'>
        {swatch ? (
          <span
            aria-hidden='true'
            className='h-2 w-2 shrink-0'
            style={{ background: swatch }}
          />
        ) : null}
        <span className='truncate'>{label}</span>
      </span>
      <span aria-hidden='true' className='nerv-head__code' />
    </div>
  )
}
