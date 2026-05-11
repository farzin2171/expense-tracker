import { EXPENSE_CATEGORIES } from '@/src/lib/categories'
import { Dashboard } from '@/src/components/dashboard/Dashboard'

export default async function Home() {
  return <Dashboard categories={EXPENSE_CATEGORIES} />
}
