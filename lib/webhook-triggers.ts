/**
 * Webhook Trigger Utility
 * Use this to trigger n8n workflows when events occur in ClassVisa
 */

type WebhookPayload = {
  order?: {
    id: string
    shippingName: string
    shippingEmail: string
    total: number
    items: { productId: string; quantity: number; price: number }[]
    status: string
    shippingAddress: string
    createdAt: string
  }
  review?: {
    id: string
    customerName: string
    customerEmail: string
    productId: string
    productName: string
    rating: number
    text: string
    createdAt: string
  }
}

export async function triggerWebhook (event: 'order.created' | 'review.created', payload: WebhookPayload) {
  try {
    const webhookUrl = process.env.N8N_WEBHOOK_URL
    if (!webhookUrl) {
      console.warn('[Webhook] N8N_WEBHOOK_URL not set, skipping webhook trigger')
      return
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Event-Type': event,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.error(`[Webhook] Failed to trigger ${event}:`, response.status, await response.text())
    } else {
      console.log(`[Webhook] Successfully triggered ${event}`)
    }
  } catch (err) {
    console.error(`[Webhook] Error triggering ${event}:`, err)
    // Don't throw - webhook failures shouldn't break the main flow
  }
}

/**
 * Trigger order.created webhook
 */
export async function triggerOrderWebhook (order: {
  id: string
  shippingName: string
  shippingEmail: string
  total: number
  items?: { productId: string; quantity: number; price: number }[]
  status: string
  shippingAddress?: string
  createdAt: string
}) {
  return triggerWebhook('order.created', {
    order: {
      items: order.items || [],
      shippingAddress: order.shippingAddress || '',
      ...order,
    },
  })
}

/**
 * Trigger review.created webhook
 */
export async function triggerReviewWebhook (review: {
  id: string
  customerName: string
  customerEmail: string
  productId: string
  productName: string
  rating: number
  text: string
  createdAt: string
}) {
  return triggerWebhook('review.created', { review })
}
