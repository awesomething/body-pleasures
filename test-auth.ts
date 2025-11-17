import { prisma } from '@/lib/prisma'
import { hashPassword, comparePassword } from '@/lib/auth'

async function testAuth () {
  try {
    console.log('Testing auth...')

    // 1. Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: 'oyedey@gmail.com' },
    })

    if (user) {
      console.log('✅ User found in database:', user)

      // 2. Test password comparison
      const testPassword = 'test123' // or whatever password was used
      const isMatch = await comparePassword(testPassword, user.passwordHash)
      console.log(`✅ Password match test (test123): ${isMatch}`)
    } else {
      console.log('❌ User not found in database')

      // List all users
      const allUsers = await prisma.user.findMany()
      console.log('All users in DB:', allUsers)
    }
  } catch (err) {
    console.error('❌ Test failed:', err)
  } finally {
    await prisma.$disconnect()
  }
}

testAuth()
