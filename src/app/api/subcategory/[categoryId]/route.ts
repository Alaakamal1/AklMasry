// import { NextResponse } from "next/server";
// import SubCategory from "@/models/SubCategory";
// import connectDB from "@/lib/mongodb";

// interface Params {
//   params: { categoryId: string };
// }

// export async function GET(req: Request, { params }: Params) {
//   await connectDB();

//   try {
//     const { categoryId } = params;
//     const subCategories = await SubCategory.find({ categoryId, isAvailable: true });
//     return NextResponse.json(subCategories, { status: 200 });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SubCategory from "@/models/SubCategory";

interface Params {
  params: { categoryId: string };
}

export async function GET(req: Request, { params }: Params) {
  try {
    await connectDB();
    const subCategories = await SubCategory.find({
      categoryId: params.categoryId,
    }).lean();
    return NextResponse.json(subCategories);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch subcategories" },
      { status: 500 }
    );
  }
}

