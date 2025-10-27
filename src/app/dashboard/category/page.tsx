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
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await fetch("/api/category");
      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }
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
    const loadData = () => {
      fetchCategories();
    };
    loadData();
  }, []);

  async function handleDelete(id: string) {
    const result = await new Promise<boolean>((resolve) => {
      toast.custom((t) => (
        <div className="bg-white p-4 rounded shadow-lg flex flex-col gap-3 w-72 mx-auto">
          <span className="font-medium">هل أنت متأكد من الحذف؟</span>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                resolve(true);
                toast.dismiss(t.id);
              }}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              حذف
            </button>
            <button
              onClick={() => {
                resolve(false);
                toast.dismiss(t.id);
              }}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              إلغاء
            </button>
          </div>
        </div>
      ));
    });

    if (!result) return;

    try {
      await fetch(`/api/category?id=${id}`, { method: "DELETE" });
      fetchCategories();
      toast.success("تم الحذف بنجاح", { duration: 2000 });
    } catch {
      toast.error("حدث خطأ أثناء الحذف", { duration: 2000 });
    }
  }

  function handleAdd() {
    setEditingCategory(null);
    setOpen(true);
  }

  function handleEdit(cat: ICategory) {
    setEditingCategory(cat);
    setOpen(true);
  }
  return (
    <div className="p-6 space-y-6 ">
      <div className="bg-white shadow rounded-xl p-4 mt-4">
        <div className="flex justify-between pb-2 max-sm:flex-col">
          <h2 className="text-lg font-bold mb-4 sm:text-xl max-sm:text-center">
            قائمة الأقسام الرئيسية
          </h2>
          <Button
            onClick={handleAdd}
            className="bg-green-600 text-white py-5 hover:bg-green-700  sm:text-base"
          >
            إضافه صنف رئيسي{" "}
          </Button>
        </div>
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
                          onClick={() => handleDelete(cat._id)}
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
    </div>
  );
}
