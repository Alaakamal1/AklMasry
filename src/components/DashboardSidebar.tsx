import Link from "next/link";

export default function DashboardSidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
      <h2 className="text-xl font-bold">لوحة التحكم</h2>
      <nav className="flex flex-col space-y-2">
        <Link href="/dashboard/category" className="hover:underline">
          الكاتيجوريز
        </Link>
        <Link href="/dashboard/subcategory" className="hover:underline">
          الاصناف
        </Link>
        <Link href="/dashboard/dishes" className="hover:underline">
          الأطباق
        </Link>
      </nav>
    </aside>
  );
}
