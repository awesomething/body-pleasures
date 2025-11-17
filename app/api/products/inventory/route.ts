import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/products/inventory
// Returns all products with their stock levels
export async function GET (req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    const apiKey = authHeader?.replace('Bearer ', '')

    if (!apiKey || apiKey !== process.env.CLASSICVISA_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch products with their stock levels
    // Note: Adjust based on your actual Product/CartItem schema
    const products = await prisma.cartItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
    })

    // Transform to inventory format (you may need to adjust based on your schema)
    const inventory = products.map(item => ({
      id: item.productId,
      name: `Product ${item.productId}`,
      stock: 100 - (item._sum.quantity || 0), // Simple calculation; adjust as needed
    }))

    return NextResponse.json({ products: inventory })
  } catch (err) {
    console.error('[products/inventory] Error:', err)
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 })
  }
}
