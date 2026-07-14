'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Brand } from '@/shared/types'
import { createBrand, updateBrand, deleteBrand } from '../../brand/actions/brands'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Button } from '@/shared/components/ui/button'

interface BrandFormProps {
  brand?: Brand
}

export function BrandForm({ brand }: BrandFormProps) {
  const router = useRouter()
  const [nombre, setNombre] = useState(brand?.nombre ?? '')
  const [slug, setSlug] = useState(brand?.slug ?? '')
  const [colorHex, setColorHex] = useState(brand?.color_hex ?? '#960DF2')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = brand
      ? await updateBrand(brand.id, { nombre, slug, color_hex: colorHex })
      : await createBrand({ nombre, slug, color_hex: colorHex })

    setLoading(false)

    if (result?.error) {
      setError(result.error)
    } else {
      router.push('/admin/dashboard/marcas')
    }
  }

  const handleDelete = async () => {
    if (!brand) return
    setShowDeleteConfirm(false)

    setLoading(true)
    const result = await deleteBrand(brand.id)
    setLoading(false)

    if (result?.error) {
      setError(result.error)
    } else {
      router.push('/admin/dashboard/marcas')
    }
  }

  return (
    <div className='max-w-lg'>
      <div className='mb-8'>
        <h1 className='text-2xl font-extrabold tracking-tight text-[var(--text-primary)]'>
          {brand ? 'Editar marca' : 'Nueva marca'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='nombre'>Nombre</Label>
          <Input
            id='nombre'
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value)
              if (!brand) {
                setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
              }
            }}
            required
            placeholder='Hot Wheels'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <Label htmlFor='slug'>Slug</Label>
          <Input
            id='slug'
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            placeholder='hot-wheels'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <Label>Color</Label>
          <div className='flex items-center gap-3'>
            <input
              type='color'
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              className='w-12 h-10 rounded-lg border border-[var(--border)] cursor-pointer bg-transparent'
            />
            <Input
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              required
              placeholder='#960DF2'
              className='font-mono'
            />
          </div>
        </div>

        {error && (
          <p className='text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2'>
            {error}
          </p>
        )}

        <div className='flex gap-3 pt-2'>
            {brand && (
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
            onClick={() => router.push('/admin/dashboard/marcas')}
            disabled={loading}>
            Cancelar
          </Button>
          <Button
            type='submit'
            disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title='Eliminar marca'
        description='¿Eliminar esta marca? Esta acción no se puede deshacer.'
        confirmLabel='Eliminar'
        onConfirm={handleDelete}
      />
    </div>
  )
}
