"use client";
import { useEffect, useState } from "react";
import CategoryForm from "./add/page";
import { ICategory } from "@/models/Category";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface ICategoryWithCount extends ICategory {
  dishesCount?: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ICategoryWithCount[]>([]);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);

  // ✅ تحميل الأقسام الرئيسية مع عدد الأطباق
  async function fetchCategories() {
    const res = await fetch("/api/category");
    const data: ICategory[] = await res.json();

    const categoriesWithCount = await Promise.all(
      data.map(async (cat) => {
        const dishesRes = await fetch(`/api/subcategory?categoryId=${cat._id}`);
        const dishes = await dishesRes.json();
        return { ...cat, dishesCount: dishes.length };
      })
    );

    setCategories(categoriesWithCount);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ حذف قسم مع toast confirmation
  async function handleDelete(id: string) {
    const result = await new Promise<boolean>((resolve) => {
      toast.custom((t) => (
        <div className="bg-white p-4 rounded shadow-lg flex flex-col gap-3 w-72 mx-auto">
          <span className="font-medium">هل أنت متأكد من الحذف؟</span>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => { resolve(true); toast.dismiss(t.id); }}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              حذف
            </button>
            <button
              onClick={() => { resolve(false); toast.dismiss(t.id); }}
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
      
      {/* الجدول */}
      <div className="bg-white shadow rounded-xl p-4 mt-4">
        <div className="flex justify-between pb-2">
          <h2 className="text-lg font-bold mb-4">قائمة الأقسام الرئيسية</h2>
          <Button
            onClick={handleAdd}
            className="bg-green-600 text-white py-5 hover:bg-green-700"
          >
            إضافة صنف جديد 
          </Button>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-50">
              <th className="p-2 border">الاسم</th>
              <th className="p-2 border">عدد الأطباق</th>
              <th className="p-2 border">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="hover:bg-gray-50">
                <td className="p-2 border">{cat.categoryName}</td>
                <td className="p-2 border text-center">{cat.dishesCount ?? 0}</td>
                <td className="p-2 border flex gap-2 justify-center">
                  <Button
                    onClick={() => handleEdit(cat)}
                    className="border bg-green-600 text-white px-3 py-1 rounded"
                  >
                    تعديل
                  </Button>
                  <Button
                    onClick={() => handleDelete(cat._id)}
                    className="border text-red-600 px-3 py-1 rounded"
                  >
                    حذف
                  </Button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  لا توجد أقسام مضافة بعد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* المودال */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>

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
