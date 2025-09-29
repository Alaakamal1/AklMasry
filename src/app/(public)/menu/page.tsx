// // app/menu/page.tsx

// import Link from "next/link";
// import { subCategory } from "@/types/subCategory";

// async function getCategory() {
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

//   const res = await fetch(`${baseUrl}/api/subcategory`, {
//     cache: "no-store", // دا عشان يجيب أحدث بيانات
//   });

//   if (!res.ok) {
//     throw new Error("فشل في جلب الأقسام");
//   }

//   return res.json();
// }

// export default async function MenuPage() {
//   const subCategory: subCategory[] = await getCategory();

//   return (
//     <div className="max-w-xl mx-auto mt-6">
//       <h1 className="text-2xl font-bold mb-6 text-center">القائمة</h1>

//       <div className="space-y-4">
//         {subCategory.map((cat) => (
//           <Link
//             key={cat._id}
//             href={`/menu/${cat.subCategoryName}`}
//             className="block bg-gray-500 text-white rounded-lg p-4 shadow hover:bg-gray-700 transition"
//           >
//             {cat.subCategoryName}
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";

interface Category {
  _id: string;
  categoryName: string;
}

interface SubCategory {
  _id: string;
  subCategoryName: string;
}

interface Dish {
  _id: string;
  dishName: string;
  price: number;
}

export default function Menu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);

  // load main categories
  useEffect(() => {
    fetch("/api/category")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleCategoryClick = async (categoryId: string) => {
    const res = await fetch(`/api/subCategory/${categoryId}`);
    const data = await res.json();
    setSubCategories(data);
    setDishes([]); // reset dishes
  };

  const handleSubCategoryClick = async (subCategoryId: string) => {
    const res = await fetch(`/api/dishes/${subCategoryId}`);
    const data = await res.json();
    setDishes(data);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">القائمة الرئيسية</h2>

      {/* Categories */}
      <div className="flex gap-4 mt-4">
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => handleCategoryClick(cat._id)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            {cat.categoryName}
          </button>
        ))}
      </div>

      {/* SubCategories */}
      {subCategories.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">الأصناف</h3>
          <div className="flex gap-3 mt-2">
            {subCategories.map((sub) => (
              <button
                key={sub._id}
                onClick={() => handleSubCategoryClick(sub._id)}
                className="px-3 py-1 bg-green-500 text-white rounded-lg"
              >
                {sub.subCategoryName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dishes */}
      {dishes.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">الأطباق</h3>
          <ul className="list-disc pl-5 mt-2">
            {dishes.map((dish) => (
              <li key={dish._id}>
                {dish.dishName} - {dish.price} جنيه
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
