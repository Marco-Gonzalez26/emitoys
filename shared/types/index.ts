// BRANDS

export type Brand = {
  id: string
  nombre: string
  slug: string
  color_hex: string
  logo_url: string | null
  created_at: string
}

// CART PRODUCTS
export type CartProduct = {
  product: Product
  cantidad: number
  precio_unidad: number
}



// PRODUCTS

export type ProductStatus = 'disponible' | 'pre_venta' | 'agotado'

export type Product = {
  id: string
  marca_id: string
  marca?: Brand
  nombre: string
  codigo: string | null
  slug: string
  descripcion: string | null
  escala: string | null
  precio: number
  precio_oferta: number | null
  stock: number
  estado: ProductStatus
  pre_venta_fecha_cierre: string | null
  pre_venta_cupo_total: number | null
  es_destacado: boolean
  es_nuevo: boolean
  created_at: string
  imagenes?: ProductImage[]
}

export type ProductImage = {
  id: string
  producto_id: string
  url: string
  orden: number
  created_at: string
}

// USERS

export type UserRole = 'cliente' | 'admin'

export type UserProfile = {
  id: string
  nombre: string
  cedula: string | null
  telefono: string | null
  tipo_usuario: UserRole
  created_at: string
}

export type ShippingAddress = {
  id: string
  usuario_id: string
  provincia: string
  ciudad: string
  calle: string
  referencia: string | null
  es_predeterminada: boolean
  created_at: string
}

// CART

export type CartItem = {
  id: string
  carrito_id: string
  producto_id: string
  product?: Product
  cantidad: number
  precio_unidad: number
  created_at: string
}

// ORDERS

export type OrderStatus =
  | 'pendiente'
  | 'confirmada'
  | 'enviada'
  | 'entregada'
  | 'cancelada'

export type Order = {
  id: string
  cliente_id: string
  carrito_id: string | null
  direccion_envio_id: string | null
  direccion_envio?: ShippingAddress
  estado: OrderStatus
  costo_subtotal: number
  costo_envio: number
  costo_total: number
  notas: string | null
  created_at: string
  items?: OrderItem[]
}

export type OrderItem = {
  id: string
  orden_id: string
  producto_id: string | null
  nombre_producto: string
  cantidad: number
  precio_unidad: number
  created_at: string
}

// CATALOG FILTERS

export type CatalogFilters = {
  marca?: string[]
  escala?: string[]
  precio_min?: number
  precio_max?: number
  estado?: ProductStatus
  solo_en_stock?: boolean
  sort?: 'reciente' | 'precio_asc' | 'precio_desc' | 'nombre'
}
