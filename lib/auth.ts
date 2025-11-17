import jwt, { SignOptions } from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export type JWTPayload = {
  userId: string
  email: string
  role: string
}

/**
 * Hash a plaintext password using bcrypt
 */
export async function hashPassword (password: string): Promise<string> {
  try {
    const hash = await bcrypt.hash(password, 10)
    console.log('✅ Password hashed, hash length:', hash.length)
    return hash
  } catch (err) {
    console.error('❌ bcrypt.hash failed:', err)
    throw err
  }
}

/**
 * Compare plaintext password with hash
 */
export async function comparePassword (password: string, hash: string): Promise<boolean> {
  try {
    console.log('Comparing password, hash length:', hash.length)
    const match = await bcrypt.compare(password, hash)
    console.log('✅ bcrypt.compare result:', match)
    return match
  } catch (err) {
    console.error('❌ bcrypt.compare failed:', err)
    throw err
  }
}

/**
 * Sign a JWT token
 */
export function signToken (payload: JWTPayload, expiresIn: string | number = '30d'): string {
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn } as any)
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken (token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch (err) {
    return null
  }
}

/**
 * Validate email format
 */
export function isValidEmail (email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength (min 6 chars for simplicity; can be stricter)
 */
export function isValidPassword (password: string): boolean {
  return password.length >= 6
}
