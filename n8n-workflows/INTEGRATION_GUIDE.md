# n8n Integration Examples

This document shows how to trigger n8n workflows from your ClassVisa code.

## Quick Start

### 1. Trigger Order Webhook (in your checkout/order creation code)

```typescript
import { triggerOrderWebhook } from '@/lib/webhook-triggers'

// When a new order is created
await triggerOrderWebhook({
  id: order.id,
  shippingName: order.shippingName,
  shippingEmail: order.shippingEmail,
  total: order.total, // in cents
  items: order.items.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
    price: item.price,
  })),
  status: order.status,
  shippingAddress: order.shippingAddress,
  createdAt: order.createdAt.toISOString(),
})
```

### 2. Trigger Review Webhook (in your review creation code)

```typescript
import { triggerReviewWebhook } from '@/lib/webhook-triggers'

// When a new review is posted
await triggerReviewWebhook({
  id: review.id,
  customerName: review.customerName,
  customerEmail: review.customerEmail,
  productId: review.productId,
  productName: review.productName,
  rating: review.rating,
  text: review.text,
  createdAt: review.createdAt.toISOString(),
})
```

---

## Implementation Guide

### Step 1: Add Webhook Triggers to Order Checkout

Update your `/app/api/checkout` or order creation endpoint:

```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { triggerOrderWebhook } from '@/lib/webhook-triggers'

export async function POST (req: Request) {
  try {
    // ... existing checkout logic ...

    // Create order in database
    const order = await prisma.order.create({
      data: {
        // ... order data ...
      },
    })

    // Fetch order items for webhook
    const orderItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
    })

    // Trigger n8n workflow
    await triggerOrderWebhook({
      id: order.id,
      shippingName: order.shippingName,
      shippingEmail: order.shippingEmail,
      total: order.total,
      items: orderItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      status: order.status,
      shippingAddress: order.shippingAddress || '',
      createdAt: order.createdAt.toISOString(),
    })

    return NextResponse.json({ orderId: order.id })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
```

### Step 2: Add Webhook Triggers to Review Creation

Create a new endpoint `/app/api/reviews` or update existing review creation:

```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { triggerReviewWebhook } from '@/lib/webhook-triggers'

export async function POST (req: Request) {
  try {
    const { productId, customerName, customerEmail, rating, text } = await req.json()

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

    // Fetch product name for webhook
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { name: true },
    })

    // Trigger n8n workflow
    await triggerReviewWebhook({
      id: review.id,
      customerName,
      customerEmail,
      productId,
      productName: product?.name || 'Unknown Product',
      rating,
      text,
      createdAt: review.createdAt.toISOString(),
    })

    return NextResponse.json({ reviewId: review.id })
  } catch (err) {
    console.error('Review creation error:', err)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}
```

### Step 3: Extend Prisma Schema (if needed)

If you don't have Product and Review models, add them to `prisma/schema.prisma`:

```prisma
model Product {
  id        String   @id @default(cuid())
  name      String
  price     Int
  stock     Int      @default(100)
  createdAt DateTime @default(now())
  reviews   Review[]
}

model Review {
  id            String   @id @default(cuid())
  productId     String
  product       Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  customerName  String
  customerEmail String
  rating        Int      @db.Int
  text          String
  createdAt     DateTime @default(now())
}
```

Then run:
```bash
npx prisma migrate dev --name add_products_and_reviews
```

---

## Environment Configuration

Make sure your `.env` file includes:

```bash
# n8n Webhook URL - this is where ClassVisa sends events
N8N_WEBHOOK_URL="https://your-n8n-instance.io/webhook/orders/new"

# Or use separate URLs for different event types
N8N_ORDER_WEBHOOK_URL="https://your-n8n-instance.io/webhook/orders/new"
N8N_REVIEW_WEBHOOK_URL="https://your-n8n-instance.io/webhook/reviews/new"

# ClassVisa API Key (for inventory endpoints)
CLASSICVISA_API_KEY="your-secret-api-key"
```

To use separate URLs, update `lib/webhook-triggers.ts`:

```typescript
export async function triggerWebhook (event: 'order.created' | 'review.created', payload: WebhookPayload) {
  const webhookUrl = event === 'order.created' 
    ? process.env.N8N_ORDER_WEBHOOK_URL
    : process.env.N8N_REVIEW_WEBHOOK_URL

  // ... rest of function
}
```

---

## Testing Webhooks Locally

### Test Order Webhook

```bash
curl -X POST http://localhost:3000/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"productId": "prod-1", "quantity": 2, "price": 5999}],
    "shippingName": "John Doe",
    "shippingEmail": "john@example.com",
    "shippingAddress": "123 Main St",
    "total": 11998
  }'
```

Check n8n execution logs to see the order webhook trigger.

### Test Review Webhook

```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod-1",
    "customerName": "Jane Smith",
    "customerEmail": "jane@example.com",
    "rating": 5,
    "text": "Amazing product! Fast shipping."
  }'
```

Check n8n execution logs to see sentiment analysis and alerts.

---

## Error Handling

The webhook triggers are designed to fail gracefully:

```typescript
export async function triggerWebhook (event, payload) {
  try {
    // ... webhook call ...
  } catch (err) {
    // Log but don't throw - webhook failures shouldn't break orders
    console.error(`[Webhook] Error triggering ${event}:`, err)
  }
}
```

**Important**: Webhook failures will NOT prevent orders or reviews from being created. They only prevent automations from running.

---

## Monitoring n8n Workflows

### In n8n Dashboard:

1. **Open each workflow** and click **Show executions**
2. **Look for**:
   - ✅ Green checkmarks = successful runs
   - ❌ Red X marks = failed runs
   - Execution time and output data

### Common Issues:

| Problem | Solution |
|---------|----------|
| Webhook not triggering | Check N8N_WEBHOOK_URL in .env and verify n8n instance is running |
| Authentication errors | Verify credentials are valid in n8n (Slack, Google, OpenAI, Zendesk) |
| Rate limiting | Add delays between webhook calls; check API quotas |
| Timeout errors | Increase timeout in n8n workflow settings; optimize expensive operations |

---

## Advanced: Custom Webhook Payloads

To extend webhook data, modify `lib/webhook-triggers.ts`:

```typescript
export async function triggerOrderWebhook (order: {
  // ... existing fields ...
  customField?: string
}) {
  return triggerWebhook('order.created', {
    order: {
      customField: order.customField,
      // ... rest ...
    },
  })
}
```

Then update n8n workflows to use the new field:
```
{{$node["webhook_trigger"].json.body.order.customField}}
```

---

## Resources

- [n8n Webhook Docs](https://docs.n8n.io/workflows/triggers/webhook/)
- [n8n HTTP Request Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/)
- [Webhook.cool (testing tool)](https://webhook.cool)
