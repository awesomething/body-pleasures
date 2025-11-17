"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useAuth } from "@/hooks/useAuth"

export default function ProfilePage () {
    const { user, loading, logout } = useAuth()
    const router = useRouter()
    const [orders, setOrders] = useState<any[]>([])

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/login")
        }
    }, [user, loading, router])

    useEffect(() => {
        if (user) {
            // Fetch user's orders
            const fetchOrders = async () => {
                try {
                    const res = await fetch("/api/orders/me")
                    if (res.ok) {
                        const data = await res.json()
                        setOrders(data.orders || [])
                    }
                } catch (err) {
                    console.error("Failed to fetch orders:", err)
                }
            }
            fetchOrders()
        }
    }, [user])

    const handleLogout = async () => {
        await logout()
    }

    if (loading) {
        return (
            <>
                <Navigation />
                <main className="min-h-screen flex items-center justify-center">
                    <p>Loading...</p>
                </main>
                <Footer />
            </>
        )
    }

    if (!user) {
        return null
    }

    return (
        <>
            <Navigation />
            <main className="max-w-4xl mx-auto py-24 px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-serif">Your Profile</h1>
                    <Button variant="ghost" onClick={handleLogout}>
                        Log Out
                    </Button>
                </div>

                {/* User Info */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                    <div className="space-y-2">
                        <p><span className="font-medium">Name:</span> {user.name || "Not set"}</p>
                        <p><span className="font-medium">Email:</span> {user.email}</p>
                        <p><span className="font-medium">Role:</span> {user.role}</p>
                        <p><span className="font-medium">Member since:</span> {new Date().toLocaleDateString()}</p>
                    </div>
                    <Link href="/profile/edit">
                        <Button className="mt-4">Edit Profile</Button>
                    </Link>
                </div>

                {/* Order History */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Order History</h2>
                    {orders.length === 0 ? (
                        <p className="text-gray-600">No orders yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="border rounded-lg p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                                        <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">${order.total.toFixed(2)}</p>
                                        <p className="text-sm text-gray-600 capitalize">{order.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}
