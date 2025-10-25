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
import { Button } from "@/components/ui/button";
import { ICategory } from "@/models/Category";
import { ISubCategory } from "@/models/SubCategory";
import { IDish } from "@/models/Dish";

interface DishFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: IDish | null;
}

export default function DishForm({ onClose, onSuccess, initialData }: DishFormProps) {
  const [dishName, setDishName] = useState<string>(initialData?.dishName ?? "");
  const [price, setPrice] = useState<string>(initialData?.price?.toString() ?? "");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(
    typeof initialData?.subCategoryId === "string"
      ? initialData.subCategoryId
      : initialData?.subCategoryId?._id ?? ""
  );
  const [loadingSubs, setLoadingSubs] = useState<boolean>(false);

  // جلب الأقسام الرئيسية
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category");
        if (!res.ok) throw new Error("خطأ أثناء جلب الأقسام");
        const data: ICategory[] = await res.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
        toast.error("تعذر تحميل الأقسام الرئيسية");
      }
    };
    fetchCategories();
  }, []);

  // تعبئة القسم الرئيسي عند التعديل
  useEffect(() => {
    if (!categories.length || !initialData?.subCategoryId) return;

    const subCat = initialData.subCategoryId;
    if (typeof subCat !== "string" && subCat?.categoryId) {
      const catId = typeof subCat.categoryId === "object" ? subCat.categoryId?._id : subCat.categoryId;
      if (catId) setSelectedCategory(catId.toString());
    }
  }, [categories, initialData]);

  // جلب الأقسام الفرعية عند اختيار قسم رئيسي
  useEffect(() => {
    const categoryToFetch =
      selectedCategory ||
      (initialData?.subCategoryId && typeof initialData.subCategoryId !== "string"
        ? initialData.subCategoryId.categoryId
          ? typeof initialData.subCategoryId.categoryId === "object"
            ? initialData.subCategoryId.categoryId._id
            : initialData.subCategoryId.categoryId
          : null
        : null);

    if (!categoryToFetch) return;

    const fetchSubs = async () => {
      setLoadingSubs(true);
      try {
        const res = await fetch(`/api/subcategory/${categoryToFetch}`);
        if (!res.ok) throw new Error("خطأ أثناء جلب الأقسام الفرعية");
        const data: ISubCategory[] = await res.json();
        setSubCategories(data);

        // تعبئة القسم الفرعي تلقائياً عند التعديل
        if (initialData?.subCategoryId && !selectedSubCategory) {
          setSelectedSubCategory(
            typeof initialData.subCategoryId === "object"
              ? initialData.subCategoryId._id
              : initialData.subCategoryId
          );
        }
      } catch (error) {
        console.error(error);
        toast.error("تعذر تحميل الأقسام الفرعية");
        setSubCategories([]);
      } finally {
        setLoadingSubs(false);
      }
    };

    fetchSubs();
  }, [selectedCategory, initialData, selectedSubCategory]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      dishName,
      price: Number(price),
      subCategoryId: selectedSubCategory,
    };

    try {
      const res = await fetch("/api/dishes", {
        method: initialData ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: initialData
          ? JSON.stringify({ id: initialData._id, ...payload })
          : JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "حدث خطأ أثناء الحفظ");
        return;
      }

      toast.success(initialData ? "تم تعديل الطبق" : "تم إضافة الطبق");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("تعذر الاتصال بالسيرفر");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-xl">
      <h1 className="text-lg font-bold text-gray-800">
        {initialData ? "تعديل الطبق" : "إضافة طبق جديد"}
      </h1>

      <Input
        type="text"
        placeholder="اسم الطبق"
        value={dishName}
        onChange={(e) => setDishName(e.target.value)}
        required
      />

      <Input
        type="text"
        placeholder="السعر"
        value={price}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value)) setPrice(value);
        }}
        required
      />

      <Select
        onValueChange={(val) => {
          setSelectedCategory(val);
          setSubCategories([]);
          setSelectedSubCategory("");
        }}
        value={selectedCategory}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="اختر القسم الرئيسي" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <SelectItem key={cat._id} value={cat._id}>
                {cat.categoryName}
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-gray-400">جاري التحميل...</div>
          )}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(val) => setSelectedSubCategory(val)}
        value={selectedSubCategory}
        disabled={!selectedCategory && !initialData?.subCategoryId}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="اختر القسم الفرعي" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {loadingSubs ? (
            <div className="p-2 text-gray-400">جاري التحميل...</div>
          ) : subCategories.length > 0 ? (
            subCategories.map((sub) => (
              <SelectItem key={sub._id} value={sub._id}>
                {sub.subCategoryName}
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-gray-400">لا توجد أقسام فرعية</div>
          )}
        </SelectContent>
      </Select>

      <div className="flex gap-5">
        <Button type="submit" className="bg-green-600 text-white px-4 py-2 max-sm:w-1/3 md:w-52 rounded">
          {initialData ? "حفظ التعديلات" : "حفظ"}
        </Button>
        <Button type="button" onClick={onClose} className="bg-gray-300 md:w-52 max-sm:w-1/3 px-4 py-2 rounded">
          إلغاء
        </Button>
      </div>
    </form>
  );
}
