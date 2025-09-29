// // "use client";

// // import { useEffect, useState } from "react";
// // import CategoryForm from "./CategoryForm";
// // import { Button } from "@/components/ui/button";
// // import { CategoryType } from "@/types/category";


// // export default function CategoriesPage() {
// //   const [categories, setCategories] = useState<CategoryType[]>([]);

// //   const fetchCategories = async () => {
// //     const res = await fetch("/api/category");
// //     const data: CategoryType[] = await res.json();
// //     setCategories(data);
// //   };

// //   const handleDelete = async (id: string) => {
// //     await fetch(`/api/category/${id}`, { method: "DELETE" });
// //     fetchCategories();
// //   };

// //   useEffect(() => {
// //     fetchCategories();
// //   }, []);

// //   return (
// //     <div>
// //       <h1>إدارة الكاتيجوريز</h1>
// //       <CategoryForm onSuccess={fetchCategories} />
// //       <ul>
// //         {categories.map((cat) => (
// //           <li key={cat._id}>
// //             {cat.categoryName} 
// //             <Button onClick={() => handleDelete(cat._id)}>حذف</Button>
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // }

// "use client";
// import React, { useState, useEffect } from "react";
// import {CategoryForm} from "@/components/CategoryForm";
// import ListTable from "@/components/ui/ListTable";
// import { ICategory } from "@/models/Category";

// export default function CategoriesPage() {
//   const [categories, setCategories] = useState<ICategory[]>([]);

//   const fetchCategories = async () => {
//     const res = await fetch("/api/category");
//     const data: ICategory[] = await res.json();
//     setCategories(data);
//   };

//   const handleDelete = async (id: string) => {
//     await fetch(`/api/category/${id}`, { method: "DELETE" });
//     fetchCategories();
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   return (
//     <div>
//       <h1 className="text-xl font-bold mb-4">إدارة الكاتيجوريز</h1>
//       <CategoryForm onSuccess={fetchCategories} />
//       <ListTable data={categories} columns={[{ key: "name", label: "اسم الكاتيجوري" }]} onDelete={handleDelete} />
//     </div>
//   );
// }

// "use client";
// import { useState } from "react";

// export default function CategoryForm() {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const res = await fetch("/dashboard/categories/api/categories", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name, description }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       setMessage("Category added successfully!");
//       setName("");
//       setDescription("");
//     } else {
//       setMessage(data.error || "Something went wrong.");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 border rounded">
//       <h1 className="text-xl font-bold mb-4">Add New Category</h1>
//       {message && <p className="mb-4 text-green-600">{message}</p>}
//       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//         <input
//           type="text"
//           placeholder="Category Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//           className="border p-2 rounded"
//         />
//         <textarea
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="border p-2 rounded"
//         />
//         <button type="submit" className="bg-blue-500 text-white p-2 rounded">
//           Add Category
//         </button>
//       </form>
//     </div>
//   );
// }
