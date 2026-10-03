'use client'

import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle
} from '@/shared/components/ui/sheet'
import { Slider } from '@/shared/components/ui/slider'
import { Input } from '@/shared/components/ui/input'
import type { Brand } from '@/shared/types'

interface FilterDrawerProps {
  brands: Brand[]
  selectedMarcas: string[]
  selectedEscalas: string[]
  precioMin?: number
  precioMax?: number
  maxPrice: number
  onApply: (
    marcas: string[],
    escalas: string[],
    min: number | undefined,
    max: number | undefined
  ) => void
  onClear: () => void
}

const ESCALAS = ['1:64', '1:43', '1:18', '1:12']

export function FilterDrawer({
  brands,
  selectedMarcas,
  selectedEscalas,
  precioMin,
  precioMax,
  maxPrice,
  onApply,
  onClear
}: FilterDrawerProps) {
  const [open, setOpen] = useState(false)
  const [pendingMarcas, setPendingMarcas] = useState(selectedMarcas)
  const [pendingEscalas, setPendingEscalas] = useState(selectedEscalas)
  const [sliderValue, setSliderValue] = useState<[number, number]>([
    precioMin ?? 0,
    precioMax ?? maxPrice
  ])
  const [localMin, setLocalMin] = useState(precioMin ?? 0)
  const [localMax, setLocalMax] = useState(precioMax ?? maxPrice)

  const toggleMarca = (slug: string) => {
    setPendingMarcas((prev) =>
      prev.includes(slug) ? prev.filter((m) => m !== slug) : [...prev, slug]
    )
  }

  const toggleEscala = (escala: string) => {
    setPendingEscalas((prev) =>
      prev.includes(escala)
        ? prev.filter((e) => e !== escala)
        : [...prev, escala]
    )
  }

  const handleSliderChange = (value: number[]) => {
    setSliderValue([value[0], value[1]])
    setLocalMin(value[0])
    setLocalMax(value[1])
  }

  const handleApply = () => {
    onApply(
      pendingMarcas,
      pendingEscalas,
      localMin > 0 ? localMin : undefined,
      localMax < maxPrice ? localMax : undefined
    )
    setOpen(false)
  }

  const handleClear = () => {
    setPendingMarcas([])
    setPendingEscalas([])
    setSliderValue([0, maxPrice])
    setLocalMin(0)
    setLocalMax(maxPrice)
    onClear()
    setOpen(false)
  }

  const hasPendingChanges =
    JSON.stringify([...pendingMarcas].sort()) !==
      JSON.stringify([...selectedMarcas].sort()) ||
    JSON.stringify([...pendingEscalas].sort()) !==
      JSON.stringify([...selectedEscalas].sort()) ||
    localMin !== (precioMin ?? 0) ||
    localMax !== (precioMax ?? maxPrice)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className='nerv-btn nerv-btn--brand fixed bottom-6 left-1/2 z-40 -translate-x-1/2 lg:hidden'>
          <SlidersHorizontal className='w-5 h-5' />
          Filtros
        </button>
      </SheetTrigger>

      <SheetContent
        side='bottom'
        className='h-[80vh] overflow-y-auto rounded-none border-t-2 border-(--edge) p-4'>
        <div className='flex items-center justify-between mb-6'>
          <SheetTitle className='m-0 font-[family-name:var(--font-garage)] text-2xl tracking-[-0.01em] text-(--text-primary) uppercase'>
            Filtros
          </SheetTitle>
        </div>

        <button
          type='button'
          onClick={handleClear}
          className='nerv-btn nerv-btn--sm mb-6'>
          Limpiar
        </button>
        <div className='mb-6'>
          <h3 className='font-[family-name:var(--font-garage)] text-base tracking-[0.02em] uppercase text-(--text-primary) mb-3'>
            Marcas
          </h3>
          <div className='flex flex-wrap gap-2'>
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => toggleMarca(brand.slug)}
                aria-pressed={pendingMarcas.includes(brand.slug)}
                className={`nerv-btn nerv-btn--sm ${
                  pendingMarcas.includes(brand.slug) ? 'nerv-btn--brand' : ''
                }`}>
                {brand.nombre}
              </button>
            ))}
          </div>
        </div>

        <div className='mb-6'>
          <h3 className='font-[family-name:var(--font-garage)] text-base tracking-[0.02em] uppercase text-(--text-primary) mb-3'>
            Escalas
          </h3>
          <div className='flex flex-wrap gap-2'>
            {ESCALAS.map((escala) => (
              <button
                key={escala}
                onClick={() => toggleEscala(escala)}
                aria-pressed={pendingEscalas.includes(escala)}
                className={`nerv-btn nerv-btn--sm ${
                  pendingEscalas.includes(escala) ? 'nerv-btn--brand' : ''
                }`}>
                {escala}
              </button>
            ))}
          </div>
        </div>

        <div className='mb-6'>
          <h3 className='font-[family-name:var(--font-garage)] text-base tracking-[0.02em] uppercase text-(--text-primary) mb-3'>
            Precio
          </h3>
          <div className='mb-4'>
            <Slider
              value={sliderValue}
              onValueChange={handleSliderChange}
              min={0}
              max={maxPrice}
              step={1}
            />
            <div className='flex justify-between font-mono text-xs font-semibold tracking-[0.08em] text-[var(--text-secondary)] mt-1 tabular-nums'>
              <span>${sliderValue[0]}</span>
              <span>${sliderValue[1]}</span>
            </div>
          </div>
          <div className='flex gap-2 items-center'>
            <Input
              type='number'
              value={localMin}
              onChange={(e) => setLocalMin(Number(e.target.value))}
              placeholder='Min'
              className='text-center'
              min={0}
              max={localMax}
            />
            <span className='text-[var(--text-secondary)]'>-</span>
            <Input
              type='number'
              value={localMax}
              onChange={(e) => setLocalMax(Number(e.target.value))}
              placeholder='Max'
              className='text-center'
              min={localMin}
              max={maxPrice}
            />
          </div>
        </div>

        <button
          type='button'
          onClick={handleApply}
          aria-disabled={!hasPendingChanges}
          className={`nerv-btn nerv-btn--block text-xs ${
            hasPendingChanges ? 'nerv-btn--brand' : 'nerv-btn--off'
          }`}>
          Aplicar filtros
        </button>
      </SheetContent>
    </Sheet>
  )
}
