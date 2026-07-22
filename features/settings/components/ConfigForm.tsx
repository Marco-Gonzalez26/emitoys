'use client'

import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { Label } from '@/shared/components/ui/label'
import { updateConfiguracion, type Configuracion } from '../actions/settings'
import { useRouter } from 'next/navigation'

export function ConfigForm({ config }: { config: Configuracion }) {
  const [form, setForm] = useState<Configuracion>(config)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const handleChange = (key: keyof Configuracion, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    setSaving(true)
    await updateConfiguracion(form)
    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    router.push('/admin/dashboard')
  }

  return (
    <div className='flex flex-col gap-8 mx-auto'>
      {/* Contacto */}
      <section className='flex flex-col gap-4'>
        <h2 className='text-base font-bold text-(--text-primary) border-b border-border pb-2'>
          Contacto
        </h2>
        <div className='flex flex-col gap-1.5'>
          <Label>WhatsApp</Label>
          <Input
            placeholder='+593999999999'
            value={form.whatsapp}
            onChange={(e) => handleChange('whatsapp', e.target.value)}
          />
        </div>
        <div className='flex flex-col gap-1.5'>
          <Label>Correo</Label>
          <Input
            placeholder='contacto@emitoys.com'
            value={form.correo}
            onChange={(e) => handleChange('correo', e.target.value)}
          />
        </div>
      </section>

      {/* Redes sociales */}
      <section className='flex flex-col gap-4'>
        <h2 className='text-base font-bold text-(--text-primary) border-b border-border pb-2'>
          Redes sociales
        </h2>
        <div className='flex flex-col gap-1.5'>
          <Label>Instagram</Label>
          <Input
            placeholder='https://instagram.com/emitoys'
            value={form.instagram}
            onChange={(e) => handleChange('instagram', e.target.value)}
          />
        </div>
        <div className='flex flex-col gap-1.5'>
          <Label>TikTok</Label>
          <Input
            placeholder='https://tiktok.com/@emitoys'
            value={form.tiktok}
            onChange={(e) => handleChange('tiktok', e.target.value)}
          />
        </div>
        <div className='flex flex-col gap-1.5'>
          <Label>Facebook</Label>
          <Input
            placeholder='https://facebook.com/emitoys'
            value={form.facebook}
            onChange={(e) => handleChange('facebook', e.target.value)}
          />
        </div>
      </section>

      {/* Páginas */}
      <section className='flex flex-col gap-4'>
        <h2 className='text-base font-bold text-(--text-primary) border-b border-border pb-2'>
          Páginas
        </h2>
        <div className='flex flex-col gap-1.5'>
          <Label>Comunidad</Label>
          <Textarea
            placeholder='Información sobre la comunidad...'
            rows={6}
            value={form.comunidad_contenido}
            onChange={(e) =>
              handleChange('comunidad_contenido', e.target.value)
            }
          />
        </div>
        <div className='flex flex-col gap-1.5'>
          <Label>Envíos</Label>
          <Textarea
            placeholder='Información sobre envíos...'
            rows={6}
            value={form.envios_contenido}
            onChange={(e) => handleChange('envios_contenido', e.target.value)}
          />
        </div>
      </section>

      {/* Submit */}
      <div className='flex items-center gap-4'>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </Button>
        {success && (
          <span className='text-sm text-green-500'>
            ¡Guardado correctamente!
          </span>
        )}
      </div>
    </div>
  )
}
