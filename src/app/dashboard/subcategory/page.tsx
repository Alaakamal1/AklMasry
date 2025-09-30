"use client";
import { useEffect, useState } from "react";
import SubCategoryForm from "./add/SubCategoryForm";
import { Button } from "@/components/ui/button";
import { ISubCategory } from "@/models/SubCategory";
import { ICategory } from "@/models/Category";
import toast from "react-hot-toast";

export default function SubcategoryPage() {
  const [subcategories, setSubcategories] = useState<ISubCategory[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [open, setOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<ISubCategory | null>(null);

  async function fetchSubcategories() {
    const res = await fetch("/api/subcategory");
    const data = await res.json();
    setSubcategories(data);
  }

  async function fetchCategories() {
    const res = await fetch("/api/category");
    const data = await res.json();
    setCategories(data);
  }

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  async function handleDelete(sub: ISubCategory) {
    toast(
      (t) => (
        <div className="bg-white p-4 rounded shadow-md flex flex-col gap-3">
          <span>هل أنت متأكد من الحذف؟</span>
          <div className="flex gap-2 justify-end">
            <Button
              onClick={async () => {
                await fetch(`/api/subcategory`, {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id: sub._id }),
                });
                fetchSubcategories();
                toast.dismiss(t.id);
                toast.success("تم الحذف بنجاح");
              }}
              className="text-red-600 border px-3 py-1 rounded"
            >
              حذف
            </Button>
            <Button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              إلغاء
            </Button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">الأصناف الفرعية</h1>
        <Button
          onClick={() => {
            setEditingSub(null);
            setOpen(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          إضافة
        </Button>
      </div>

      <table className="w-full border-collapse bg-white shadow rounded-xl">
        <thead>
          <tr className="bg-green-100">
            <th className="p-2 border">الصنف الفرعي</th>
            <th className="p-2 border">القسم الرئيسي</th>
            <th className="p-2 border">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {subcategories.map((sub) => (
            <tr key={sub._id} className="hover:bg-gray-50">
              <td className="p-2 border">{sub.subCategoryName}</td>
              <td className="p-2 border">{sub.categoryId?.categoryName}</td>
              <td className="p-2 border flex gap-2 justify-center">
                <Button
                  onClick={() => {
                    setEditingSub(sub);
                    setOpen(true);
                  }}
                  className="bg-green-600 text-white px-4 py-1 rounded"
                >
                  تعديل
                </Button>
                <Button
                  onClick={() => handleDelete(sub)}
                  className="text-red-600 border px-4 py-1 rounded"
                >
                  حذف
                </Button>
              </td>
            </tr>
          ))}
          {subcategories.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-center text-gray-500">
                لا توجد أصناف فرعية
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* البوباب */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>

            <SubCategoryForm
              initialData={
                editingSub
                  ? {
                      name: editingSub.subCategoryName,
                      categoryId: editingSub.categoryId?._id,
                      _id: editingSub._id,
                    }
                  : undefined
              }
              categories={categories}
              onClose={() => setOpen(false)}
              onSuccess={() => {
                fetchSubcategories();
                setOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
