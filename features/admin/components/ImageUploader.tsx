'use client'

import { useRef, useState } from 'react'
import { uploadImage } from '../actions/products'
import { ErrorDialog } from '@/shared/components/ErrorDialog'

interface ImageUploaderProps {
  onUpload: (url: string) => void
  disabled?: boolean
}

export function ImageUploader({ onUpload, disabled }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [errorDialog, setErrorDialog] = useState('')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const result = await uploadImage(file)
    if (result.url) {
      onUpload(result.url)
    } else if (result.error) {
      setErrorDialog(result.error)
    }

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        onChange={handleFileChange}
        className='hidden'
      />
      <button
        type='button'
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className='w-full h-32 border-2 border-dashed border-[var(--border)] rounded-xl flex flex-col items-center justify-center gap-2 text-[var(--text-secondary)] hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors cursor-pointer bg-transparent disabled:opacity-50 disabled:cursor-not-allowed'>
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-8 h-8'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5' />
        </svg>
        <span className='text-xs font-semibold'>Subir imagen</span>
      </button>
      <ErrorDialog
        open={!!errorDialog}
        onOpenChange={(open) => { if (!open) setErrorDialog('') }}
        description={errorDialog}
      />
    </div>
  )
}
