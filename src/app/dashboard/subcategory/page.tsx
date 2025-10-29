"use client";

import { JSX, useEffect, useState } from "react";
import SubCategoryForm from "../../../components/SubCategoryForm";
import { Button } from "@/components/ui/button";
import { ISubCategory } from "@/models/SubCategory";
import { ICategory } from "@/models/Category";
import  { Toaster } from "react-hot-toast";
import { Select, SelectTrigger } from "@radix-ui/react-select";
import { SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
interface ConfirmDialogState {
  open: boolean;
  target: ISubCategory | null;
}
export default function SubcategoryPage(): JSX.Element {
  const [subcategories, setSubcategories] = useState<ISubCategory[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [editingSub, setEditingSub] = useState<ISubCategory | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    target: null,
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  async function fetchSubcategories(): Promise<void> {
    const res = await fetch("/api/subcategory");
    const data = await res.json();
    setSubcategories(data);
  }
  async function fetchCategories(): Promise<void> {
    const res = await fetch("/api/category");
    const data = await res.json();
    setCategories(data);
  }
  useEffect(() => {
    const loadData= async () =>{
    await fetchSubcategories();
    await fetchCategories();
    }
    loadData();
  }, []);
  async function handleConfirmDelete(): Promise<void> {
    if (!confirmDialog.target) return;
    await fetch(`/api/subcategory`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: confirmDialog.target._id }),
    });
    await fetchSubcategories();
    setConfirmDialog({ open: false, target: null });
  }

  const filteredSubs = subcategories.filter((sub) => {
    const matchesCategory =
      selectedCategory === "all" ||
      String(sub.categoryId?._id) === selectedCategory;
    const matchesSearch = sub.subCategoryName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-2 sm:p-6 relative">
      <Toaster position="top-center" />

      <div className="bg-white rounded-2xl shadow p-3 sm:p-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
          <h1 className="text-lg sm:text-xl font-bold text-center md:text-left">
            الأصناف الفرعية
          </h1>
          <div className="flex flex-col md:flex-row gap-5  max-lg:w-full items-stretch md:items-center">
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value)}
            >
              <SelectTrigger className="border rounded-lg px-2 py-2 text-sm sm:text-base w-full md:w-48 flex justify-between items-center">
                <SelectValue placeholder="كل الأقسام" />
                <ChevronDown className="w-4 h-4 opacity-70" />
              </SelectTrigger>

              <SelectContent className="bg-white">
                <SelectItem value="all">كل الأقسام</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="ابحث عن صنف..."
              className="border rounded-lg px-2 py-2 text-sm sm:text-base w-full  md:w-48"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              setEditingSub(null);
              setOpenForm(true);
            }}
            className="bg-green-600 text-white px-4 py-2 sm:py-3 rounded-lg hover:bg-green-700 transition w-full md:w-auto text-sm md:text-base"
          >
            إضافة صنف فرعي
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="bg-green-50">
                <th className="p-2 border text-nowrap">الصنف الفرعي</th>
                <th className="p-2 border text-nowrap">القسم الرئيسي</th>
                <th className="p-2 border text-nowrap">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubs.map((sub) => (
                <tr key={sub._id} className="hover:bg-gray-50 text-center">
                  <td className="p-2 border">{sub.subCategoryName}</td>
                  <td className="p-2 border">
                    {sub.categoryId &&
                    typeof sub.categoryId === "object" &&
                    "categoryName" in sub.categoryId
                      ? (sub.categoryId as unknown as ICategory).categoryName
                      : categories.find(
                          (cat) => cat._id === String(sub.categoryId)
                        )?.categoryName || "غير معروف"}
                  </td>
                  <td className="p-2 border">
                    <div className="flex flex-col sm:flex-row justify-center gap-2">
                      <Button
                        onClick={() => {
                          setEditingSub(sub);
                          setOpenForm(true);
                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded sm:w-auto"
                      >
                        تعديل
                      </Button>
                      <Button
                        onClick={() =>
                          setConfirmDialog({ open: true, target: sub })
                        }
                        className="border border-red-500 text-red-600 hover:bg-red-50 px-3 py-1 rounded sm:w-auto"
                      >
                        حذف
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSubs.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    لا توجد أصناف فرعية
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {openForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-3">
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-full max-w-lg relative">
            <SubCategoryForm
              initialData={
                editingSub
                  ? {
                      name: editingSub.subCategoryName,
                      categoryId: editingSub.categoryId?._id
                        ? String(editingSub.categoryId._id)
                        : "",
                      _id: editingSub._id,
                    }
                  : undefined
              }
              categories={categories}
              onClose={() => setOpenForm(false)}
              onSuccess={() => {
                fetchSubcategories();
                setOpenForm(false);
              }}
            />
          </div>
        </div>
      )}
      {confirmDialog.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-3">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              هل أنت متأكد أنك تريد حذف هذا الصنف؟
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
              <Button
                onClick={handleConfirmDelete}
                className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded"
              >
                حذف
              </Button>
              <Button
                onClick={() => setConfirmDialog({ open: false, target: null })}
                className="bg-gray-300 text-gray-700 hover:bg-gray-400 px-4 py-2 rounded"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
