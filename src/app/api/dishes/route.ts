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

// ✅ GET: جلب كل الأطباق (مع القسم الرئيسي والفرعي)
export async function GET() {
  try {
    await connectDB();
    const dishes = await Dish.find()
      .populate({
        path: "subCategoryId",
        select: "subCategoryName categoryId",
        populate: {
          path: "categoryId",
          select: "categoryName",
        },
      })
      .lean();

    return NextResponse.json(dishes, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "فشل في جلب الأطباق" },
      { status: 500 }
    );
  }
}

// ✅ PUT: تعديل طبق
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, dishName, price, subCategoryId, image } = body;

    if (!id) {
      return NextResponse.json({ error: "ID غير موجود" }, { status: 400 });
    }

    const updatedDish = await Dish.findByIdAndUpdate(
      id,
      { dishName, price, subCategoryId, image },
      { new: true }
    );

    if (!updatedDish) {
      return NextResponse.json({ error: "الطبق غير موجود" }, { status: 404 });
    }

    return NextResponse.json(updatedDish, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE: حذف طبق
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID غير موجود" }, { status: 400 });
    }

    const deletedDish = await Dish.findByIdAndDelete(id);

    if (!deletedDish) {
      return NextResponse.json({ error: "الطبق غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ message: "تم الحذف بنجاح" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

