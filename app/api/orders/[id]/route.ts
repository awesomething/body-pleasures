import { NextResponse } from 'next/server'
import { readJSON, writeJSON } from '@/lib/storage'
import { revertStock } from '@/lib/inventory'

const ORDERS_FILE = 'orders.json'

function listOrders() {
  return (readJSON<any[]>(ORDERS_FILE) || [])
}

function saveOrders(orders: any[]) {
  writeJSON(ORDERS_FILE, orders)
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const orders = listOrders()
  const o = orders.find((x) => x.id === params.id)
  if (!o) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json(o)
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  // used to update order status (e.g., cancel) and revert stock when needed
  try {
    const body = await req.json()
    const orders = listOrders()
    const idx = orders.findIndex((x) => x.id === params.id)
    if (idx === -1) return NextResponse.json({ error: 'not found' }, { status: 404 })
    const order = orders[idx]
    const newStatus = body.status
    if (!newStatus) return NextResponse.json({ error: 'status required' }, { status: 400 })

    // if cancelling from paid => revert stock
    if (order.status === 'paid' && (newStatus === 'canceled' || newStatus === 'failed')) {
      for (const it of order.items) {
        try {
          await revertStock(it.productId, it.variantId || null, it.quantity)
        } catch (err) {
          console.error('failed to revert stock for', it, err)
        }
      }
    }

    orders[idx] = { ...order, ...body }
    saveOrders(orders)
    return NextResponse.json(orders[idx])
  } catch (err) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }
}
