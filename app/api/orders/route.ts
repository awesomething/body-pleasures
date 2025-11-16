import { NextResponse } from 'next/server'
import { readJSON, writeJSON } from '@/lib/storage'
import { decrementStock } from '@/lib/inventory'

const ORDERS_FILE = 'orders.json'

function listOrders() {
  return (readJSON<any[]>(ORDERS_FILE) || [])
}

function saveOrders(orders: any[]) {
  writeJSON(ORDERS_FILE, orders)
}

export async function GET() {
  return NextResponse.json(listOrders())
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, customer, method } = body
    if (!items || !Array.isArray(items) || items.length === 0) return NextResponse.json({ error: 'no items' }, { status: 400 })

    // attempt to decrement stock for each item
    const alerts: any[] = []
    const decremented: { productId: string; variantId: string | null; qty: number }[] = []
    try {
      for (const it of items) {
        const { productId, variantId = null, quantity } = it
        await decrementStock(productId, variantId, quantity)
        decremented.push({ productId, variantId, qty: quantity })
      }
    } catch (err) {
      // revert any decremented items
      for (const d of decremented) {
        try {
          // revert - use inventory.revertStock
          const inv = await import('@/lib/inventory')
          await inv.revertStock(d.productId, d.variantId, d.qty)
        } catch (e) {
          console.error('failed to revert', e)
        }
      }
      return NextResponse.json({ error: String(err) }, { status: 400 })
    }

    // Create order record
    const orders = listOrders()
    const order = { id: `ord_${Date.now().toString(36)}`, items, customer, method, status: 'paid', total: body.total || 0, createdAt: new Date().toISOString() }
    orders.unshift(order)
    saveOrders(orders)
    return NextResponse.json(order, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
  }
}
