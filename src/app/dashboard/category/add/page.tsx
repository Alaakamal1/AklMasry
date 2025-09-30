"use client";
import { useState, useEffect } from "react";
import { ICategory } from "@/models/Category";
import toast from "react-hot-toast";

type Props = {
  initialData?: ICategory | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CategoryForm({ initialData, onClose, onSuccess }: Props) {
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (initialData) setCategoryName(initialData.categoryName);
    else setCategoryName("");
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return toast.error("من فضلك أدخل اسم القسم");

    try {
      const method = initialData ? "PUT" : "POST";
      const id = initialData?._id;

      const res = await fetch(initialData ? `/api/category?id=${id}` : "/api/category", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryName }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "حدث خطأ");
      }

      toast.success(initialData ? "تم تعديل القسم بنجاح" : "تم إضافة القسم بنجاح");
      setCategoryName("");
      onSuccess();
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("❌ خطأ: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold">
        {initialData ? "تعديل القسم" : "إضافة قسم جديد"}
      </h2>

      <input
        type="text"
        placeholder="اسم القسم"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        className="w-full border p-2 rounded-lg"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          حفظ
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}
