'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Testimonial } from '@/shared/types'
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} from '../actions/testimonials'
import { TestimonialImageUploader } from './TestimonialImageUploader'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Button } from '@/shared/components/ui/button'
import { TrashIcon } from 'lucide-react'

interface TestimonialFormProps {
  testimonial?: Testimonial
}

export function TestimonialForm({ testimonial }: TestimonialFormProps) {
  const router = useRouter()
  const [nombreCliente, setNombreCliente] = useState(
    testimonial?.nombre_cliente ?? ''
  )
  const [comentario, setComentario] = useState(testimonial?.comentario ?? '')
  const [fotoUrl, setFotoUrl] = useState(testimonial?.foto_url ?? '')
  const [estrellas, setEstrellas] = useState(testimonial?.estrellas ?? 5)
  const [activo, setActivo] = useState(testimonial?.activo ?? true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const payload = {
      nombre_cliente: nombreCliente,
      comentario,
      foto_url: fotoUrl || undefined,
      estrellas: Number(estrellas),
      activo
    }

    const result = testimonial
      ? await updateTestimonial(testimonial.id, payload)
      : await createTestimonial(payload)

    setLoading(false)

    if (result?.error) {
      setError(result.error)
    } else {
      router.push('/admin/dashboard/testimonios')
    }
  }

  const handleDelete = async () => {
    if (!testimonial) return
    setShowDeleteConfirm(false)

    setLoading(true)
    const result = await deleteTestimonial(testimonial.id)
    setLoading(false)

    if (result?.error) {
      setError(result.error)
    } else {
      router.push('/admin/dashboard/testimonios')
    }
  }

  return (
    <div className='max-w-lg w-full'>
      <div className='mb-8'>
        <h1 className='text-2xl font-extrabold tracking-tight text-(--text-primary)'>
          {testimonial ? 'Editar testimonio' : 'Nuevo testimonio'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='nombre_cliente'>Nombre del cliente</Label>
          <Input
            id='nombre_cliente'
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
            required
            placeholder='Juan Pérez'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <Label htmlFor='comentario'>Comentario</Label>
          <Textarea
            id='comentario'
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            required
            rows={4}
            placeholder='El Tarmac Works de la NSX quedó espectacular, envío rapidísimo...'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <Label htmlFor='estrellas'>Estrellas</Label>
          <select
            id='estrellas'
            value={estrellas}
            onChange={(e) => setEstrellas(Number(e.target.value))}
            className='w-full rounded-lg border border-border bg-(--surface) px-3 py-2 text-sm text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-(--brand) cursor-pointer'>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {'★'.repeat(n)}
                {'☆'.repeat(5 - n)}
              </option>
            ))}
          </select>
        </div>

        <div className='flex flex-col gap-2'>
          <Label>Foto del cliente</Label>
          {fotoUrl ? (
            <div className='relative group'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fotoUrl}
                alt='Foto del cliente'
                className='w-full h-32 object-cover rounded-xl border border-border bg-(--surface)'
              />
              <button
                type='button'
                onClick={() => setFotoUrl('')}
                className='absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white text-xs flex items-center justify-center transition-opacity cursor-pointer border-none'>
                <TrashIcon className='w-4 h-4' />
              </button>
            </div>
          ) : (
            <TestimonialImageUploader onUpload={setFotoUrl} disabled={loading} />
          )}
        </div>

        <label className='flex items-center gap-3 cursor-pointer'>
          <input
            type='checkbox'
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
            className='w-4 h-4 accent-(--brand) cursor-pointer'
          />
          <span className='text-sm font-semibold text-(--text-primary)'>
            Visible en la página
          </span>
        </label>

        {error && (
          <p className='text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2'>
            {error}
          </p>
        )}

        <div className='flex gap-3 pt-2'>
          {testimonial && (
            <Button
              type='button'
              variant='destructive'
              onClick={() => setShowDeleteConfirm(true)}
              disabled={loading}>
              Eliminar
            </Button>
          )}
          <div className='flex-1' />
          <Button
            type='button'
            variant='outline'
            onClick={() => router.push('/admin/dashboard/testimonios')}
            disabled={loading}>
            Cancelar
          </Button>
          <Button type='submit' disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title='Eliminar testimonio'
        description='¿Eliminar este testimonio? Esta acción no se puede deshacer.'
        confirmLabel='Eliminar'
        onConfirm={handleDelete}
      />
    </div>
  )
}