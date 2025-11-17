import { NextResponse } from 'next/server'

export async function POST (req: Request) {
  const response = NextResponse.json({ message: 'Logged out' })
  response.cookies.set('authToken', '', { maxAge: 0 })
  return response
}
