'use client'

import { Search } from 'lucide-react'

interface EmptyStateProps {
  onClearFilters: () => void
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-(--border) bg-(--surface) px-6 py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-(--surface-2)">
        <Search className="h-10 w-10 text-(--text-secondary)" />
      </div>
      <h3 className="mb-2 text-2xl font-extrabold tracking-tight text-(--text-primary)">
        No se encontraron productos
      </h3>
      <p className="mb-8 max-w-sm text-(--text-secondary)">
        No hay productos que coincidan con los filtros. Prueba ajustando la
        búsqueda o limpia los filtros.
      </p>
      <button
        onClick={onClearFilters}
        className="cursor-pointer rounded-full bg-(--brand) px-6 py-3 text-sm font-bold tracking-wide text-white transition-colors duration-200 hover:bg-(--brand-hover) active:scale-[0.97]">
        Limpiar filtros
      </button>
    </div>
  )
}