import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Dish from "@/models/Dish";
export async function GET(context: { params: Promise<{ subCategoryId: string }> }) {
  try {
    const { subCategoryId } = await context.params; 
    await connectDB();

    const dishes = await Dish.find({
      subCategoryId: subCategoryId,
    }).lean();

    return NextResponse.json(dishes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
