'use client'

import { useState } from 'react'
import { Slider } from '@/shared/components/ui/slider'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Input } from '@/shared/components/ui/input'
import type { Brand } from '@/shared/types'
import { Button } from '@/shared/components/ui/button'

interface FilterSidebarProps {
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

export function FilterSidebar({
  brands,
  selectedMarcas,
  selectedEscalas,
  precioMin,
  precioMax,
  maxPrice,
  onApply,
  onClear
}: FilterSidebarProps) {
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
  }

  const handleClear = () => {
    setPendingMarcas([])
    setPendingEscalas([])
    setSliderValue([0, maxPrice])
    setLocalMin(0)
    setLocalMax(maxPrice)
    onClear()
  }

  const hasPendingChanges =
    JSON.stringify(pendingMarcas.sort()) !==
      JSON.stringify(selectedMarcas.sort()) ||
    JSON.stringify(pendingEscalas.sort()) !==
      JSON.stringify(selectedEscalas.sort()) ||
    localMin !== (precioMin ?? 0) ||
    localMax !== (precioMax ?? maxPrice)

  return (
    <aside className='w-full lg:w-64 shrink-0'>
      <div className='bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 sticky top-28'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-extrabold tracking-tight text-[var(--text-primary)]'>
            Filtros
          </h2>
          <button
            onClick={handleClear}
            className='text-xs text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors duration-200 bg-transparent border-none cursor-pointer'>
            Limpiar
          </button>
        </div>

        <div className='mb-6'>
          <h3 className='text-xs font-semibold tracking-wider uppercase text-[var(--text-secondary)] mb-3'>
            Marcas
          </h3>
          <div className='space-y-2'>
            {brands.map((brand) => (
              <label
                key={brand.id}
                className='flex items-center gap-3 cursor-pointer group'>
                <Checkbox
                  checked={pendingMarcas.includes(brand.slug)}
                  onCheckedChange={() => toggleMarca(brand.slug)}
                />
                <span className='text-sm text-(--text-primary) group-hover:text-(--brand) transition-colors'>
                  {brand.nombre}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className='mb-6'>
          <h3 className='text-xs font-semibold tracking-wider uppercase text-[var(--text-secondary)] mb-3'>
            Escalas
          </h3>
          <div className='space-y-2'>
            {ESCALAS.map((escala) => (
              <label
                key={escala}
                className='flex items-center gap-3 cursor-pointer group'>
                <Checkbox
                  checked={pendingEscalas.includes(escala)}
                  onCheckedChange={() => toggleEscala(escala)}
                />
                <span className='text-sm text-[var(--text-primary)] group-hover:text-[var(--brand)] transition-colors'>
                  {escala}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className='mb-6'>
          <h3 className='text-xs font-semibold tracking-wider uppercase text-[var(--text-secondary)] mb-3'>
            Precio
          </h3>
          <div className='mb-4'>
            <Slider
              value={sliderValue}
              onValueChange={handleSliderChange}
              min={0}
              max={maxPrice}
              step={1}
              className='py-2'
            />
            <div className='flex justify-between text-xs text-[var(--text-secondary)] mt-1'>
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

        <Button
          onClick={handleApply}
          className={`w-full py-3 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-200 border border-border bg-(--surface-2) text-(--text-secondary) cursor-pointer ${
            hasPendingChanges
              ? 'bg-(--brand) text-white hover:opacity-90'
              : 'bg-(--surface-2) text-(--text-secondary) cursor-default hover:text-white'
          }`}>
          Aplicar filtros
        </Button>
      </div>
    </aside>
  )
}
