// src/app/api/register/route.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/mongodb'

export async function POST(req: Request) {
  const { password, secret } = await req.json()

  // حماية بسيطة: لو حابة تضعي سر مؤقت لتمنع أي حد من استدعاء ال route
  if (secret !== process.env.DASHBOARD_COOKIE_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!password || typeof password !== 'string') {
    return NextResponse.json({ error: 'Password required' }, { status: 400 })
  }

  const saltRounds = 10
  const hashed = await bcrypt.hash(password, saltRounds)

  const { db } = await connectToDatabase()
  // مجموعة (collection) اسمها admins
  const result = await db.collection('admins').updateOne(
    { role: 'admin' },
    { $set: { password: hashed, updatedAt: new Date() } },
    { upsert: true }
  )

  return NextResponse.json({ ok: true })
}
