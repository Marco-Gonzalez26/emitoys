'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { Testimonial } from '@/shared/types'
import {
  deleteTestimonial,
  toggleTestimonialActive
} from '../actions/testimonials'
import { Button } from '@/shared/components/ui/button'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { ErrorDialog } from '@/shared/components/ErrorDialog'

interface TestimonialsTableProps {
  initialTestimonials: Testimonial[]
}

export function TestimonialsTable({
  initialTestimonials
}: TestimonialsTableProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials)
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null)
  const [errorDialog, setErrorDialog] = useState('')

  const handleToggle = async (t: Testimonial) => {
    const next = !t.activo
    setTestimonials((prev) =>
      prev.map((item) => (item.id === t.id ? { ...item, activo: next } : item))
    )
    const result = await toggleTestimonialActive(t.id, next)
    if (result?.error) {
      setTestimonials((prev) =>
        prev.map((item) =>
          item.id === t.id ? { ...item, activo: t.activo } : item
        )
      )
      setErrorDialog(result.error)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const result = await deleteTestimonial(deleteTarget.id)
    setDeleteTarget(null)
    if (result?.error) {
      setErrorDialog(result.error)
    } else {
      setTestimonials((prev) =>
        prev.filter((item) => item.id !== deleteTarget.id)
      )
    }
  }

  return (
    <div className='px-6 py-8 md:px-10'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-extrabold tracking-tight text-(--text-primary)'>
          Testimonios
        </h1>
        <Button asChild>
          <Link href='/admin/dashboard/testimonios/nueva'>+ Nuevo testimonio</Link>
        </Button>
      </div>

      {testimonials.length === 0 ? (
        <div className='text-center py-16 text-(--text-secondary)'>
          No hay testimonios registrados
        </div>
      ) : (
        <div className='flex flex-col gap-3'>
          {testimonials.map((t) => (
            <div
              key={t.id}
              className={cn(
                'flex flex-wrap items-center gap-4 px-4 py-3 bg-(--surface) border border-border rounded-xl',
                !t.activo && 'opacity-60'
              )}>
              {t.foto_url ? (
                <Image
                  src={t.foto_url}
                  alt={t.nombre_cliente}
                  width={40}
                  height={40}
                  className='w-10 h-10 rounded-full object-cover border border-border shrink-0'
                />
              ) : (
                <div className='w-10 h-10 rounded-full bg-(--brand) text-white flex items-center justify-center text-sm font-extrabold shrink-0'>
                  {t.nombre_cliente.charAt(0).toUpperCase()}
                </div>
              )}

              <div className='flex flex-col gap-0.5 min-w-0 flex-1'>
                <div className='flex items-center gap-2 flex-wrap'>
                  <span className='text-sm font-semibold text-(--text-primary) truncate'>
                    {t.nombre_cliente}
                  </span>
                  <span className='flex items-center gap-0.5'>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'w-3.5 h-3.5',
                          i < t.estrellas
                            ? 'fill-(--brand) text-(--brand)'
                            : 'fill-(--surface-2) text-(--surface-2)'
                        )}
                      />
                    ))}
                  </span>
                </div>
                <p className='text-xs text-(--text-secondary) leading-relaxed line-clamp-2 m-0'>
                  &ldquo;{t.comentario}&rdquo;
                </p>
              </div>

              <span
                className={cn(
                  'text-xs font-semibold px-2.5 py-1 rounded-full shrink-0',
                  t.activo
                    ? 'bg-green-100 text-green-800'
                    : 'bg-(--surface-2) text-(--text-secondary)'
                )}>
                {t.activo ? 'Visible' : 'Oculto'}
              </span>

              <div className='flex items-center gap-2 ml-auto shrink-0'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleToggle(t)}>
                  {t.activo ? 'Ocultar' : 'Mostrar'}
                </Button>
                <Button variant='outline' size='sm' asChild>
                  <Link
                    href={`/admin/dashboard/testimonios/${t.id}/editar`}>
                    Editar
                  </Link>
                </Button>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => setDeleteTarget(t)}>
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        title='Eliminar testimonio'
        description={`¿Eliminar el testimonio de "${deleteTarget?.nombre_cliente}"? Esta acción no se puede deshacer.`}
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