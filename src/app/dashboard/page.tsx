
'use client'
import useSWR from 'swr'
import CategoriesPage from './category/page'
import DishesPage from './dishes/page'
import SubcategoryPage from './subcategory/page'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function DashboardPage() {
  const { data, error } = useSWR('/api/stats', fetcher)

  if (error) return <div> حصل خطأ أثناء جلب البيانات</div>
  if (!data) return <div> جاري التحميل...</div>

  return (
    <div>
      <CategoriesPage/>
      <SubcategoryPage/>
      <DishesPage/>
    </div>
  )
}