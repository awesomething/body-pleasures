import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET () {
  try {
    const hasPrisma = !!prisma
    let userCount = null
    try {
      userCount = await prisma.user.count()
    } catch (qErr) {
      // capture query error
      return NextResponse.json({ ok: false, hasPrisma, queryError: String(qErr) }, { status: 500 })
    }

    return NextResponse.json({ ok: true, hasPrisma, userCount })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
