"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ISubCategory } from "@/models/SubCategory";
import { IDish } from "@/models/Dish";
import Image from "next/image";

export default function CategoryPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("id");
  const categoryName = searchParams.get("name");

  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [dishes, setDishes] = useState<Record<string, IDish[]>>({});
  const [openSubCategory, setOpenSubCategory] = useState<string | null>(null);
  const [loadingSubCategories, setLoadingSubCategories] = useState(true);
  const [loadingDishes, setLoadingDishes] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;
    setLoadingSubCategories(true);
    fetch(`/api/subcategory/${categoryId}`)
      .then((res) => res.json())
      .then((data) => setSubCategories(data))
      .finally(() => setLoadingSubCategories(false));
  }, [categoryId]);

  const toggleSubCategory = async (subCategoryId: string) => {
    if (openSubCategory === subCategoryId) {
      setOpenSubCategory(null);
      return;
    }
    setOpenSubCategory(subCategoryId);

    if (!dishes[subCategoryId]) {
      setLoadingDishes(subCategoryId);
      const res = await fetch(`/api/dishes/${subCategoryId}`);
      const data = await res.json();
      setDishes((prev) => ({ ...prev, [subCategoryId]: data }));
      setLoadingDishes(null);
    }
  };

  return (
    <main className="min-h-screen p-10  bg-[#F1E8DA]">
      <h1 className="text-3xl font-bold mb-6 text-[#674636] text-center">
        {categoryName}
      </h1>

      <div className="space-y-4">
        {loadingSubCategories
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-14 bg-[#613829] rounded-xl animate-pulse"
              ></div>
            ))
          : subCategories.map((sub) => (
              <div
                key={sub._id}
                className="rounded-xl shadow bg-gray-50 overflow-hidden"
              >
                {/* الزر الأساسي لفتح الدروب داون */}
                <button
                  onClick={() => toggleSubCategory(sub._id)}
                  className="w-full flex justify-between items-center p-4 text-lg font-semibold bg-[#6d3f2e] text-[#FFF8E8] hover:bg-[#5f3728] transition"
                >
                  <span className="text-xl">
                    {openSubCategory === sub._id ? "▲" : "▼"}
                  </span>
                  <span>{sub.subCategoryName}</span>
                </button>

                {openSubCategory === sub._id && (
                  <div className="p-4 space-y-3 bg-[#FFF8E8]">
                    {sub.image && (
                      <div className="relative w-full h-48 overflow-hidden rounded-xl">
                        <Image
                          src={sub.image}
                          alt={sub.subCategoryName}
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                    )}

                    {/* الأطباق */}
                    {loadingDishes === sub._id ? (
                      <ul className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <li
                            key={i}
                            className="h-6 bg-[#EBD6C6] rounded animate-pulse"
                          ></li>
                        ))}
                      </ul>
                    ) : dishes[sub._id]?.length > 0 ? (
                      <ul className="space-y-2">
                        {dishes[sub._id].map((dish) => (
                          <li
                            key={dish._id}
                            className="py-3 flex justify-between items-center border-b border-gray-300 text-[#6d3f2e] font-semibold"
                          >
                            <span className="text-right">{dish.dishName}</span>
                            <span className="text-left">{dish.price} جنيه</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-center">
                        لا يوجد أطباق حالياً
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
      </div>
    </main>
  );
}
