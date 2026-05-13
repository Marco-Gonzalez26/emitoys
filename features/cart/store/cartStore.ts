import { CartProduct, Product } from '@/shared/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartStore = {
  items: CartProduct[]
  shipping_cost: number
  shipping_city: string

  add: (product: Product, quantity?: number) => void
  remove: (product_id: string) => void
  updateQuantity: (product_id: string, quantity: number) => void
  setShippingCost: (cost: number) => void
  setCity: (city: string) => void
  clear: () => void

  totalItems: () => number
  subtotal: () => number
  total: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      shipping_cost: 0,
      shipping_city: '',
      add: (product, cantidad = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, cantidad: i.cantidad + cantidad }
                  : i
              )
            }
          }
          return {
            items: [
              ...state.items,
              {
                product,
                cantidad,
                precio_unidad: product.precio_oferta ?? product.precio
              }
            ]
          }
        })
      },

      remove: (product_id) => {
        set((state) => {
          return {
            items: state.items.filter((i) => i.product.id !== product_id)
          }
        })
      },

      updateQuantity: (product_id, quantity) => {
        if (quantity < 1) return
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === product_id ? { ...i, cantidad: quantity } : i
          )
        }))
      },

      setShippingCost: (cost) => {
        set((state) => ({ shipping_cost: cost }))
      },

      setCity: (city) => {
        set((state) => ({ shipping_city: city }))
      },

      clear: () => {
        set((state) => ({
          items: [],
          shipping_cost: 0,
          shipping_city: ''
        }))
      },

      totalItems: () => get().items.reduce((acc, i) => acc + i.cantidad, 0),
      subtotal: () =>
        get().items.reduce((acc, i) => acc + i.cantidad * i.precio_unidad, 0),
      total: () => get().subtotal() + get().shipping_cost
    }),
    {
      name: 'emitoys-cart-store'
    }
  )
)
