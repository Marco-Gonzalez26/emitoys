'use client'

import { Search } from 'lucide-react'
import { NervPanel } from '@/shared/components/ui/NervPanel'

interface EmptyStateProps {
  onClearFilters: () => void
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <NervPanel
      cut={22}
      innerClassName="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="nerv-tag nerv-tag--black mb-6 h-20 w-20 justify-center p-0 [--cut:12px]">
        <Search className="h-9 w-9" />
      </div>
      <h3 className="mb-2 font-[family-name:var(--font-garage)] text-2xl tracking-[-0.01em] text-(--text-primary) uppercase">
        No se encontraron productos
      </h3>
      <p className="mb-8 max-w-sm text-(--text-secondary)">
        No hay productos que coincidan con los filtros. Prueba ajustando la
        búsqueda o limpia los filtros.
      </p>
      <button
        onClick={onClearFilters}
        className="nerv-btn nerv-btn--brand">
        Limpiar filtros
      </button>
    </NervPanel>
  )
}