export interface FeaturedProduct {
  id: string
  nombre: string
  slug: string
  escala: string | null
  precio: number
  precio_oferta: number | null
  estado: 'disponible' | 'pre_venta' | 'agotado'
  marca_id: string
  marca: {
    id: string
    nombre: string
    slug: string
    color_hex: string
    logo_url: string | null
    created_at: string
  }
  imagenes: { url: string; orden: number }[]
}

export interface BrandWithProducts {
  marca: FeaturedProduct['marca']
  productos: FeaturedProduct[]
}

export const ESTADO_LABEL: Record<FeaturedProduct['estado'], string> = {
  disponible: 'Disponible',
  pre_venta: 'Pre-venta',
  agotado: 'Agotado'
}
