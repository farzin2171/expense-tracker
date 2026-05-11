import { NextResponse } from 'next/server'
import { EXPENSE_CATEGORIES } from '@/src/lib/categories'

export function GET() {
  return NextResponse.json({ categories: EXPENSE_CATEGORIES })
}
