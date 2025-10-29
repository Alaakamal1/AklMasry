import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import SubCategory from "@/models/SubCategory";
export async function GET(req: Request, context: { params: Promise<{ categoryId: string }> }) {
  try {
    const { categoryId } = await context.params; 
    await connectDB();

    const subCategories = await SubCategory.find({
      categoryId: categoryId,
    }).lean();

    return NextResponse.json(subCategories);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// import { connectDB } from "@/lib/db";
// import { NextResponse } from "next/server";
// import SubCategory from "@/models/SubCategory";

// export async function GET(
//   req: Request,
//   { params }: { params: { category: string } }
// ) {
//   try {
//     const { category } = params;

//     if (!category) {
//       return NextResponse.json({ error: "معرّف القسم مفقود" }, { status: 400 });
//     }

//     await connectDB();

//     const subCategories = await SubCategory.find({ categoryId: category }).lean();

//     return NextResponse.json(subCategories, { status: 200 });
//   } catch (error) {
//     console.error("GET /subcategory/[category] error:", error);
//     return NextResponse.json(
//       { error: "حدث خطأ في الخادم" },
//       { status: 500 }
//     );
//   }
// }
