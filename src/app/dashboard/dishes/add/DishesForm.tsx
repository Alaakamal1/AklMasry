"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICategory } from "@/models/Category";
import { ISubCategory } from "@/models/SubCategory";
import { IDish } from "@/models/Dish";
import { Button } from "@/components/ui/button";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: IDish | null; // ✨ دعم التعديل
};

export default function DishForm({ onClose, onSuccess, initialData }: Props) {
  const [dishName, setDishName] = useState(initialData?.dishName || "");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    initialData?.subCategoryId?.toString() || ""
  );

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("/api/category");
      const data = await res.json();
      setCategories(data);
    }
    fetchCategories();
  }, []);
  useEffect(() => {
    if (!selectedCategory && !initialData?.subCategoryId) return;

    const categoryToFetch =
      selectedCategory || initialData?.subCategoryId?.toString();

    async function fetchSubs() {
      const res = await fetch(`/api/subcategory/${categoryToFetch}`);
      const data = await res.json();
      setSubCategories(data);
    }
    fetchSubs();
  }, [selectedCategory, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      dishName,
      price: Number(price),
      subCategoryId: selectedSubCategory,
    };

    const url = "/api/dishes";
    const method = initialData ? "PUT" : "POST";
    const body = initialData
      ? JSON.stringify({ id: initialData._id, ...payload })
      : JSON.stringify(payload);

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body,
    });

    toast.success(initialData ? "تم تعديل الطبق" : "تم إضافة الطبق");
    onSuccess();
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white rounded-xl shadow"
    >
      <h1 className="text-lg font-bold">
        {initialData ? "تعديل الطبق" : "إضافة طبق جديد"}
      </h1>

      <Input
        type="text"
        placeholder="اسم الطبق"
        value={dishName}
        onChange={(e) => setDishName(e.target.value)}
      />
      <Input
        type="text" // بدل number
        placeholder="السعر"
        value={price}
        onChange={(e) => {
          const value = e.target.value;
          // السماح بالأرقام فقط
          if (/^\d*$/.test(value)) {
            setPrice(value);
          }
        }}
      />

      <Select

        onValueChange={(val) => setSelectedCategory(val)}
        value={selectedCategory}
      >
        <SelectTrigger className="w-full">
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

      {/* Dropdown SubCategory */}
      <Select
        onValueChange={(val) => setSelectedSubCategory(val)}
        value={selectedSubCategory}
        disabled={!selectedCategory && !initialData?.subCategoryId}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="اختر القسم الفرعي" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {subCategories.map((sub) => (
            <SelectItem key={sub._id} value={sub._id}>
              {sub.subCategoryName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-5">
        <Button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {initialData ? "حفظ التعديلات" : "حفظ"}
        </Button>
        <Button
          type="button"
          onClick={onClose}
          className="border text-red-600 px-4 py-2 rounded"
        >
          إلغاء
        </Button>
      </div>
    </form>
  );
}
