"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { ICategory } from "@/models/Category";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: {
    name: string;
    categoryId: string;
    image?: string;
    _id?: string;
  };
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
  const [preview, setPreview] = useState<string>(initialData?.image || "");
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else if (initialData?.image) {
      setPreview(initialData.image);
    } else {
      setPreview("");
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !selectedCategory) {
      toast.error("من فضلك املأ جميع الحقول");
      return;
    }

    setLoading(true);

    try {
      let uploadedImageUrl = initialData?.image || "";
      if (image) {
        const formData = new FormData();
        formData.append("file", image);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          toast.error("فشل رفع الصورة إلى Cloudinary");
          return;
        }

        uploadedImageUrl = uploadData.secure_url;
      }
      const formData = new FormData();
      if (image) formData.append("image", image);
      if (initialData?._id) formData.append("id", initialData._id);
      formData.append("subCategoryName", name);
      formData.append("categoryId", selectedCategory);
      if (uploadedImageUrl)
        formData.append("subCategoryImage", uploadedImageUrl);

      const method = initialData?._id ? "PATCH" : "POST";
      const res = await fetch("/api/subcategory", { method, body: formData });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "حدث خطأ أثناء العملية");
        return;
      }

      toast.success("تم الحفظ بنجاح!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء العملية");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white rounded-xl "
    >
      <h2 className="text-lg font-bold text-center">
        {initialData ? "تعديل القسم الفرعي" : "إضافة قسم فرعي"}
      </h2>

      {/* اسم الصنف */}
      <Input
        type="text"
        placeholder="اسم الصنف الفرعي"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
            className="text-center"
          />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {categories.map((cat) => (
            <SelectItem key={cat._id} value={cat._id}>
              {cat.categoryName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div>
        <label className="block mb-1 font-medium">
          صورة الصنف الفرعي (اختياري)
        </label>
        <Input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && (
          <div className="relative w-48 h-36 mt-2 rounded overflow-hidden border">
            <Image
              src={preview}
              alt="معاينة الصورة"
              fill
              className="object-cover"
              unoptimized 
            />
          </div>
        )}
      </div>
      <div className="flex gap-2 justify-between">
        <Button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 max-sm:w-28 sm:w-53 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "جارٍ الحفظ..." : "حفظ"}
        </Button>
        <Button
          type="button"
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 max-sm:w-28 sm:w-53 text-black px-4 py-2 rounded w-full"
        >
          إلغاء
        </Button>
      </div>
    </form>
  );
}
