import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, signToken, isValidEmail, isValidPassword } from '@/lib/auth'

export async function POST (req: Request) {
  try {
    const { email, password, name } = await req.json()

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    if (!isValidPassword(password)) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    // Hash password and create user
    let passwordHash: string
    try {
      passwordHash = await hashPassword(password)
      console.log('✅ Password hashed successfully')
    } catch (hashErr) {
      console.error('❌ Password hashing failed:', hashErr)
      return NextResponse.json({ error: 'Password hashing failed' }, { status: 500 })
    }

    let user
    try {
      user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          name: name || null,
          role: 'customer',
        },
      })
      console.log('✅ User created:', user.id, user.email)
    } catch (createErr: any) {
      console.error('❌ User creation failed:', createErr)
      if (createErr.code === 'P2002') {
        return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
      }
      return NextResponse.json({ error: 'Failed to create user: ' + createErr.message }, { status: 500 })
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
      { status: 201 }
    )

    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return response
  } catch (err) {
    console.error('❌ Register error:', err)
    const message = err instanceof Error ? err.message : JSON.stringify(err)
    return NextResponse.json({ error: 'Registration failed: ' + message }, { status: 500 })
  }
}
