<<<<<<< HEAD
// 'use client'
// import { useRouter } from 'next/navigation'

// export const dynamic = "force-dynamic";

// export default function Dashboard() {
//   const router = useRouter()

//   const handleLogout = async () => {
//     await fetch('/api/logout', { method: 'POST' })
//     router.push('/login')
//   }

//   return (
//     <div>
//       <h1>📊 أهلاً بيكي في الداشبورد</h1>
//       <button onClick={handleLogout}>تسجيل الخروج</button>
//     </div>
//   )
// }


// src/app/dashboard/page.tsx
=======

>>>>>>> 0b7272c99d18ba48276db212c7945dac92d79ab3
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
<<<<<<< HEAD
}
=======
}
>>>>>>> 0b7272c99d18ba48276db212c7945dac92d79ab3
