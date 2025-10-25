"use client";

import { useEffect, useState, useMemo } from "react";
import DishForm from "../../../components/DishForm";
import { IDish } from "@/models/Dish";
import { ICategory } from "@/models/Category";
import { ISubCategory } from "@/models/SubCategory";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function DishesPage() {
  const [dishes, setDishes] = useState<IDish[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subcategories, setSubcategories] = useState<ISubCategory[]>([]);
  const [editingDish, setEditingDish] = useState<IDish | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSub, setSelectedSub] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: string | null;
  }>({
    open: false,
    id: null,
  });

  // ============================ FETCH DATA ============================
  async function fetchDishes() {
    const res = await fetch("/api/dishes");
    const data: IDish[] = await res.json();
    setDishes(data);
  }

  async function fetchCategories() {
    const res = await fetch("/api/category");
    const data: ICategory[] = await res.json();
    setCategories(data);
  }

  async function fetchSubcategories() {
    const res = await fetch("/api/subcategory");
    const data: ISubCategory[] = await res.json();
    setSubcategories(data);
  }

  useEffect(() => {
    fetchDishes();
    fetchCategories();
    fetchSubcategories();
  }, []);

  // ============================ DELETE CONFIRMATION ============================
  function handleDeleteClick(id: string) {
    setDeleteModal({ open: true, id });
  }

  async function confirmDelete() {
    if (!deleteModal.id) return;

    await fetch(`/api/dishes?id=${deleteModal.id}`, { method: "DELETE" });
    await fetchDishes();
    setDeleteModal({ open: false, id: null });
    toast.success("تم الحذف بنجاح");
  }

  // ============================ ADD / EDIT ============================
  function handleAdd() {
    setEditingDish(null);
    setIsOpen(true);
  }

  function handleEdit(dish: IDish) {
    setEditingDish(dish);
    setIsOpen(true);
  }

  // ============================ FILTER ============================
  const filteredSubcategories = useMemo(() => {
    if (selectedCategory === "all") return subcategories;
    return subcategories.filter((sub) => {
      if (typeof sub.categoryId === "string") {
        return sub.categoryId === selectedCategory;
      }
      if (
        sub.categoryId &&
        typeof sub.categoryId === "object" &&
        "_id" in sub.categoryId
      ) {
        return (
          (sub.categoryId as { _id: string })._id?.toString() ===
          selectedCategory
        );
      }
      return false;
    });
  }, [subcategories, selectedCategory]);

  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      const matchesCategory =
        selectedCategory === "all" ||
        (typeof dish.subCategoryId === "object" &&
          dish.subCategoryId !== null &&
          "categoryId" in dish.subCategoryId &&
          typeof dish.subCategoryId.categoryId === "object" &&
          dish.subCategoryId.categoryId !== null &&
          "_id" in dish.subCategoryId.categoryId &&
          (dish.subCategoryId.categoryId as { _id: string })._id?.toString() ===
            selectedCategory);

      const matchesSub =
        selectedSub === "all" ||
        (typeof dish.subCategoryId === "object" &&
          dish.subCategoryId?._id?.toString() === selectedSub);

      const matchesSearch = dish.dishName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSub && matchesSearch;
    });
  }, [dishes, selectedCategory, selectedSub, searchTerm]);

  // ============================ RENDER ============================
  return (
    <div className="p-3 sm:p-6 relative">
      <Toaster position="top-center" />
      <div className="bg-white rounded-2xl shadow p-4 sm:p-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
          <h1 className="text-lg sm:text-xl font-bold text-center lg:text-left">
            قائمة الأطباق
          </h1>

          <div className="flex flex-col md:flex-row gap-5  max-lg:w-full items-stretch md:items-center">
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                setSelectedCategory(value);
                setSelectedSub("all");
              }}
            >
              <SelectTrigger className="border rounded-lg px-2 py-2 text-sm sm:text-base w-full md:w-48 flex justify-between items-center">
                <SelectValue placeholder="كل الأقسام" />
              </SelectTrigger>
              <SelectContent className="bg-white" >
                <SelectItem value="all">كل الأقسام</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedSub}
              onValueChange={(value) => setSelectedSub(value)}
            >
              <SelectTrigger className="border rounded-lg px-2 py-2 text-sm sm:text-base w-full md:w-48 flex justify-between items-center">
                <SelectValue placeholder="كل الأصناف" />
              </SelectTrigger>
              <SelectContent className="bg-white" >
                <SelectItem value="all">كل الأصناف</SelectItem>
                {filteredSubcategories.map((sub) => (
                  <SelectItem key={sub._id} value={sub._id}>
                    {sub.subCategoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="ابحث عن طبق..."
              className="border rounded-lg px-3 py-2 text-sm sm:text-base w-full md:w-60"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              onClick={handleAdd}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition sm:text-base w-full md:w-auto"
            >
              إضافة طبق
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="bg-green-50 text-gray-700">
                <th className="p-3 border">الاسم</th>
                <th className="p-3 border">السعر</th>
                <th className="p-3 border">القسم</th>
                <th className="p-3 border">الصنف</th>
                <th className="p-3 border">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredDishes.map((dish) => (
                <tr key={dish._id} className="hover:bg-gray-50">
                  <td className="p-3 border text-center">{dish.dishName}</td>
                  <td className="p-3 border text-center">{dish.price} ج.م</td>
                  <td className="p-3 border text-center">
                    {typeof dish.subCategoryId === "object" &&
                    dish.subCategoryId &&
                    "categoryId" in dish.subCategoryId &&
                    typeof dish.subCategoryId.categoryId === "object" &&
                    dish.subCategoryId.categoryId &&
                    "categoryName" in dish.subCategoryId.categoryId
                      ? (dish.subCategoryId.categoryId as ICategory)
                          .categoryName
                      : ""}
                  </td>
                  <td className="p-3 border text-center">
                    {typeof dish.subCategoryId === "object" &&
                    dish.subCategoryId &&
                    "subCategoryName" in dish.subCategoryId
                      ? (dish.subCategoryId as ISubCategory).subCategoryName
                      : ""}
                  </td>

                  <td className="p-3 border text-center">
                    <div className="flex flex-col md:flex-row justify-center gap-2">
                      <Button
                        onClick={() => handleEdit(dish)}
                        className="bg-green-600 text-white px-3 py-1 rounded w-full md:w-auto"
                      >
                        تعديل
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(dish._id)}
                        className="border text-red-600 px-3 py-1 rounded w-full md:w-auto"
                      >
                        حذف
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDishes.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-4 text-center text-gray-500 text-sm"
                  >
                    لا توجد أطباق
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {deleteModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm text-center animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              هل أنت متأكد أنك تريد حذف هذا الطبق؟
            </h2>
            <div className="flex justify-center gap-3">
              <Button
                onClick={confirmDelete}
                className="text-red-600 border hover:bg-red-50 px-4 py-2 rounded-md"
              >
                حذف
              </Button>
              <Button
                onClick={() => setDeleteModal({ open: false, id: null })}
                className="bg-gray-200  hover:bg-gray-300 px-4 py-2 rounded-md"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Add/Edit Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-2 sm:p-0">
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-full max-w-lg relative">
            <DishForm
              initialData={editingDish}
              onClose={() => setIsOpen(false)}
              onSuccess={() => {
                fetchDishes();
                setIsOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
