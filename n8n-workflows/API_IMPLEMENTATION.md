# ClassVisa API Implementation Examples

This document provides complete code examples for implementing the APIs that n8n workflows need.

## 1. Order Creation Endpoint with Webhook Trigger

**File**: `/app/api/checkout/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { triggerOrderWebhook } from '@/lib/webhook-triggers'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

export async function POST (req: Request) {
  try {
    const body = await req.json()
    const {
      cartId,
      paymentMethodId,
      shippingName,
      shippingEmail,
      shippingPhone,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingZip,
      shippingCountry,
    } = body

    // Validate inputs
    if (!cartId || !paymentMethodId || !shippingEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { cartId },
    })

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
    })

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Payment failed', status: paymentIntent.status },
        { status: 400 }
      )
    }

    // Create order in database
    const order = await prisma.order.create({
      data: {
        status: 'paid',
        total: total * 100, // Store in cents
        shippingName,
        shippingEmail,
        shippingPhone,
        shippingAddress,
        shippingCity,
        shippingState,
        shippingZip,
        shippingCountry,
        paymentIntentId: paymentIntent.id,
      },
    })

    // Prepare order items data for webhook
    const orderItems = cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }))

    // Trigger n8n webhook for order fulfillment automation
    await triggerOrderWebhook({
      id: order.id,
      shippingName,
      shippingEmail,
      total: order.total,
      items: orderItems,
      status: order.status,
      shippingAddress: `${shippingAddress}, ${shippingCity}, ${shippingState} ${shippingZip}, ${shippingCountry}`,
      createdAt: order.createdAt.toISOString(),
    })

    // Clear the cart
    await prisma.cartItem.deleteMany({ where: { cartId } })

    return NextResponse.json({
      orderId: order.id,
      total: order.total,
      status: order.status,
    })
  } catch (err) {
    console.error('[checkout] Error:', err)
    return NextResponse.json(
      { error: 'Checkout failed' },
      { status: 500 }
    )
  }
}
```

---

## 2. Review Creation Endpoint with Webhook Trigger

**File**: `/app/api/reviews/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { triggerReviewWebhook } from '@/lib/webhook-triggers'

export async function POST (req: Request) {
  try {
    const body = await req.json()
    const {
      productId,
      customerName,
      customerEmail,
      rating,
      text,
    } = body

    // Validate inputs
    if (!productId || !customerName || !customerEmail || !rating || !text) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate rating is 1-5
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Get product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        productId,
        customerName,
        customerEmail,
        rating,
        text,
      },
    })

    // Trigger n8n webhook for customer support triage
    await triggerReviewWebhook({
      id: review.id,
      customerName,
      customerEmail,
      productId,
      productName: product.name,
      rating,
      text,
      createdAt: review.createdAt.toISOString(),
    })

    return NextResponse.json({
      reviewId: review.id,
      message: 'Review created successfully',
    })
  } catch (err) {
    console.error('[reviews] Error:', err)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}

export async function GET (req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'productId query parameter required' },
        { status: 400 }
      )
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    return NextResponse.json({ reviews })
  } catch (err) {
    console.error('[reviews GET] Error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}
```

---

## 3. Inventory Endpoints (for Workflow 2)

**File**: `/app/api/products/inventory/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/products/inventory
// Returns all products with their current stock levels
export async function GET (req: Request) {
  try {
    // Verify API key
    const authHeader = req.headers.get('authorization')
    const apiKey = authHeader?.replace('Bearer ', '')

    if (!apiKey || apiKey !== process.env.CLASSICVISA_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized - invalid API key' },
        { status: 401 }
      )
    }

    // Fetch all products with stock info
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        stock: true,
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        stock: p.stock || 0,
      })),
      totalProducts: products.length,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[products/inventory GET] Error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}
```

**File**: `/app/api/products/sync-inventory/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type InventoryUpdate = {
  sku?: string
  productId?: string
  stock: number
}

// PATCH /api/products/sync-inventory
// Batch update product inventory from supplier or external source
export async function PATCH (req: Request) {
  try {
    // Verify API key
    const authHeader = req.headers.get('authorization')
    const apiKey = authHeader?.replace('Bearer ', '')

    if (!apiKey || apiKey !== process.env.CLASSICVISA_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized - invalid API key' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const batchUpdates: InventoryUpdate[] = body.batchUpdates || body.updates || []

    if (!Array.isArray(batchUpdates)) {
      return NextResponse.json(
        { error: 'batchUpdates must be an array' },
        { status: 400 }
      )
    }

    let successCount = 0
    let errorCount = 0
    const errors: string[] = []

    // Process each inventory update
    for (const update of batchUpdates) {
      try {
        const productId = update.productId || update.sku
        const { stock } = update

        if (!productId || stock === undefined) {
          errorCount++
          errors.push(`Invalid update: missing productId or stock`)
          continue
        }

        // Update product stock
        await prisma.product.update({
          where: { id: productId },
          data: { stock },
        })

        console.log(`[Inventory Sync] Updated product ${productId} to ${stock} units`)
        successCount++
      } catch (err: any) {
        errorCount++
        const errorMsg = err.message || 'Unknown error'
        errors.push(`Failed to update ${update.productId || update.sku}: ${errorMsg}`)
        console.error('[Inventory Sync] Update error:', err)
      }
    }

    return NextResponse.json({
      message: 'Inventory sync completed',
      successCount,
      errorCount,
      totalProcessed: batchUpdates.length,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[products/sync-inventory PATCH] Error:', err)
    return NextResponse.json(
      { error: 'Failed to sync inventory' },
      { status: 500 }
    )
  }
}
```

