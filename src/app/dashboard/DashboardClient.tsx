"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CategoriesPage from "./category/page";
import SubcategoryPage from "./subcategory/page";
import DishesPage from "./dishes/page";
import toast, { Toaster } from "react-hot-toast";

interface Props {
  user: {
    id: string;
    name: string;
    role: string;
  };
}

export default function DashboardClient({ user }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setTimeout(() => router.push("/"), 1000);
      } else {
        toast.error("حدث خطأ أثناء تسجيل الخروج");
      }
    } catch (err) {
      console.error(err);
      toast.error("تعذر الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-lg font-semibold">مرحبًا {user.name}</h1>
        <button
          onClick={handleLogout}
          disabled={loading}
          className="px-4 py-2 border text-red-600 rounded-lg transition hover:bg-red-50 disabled:opacity-50"
        >
          {loading ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
        </button>
      </div>
      <CategoriesPage />
      <SubcategoryPage />
      <DishesPage />
    </>
  );
}
