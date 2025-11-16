import { NextResponse } from 'next/server'
import { listProducts, upsertProduct } from '@/lib/inventory'

function genId() {
  return `prod_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export async function GET() {
  const products = listProducts()
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // basic defaults and id generation
  const id = body.id || genId()
    const product = { ...body, id }
    upsertProduct(product)
    return NextResponse.json(product, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
  }
}
