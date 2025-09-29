// // import { NextResponse } from "next/server";
// // import Product from "@/models/Product";
// // import { connectDB } from "@/lib/db";

// // export async function POST(req: Request) {
// //   try {
// //     await connectDB();
// //     const body = await req.json();

// //     if (!body.productName || !body.price || !body.categoryId || !body.subCategoryId || !body.description) {
// //       return NextResponse.json({ error: "البيانات غير مكتملة" }, { status: 400 });
// //     }

// //     const product = await Product.create({
// //       productName: body.productName,
// //       price: body.price,
// //       categoryId: body.categoryId,
// //       subCategoryId: body.subCategoryId,
// //       description: body.description,
// //       isAvailable: body.isAvailable ?? true,
// //     });

// //     return NextResponse.json(product, { status: 201 });
// //   } catch (err: any) {
// //     return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
// //   }
// // }

// import { NextResponse } from "next/server";
// import Product from "@/models/Dish";
// import { connectDB } from "@/lib/db";

// export async function GET() {
//   try {
//     await connectDB();
//     const products = await Product.find()
//       .populate("categoryId")
//       .populate("subCategoryId")
//       .lean();
//     return NextResponse.json(products);
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       return NextResponse.json(
//         { error: err.message || String(err) },
//         { status: 500 }
//       );
//     }
//     return NextResponse.json({ error: String(err) }, { status: 500 });
//   }
// }

// export async function POST(req: Request) {
//   try {
//     await connectDB();
//     const body = await req.json();
//     const {
//       productName,
//       price,
//       categoryId,
//       subCategoryId,
//       isAvailable,
//     } = body;

//     if (!productName || !price || !categoryId || !subCategoryId) {
//       return NextResponse.json(
//         { error: "البيانات غير مكتملة" },
//         { status: 400 }
//       );
//     }

//     const product = await Product.create({
//       productName,
//       image: body.image || "",
//       price,
//       categoryId,
//       subCategoryId,
//       description: body.description || "",
//       isAvailable: isAvailable ?? true,
//     });

//     return NextResponse.json(product, { status: 201 });
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       return NextResponse.json(
//         { error: err.message || String(err) },
//         { status: 500 }
//       );
//     }
//     return NextResponse.json({ error: String(err) }, { status: 500 });
//   }
// }

// export async function PATCH(req: Request) {
//   try {
//     await connectDB();
//     const body = await req.json();
//     const {
//       id,
//       productName,
//       price,
//       image,
//       categoryId,
//       subCategoryId,
//       description,
//       isAvailable,
//     } = body;

//     if (!id) return NextResponse.json({ error: "ID مطلوب" }, { status: 400 });

//     const product = await Product.findById(id);
//     if (!product)
//       return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });

//     if (productName) product.productName = productName;
//     if (price) product.price = price;
//     if (categoryId) product.categoryId = categoryId;
//     if (subCategoryId) product.subCategoryId = subCategoryId;
//     if (description) product.description = description;
//     if (isAvailable !== undefined) product.isAvailable = isAvailable;

//     await product.save();
//     return NextResponse.json(product, { status: 200 });
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       return NextResponse.json(
//         { error: err.message || String(err) },
//         { status: 500 }
//       );
//     }
//     return NextResponse.json({ error: String(err) }, { status: 500 });
//   }
// }

// export async function DELETE(req: Request) {
//   try {
//     await connectDB();
//     const body = await req.json();
//     const { id } = body;

//     if (!id) return NextResponse.json({ error: "ID مطلوب" }, { status: 400 });

//     const deleted = await Product.findByIdAndDelete(id);
//     if (!deleted)
//       return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });

//     return NextResponse.json({ message: "تم الحذف بنجاح" }, { status: 200 });
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       return NextResponse.json(
//         { error: err.message || String(err) },
//         { status: 500 }
//       );
//     }
//     return NextResponse.json({ error: String(err) }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Dish from "@/models/Dish";

interface Params {
  params: { subCategoryId: string };
}

export async function GET(req: Request, { params }: Params) {
  try {
    await connectDB();
    const dishes = await Dish.find({
      subCategoryId: params.subCategoryId,
    }).lean();
    return NextResponse.json(dishes);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dishes" },
      { status: 500 }
    );
  }
}

