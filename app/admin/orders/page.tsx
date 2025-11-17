'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

type Order = {
    id: string
    total: number
    status: string
    createdAt: string
    shippingName?: string | null
    shippingEmail?: string | null
}

export default function OrdersPage () {
    const [q, setQ] = useState('')
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(false)

    async function fetchOrders (query?: string) {
        setLoading(true)
        const url = '/api/admin/orders/search' + (query ? `?q=${encodeURIComponent(query)}` : '')
        const res = await fetch(url)
        const data = await res.json()
        setOrders(data.orders || [])
        setLoading(false)
    }

    useEffect(() => { fetchOrders() }, [])

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Orders</h2>
                <div className="flex gap-2">
                    <input
                        className="border rounded px-2 py-1"
                        placeholder="Search orders by id, name or email"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                    <button className="px-3 py-1 bg-slate-800 text-white rounded" onClick={() => fetchOrders(q)}>Search</button>
                </div>
            </div>

            {loading ? <p>Loading...</p> : (
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="text-left border-b">
                            <th className="py-2">ID</th>
                            <th className="py-2">Total</th>
                            <th className="py-2">Status</th>
                            <th className="py-2">Created</th>
                            <th className="py-2">Customer</th>
                            <th className="py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="border-b">
                                <td className="py-2">{order.id}</td>
                                <td className="py-2">${(order.total / 100).toFixed(2)}</td>
                                <td className="py-2">{order.status}</td>
                                <td className="py-2">{new Date(order.createdAt).toLocaleString()}</td>
                                <td className="py-2">{order.shippingName || order.shippingEmail || '—'}</td>
                                <td className="py-2">
                                    <Link href={`/admin/orders/${order.id}`} className="text-sky-600">View</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}
