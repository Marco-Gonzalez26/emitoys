'use client'

import { useRef, useState } from 'react'
import { ImagePlus } from 'lucide-react'
import { uploadTestimonialImage } from '../actions/testimonials'
import { ErrorDialog } from '@/shared/components/ErrorDialog'

interface TestimonialImageUploaderProps {
  onUpload: (url: string) => void
  disabled?: boolean
}

export function TestimonialImageUploader({
  onUpload,
  disabled
}: TestimonialImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [errorDialog, setErrorDialog] = useState('')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const result = await uploadTestimonialImage(file)
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
        <ImagePlus className='w-8 h-8' />
        <span className='text-xs font-semibold'>Subir foto del cliente</span>
      </button>
      <ErrorDialog
        open={!!errorDialog}
        onOpenChange={(open) => { if (!open) setErrorDialog('') }}
        description={errorDialog}
      />
    </div>
  )
}