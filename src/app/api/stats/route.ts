// src/app/api/stats/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  const { db } = await connectToDatabase()

  const dishesCount = await db.collection('dishes').countDocuments()
  const categoriesCount = await db.collection('categories').countDocuments()
  const subCategoriesCount = await db.collection('subcategories').countDocuments()

  return NextResponse.json({ dishesCount, categoriesCount, subCategoriesCount })
}
