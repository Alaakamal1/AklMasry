// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { ISubCategory } from "@/models/SubCategory";
// import { IDish } from "@/models/Dish";


// export default function CategoryPage() {
//   const searchParams = useSearchParams();
//   const categoryId = searchParams.get("id"); // بنبعتها من اللينك
//   const categoryName = searchParams.get("name");

//   const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
//   const [dishes, setDishes] = useState<Record<string, IDish[]>>({}); // نخزن كل SubCategory مع أطباقها
//   const [openSubCategory, setOpenSubCategory] = useState<string | null>(null);

//   useEffect(() => {
//     if (!categoryId) return;
//     fetch(`/api/subCategory/${categoryId}`)
//       .then((res) => res.json())
//       .then((data) => setSubCategories(data));
//   }, [categoryId]);

//   const toggleSubCategory = async (subCategoryId: string) => {
//     if (openSubCategory === subCategoryId) {
//       setOpenSubCategory(null); // لو مفتوح نقفله
//       return;
//     }
//     setOpenSubCategory(subCategoryId);

//     // لو لسه ما جبناش الأطباق بتاعة الـ SubCategory
//     if (!dishes[subCategoryId]) {
//       const res = await fetch(`/api/dishes/${subCategoryId}`);
//       const data = await res.json();
//       setDishes((prev) => ({ ...prev, [subCategoryId]: data }));
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gray-50 p-10">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">
//         {categoryName}
//       </h1>

//       <div className="space-y-4">
//         {subCategories.map((sub) => (
//           <div
//             key={sub._id}
//             className="border rounded-xl shadow bg-white"
//           >
//             {/* عنوان الـ SubCategory */}
//             <button
//               onClick={() => toggleSubCategory(sub._id)}
//               className="w-full flex justify-between items-center p-4 text-lg font-semibold bg-gray-100 hover:bg-gray-200 rounded-t-xl"
//             >
//               {sub.subCategoryName}
//               <span>{openSubCategory === sub._id ? "▲" : "▼"}</span>
//             </button>

//             {/* محتوى الـ Accordion */}
//             {openSubCategory === sub._id && (
//               <div className="p-4 space-y-2">
//                 {dishes[sub._id]?.length > 0 ? (
//                   <ul className="list-disc pl-6">
//                     {dishes[sub._id].map((dish) => (
//                       <li key={dish._id}>
//                         {dish.dishName} - {dish.price} جنيه
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-gray-500">لا يوجد أطباق حالياً</p>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </main>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ISubCategory } from "@/models/SubCategory";
import { IDish } from "@/models/Dish";

export default function CategoryPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("id");
  const categoryName = searchParams.get("name");

  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [dishes, setDishes] = useState<Record<string, IDish[]>>({});
  const [openSubCategory, setOpenSubCategory] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;
    fetch(`/api/subcategory/${categoryId}`)
      .then((res) => res.json())
      .then((data) => setSubCategories(data));
  }, [categoryId]);

  const toggleSubCategory = async (subCategoryId: string) => {
    if (openSubCategory === subCategoryId) {
      setOpenSubCategory(null);
      return;
    }
    setOpenSubCategory(subCategoryId);

    if (!dishes[subCategoryId]) {
      const res = await fetch(`/api/dishes/${subCategoryId}`);
      const data = await res.json();
      setDishes((prev) => ({ ...prev, [subCategoryId]: data }));
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {categoryName}
      </h1>

      <div className="space-y-4">
        {subCategories.map((sub) => (
          <div key={sub._id} className="border rounded-xl shadow bg-white">
            <button
              onClick={() => toggleSubCategory(sub._id)}
              className="w-full flex justify-between items-center p-4 text-lg font-semibold bg-gray-100 hover:bg-gray-200 rounded-t-xl"
            >
              {sub.subCategoryName}
              <span>{openSubCategory === sub._id ? "▲" : "▼"}</span>
            </button>

            {openSubCategory === sub._id && (
              <div className="p-4 space-y-2">
                {dishes[sub._id]?.length > 0 ? (
                  <ul className="list-disc pl-6">
                    {dishes[sub._id].map((dish) => (
                      <li key={dish._id}>
                        {dish.dishName} - {dish.price} جنيه
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">لا يوجد أطباق حالياً</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
