import { NextResponse } from 'next/server'
import { getProduct, upsertProduct, deleteProduct } from '@/lib/inventory'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const p = getProduct(params.id)
  if (!p) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json(p)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const existing = getProduct(params.id)
    if (!existing) return NextResponse.json({ error: 'not found' }, { status: 404 })
    const updated = { ...existing, ...body, id: params.id }
    upsertProduct(updated)
    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const existing = getProduct(params.id)
  if (!existing) return NextResponse.json({ error: 'not found' }, { status: 404 })
  deleteProduct(params.id)
  return NextResponse.json({ ok: true })
}
