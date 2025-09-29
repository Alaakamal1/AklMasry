import { NextResponse } from "next/server";
import SubCategory from "@/models/SubCategory";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { error } from "console";

export async function GET() {
  try {
    await connectDB();
    const subCategories = await SubCategory.find().populate("categoryId").lean();
    return NextResponse.json(subCategories, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { subCategoryName, categoryId } = body;

    if (!subCategoryName || !categoryId) {
      return NextResponse.json(
        { error: "البيانات غير مكتملة" },
        { status: 400 }
      );
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { error: "القسم الرئيسي غير موجود" },
        { status: 404 }
      );
    }
    const subCategory = await SubCategory.create({
      subCategoryName,
      categoryId,
    });

    const populatedSubCategory = await subCategory.populate("categoryId");

    return NextResponse.json(populatedSubCategory, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json(
        { error: err.message || String(err) },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, subCategoryName, isAvailable, categoryId } = body;

    if (!id) return NextResponse.json({ error: "ID مطلوب" }, { status: 400 });

    const subCategory = await SubCategory.findById(id);
    if (!subCategory)
      return NextResponse.json(
        { error: "القسم الفرعي غير موجود" },
        { status: 404 }
      );

    if (subCategoryName) subCategory.subCategoryName = subCategoryName;
    if (isAvailable !== undefined) subCategory.isAvailable = isAvailable;
    if (categoryId) {
      const category = await categoryId.findById(categoryId);
      if (!category)
        return NextResponse.json(
          { error: "القسم الرئيسي غير موجود" },
          { status: 404 }
        );
      subCategory.categoryId = categoryId;
    }

    await subCategory.save();
    return NextResponse.json(subCategory, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json(
        { error: err.message || String(err) },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id } = body;

    if (!id) return NextResponse.json({ error: "ID مطلوب" }, { status: 400 });

    const deleted = await SubCategory.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json(
        { error: "القسم الفرعي غير موجود" },
        { status: 404 }
      );

    return NextResponse.json({ message: "تم الحذف بنجاح" }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json(
        { error: err.message || String(err) },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
