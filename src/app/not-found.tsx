"use client";

import Link from "next/link";
export default function NotFound() {
  return (
    <div className="bg-[rgb(241,232,218)] min-h-screen flex flex-col justify-between font-family-custom">
      <main className="grow flex flex-col items-center justify-center text-center p-10">
        <section className="py-20">
          <h1 className="text-6xl font-bold mb-4 text-[#3d3324]">404</h1>
          <h2 className="text-3xl font-semibold mb-4 text-[#3d3324]">
            الصفحة غير موجودة
          </h2>
          <p className="text-[#4c3f2d] mb-8">
            عذرًا، الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-[#613829] text-[#F1E8DA] rounded-2xl shadow hover:shadow-lg transition"
          >
            العودة إلى الصفحة الرئيسية
          </Link>
        </section>
      </main>
    </div>
  );
}
