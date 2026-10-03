'use client'

import { useState } from 'react'
import { Slider } from '@/shared/components/ui/slider'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Input } from '@/shared/components/ui/input'
import type { Brand } from '@/shared/types'
import { NervPanel } from '@/shared/components/ui/NervPanel'

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
      <NervPanel className='sticky top-24' innerClassName='p-6'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='m-0 font-[family-name:var(--font-garage)] text-2xl tracking-[-0.01em] text-(--text-primary) uppercase'>
            Filtros
          </h2>
          <button
            onClick={handleClear}
            className='cursor-pointer border-none bg-transparent font-mono text-xs font-semibold tracking-[0.14em] text-(--text-secondary) uppercase underline-offset-4 transition-colors duration-200 hover:text-(--brand-ink) hover:underline'>
            Limpiar
          </button>
        </div>

        <div className='mb-6'>
          <h3 className='font-[family-name:var(--font-garage)] text-base tracking-[0.02em] uppercase text-(--text-primary) mb-3'>
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
                <span
                  className='h-2.5 w-2.5'
                  style={{ background: brand.color_hex }}
                />
                <span className='text-sm text-(--text-primary) group-hover:text-(--brand-ink) transition-colors'>
                  {brand.nombre}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className='mb-6'>
          <h3 className='font-[family-name:var(--font-garage)] text-base tracking-[0.02em] uppercase text-(--text-primary) mb-3'>
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
                <span className='text-sm text-(--text-primary) group-hover:text-(--brand-ink) transition-colors'>
                  {escala}
                </span>
              </label>
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
              className='py-2'
            />
            <div className='flex justify-between font-mono text-xs font-semibold tracking-[0.08em] text-(--text-secondary) mt-1 tabular-nums'>
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
      </NervPanel>
    </aside>
  )
}
