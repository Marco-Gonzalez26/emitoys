'use client'

interface EmptyStateProps {
  onClearFilters: () => void
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-[var(--surface-2)] flex items-center justify-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-10 h-10 text-[var(--text-secondary)]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-extrabold tracking-tight text-[var(--text-primary)] mb-2">
        No se encontraron productos
      </h3>
      <p className="text-[var(--text-secondary)] max-w-sm mb-6">
        No hay productos que coincidan con los filtros de búsqueda. Prueba ajustando los filtros o limpia la búsqueda.
      </p>
      <button
        onClick={onClearFilters}
        className="px-6 py-3 rounded-full bg-[var(--brand)] text-white text-sm font-bold tracking-wide hover:opacity-90 transition-opacity duration-200"
      >
        Limpiar Filtros
      </button>
    </div>
  )
}