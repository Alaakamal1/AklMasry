import Footer from "@/components/Footer";
import { connectDB } from "@/lib/db";
import Category, { ICategory } from "@/models/Category";
import Link from "next/link";

export default async function Home() {
  await connectDB();

  // جلب الأقسام وتحويل النوع بطريقة آمنة
  const CategoryModel = (await Category.find().lean()) as unknown as ICategory[];

  const isLoading = CategoryModel.length === 0;

  return (
    <div className="bg-[rgb(241,232,218)]">
      <main className="min-h-screen p-10 font-family-custom">
        <section className="text-center py-20">
          <h1 className="text-4xl font-bold mb-4 text-[#3d3324]">
            اهلا وسهلاً في آكـل مـصـري
          </h1>
          <p className="text-[#4c3f2d] mb-6">آكل مصري من قلب المطعم المصري</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 rounded-2xl animate-pulse bg-[#e0d8c8]"
                ></div>
              ))
            : CategoryModel.map((cat) => (
                <Link
                  key={cat._id.toString()}
                  href={`/category?id=${cat._id.toString()}&name=${encodeURIComponent(
                    cat.categoryName
                  )}`}
                  className="p-6 bg-[#613829] rounded-2xl shadow hover:shadow-lg text-center"
                >
                  <h2 className="text-xl font-semibold mb-2 text-[#F1E8DA]">
                    {cat.categoryName}
                  </h2>
                </Link>
              ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
