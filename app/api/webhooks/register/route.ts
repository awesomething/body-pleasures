import { NextResponse } from 'next/server'

type WebhookRegistration = {
  event: 'order.created' | 'review.created'
  url: string
}

// Store webhook registrations in memory or database
// For production, store these in the database
const webhookRegistry: WebhookRegistration[] = [
  // Pre-registered webhooks can be added here or loaded from DB
]

// POST /api/webhooks/register
// Register a webhook URL for a specific event
export async function POST (req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    const apiKey = authHeader?.replace('Bearer ', '')

    if (!apiKey || apiKey !== process.env.CLASSICVISA_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { event, url } = body

    if (!event || !url) {
      return NextResponse.json({ error: 'event and url are required' }, { status: 400 })
    }

    if (!['order.created', 'review.created'].includes(event)) {
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 })
    }

    // Validate URL is a valid webhook
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: 'Invalid webhook URL' }, { status: 400 })
    }

    // Add or update webhook registration
    const existingIndex = webhookRegistry.findIndex(w => w.event === event && w.url === url)
    if (existingIndex === -1) {
      webhookRegistry.push({ event, url })
    }

    console.log(`[Webhook Registry] Registered ${event} -> ${url}`)

    return NextResponse.json({
      message: 'Webhook registered successfully',
      event,
      url,
      registeredWebhooks: webhookRegistry.length,
    })
  } catch (err) {
    console.error('[webhooks/register] Error:', err)
    return NextResponse.json({ error: 'Failed to register webhook' }, { status: 500 })
  }
}

// GET /api/webhooks/register
// List all registered webhooks
export async function GET (req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    const apiKey = authHeader?.replace('Bearer ', '')

    if (!apiKey || apiKey !== process.env.CLASSICVISA_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ webhooks: webhookRegistry })
  } catch (err) {
    console.error('[webhooks/register] Error:', err)
    return NextResponse.json({ error: 'Failed to fetch webhooks' }, { status: 500 })
  }
}
