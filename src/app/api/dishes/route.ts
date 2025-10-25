import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Dish, { IDish } from "@/models/Dish";
import SubCategory from "@/models/SubCategory";

/* ---------------------------------- POST ---------------------------------- */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const body: Partial<IDish> = await req.json();
    const { dishName, price, subCategoryId, image } = body;

    if (!dishName || !price || !subCategoryId) {
      return NextResponse.json(
        { error: "البيانات غير مكتملة" },
        { status: 400 }
      );
    }
    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory) {
      return NextResponse.json(
        { error: "القسم الفرعي غير موجود" },
        { status: 404 }
      );
    }

    const dish = await Dish.create({
      dishName,
      price,
      image,
      subCategoryId,
    });

    return NextResponse.json(dish, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "حدث خطأ أثناء الإضافة";
    console.error("POST /api/dishes error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* ---------------------------------- GET ----------------------------------- */
export async function GET(): Promise<NextResponse> {
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
      .lean<IDish[]>();

    return NextResponse.json(dishes, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "فشل في جلب الأطباق";
    console.error("GET /api/dishes error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* ---------------------------------- PATCH ----------------------------------- */
export async function PATCH(req: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const body: Partial<IDish> & { id?: string } = await req.json();
    const { id, dishName, price, subCategoryId } = body;

    if (!id) {
      return NextResponse.json({ error: "ID غير موجود" }, { status: 400 });
    }

    const dish = await Dish.findById(id);
    if (!dish) {
      return NextResponse.json({ error: "الطبق غير موجود" }, { status: 404 });
    }

    const updateFields: Record<string, unknown> = {};
    if (dishName !== undefined) updateFields.dishName = dishName;
    if (price !== undefined) updateFields.price = price;

    if (subCategoryId !== undefined) {
      if (typeof subCategoryId === "string") {
        if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
          return NextResponse.json(
            { error: "قيمة subCategoryId غير صالحة" },
            { status: 400 }
          );
        }
        updateFields.subCategoryId = new mongoose.Types.ObjectId(subCategoryId);
      } else if (subCategoryId instanceof mongoose.Types.ObjectId) {
        updateFields.subCategoryId = subCategoryId;
      } else {
        return NextResponse.json(
          { error: "subCategoryId لازم يكون string أو ObjectId" },
          { status: 400 }
        );
      }
    }

    const updatedDish = await Dish.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedDish) {
      return NextResponse.json({ error: "الطبق غير موجود بعد التحديث" }, { status: 404 });
    }

    return NextResponse.json(updatedDish, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "حدث خطأ أثناء التعديل";
    console.error("PATCH /api/dishes error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
/* -------------------------------- DELETE ---------------------------------- */
export async function DELETE(req: NextRequest): Promise<NextResponse> {
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
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "حدث خطأ أثناء الحذف";
    console.error("DELETE /api/dishes error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
