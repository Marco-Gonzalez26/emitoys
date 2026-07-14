'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Brand } from '@/shared/types'
import type { ProductWithBrand } from '@/features/catalog/actions/products'
import { getAdminProducts, deleteProduct } from '../actions/products'
import { getBrands } from '@/features/brand/actions/brands'
import { Button } from '@/shared/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { ErrorDialog } from '@/shared/components/ErrorDialog'
import { Plus } from 'lucide-react'

const ESTADO_BADGES: Record<string, string> = {
  disponible: 'bg-green-100 text-green-800',
  pre_venta: 'bg-purple-100 text-purple-800',
  agotado: 'bg-gray-100 text-gray-500'
}

export function ProductsTable() {
  const [products, setProducts] = useState<ProductWithBrand[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [filterBrand, setFilterBrand] = useState('all')
  const [filterEstado, setFilterEstado] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState<ProductWithBrand | null>(null)
  const [errorDialog, setErrorDialog] = useState('')

  const fetchData = async () => {
    setLoading(true)
    const [productsData, brandsData] = await Promise.all([
      getAdminProducts(),
      getBrands()
    ])
    setProducts(productsData)
    setBrands(brandsData)
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData()
  }, [])

  const filtered = products.filter((p) => {
    if (filterBrand !== 'all' && p.marca_id !== filterBrand) return false
    if (filterEstado !== 'all' && p.estado !== filterEstado) return false
    return true
  })

  const handleDelete = async () => {
    if (!deleteTarget) return

    const result = await deleteProduct(deleteTarget.id)
    setDeleteTarget(null)

    if (result?.error) {
      setErrorDialog(result.error)
    } else {
      fetchData()
    }
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-extrabold tracking-tight text-[var(--text-primary)]'>
          Productos
        </h1>
        <Button asChild className='bg-(--brand)'>
          <Link href='/admin/dashboard/productos/nuevo'>
            Nuevo producto <Plus className='w-4 h-4 ml-1' />
          </Link>
        </Button>
      </div>

      <div className='flex gap-3 mb-6'>
        <Select value={filterBrand} onValueChange={setFilterBrand}>
          <SelectTrigger className='w-[200px]'>
            <SelectValue placeholder='Todas las marcas' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todas las marcas</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterEstado} onValueChange={setFilterEstado}>
          <SelectTrigger className='w-[200px]'>
            <SelectValue placeholder='Todos los estados' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todos los estados</SelectItem>
            <SelectItem value='disponible'>Disponible</SelectItem>
            <SelectItem value='pre_venta'>Pre-venta</SelectItem>
            <SelectItem value='agotado'>Agotado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className='flex items-center justify-center py-16'>
          <div className='w-8 h-8 border-2 border-[var(--brand)] border-t-transparent rounded-full animate-spin' />
        </div>
      ) : filtered.length === 0 ? (
        <div className='text-center py-16 text-[var(--text-secondary)]'>
          No hay productos
          {filterBrand !== 'all' || filterEstado !== 'all'
            ? ' con esos filtros'
            : ' registrados'}
        </div>
      ) : (
        <div className='bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className='text-right'>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      {product.imagenes?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.imagenes[0].url}
                          alt={product.nombre}
                          className='w-10 h-10 rounded-lg object-cover border border-[var(--border)]'
                        />
                      ) : (
                        <div className='w-10 h-10 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] text-xs'>
                          IMG
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        title='Eliminar producto'
        description={`¿Eliminar "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel='Eliminar'
        onConfirm={handleDelete}
      />
      <ErrorDialog
        open={!!errorDialog}
        onOpenChange={(open) => { if (!open) setErrorDialog('') }}
        description={errorDialog}
      />
    </div>
                      )}
                      <div>
                        <p className='text-sm font-semibold text-[var(--text-primary)]'>
                          {product.nombre}
                        </p>
                        <p className='text-xs text-[var(--text-secondary)]'>
                          {product.escala ?? '—'}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='text-sm text-[var(--text-secondary)]'>
                    {product.marca?.nombre ?? '—'}
                  </TableCell>
                  <TableCell>
                    <div className='text-sm'>
                      <span className='font-semibold text-[var(--text-primary)]'>
                        ${product.precio.toFixed(2)}
                      </span>
                      {product.precio_oferta && (
                        <span className='ml-2 text-xs text-[var(--brand)] line-through'>
                          ${product.precio_oferta.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className='text-sm text-[var(--text-primary)]'>
                    {product.stock}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ESTADO_BADGES[product.estado] ?? ''}`}>
                      {product.estado === 'disponible'
                        ? 'Disponible'
                        : product.estado === 'pre_venta'
                          ? 'Pre-venta'
                          : 'Agotado'}
                    </span>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-2'>
                      <Button variant='outline' size='sm' asChild>
                        <Link
                          href={`/admin/dashboard/productos/${product.id}/editar`}>
                          Editar
                        </Link>
                      </Button>
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => setDeleteTarget(product)}>
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
