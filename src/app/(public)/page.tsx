import { connectDB } from "@/lib/db";
import Category, { ICategory } from "@/models/Category";
import Link from "next/link";

export  async function Home() {
  await connectDB();
const CategoryModel = (await Category.find().lean()) as ICategory[];

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <section className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          اهلا وسهلاً في أكـل مصري🍽️
        </h1>
        <p className="text-gray-600 mb-6">
          طعم بلدنا أصيل ومستنيك تجرب كل حاجة
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CategoryModel.map((cat) => (
          // <Link
          //   key={cat._id.toString()}
          //   href={`/category=${cat.categoryName}`}
          //   className="p-6 bg-white rounded-2xl shadow hover:shadow-lg text-center"
          // >
          //   <h2 className="text-xl font-semibold mb-2">{cat.categoryName}</h2>
          // </Link>
          <Link
  key={cat._id.toString()}
  href={`/category?id=${cat._id.toString()}&name=${encodeURIComponent(cat.categoryName)}`}
  className="p-6 bg-white rounded-2xl shadow hover:shadow-lg text-center"
>
  <h2 className="text-xl font-semibold mb-2">{cat.categoryName}</h2>
</Link>

        ))}
      </div>
    </main>
  );
}
