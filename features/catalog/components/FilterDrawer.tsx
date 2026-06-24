'use client'

import { useState, useEffect } from 'react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle
} from '@/shared/components/ui/sheet'
import { Slider } from '@/shared/components/ui/slider'
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

  // Sincronizar cuando cambian desde afuera (ej: limpiar filtros)
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
    setOpen(false) // cierra el drawer al aplicar
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
        <button className='lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[var(--brand)] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-semibold text-sm'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={2}
            stroke='currentColor'
            className='w-5 h-5'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75'
            />
          </svg>
          Filtros
        </button>
      </SheetTrigger>

      <SheetContent
        side='bottom'
        className='h-[80vh] overflow-y-auto rounded-t-2xl'>
        <div className='flex items-center justify-between mb-6'>
          <SheetTitle className='text-xl font-extrabold tracking-tight text-[var(--text-primary)]'>
            Filtros
          </SheetTitle>
          <button
            onClick={handleClear}
            className='text-xs text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors duration-200'>
            Limpiar
          </button>
        </div>

        {/* Marcas */}
        <div className='mb-6'>
          <h3 className='text-xs font-semibold tracking-wider uppercase text-[var(--text-secondary)] mb-3'>
            Marcas
          </h3>
          <div className='flex flex-wrap gap-2'>
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => toggleMarca(brand.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  pendingMarcas.includes(brand.slug)
                    ? 'bg-[var(--brand)] text-white'
                    : 'bg-[var(--surface-2)] text-[var(--text-primary)] border border-[var(--border)]'
                }`}>
                {brand.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Escalas */}
        <div className='mb-6'>
          <h3 className='text-xs font-semibold tracking-wider uppercase text-[var(--text-secondary)] mb-3'>
            Escalas
          </h3>
          <div className='flex flex-wrap gap-2'>
            {ESCALAS.map((escala) => (
              <button
                key={escala}
                onClick={() => toggleEscala(escala)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  pendingEscalas.includes(escala)
                    ? 'bg-[var(--brand)] text-white'
                    : 'bg-[var(--surface-2)] text-[var(--text-primary)] border border-[var(--border)]'
                }`}>
                {escala}
              </button>
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
      </SheetContent>
    </Sheet>
  )
}
