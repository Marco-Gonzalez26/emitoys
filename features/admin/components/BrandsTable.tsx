'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Brand } from '@/shared/types'
import { getBrands, deleteBrand } from '../../brand/actions/brands'
import { Button } from '@/shared/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/components/ui/table'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { ErrorDialog } from '@/shared/components/ErrorDialog'

export function BrandsTable() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null)
  const [errorDialog, setErrorDialog] = useState('')

  const fetchBrands = async () => {
    setLoading(true)
    const data = await getBrands()
    setBrands(data)
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBrands()
  }, [])

  const handleDelete = async () => {
    if (!deleteTarget) return

    const result = await deleteBrand(deleteTarget.id)
    setDeleteTarget(null)

    if (result?.error) {
      setErrorDialog(result.error)
    } else {
      fetchBrands()
    }
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-extrabold tracking-tight text-[var(--text-primary)]'>
          Marcas
        </h1>
        <Button asChild>
          <Link href='/admin/dashboard/marcas/nueva'>
            + Nueva marca
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className='flex items-center justify-center py-16'>
          <div className='w-8 h-8 border-2 border-[var(--brand)] border-t-transparent rounded-full animate-spin' />
        </div>
      ) : brands.length === 0 ? (
        <div className='text-center py-16 text-[var(--text-secondary)]'>
          No hay marcas registradas
        </div>
      ) : (
        <div className='bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Marca</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Color</TableHead>
                <TableHead className='text-right'>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <div
                        className='w-3 h-3 rounded-full shrink-0'
                        style={{ background: brand.color_hex }}
                      />
                      <span className='text-sm font-semibold text-[var(--text-primary)]'>
                        {brand.nombre}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className='text-sm text-[var(--text-secondary)] font-mono'>
                    {brand.slug}
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <div
                        className='w-6 h-6 rounded-lg border border-[var(--border)]'
                        style={{ background: brand.color_hex }}
                      />
                      <span className='text-xs text-[var(--text-secondary)] font-mono'>
                        {brand.color_hex}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-2'>
                      <Button variant='outline' size='sm' asChild>
                        <Link href={`/admin/dashboard/marcas/${brand.id}/editar`}>
                          Editar
                        </Link>
                      </Button>
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => setDeleteTarget(brand)}>
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
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        title='Eliminar marca'
        description={`¿Eliminar la marca "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel='Eliminar'
        onConfirm={handleDelete}
      />
      <ErrorDialog
        open={!!errorDialog}
        onOpenChange={(open) => { if (!open) setErrorDialog('') }}
        description={errorDialog}
      />
    </div>
  )
}
