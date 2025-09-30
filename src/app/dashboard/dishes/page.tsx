
"use client";
import { useEffect, useState } from "react";
import DishForm from "./add/DishesForm";
import { IDish } from "@/models/Dish";
import { Button } from "@/components/ui/button";

export default function DishesPage() {
  const [dishes, setDishes] = useState<IDish[]>([]);
  const [editingDish, setEditingDish] = useState<IDish | null>(null);
  const [isOpen, setIsOpen] = useState(false); // ✨ حالة المودال

  // ✅ جلب الأطباق
  async function fetchDishes() {
    const res = await fetch("/api/dishes");
    const data = await res.json();
    setDishes(data);
  }

  useEffect(() => {
    fetchDishes();
  }, []);

  // ✅ حذف طبق
  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    await fetch(`/api/dishes?id=${id}`, { method: "DELETE" });
    fetchDishes();
  }

  // ✅ فتح المودال للإضافة
  function handleAdd() {
    setEditingDish(null); // إضافة جديدة
    setIsOpen(true);
  }

  // ✅ فتح المودال للتعديل
  function handleEdit(dish: IDish) {
    setEditingDish(dish);
    setIsOpen(true);
  }

  return (
    <div className="p-6 space-y-6 relative">
      <div className="bg-white shadow rounded-xl p-4 mt-4">
        <div className="flex justify-between">
          <h2 className="text-lg font-bold mb-4">قائمة الأطباق</h2>

          <Button
            onClick={handleAdd}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
             إضافة طبق
          </Button>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-50">
              <th className="p-2 border">الاسم</th>
              <th className="p-2 border">السعر</th>
              <th className="p-2 border">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {dishes.map((dish) => (
              <tr key={dish._id} className="hover:bg-gray-50">
                <td className="p-2 border">{dish.dishName}</td>
                <td className="p-2 border">{dish.price} ج.م</td>
                <td className="p-2 border flex gap-2 justify-center">
                  <Button
                    onClick={() => handleEdit(dish)}
                    className="bg-green-600 text-white px-4 py-1 rounded"
                  >
                    تعديل
                  </Button>
                  <Button
                    onClick={() => handleDelete(dish._id)}
                    className="border text-red-600  px-4 py-1 rounded"
                  >
                    حذف
                  </Button>
                </td>
              </tr>
            ))}
            {dishes.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  لا توجد أطباق مضافة بعد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* المودال */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
            {/* زر إغلاق */}
            <Button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </Button>

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
