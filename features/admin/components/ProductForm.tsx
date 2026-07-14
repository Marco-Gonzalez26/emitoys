'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Resolver, Control } from 'react-hook-form'
import type { Brand } from '@/shared/types'
import type { ProductWithBrand } from '@/features/catalog/actions/products'
import { createProduct, updateProduct, deleteProduct } from '../actions/products'
import { ImageUploader } from './ImageUploader'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/components/ui/form'
import { TrashIcon } from 'lucide-react'

const ESCALAS = ['1:64', '1:43', '1:18', '1:12'] as const
const ESTADOS = ['disponible', 'pre_venta', 'agotado'] as const

const productSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  slug: z.string().min(1, 'El slug es obligatorio'),
  codigo: z.string().optional().default(''),
  descripcion: z.string().optional().default(''),
  marca_id: z.string().min(1, 'Seleccioná una marca'),
  escala: z.string().optional().default(''),
  precio: z.coerce.number().min(0.01, 'El precio debe ser mayor a 0'),
  precio_oferta: z.coerce.number().optional().nullable(),
  stock: z.coerce.number().int().min(0, 'El stock no puede ser negativo'),
  estado: z.enum(ESTADOS),
  es_destacado: z.boolean(),
  es_nuevo: z.boolean()
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  product?: ProductWithBrand
  brands: Brand[]
}

export function ProductForm({ product, brands }: ProductFormProps) {
  const router = useRouter()
  const [imagenes, setImagenes] = useState<{ url: string; orden: number }[]>(
    product?.imagenes?.map((img) => ({ url: img.url, orden: img.orden })) ?? []
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormData>,
    defaultValues: {
      nombre: product?.nombre ?? '',
      slug: product?.slug ?? '',
      codigo: product?.codigo ?? '',
      descripcion: product?.descripcion ?? '',
      marca_id: product?.marca_id ?? (brands[0]?.id ?? ''),
      escala: product?.escala ?? '',
      precio: product?.precio ?? 0,
      precio_oferta: product?.precio_oferta ?? null,
      stock: product?.stock ?? 0,
      estado: product?.estado ?? 'disponible',
      es_destacado: product?.es_destacado ?? false,
      es_nuevo: product?.es_nuevo ?? false
    }
  })

  const autoSlug = (value: string) => {
    if (!product) {
      form.setValue('slug', value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''), { shouldValidate: true })
    }
  }

  const onSubmit = async (data: ProductFormData) => {
    setError('')
    setLoading(true)

    const productData = {
      ...data,
      codigo: data.codigo || undefined,
      descripcion: data.descripcion || undefined,
      escala: data.escala || undefined,
      precio_oferta: data.precio_oferta || undefined,
      imagenes
    }

    const result = product
      ? await updateProduct(product.id, productData)
      : await createProduct(productData)

    setLoading(false)

    if (result?.error) {
      setError(result.error)
    } else {
      router.push('/admin/dashboard/productos')
    }
  }

  const handleDelete = async () => {
    if (!product) return
    setShowDeleteConfirm(false)

    setLoading(true)
    const result = await deleteProduct(product.id)
    setLoading(false)

    if (result?.error) {
      setError(result.error)
    } else {
      router.push('/admin/dashboard/productos')
    }
  }

  const addImage = (url: string) => {
    setImagenes((prev) => [...prev, { url, orden: prev.length }])
  }

  const removeImage = (index: number) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className='w-full max-w-2xl mx-auto px-4 sm:px-6'>
      <div className='mb-8'>
        <h1 className='text-2xl font-extrabold tracking-tight text-[var(--text-primary)]'>
          {product ? 'Editar producto' : 'Nuevo producto'}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <FormField
              control={form.control as Control<ProductFormData>}
              name='nombre'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        autoSlug(e.target.value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as Control<ProductFormData>}
              name='slug'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <FormField
              control={form.control as Control<ProductFormData>}
              name='codigo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as Control<ProductFormData>}
              name='marca_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Seleccionar marca' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {brands.map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='descripcion'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <FormField
              control={form.control as Control<ProductFormData>}
              name='escala'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Escala</FormLabel>
                  <Select
                    value={field.value || '_none'}
                    onValueChange={(v) => field.onChange(v === '_none' ? '' : v)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='_none'>Sin escala</SelectItem>
                      {ESCALAS.map((e) => (
                        <SelectItem key={e} value={e}>{e}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as Control<ProductFormData>}
              name='precio'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio *</FormLabel>
                  <FormControl>
                    <Input type='number' step='0.01' min='0' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as Control<ProductFormData>}
              name='precio_oferta'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio oferta</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      step='0.01'
                      min='0'
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <FormField
              control={form.control as Control<ProductFormData>}
              name='stock'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock *</FormLabel>
                  <FormControl>
                    <Input type='number' min='0' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as Control<ProductFormData>}
              name='estado'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='disponible'>Disponible</SelectItem>
                      <SelectItem value='pre_venta'>Pre-venta</SelectItem>
                      <SelectItem value='agotado'>Agotado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex flex-col gap-2'>
              <FormLabel>Opciones</FormLabel>
              <div className='flex items-center gap-4 h-9'>
                <FormField
                  control={form.control as Control<ProductFormData>}
                  name='es_destacado'
                  render={({ field }) => (
                    <label className='flex items-center gap-2 cursor-pointer text-sm'>
                      <input
                        type='checkbox'
                        checked={field.value}
                        onChange={field.onChange}
                        className='h-4 w-4 rounded border-[var(--border)]'
                      />
                      Destacado
                    </label>
                  )}
                />
                <FormField
                  control={form.control as Control<ProductFormData>}
                  name='es_nuevo'
                  render={({ field }) => (
                    <label className='flex items-center gap-2 cursor-pointer text-sm'>
                      <input
                        type='checkbox'
                        checked={field.value}
                        onChange={field.onChange}
                        className='h-4 w-4 rounded border-[var(--border)]'
                      />
                      Nuevo
                    </label>
                  )}
                />
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <FormLabel>Imágenes</FormLabel>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
              {imagenes.map((img, i) => (
                <div key={i} className='relative group'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={`Imagen ${i + 1}`}
                    className='w-full h-24 object-cover rounded-lg border border-[var(--border)]'
                  />
                  <button
                    type='button'
                    onClick={() => removeImage(i)}
                    className='absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-none cursor-pointer'>
                    <TrashIcon className='w-4 h-4' />
                  </button>
                  <span className='absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded'>
                    {img.orden === 0 ? 'Principal' : `#${img.orden + 1}`}
                  </span>
                </div>
              ))}
              {imagenes.length < 8 && (
                <ImageUploader onUpload={addImage} disabled={loading} />
              )}
            </div>
          </div>

          {error && (
            <p className='text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2'>
              {error}
            </p>
          )}

          <div className='flex flex-col sm:flex-row gap-3 pt-2'>
            {product && (
              <Button
                type='button'
                variant='destructive'
                onClick={() => setShowDeleteConfirm(true)}
                disabled={loading}>
                Eliminar
              </Button>
            )}
            <div className='hidden sm:block flex-1' />
            <Button
              type='button'
              variant='outline'
              onClick={() => router.push('/admin/dashboard/productos')}
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
      </Form>
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title='Eliminar producto'
        description='¿Eliminar este producto? Esta acción no se puede deshacer.'
        confirmLabel='Eliminar'
        onConfirm={handleDelete}
      />
    </div>
  )
}
