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
