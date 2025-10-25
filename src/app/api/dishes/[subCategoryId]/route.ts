import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Dish from "@/models/Dish";

export async function GET(
  req: Request,
  context: { params: Promise<{ subCategoryId: string }> }
) {
  try {
    const { subCategoryId } = await context.params; // 👈 استخدام await هنا
    await connectDB();

    const query =
      mongoose.Types.ObjectId.isValid(subCategoryId)
        ? { subCategoryId: new mongoose.Types.ObjectId(subCategoryId) }
        : { subCategoryId: subCategoryId };

    const dishes = await Dish.find(query).lean();

    return NextResponse.json(dishes);
  } catch (error) {
    console.error("Error in /api/dishes:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
