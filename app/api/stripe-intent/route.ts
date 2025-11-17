import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// Use default apiVersion (from Stripe account) to avoid mismatched type literals
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

export async function POST (req: Request) {
  try {
    const cookieStore = await cookies()
    let sessionId = cookieStore.get('sessionId')?.value
    if (!sessionId) {
      return NextResponse.json({ error: 'no session' }, { status: 400 })
    }

    const { shippingName, shippingEmail, shippingPhone, shippingAddress, shippingCity, shippingState, shippingZip, shippingCountry, subtotal, tax, shipping, total } = await req.json()

    // Get cart items
    const cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: { items: true },
    })
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'cart empty' }, { status: 400 })
    }

    // Create Stripe payment intent
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // cents
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        sessionId,
        shippingName,
        shippingEmail,
        shippingAddress,
        shippingCity,
        shippingState,
        shippingZip,
        shippingCountry,
      },
    })

    return NextResponse.json({
      clientSecret: intent.client_secret,
      intentId: intent.id,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'failed to create intent' }, { status: 500 })
  }
}
