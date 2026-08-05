'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { dishes } from '@/data/menu'
import { site } from '@/data/site'
import type { CartLine, FulfilmentMethod } from '@/types'

const STORAGE_KEY = 'vegan-garden.cart'

export interface CartItem extends CartLine {
  name: string
  nameVi: string
  price: number
  image: string
  lineTotal: number
}

interface CartContextValue {
  lines: CartLine[]
  count: number
  subtotal: number
  deliveryFee: number
  total: number
  method: FulfilmentMethod
  setMethod: (method: FulfilmentMethod) => void
  isOpen: boolean
  open: () => void
  close: () => void
  add: (dishId: string, quantity?: number, note?: string) => void
  setQuantity: (dishId: string, quantity: number) => void
  remove: (dishId: string) => void
  setNote: (dishId: string, note: string) => void
  clear: () => void
  /** True once the persisted cart has been read - avoids a hydration mismatch. */
  hydrated: boolean
  lastAdded: string | null
}

const CartContext = createContext<CartContextValue | null>(null)

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== 'object') return false
  const line = value as Partial<CartLine>
  return typeof line.dishId === 'string' && typeof line.quantity === 'number'
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [method, setMethod] = useState<FulfilmentMethod>('pickup')
  const [isOpen, setIsOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [lastAdded, setLastAdded] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed: unknown = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          // drop lines whose dish no longer exists on the menu
          setLines(
            parsed
              .filter(isCartLine)
              .filter((line) => dishes.some((dish) => dish.id === line.dishId))
              .map((line) => ({ ...line, note: line.note ?? '' }))
          )
        }
      }
    } catch {
      /* corrupted storage - start with an empty cart */
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      /* storage full or unavailable */
    }
  }, [lines, hydrated])

  const add = useCallback((dishId: string, quantity = 1, note = '') => {
    setLines((current) => {
      const existing = current.find((line) => line.dishId === dishId)
      if (existing) {
        return current.map((line) =>
          line.dishId === dishId
            ? { ...line, quantity: Math.min(line.quantity + quantity, 30), note: note || line.note }
            : line
        )
      }
      return [...current, { dishId, quantity, note }]
    })
    setLastAdded(dishId)
    window.setTimeout(() => setLastAdded((id) => (id === dishId ? null : id)), 2400)
  }, [])

  const setQuantity = useCallback((dishId: string, quantity: number) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((line) => line.dishId !== dishId)
        : current.map((line) =>
            line.dishId === dishId ? { ...line, quantity: Math.min(quantity, 30) } : line
          )
    )
  }, [])

  const remove = useCallback((dishId: string) => {
    setLines((current) => current.filter((line) => line.dishId !== dishId))
  }, [])

  const setNote = useCallback((dishId: string, note: string) => {
    setLines((current) =>
      current.map((line) => (line.dishId === dishId ? { ...line, note } : line))
    )
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const { count, subtotal } = useMemo(() => {
    let itemCount = 0
    let sum = 0
    for (const line of lines) {
      const dish = dishes.find((entry) => entry.id === line.dishId)
      if (!dish) continue
      itemCount += line.quantity
      sum += dish.price * line.quantity
    }
    return { count: itemCount, subtotal: Math.round(sum * 100) / 100 }
  }, [lines])

  const deliveryFee =
    method === 'delivery' && subtotal > 0 && subtotal < site.delivery.freeFrom
      ? site.delivery.fee
      : 0

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count,
      subtotal,
      deliveryFee,
      total: Math.round((subtotal + deliveryFee) * 100) / 100,
      method,
      setMethod,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      setQuantity,
      remove,
      setNote,
      clear,
      hydrated,
      lastAdded,
    }),
    [
      lines,
      count,
      subtotal,
      deliveryFee,
      method,
      isOpen,
      add,
      setQuantity,
      remove,
      setNote,
      clear,
      hydrated,
      lastAdded,
    ]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}

/** Joins cart lines with the menu so views get names, prices and images. */
export function useCartItems(): CartItem[] {
  const { lines } = useCart()
  return useMemo(
    () =>
      lines.flatMap((line) => {
        const dish = dishes.find((entry) => entry.id === line.dishId)
        if (!dish) return []
        return [
          {
            ...line,
            name: dish.nameVi,
            nameVi: dish.nameVi,
            price: dish.price,
            image: dish.image,
            lineTotal: Math.round(dish.price * line.quantity * 100) / 100,
          },
        ]
      }),
    [lines]
  )
}
