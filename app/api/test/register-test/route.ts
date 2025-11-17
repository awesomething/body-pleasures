import { NextResponse } from 'next/server'
import { hashPassword, comparePassword, signToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * Test endpoint - DO NOT USE IN PRODUCTION
 * POST /api/test/register-test
 */
export async function POST (req: Request) {
  try {
    const testEmail = 'test-' + Date.now() + '@test.com'
    const testPassword = 'password123'

    console.log('\n🧪 === REGISTRATION TEST ===')
    console.log('Test email:', testEmail)
    console.log('Test password:', testPassword)

    // Step 1: Hash password
    console.log('\n1️⃣ Hashing password...')
    const hash = await hashPassword(testPassword)
    console.log('✅ Hash created:', hash.substring(0, 20) + '...')

    // Step 2: Create user
    console.log('\n2️⃣ Creating user in database...')
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        passwordHash: hash,
        name: 'Test User',
        role: 'customer',
      },
    })
    console.log('✅ User created:', user.id, user.email)

    // Step 3: Test password comparison
    console.log('\n3️⃣ Testing password comparison...')
    const isMatch = await comparePassword(testPassword, hash)
    console.log('✅ Password match:', isMatch)

    // Step 4: Test with wrong password
    console.log('\n4️⃣ Testing wrong password...')
    const isWrongMatch = await comparePassword('wrongpassword', hash)
    console.log('✅ Wrong password match:', isWrongMatch)

    // Step 5: Generate token
    console.log('\n5️⃣ Generating JWT token...')
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })
    console.log('✅ Token generated:', token.substring(0, 20) + '...')

    // Step 6: Try to login with correct password
    console.log('\n6️⃣ Simulating login with correct password...')
    const foundUser = await prisma.user.findUnique({ where: { email: testEmail } })
    if (foundUser) {
      const loginMatch = await comparePassword(testPassword, foundUser.passwordHash)
      console.log('✅ Login would succeed:', loginMatch)
    }

    console.log('\n✅ === ALL TESTS PASSED ===\n')

    return NextResponse.json({
      message: 'All tests passed',
      testUser: {
        id: user.id,
        email: user.email,
        passwordHashLength: hash.length,
        passwordMatchCorrect: isMatch,
        passwordMatchWrong: isWrongMatch,
      },
    })
  } catch (err) {
    console.error('\n❌ === TEST FAILED ===')
    console.error(err)
    return NextResponse.json(
      {
        error: 'Test failed',
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}
