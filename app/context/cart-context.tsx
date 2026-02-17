"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

export interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
}

interface Discount {
  id: string
  type: "percentage" | "fixed"
  value: number
  description: string
  minAmount?: number
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  loyaltyPoints: number
  totalSpent: number
  purchaseHistory: Transaction[]
}

interface Transaction {
  id: string
  customerId?: string
  items: CartItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: string
  timestamp: Date
  receiptNumber: string
}

interface CartItem extends Product {
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  itemCount: number
  appliedDiscount: Discount | null
  applyDiscount: (discount: Discount) => void
  removeDiscount: () => void
  discountAmount: number
  customer: Customer | null
  setCustomer: (customer: Customer | null) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)

      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }

      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  const applyDiscount = (discount: Discount) => {
    if (discount.minAmount && cartTotal < discount.minAmount) {
      return
    }
    setAppliedDiscount(discount)
  }

  const removeDiscount = () => {
    setAppliedDiscount(null)
  }

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  const discountAmount = appliedDiscount
    ? appliedDiscount.type === "percentage"
      ? cartTotal * (appliedDiscount.value / 100)
      : appliedDiscount.value
    : 0

  const itemCount = cart.reduce((count, item) => count + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        appliedDiscount,
        applyDiscount,
        removeDiscount,
        discountAmount,
        customer,
        setCustomer,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
