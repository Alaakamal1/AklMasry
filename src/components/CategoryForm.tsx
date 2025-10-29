"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ICategory } from "@/models/Category";

interface CategoryFormProps {
  initialData?: ICategory | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CategoryForm({
  initialData,
  onClose,
  onSuccess,
}: CategoryFormProps) {
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    setCategoryName(initialData?.categoryName || "");
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.error("من فضلك أدخل اسم القسم");
      return;
    }

    try {
      const method = initialData ? "PATCH" : "POST";
      const id = initialData?._id;
      const res = await fetch( "/api/category",
        {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({id, categoryName }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error ?? "حدث خطأ");
      }

      setCategoryName("");
      onSuccess();
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("خطأ: " + error.message);
      } else {
        toast.error("حدث خطأ غير معروف");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold">
        {initialData ? "تعديل القسم" : "إضافة قسم جديد"}
      </h2>

      <Input
        type="text"
        placeholder="اسم القسم"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        className="w-full border p-2 rounded-lg"
      />

      <div className="flex gap-2">
        <Button
          type="submit"
          className="bg-green-600 text-white sm:w-55 max-sm:w-27 lg:w-57 px-4 py-2 rounded"
        >
          حفظ
        </Button>
        <Button
          type="button"
          onClick={onClose}
          className="bg-gray-300 text-black sm:w-55 max-sm:w-27 lg:w-57 px-4 py-2 rounded"
        >
          إلغاء
        </Button>
      </div>
    </form>
  );
}
