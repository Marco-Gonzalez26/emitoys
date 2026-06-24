'use client'

import { useState, useEffect } from 'react'
import { Slider } from '@/shared/components/ui/slider'
import type { Brand } from '@/shared/types'

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
  // Estado local pendiente — no afecta la URL hasta "Aplicar"
  const [pendingMarcas, setPendingMarcas] = useState(selectedMarcas)
  const [pendingEscalas, setPendingEscalas] = useState(selectedEscalas)
  const [sliderValue, setSliderValue] = useState<[number, number]>([
    precioMin ?? 0,
    precioMax ?? maxPrice
  ])
  const [localMin, setLocalMin] = useState(precioMin ?? 0)
  const [localMax, setLocalMax] = useState(precioMax ?? maxPrice)

  // Sincronizar si cambian los filtros desde afuera (ej: limpiar filtros)
  useEffect(() => {
    setPendingMarcas(selectedMarcas)
    setPendingEscalas(selectedEscalas)
    setSliderValue([precioMin ?? 0, precioMax ?? maxPrice])
    setLocalMin(precioMin ?? 0)
    setLocalMax(precioMax ?? maxPrice)
  }, [selectedMarcas, selectedEscalas, precioMin, precioMax, maxPrice])

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
      <div className='bg-(--surface) border border-border rounded-xl p-6 sticky top-28'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-extrabold tracking-tight text-(--text-primary)'>
            Filtros
          </h2>
          <button
            onClick={handleClear}
            className='text-xs text-(--text-secondary) hover:text-(--brand) transition-colors duration-200'>
            Limpiar
          </button>
        </div>

        {/* Marcas */}
        <div className='mb-6'>
          <h3 className='text-xs font-semibold tracking-wider uppercase text-(--text-secondary) mb-3'>
            Marcas
          </h3>
          <div className='space-y-2'>
            {brands.map((brand) => (
              <label
                key={brand.id}
                className='flex items-center gap-3 cursor-pointer group'>
                <input
                  type='checkbox'
                  checked={pendingMarcas.includes(brand.slug)}
                  onChange={() => toggleMarca(brand.slug)}
                  className='h-5 w-5 rounded border-border text-(--brand) focus:ring-(--brand) focus:ring-offset-0'
                />
                <span className='text-sm text-(--text-primary) group-hover:text-(--brand) transition-colors'>
                  {brand.nombre}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Escalas */}
        <div className='mb-6'>
          <h3 className='text-xs font-semibold tracking-wider uppercase text-[var(--text-secondary)] mb-3'>
            Escalas
          </h3>
          <div className='space-y-2'>
            {ESCALAS.map((escala) => (
              <label
                key={escala}
                className='flex items-center gap-3 cursor-pointer group'>
                <input
                  type='checkbox'
                  checked={pendingEscalas.includes(escala)}
                  onChange={() => toggleEscala(escala)}
                  className='h-5 w-5 rounded border-[var(--border)] text-[var(--brand)] focus:ring-[var(--brand)] focus:ring-offset-0'
                />
                <span className='text-sm text-[var(--text-primary)] group-hover:text-[var(--brand)] transition-colors'>
                  {escala}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Precio */}
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
            <input
              type='number'
              value={localMin}
              onChange={(e) => setLocalMin(Number(e.target.value))}
              placeholder='Min'
              className='w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg py-2 px-3 text-center text-sm focus:outline-none focus:border-[var(--brand)]'
              min={0}
              max={localMax}
            />
            <span className='text-[var(--text-secondary)]'>-</span>
            <input
              type='number'
              value={localMax}
              onChange={(e) => setLocalMax(Number(e.target.value))}
              placeholder='Max'
              className='w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg py-2 px-3 text-center text-sm focus:outline-none focus:border-[var(--brand)]'
              min={localMin}
              max={maxPrice}
            />
          </div>
        </div>

        {/* Aplicar */}
        <button
          onClick={handleApply}
          className={`w-full py-3 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-200 ${
            hasPendingChanges
              ? 'bg-[var(--brand)] text-white hover:opacity-90'
              : 'bg-[var(--surface-2)] text-[var(--text-secondary)] cursor-default'
          }`}>
          Aplicar filtros
        </button>
      </div>
    </aside>
  )
}
