import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, signToken, isValidEmail } from '@/lib/auth'

export async function POST (req: Request) {
  try {
    const { email, password } = await req.json()

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      console.log('❌ User not found:', email)
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }
    console.log('✅ User found:', user.email)

    // Verify password
    let isValid: boolean
    try {
      isValid = await comparePassword(password, user.passwordHash)
      console.log('✅ Password comparison complete, match:', isValid)
    } catch (compareErr) {
      console.error('❌ Password comparison failed:', compareErr)
      return NextResponse.json({ error: 'Password verification failed' }, { status: 500 })
    }

    if (!isValid) {
      console.log('❌ Password mismatch for user:', email)
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Sign JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Create response with httpOnly cookie
    const response = NextResponse.json(
      {
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        token,
      },
      { status: 200 }
    )

    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return response
  } catch (err) {
    console.error('❌ Login error:', err)
    const message = err instanceof Error ? err.message : JSON.stringify(err)
    return NextResponse.json({ error: 'Login failed: ' + message }, { status: 500 })
  }
}
