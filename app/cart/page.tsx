"use client"

import React from "react"
import { useCart } from "@/components/cart-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function CartPage () {
    const { items, updateQuantity, removeItem, total } = useCart()

    return (
        <>
            <Navigation />
            <main className="max-w-4xl mx-auto py-24 px-4">
                <h1 className="text-3xl font-serif mb-6">Your Cart</h1>

                {items.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="mb-4">Your cart is empty.</p>
                        <Link href="/">
                            <Button>Continue shopping</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {items.map((it) => (
                            <div key={it.id} className="flex items-center gap-4 border p-4 rounded-md">
                                {it.image && <img src={it.image} alt={it.name} className="w-24 h-24 object-cover rounded" />}
                                <div className="flex-1">
                                    <h3 className="font-medium">{it.name}</h3>
                                    <p className="text-sm text-muted-foreground">{`$${it.price.toFixed(2)}`}</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <button className="px-2 rounded border" onClick={() => updateQuantity(it.id, it.quantity - 1)}>-</button>
                                        <input
                                            className="w-16 text-center rounded border px-2 py-1"
                                            type="number"
                                            min={1}
                                            value={it.quantity}
                                            onChange={(e) => updateQuantity(it.id, Math.max(1, Number(e.target.value || 1)))}
                                        />
                                        <button className="px-2 rounded border" onClick={() => updateQuantity(it.id, it.quantity + 1)}>+</button>
                                        <button className="ml-4 text-sm text-red-600" onClick={() => removeItem(it.id)}>Remove</button>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-medium">{`$${(it.price * it.quantity).toFixed(2)}`}</div>
                                </div>
                            </div>
                        ))}

                        <div className="flex items-center justify-between border-t pt-4">
                            <div>
                                <div className="text-sm text-muted-foreground">Total</div>
                                <div className="text-2xl font-semibold">{`$${total.toFixed(2)}`}</div>
                            </div>
                            <div className="flex gap-2">
                                <Link href="/">
                                    <Button variant="ghost">Continue Shopping</Button>
                                </Link>
                                <Link href="/checkout">
                                    <Button>Checkout</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    )
}
