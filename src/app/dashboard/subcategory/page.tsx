// // "use client";

// // import React, { useState, useEffect } from "react";
// // import SubcategoryForm from "./SubcategoryForm";
// // import * as Select from "@radix-ui/react-select";
// // import { CategoryType } from "@/types/category";
// // import { subCategory } from "@/types/subCategory";

// // export default function SubcategoriesPage() {
// //   const [categories, setCategories] = useState<CategoryType[]>([]);
// //   const [selectedCategory, setSelectedCategory] = useState<string>("");
// //   const [subcategories, setSubcategories] = useState<subCategory[]>([]);

// //   useEffect(() => {
// //     fetch("/api/category")
// //       .then(res => res.json())
// //       .then(setCategories);
// //   }, []);

// //   // جلب الأصناف عند اختيار الكاتيجوري
// //   useEffect(() => {
// //     if (selectedCategory) {
// //       fetch(`/api/subcategory?categoryId=${selectedCategory}`)
// //         .then(res => res.json())
// //         .then(setSubcategories);
// //     } else {
// //       setSubcategories([]);
// //     }
// //   }, [selectedCategory]);

// //   return (
// //     <div>
// //       <h1>إدارة الأصناف</h1>

// //       {/* Radix Dropdown */}
// //       <Select.Root value={selectedCategory} onValueChange={setSelectedCategory}>
// //         <Select.Trigger>
// //           <Select.Value placeholder="اختر كاتيجوري" />
// //         </Select.Trigger>
// //         <Select.Content>
// //           {categories.map(cat => (
// //             <Select.Item key={cat._id} value={cat._id}>
// //               <Select.ItemText>{cat.categoryName}</Select.ItemText>
// //             </Select.Item>
// //           ))}
// //         </Select.Content>
// //       </Select.Root>

// //       {/* Form لإضافة صنف جديد */}
// //       {selectedCategory && <SubcategoryForm categoryId={selectedCategory} />}

// //       {/* عرض الأصناف */}
// //       <ul>
// //         {subcategories.map(sub => (
// //           <li key={sub._id}>{sub.subCategoryName}</li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // }


// "use client";
// import React, { useState, useEffect } from "react";
// import SubcategoryForm from "./SubcategoryForm";
// import Dropdown from "@/components/ui/Dropdown";
// import ListTable from "@/components/ui/ListTable";

// interface Category { _id: string; name: string }
// interface Subcategory { _id: string; name: string }

// export default function SubcategoriesPage() {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

//   useEffect(() => {
//     fetch("/api/category")
//       .then(res => res.json())
//       .then(setCategories);
//   }, []);

//   useEffect(() => {
//     if (selectedCategory) {
//       fetch(`/api/subcategories?categoryId=${selectedCategory}`)
//         .then(res => res.json())
//         .then(setSubcategories);
//     } else {
//       setSubcategories([]);
//     }
//   }, [selectedCategory]);

//   const handleDelete = async (id: string) => {
//     await fetch(`/api/subcategory/${id}`, { method: "DELETE" });
//     setSubcategories(subcategories.filter(s => s._id !== id));
//   };

//   return (
//     <div>
//       <h1 className="text-xl font-bold mb-4">إدارة الأصناف</h1>
//       <Dropdown
//         value={selectedCategory}
//         onChange={setSelectedCategory}
//         options={categories}
//         placeholder="اختر كاتيجوري"
//       />
//       {selectedCategory && <SubcategoryForm categoryId={selectedCategory} onSuccess={() => {
//         fetch(`/api/subcategories?categoryId=${selectedCategory}`)
//           .then(res => res.json())
//           .then(setSubcategories);
//       }} />}
//       <ListTable data={subcategories} columns={[{ key: "name", label: "اسم الصنف" }]} onDelete={handleDelete} />
//     </div>
//   );
// }
