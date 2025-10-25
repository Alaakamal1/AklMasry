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
import { toast } from "react-hot-toast";
import Image from "next/image";

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
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !selectedCategory) {
      toast.error("من فضلك املأ جميع الحقول");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      if (initialData?._id) formData.append("id", initialData._id);
      formData.append("subCategoryName", name);
      formData.append("categoryId", selectedCategory);
      if (image) formData.append("subCategoryImage", image);

      const method = initialData?._id ? "PATCH" : "POST";
      const res = await fetch("/api/subcategory", { method, body: formData });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "حدث خطأ أثناء العملية");
        return;
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast.error("حدث خطأ أثناء العملية");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-2 bg-white rounded-xl "
    >
      <h2 className="text-lg font-bold">
        {initialData ? " تعديل القسم الفرعي" : "إضافة قسم فرعي"}
      </h2>
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="اسم الصنف الفرعي"
        className="border p-2 w-full rounded"
      />

      <Select
        onValueChange={setSelectedCategory}
        value={selectedCategory}
        disabled={categories.length === 0}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder="اختر القسم الرئيسي"
            className="text-center "
          />
        </SelectTrigger>
        <SelectContent className="bg-white ">
          {categories.map((cat) => (
            <SelectItem key={cat._id} value={cat._id}>
              {cat.categoryName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div>
        <label className="block mb-1">صورة الصنف الفرعي (اختياري)</label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setImage(file);
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => setPreview(reader.result as string);
              reader.readAsDataURL(file);
            } else {
              setPreview("");
            }
          }}
        />
        {preview && (
          <Image
            src={preview}
            alt="معاينة الصورة"
            className="mt-2 max-h-32 rounded"
            width={200}
            height={150}
          />
        )}
      </div>

      <div className="flex gap-2 justify-between">
        <Button
          type="submit"
          className="bg-green-600 text-white sm:w-55 px-4 py-2  max-sm:w-37  rounded"
          disabled={loading}
        >
          حفظ
        </Button>
        <Button
          type="button"
          onClick={onClose}
          className="bg-gray-300 px-4 py-2 sm:w-55  max-sm:w-37  rounded"
        >
          إلغاء
        </Button>
      </div>
    </form>
  );
}
