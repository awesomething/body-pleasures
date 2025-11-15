"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

export type CartItem = {
    id: string
    name: string
    price: number
    quantity: number
    image?: string
}

type CartContextValue = {
    items: CartItem[]
    addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clear: () => void
    total: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const STORAGE_KEY = 'cart:v1'

export function CartProvider ({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (!raw) return []
            return JSON.parse(raw) as CartItem[]
        } catch {
            return []
        }
    })

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
        } catch { }
    }, [items])

    const addItem = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
        setItems((cur) => {
            const existing = cur.find((i) => i.id === item.id)
            if (existing) {
                return cur.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i))
            }
            return [...cur, { ...item, quantity }]
        })
    }

    const removeItem = (id: string) => setItems((cur) => cur.filter((i) => i.id !== id))

    const updateQuantity = (id: string, quantity: number) => {
        setItems((cur) => cur.map((i) => (i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i)).filter((i) => i.quantity > 0))
    }

    const clear = () => setItems([])

    const total = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items])

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clear, total }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart () {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error('useCart must be used within a CartProvider')
    return ctx
}

export function useCartItems () {
    return useCart().items
}