---

## 4. Prisma Schema Updates

**File**: `prisma/schema.prisma`

Add these models if they don't exist:

```prisma
// Products for inventory management
model Product {
  id        String   @id @default(cuid())
  name      String   @unique
  description String?
  price     Int      // Price in cents
  stock     Int      @default(100)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  reviews   Review[]

  @@index([name])
}

// Customer reviews for sentiment analysis
model Review {
  id            String   @id @default(cuid())
  productId     String
  product       Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  customerName  String
  customerEmail String
  rating        Int      @db.Int // 1-5
  text          String   @db.Text
  sentiment     String?  // "positive", "negative", "neutral" (set by n8n)
  createdAt     DateTime @default(now())

  @@index([productId])
  @@index([customerEmail])
  @@index([sentiment])
}
```

Run migration:

```bash
npx prisma migrate dev --name add_products_reviews
```

---

## 5. Test Data Creation

**File**: `scripts/seed-products.ts` (optional)

```typescript
import { prisma } from '@/lib/prisma'

async function main () {
  // Clear existing data
  await prisma.review.deleteMany({})
  await prisma.product.deleteMany({})

  // Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Silk Pillowcase',
        description: 'Luxury 100% silk pillowcase for hair and skin',
        price: 2999, // $29.99
        stock: 5, // Low stock to trigger alerts
      },
    }),
    prisma.product.create({
      data: {
        name: 'Sleep Mask',
        description: 'Comfortable blackout sleep mask',
        price: 1499, // $14.99
        stock: 25,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Weighted Blanket',
        description: '15lb weighted blanket for better sleep',
        price: 14999, // $149.99
        stock: 8, // Low stock
      },
    }),
  ])

  console.log('✅ Created products:', products.length)
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
```

Run with:
```bash
npx ts-node scripts/seed-products.ts
```

---

## 6. Manual Testing Commands

### Create a Test Order

```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "cartId": "test-cart-1",
    "paymentMethodId": "pm_test_123",
    "shippingName": "John Doe",
    "shippingEmail": "john@example.com",
    "shippingPhone": "+1234567890",
    "shippingAddress": "123 Main St",
    "shippingCity": "New York",
    "shippingState": "NY",
    "shippingZip": "10001",
    "shippingCountry": "USA"
  }'
```

### Create a Test Review

```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "clp1234567890",
    "customerName": "Jane Smith",
    "customerEmail": "jane@example.com",
    "rating": 4,
    "text": "Great product! Arrived quickly and works as described."
  }'
```

### Get Current Inventory

```bash
curl -X GET http://localhost:3000/api/products/inventory \
  -H "Authorization: Bearer your-classicvisa-api-key"
```

### Sync Inventory

```bash
curl -X PATCH http://localhost:3000/api/products/sync-inventory \
  -H "Authorization: Bearer your-classicvisa-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "batchUpdates": [
      { "productId": "clp1234567890", "stock": 50 },
      { "productId": "clp0987654321", "stock": 100 }
    ]
  }'
```

---

## Environment Variables Needed

Add to your `.env` file:

```bash
# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLIC_KEY="pk_test_..."

# n8n Webhooks
N8N_WEBHOOK_URL="https://your-n8n.io/webhook"
N8N_ORDER_WEBHOOK_URL="https://your-n8n.io/webhook/orders/new"
N8N_REVIEW_WEBHOOK_URL="https://your-n8n.io/webhook/reviews/new"

# ClassVisa API Authentication
CLASSICVISA_API_KEY="choose-secure-api-key"
```

---

## Database Queries (for debugging)

```sql
-- Check products with low stock
SELECT id, name, stock FROM Product WHERE stock < 10;

-- Get recent reviews
SELECT * FROM Review ORDER BY createdAt DESC LIMIT 10;

-- Count reviews by sentiment
SELECT sentiment, COUNT(*) FROM Review GROUP BY sentiment;

-- Check recent orders
SELECT id, shippingEmail, total, status, createdAt FROM Order ORDER BY createdAt DESC;
```

---

**That's it!** With these implementations, your ClassVisa e-commerce platform will be fully integrated with n8n workflows. 🚀
