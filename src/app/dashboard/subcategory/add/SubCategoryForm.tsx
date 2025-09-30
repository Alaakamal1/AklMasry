"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { ICategory } from "@/models/Category";
import { toast } from "react-hot-toast"; // إذا حابة تستعملي toast

type Props = {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: { name: string; categoryId: string; _id?: string };
  categories: ICategory[];
};

export default function SubCategoryForm({
  onClose,
  onSuccess,
  initialData,
  categories,
}: Props) {
  const [name, setName] = useState(initialData?.name || "");
  const [selectedCategory, setSelectedCategory] = useState(
    initialData?.categoryId || ""
  );
  const [loading, setLoading] = useState(false);
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  if (!name || !selectedCategory) {
    toast.error("من فضلك املأ جميع الحقول");
    return;
  }

  const payload = { subCategoryName: name, categoryId: selectedCategory };
  setLoading(true);

  try {
    if (initialData?._id) {
      // تعديل
      await fetch(`/api/subcategory?id=${initialData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      toast.success("تم تعديل الصنف الفرعي بنجاح");
    } else {
      // إضافة
      await fetch("/api/subcategory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      toast.success("تم إضافة الصنف الفرعي بنجاح");
    }

    onSuccess();
    onClose();
  } catch (err) {
    toast.error("حدث خطأ أثناء العملية");
  } finally {
    setLoading(false);
  }
}

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-xl shadow">
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="اسم الصنف الفرعي"
        className="border p-2 w-full rounded"
      />

      {/* اختيار القسم الرئيسي */}
      <Select
        onValueChange={setSelectedCategory}
        value={selectedCategory}
        disabled={categories.length === 0}
      >
        <SelectTrigger>
          <SelectValue placeholder="اختر القسم الرئيسي" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {categories.map((cat) => (
            <SelectItem key={cat._id} value={cat._id}>
              {cat.categoryName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          حفظ
        </Button>
        <Button
          type="button"
          onClick={onClose}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          إلغاء
        </Button>
      </div>
    </form>
  );
}
