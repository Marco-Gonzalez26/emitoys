'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import type { Brand } from '@/shared/types'
import { deleteBrand, updateBrandsOrder } from '../../brand/actions/brands'
import { Button } from '@/shared/components/ui/button'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { ErrorDialog } from '@/shared/components/ErrorDialog'

function SortableRow({
  brand,
  onDelete
}: {
  brand: Brand
  onDelete: (brand: Brand) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: String(brand.id) })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='flex items-center gap-4 px-4 py-3 bg-(--surface) border border-border rounded-xl mb-2'>
      {/* Handle */}
      <button
        {...attributes}
        {...listeners}
        className='cursor-grab active:cursor-grabbing text-(--text-secondary) hover:text-(--text-primary) transition-colors'
        aria-label='Reordenar'>
        <GripVertical className='w-4 h-4' />
      </button>

      {/* Color dot */}
      <div
        className='w-3 h-3 rounded-full shrink-0'
        style={{ background: brand.color_hex }}
      />

      {/* Nombre */}
      <span className='text-sm font-semibold text-(--text-primary) flex-1'>
        {brand.nombre}
      </span>

      {/* Slug */}
      <span className='text-xs text-(--text-secondary) font-mono hidden md:block'>
        {brand.slug}
      </span>

      {/* Color hex */}
      <div className='hidden md:flex items-center gap-2'>
        <div
          className='w-5 h-5 rounded border border-border'
          style={{ background: brand.color_hex }}
        />
        <span className='text-xs text-(--text-secondary) font-mono'>
          {brand.color_hex}
        </span>
      </div>

      {/* Acciones */}
      <div className='flex items-center gap-2 ml-auto'>
        <Button variant='outline' size='sm' asChild>
          <Link href={`/admin/dashboard/marcas/${brand.id}/editar`}>
            Editar
          </Link>
        </Button>
        <Button variant='destructive' size='sm' onClick={() => onDelete(brand)}>
          Eliminar
        </Button>
      </div>
    </div>
  )
}
interface BrandsTableProps {
  initialBrands: Brand[]
}

export function BrandsTable({ initialBrands }: BrandsTableProps) {
  const [brands, setBrands] = useState<Brand[]>(initialBrands)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null)
  const [errorDialog, setErrorDialog] = useState('')
  const [isTouchDevice] = useState(() =>
    typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  )

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: isTouchDevice ? 0 : 8 }
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: isTouchDevice ? 150 : 0, tolerance: 5 }
  })
  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates
  })

  const sensors = useSensors(pointerSensor, touchSensor, keyboardSensor)

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = brands.findIndex((b) => b.id === active.id)
    const newIndex = brands.findIndex((b) => b.id === over.id)
    const reordered = arrayMove(brands, oldIndex, newIndex)
    // Optimistic update — se ve instantáneo
    setBrands(reordered)

    // Persistir en Supabase
    setSaving(true)
    await updateBrandsOrder(reordered.map((b, i) => ({ id: String(b.id), orden: i })))

    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const result = await deleteBrand(deleteTarget.id)
    setDeleteTarget(null)
    if (result?.error) {
      setErrorDialog(result.error)
    }
  }

   return (
    <div>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <h1 className='text-2xl font-extrabold tracking-tight text-(--text-primary)'>
            Marcas
          </h1>
          {saving && (
            <span className='text-xs text-(--text-secondary) animate-pulse'>
              Guardando orden...
            </span>
          )}
        </div>
        <Button asChild>
          <Link href='/admin/dashboard/marcas/nueva'>+ Nueva marca</Link>
        </Button>
      </div>

      {/* Lista sorteable */}
      {brands.length === 0 ? (
        <div className='text-center py-16 text-(--text-secondary)'>
          No hay marcas registradas
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}>
          <SortableContext
            items={brands.map((b) => String(b.id))}
            strategy={verticalListSortingStrategy}>
            {brands.map((brand) => (
              <SortableRow
                key={brand.id}
                brand={brand}
                onDelete={setDeleteTarget}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        title='Eliminar marca'
        description={`¿Eliminar la marca "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel='Eliminar'
        onConfirm={handleDelete}
      />
      <ErrorDialog
        open={!!errorDialog}
        onOpenChange={(open) => {
          if (!open) setErrorDialog('')
        }}
        description={errorDialog}
      />
    </div>
  )
}
