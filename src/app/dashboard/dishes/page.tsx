// "use client";

// import { useState, useEffect } from "react";

// interface Category {
//   _id: string;
//   categoryName: string;
// }

// interface SubCategory {
//   _id: string;
//   subCategoryName: string;
// }

// export default function DishesDashboard() {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedSubCategory, setSelectedSubCategory] = useState("");
//   const [dishName, setDishName] = useState("");
//   const [price, setPrice] = useState<number | "">("");
//   const [message, setMessage] = useState("");

//   // تحميل الكاتيجوريز
//   useEffect(() => {
//     fetch("/api/category")
//       .then((res) => res.json())
//       .then((data) => setCategories(data));
//   }, []);

//   // تحميل الـ SubCategories حسب الكاتيجوري
//   useEffect(() => {
//     if (!selectedCategory) return;
//     fetch(`/api/subcategory/${selectedCategory}`)
//       .then((res) => res.json())
//       .then((data) => setSubCategories(data));
//   }, [selectedCategory]);

//   const handleAddDish = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!dishName || !price || !selectedSubCategory) {
//       setMessage("من فضلك أدخل كل البيانات");
//       return;
//     }

//     const res = await fetch("/api/dishes", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         dishName,
//         price: Number(price),
//         subCategoryId: selectedSubCategory,
//       }),
//     });

//     if (res.ok) {
//       setMessage("✅ تم إضافة الطبق بنجاح");
//       setDishName("");
//       setPrice("");
//       setSelectedSubCategory("");
//     } else {
//       const err = await res.json();
//       setMessage(`❌ خطأ: ${err.error}`);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gray-50 p-10">
//       <h1 className="text-2xl font-bold mb-6">إدارة الأطباق</h1>

//       <form
//         onSubmit={handleAddDish}
//         className="bg-white shadow-md rounded-xl p-6 max-w-lg space-y-4"
//       >
//         {/* اختيار الكاتيجوري */}
//         <div>
//           <label className="block mb-2 font-medium">القسم الرئيسي</label>
//           <select
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             className="w-full border p-2 rounded-lg"
//           >
//             <option value="">-- اختر --</option>
//             {categories.map((cat) => (
//               <option key={cat._id} value={cat._id}>
//                 {cat.categoryName}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* اختيار SubCategory */}
//         <div>
//           <label className="block mb-2 font-medium">القسم الفرعي</label>
//           <select
//             value={selectedSubCategory}
//             onChange={(e) => setSelectedSubCategory(e.target.value)}
//             className="w-full border p-2 rounded-lg"
//           >
//             <option value="">-- اختر --</option>
//             {subCategories.map((sub) => (
//               <option key={sub._id} value={sub._id}>
//                 {sub.subCategoryName}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* إدخال بيانات الطبق */}
//         <div>
//           <label className="block mb-2 font-medium">اسم الطبق</label>
//           <input
//             type="text"
//             value={dishName}
//             onChange={(e) => setDishName(e.target.value)}
//             className="w-full border p-2 rounded-lg"
//             placeholder="مثال: سندويتش كبده"
//           />
//         </div>

//         <div>
//           <label className="block mb-2 font-medium">السعر</label>
//           <input
//             type="number"
//             value={price}
//             onChange={(e) => setPrice(Number(e.target.value))}
//             className="w-full border p-2 rounded-lg"
//             placeholder="مثال: 50"
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
//         >
//           إضافة الطبق
//         </button>

//         {message && <p className="mt-4 text-center">{message}</p>}
//       </form>
//     </main>
//   );
// }
