import { CartProduct, Product } from '@/shared/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartStore {
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
  persist<CartStore>(
    (set, get) => ({
      items: [],
      shipping_cost: 0,
      shipping_city: '',
      add: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              )
            }
          }
          return {
            items: [
              ...state.items,
              {
                product,
                quantity,
                unit_price: product.precio_oferta ?? product.precio
              }
            ]
          }
        })
      },
      remove: (product_id) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== product_id)
        }))
      },
      updateQuantity: (product_id, quantity) => {
        if (quantity < 1) return
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === product_id ? { ...i, quantity } : i
          )
        }))
      },

      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((acc, i) => acc + i.quantity * i.unit_price, 0),
      total: () => get().subtotal() + get().shipping_cost,
      setShippingCost: (cost) => set({ shipping_cost: cost }),
      setCity: (city) => set({ shipping_city: city }),
      clear: () => set({ items: [], shipping_cost: 0, shipping_city: '' })
    }),

    {
      name: 'emitoys-cart-store'
    }
  )
)
