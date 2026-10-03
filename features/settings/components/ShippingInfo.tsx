'use client'

import { useState } from 'react'
import { Accordion, AccordionPanel } from 'grommet'
import { Minus, Plus } from 'lucide-react'
import { NervGrommet } from '@/shared/components/ui/NervGrommet'
import { NervPanel } from '@/shared/components/ui/NervPanel'

interface Section {
  title: string
  body: string
}

/**
 * Splits the owner's shipping text into sections: blocks separated by a
 * blank line whose first line reads as a title. Returns null when the text
 * isn't structured that way, so it renders as plain prose instead.
 */
function toSections(content: string): Section[] | null {
  const sections = content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const [first, ...rest] = block.split('\n')
      return { title: first.trim().replace(/:$/, ''), body: rest.join('\n').trim() }
    })
  const structured =
    sections.length >= 2 &&
    sections.every((s) => s.body !== '' && s.title.length <= 80)
  return structured ? sections : null
}

export function ShippingInfo({ content }: { content: string }) {
  const [active, setActive] = useState<number[]>([0])
  const sections = toSections(content)

  if (!sections) {
    return (
      <p className='whitespace-pre-wrap text-base leading-relaxed text-(--text-secondary)'>
        {content}
      </p>
    )
  }

  return (
    <NervPanel cut={18}>
      <NervGrommet>
        <Accordion activeIndex={active} onActive={setActive}>
          {sections.map((section, i) => {
            const open = active.includes(i)
            return (
              <AccordionPanel
                key={`${i}-${section.title}`}
                header={
                  <div
                    className={`flex items-center gap-4 px-5 py-4 text-left ${
                      i > 0 ? 'border-t-2 border-(--edge)' : ''
                    } ${open ? 'bg-(--surface-2)' : 'bg-(--surface)'}`}>
                    <span className='flex-1 text-base font-bold text-(--text-primary)'>
                      {section.title}
                    </span>
                    <span
                      aria-hidden='true'
                      className={`nerv-tag h-7 w-7 justify-center p-0 ${
                        open ? 'nerv-tag--alert' : 'nerv-tag--info'
                      }`}>
                      {open ? <Minus className='h-4 w-4' /> : <Plus className='h-4 w-4' />}
                    </span>
                  </div>
                }>
                <p className='m-0 whitespace-pre-wrap bg-(--surface-2) px-5 pb-5 text-base leading-relaxed text-(--text-secondary)'>
                  {section.body}
                </p>
              </AccordionPanel>
            )
          })}
        </Accordion>
      </NervGrommet>
    </NervPanel>
  )
}
