'use client'

import { useState, useSyncExternalStore } from 'react'
import { Clock } from 'grommet'
import { NervGrommet } from '@/shared/components/ui/NervGrommet'

const DAY_MS = 86_400_000
const noopSubscribe = () => () => {}

// Grommet's digital Clock wraps hours at 24, so whole days are shown
// separately and the Clock only ever counts down the current day.
function splitRemaining(closesAt: number, now: number) {
  const remaining = closesAt - now
  if (remaining <= 0) return null
  let days = Math.floor(remaining / DAY_MS)
  let seconds = Math.floor((remaining % DAY_MS) / 1000)
  if (seconds === 0) {
    days -= 1
    seconds = 86_399
  }
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return { days, time: `PT${h}H${m}M${s}S` }
}

interface PreventaCountdownProps {
  closesAt: string
  /** Static date label, used for SSR and as the accessible name. */
  label: string
}

/** NERV internal-power style timer counting down to the pre-venta close. */
export function PreventaCountdown({ closesAt, label }: PreventaCountdownProps) {
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  )
  const [now, setNow] = useState(() => Date.now())
  const target = new Date(closesAt).getTime()
  const parts = mounted && !Number.isNaN(target) ? splitRemaining(target, now) : null

  return (
    <div className='nerv-timer' role='timer' aria-label={label}>
      <span className='nerv-timer__label'>
        {parts ? 'Cierra en' : mounted ? 'Cerrada' : 'Cierra'}
      </span>
      <div className='nerv-timer__face' aria-hidden='true'>
        {parts ? (
          <>
            {parts.days > 0 ? <span>{parts.days}D</span> : null}
            <NervGrommet>
              <Clock
                key={now}
                type='digital'
                time={parts.time}
                run='backward'
                precision='seconds'
                size='small'
                onChange={(t) => {
                  if (t === 'P0H0M0S') setNow(Date.now())
                }}
              />
            </NervGrommet>
          </>
        ) : (
          <span>{label.replace(/^Cierra\s*/i, '')}</span>
        )}
      </div>
    </div>
  )
}
