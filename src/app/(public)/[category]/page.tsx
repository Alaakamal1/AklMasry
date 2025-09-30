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
      <h1 className="text-3xl font-bold mb-6 text-[#4c3f2d] flex justify-center">
        {categoryName}
      </h1>

      <div className="space-y-4 ">
        {subCategories.map((sub) => (
          <div key={sub._id} className=" rounded-xl shadow bg-gray-50">
            <button
              onClick={() => toggleSubCategory(sub._id)}
              className="w-full flex justify-between items-center p-4 text-lg font-semibold bg-[#4c3f2d] text-gray-100 hover:bg-[#4c3f2d] rounded-xl"
            >
              <span>{openSubCategory === sub._id ? "▲" : "▼"}</span>
              {sub.subCategoryName}
            </button>

            {openSubCategory === sub._id && (
              <div className="p-4 space-y-2 rounded-t-xl">
                {dishes[sub._id]?.length > 0 ? (
                  <ul className="pl-0">
                    {dishes[sub._id].map((dish) => (
                      <li
                        key={dish._id}
                        className="py-3 flex justify-between items-center border-b border-gray-300"
                      >
                        <span className="text-left">{dish.price} جنيه</span>
                        <span className="text-right">{dish.dishName}</span>
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
