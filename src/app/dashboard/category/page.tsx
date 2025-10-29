"use client";

import { useEffect, useState } from "react";
import CategoryForm from "../../../components/CategoryForm";
import { ICategory } from "@/models/Category";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface ICategoryWithCount extends ICategory {
  subCount?: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ICategoryWithCount[]>([]);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // 🔹 تحميل البيانات
  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await fetch("/api/category");
      if (!res.ok) throw new Error("Failed to fetch categories");

      const data = await res.json();
      const categoriesWithCount = data.map((cat: ICategoryWithCount) => ({
        ...cat,
        createdAt: new Date(cat.createdAt),
        updatedAt: new Date(cat.updatedAt),
      }));

      setCategories(categoriesWithCount);
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error("حدث خطأ أثناء تحميل الأقسام", { duration: 2000 });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  // 🔹 حذف القسم
  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/category`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("تم الحذف بنجاح", { duration: 2000 });
      fetchCategories();
    } catch {
      toast.error("حدث خطأ أثناء الحذف", { duration: 2000 });
    }
  }

  // 🔹 فتح نموذج الإضافة
  function handleAdd() {
    setEditingCategory(null);
    setOpen(true);
  }

  // 🔹 فتح نموذج التعديل
  function handleEdit(cat: ICategory) {
    setEditingCategory(cat);
    setOpen(true);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white shadow rounded-xl p-4 mt-4">
        <div className="flex justify-between pb-2 max-sm:flex-col">
          <h2 className="text-lg font-bold mb-4 sm:text-xl max-sm:text-center">
            قائمة الأقسام الرئيسية
          </h2>
          <Button
            onClick={handleAdd}
            className="bg-green-600 text-white py-5 hover:bg-green-700 sm:text-base"
          >
            إضافة صنف رئيسي
          </Button>
        </div>

        {/* جدول الأقسام */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-50">
              <th className="p-2 border">الاسم</th>
              <th className="p-2 border">عدد الأصناف الفرعية</th>
              <th className="p-2 border">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td className="p-2 border text-center">
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mx-auto sm:w-1/2"></div>
                    </td>
                    <td className="p-2 border text-center">
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3 mx-auto"></div>
                    </td>
                    <td className="p-2 border text-center">
                      <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                        <div className="h-8 w-24 sm:w-20 bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-8 w-24 sm:w-20 bg-gray-200 animate-pulse rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))
              : categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-gray-50 text-center">
                    <td className="p-2 border text-sm sm:text-base">
                      {cat.categoryName}
                    </td>
                    <td className="p-2 border text-sm sm:text-base">
                      {cat.subCount ?? 0}
                    </td>
                    <td className="p-3 border">
                      <div className="flex flex-col sm:flex-row justify-center gap-2">
                        <Button
                          onClick={() => handleEdit(cat)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded w-full sm:w-auto"
                        >
                          تعديل
                        </Button>
                        <Button
                          onClick={() => {
                            setDeleteId(cat._id);
                            setShowConfirm(true);
                          }}
                          className="border text-red-600 px-3 py-1 rounded w-full sm:w-auto"
                        >
                          حذف
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            {!loading && categories.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  لا توجد أقسام مضافة بعد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 نموذج الإضافة / التعديل */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
            <CategoryForm
              initialData={editingCategory}
              onClose={() => setOpen(false)}
              onSuccess={() => {
                fetchCategories();
                setOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* 🔹 بوباب تأكيد الحذف */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 transition-all duration-200">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center animate-fadeIn">
            <h3 className="text-lg font-semibold mb-4">هل أنت متأكد من الحذف؟</h3>
            <p className="text-gray-600 mb-6">لن يمكنك التراجع بعد الحذف.</p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={async () => {
                  if (deleteId) {
                    await handleDelete(deleteId);
                    setShowConfirm(false);
                    setDeleteId(null);
                  }
                }}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                حذف
              </Button>
              <Button
                onClick={() => {
                  setShowConfirm(false);
                  setDeleteId(null);
                }}
                className="bg-gray-300 text-black hover:bg-gray-400"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
