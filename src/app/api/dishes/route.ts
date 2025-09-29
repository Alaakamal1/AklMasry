import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Dish from "@/models/Dish";
import SubCategory from "@/models/SubCategory";

// ✅ POST: إضافة Dish جديدة
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { dishName, price, subCategoryId, image } = body;

    // تحقق من البيانات
    if (!dishName || !price || !subCategoryId) {
      return NextResponse.json(
        { error: "البيانات غير مكتملة" },
        { status: 400 }
      );
    }

    // تحقق أن الـ SubCategory موجودة
    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory) {
      return NextResponse.json(
        { error: "القسم الفرعي غير موجود" },
        { status: 404 }
      );
    }

    // إنشاء الطبق
    const dish = await Dish.create({
      dishName,
      price,
      image,
      subCategoryId,
    });

    return NextResponse.json(dish, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
