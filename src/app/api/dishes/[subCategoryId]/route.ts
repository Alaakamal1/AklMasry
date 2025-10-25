import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Dish from "@/models/Dish";

export async function GET(
  req: Request,
  { params }: { params: { subCategoryId: string } }
) {
  try {
    const { subCategoryId } = params;
    await connectDB();

    // استعلام مع النوع الصحيح
    const query: { subCategoryId: mongoose.Types.ObjectId | string } = {
      subCategoryId: mongoose.Types.ObjectId.isValid(subCategoryId)
        ? new mongoose.Types.ObjectId(subCategoryId)
        : subCategoryId,
    };

    const dishes = await Dish.find(query).lean();

    return NextResponse.json(dishes);
  } catch (error) {
    console.error("Error in /api/dishes:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
