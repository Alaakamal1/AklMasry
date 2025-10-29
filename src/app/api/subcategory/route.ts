export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import SubCategory, { ISubCategory } from "@/models/SubCategory";
import Dish from "@/models/Dish";
export async function GET(): Promise<NextResponse> {
  try {
    await connectDB();
    const subCategories = await SubCategory.find()
      .populate("categoryId")
      .lean<ISubCategory[]>();
    return NextResponse.json(subCategories, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* --------------------------------------------
   POST — Create subcategory
-------------------------------------------- */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const contentType = req.headers.get("content-type") || "";

    let subCategoryName = "";
    let categoryId: string | null = null;
    let imageUrl = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      subCategoryName = formData.get("subCategoryName") as string;
      categoryId = formData.get("categoryId") as string;
      imageUrl = (formData.get("subCategoryImage") as string) || "";
    } 
    else {
      const body = (await req.json()) as Pick<
        ISubCategory,
        "subCategoryName" | "categoryId" | "image"
      >;
      subCategoryName = body.subCategoryName;
      categoryId = body.categoryId as unknown as string;
      imageUrl = body.image || "";
    }
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
    const categoryIdValue =
      typeof categoryId === "object" && "_id" in categoryId
        ? (categoryId as { _id: string })._id
        : categoryId;
    const subCategory = await SubCategory.create({
      subCategoryName,
      categoryId: new mongoose.Types.ObjectId(categoryIdValue),
      image: imageUrl || "",
    });
    const populated = await subCategory.populate("categoryId");

    return NextResponse.json(populated, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /subcategory error:", error);
    const message =
      error instanceof Error ? error.message : "حدث خطأ غير متوقع";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
/* --------------------------------------------
   📍 PATCH — Update subcategory
-------------------------------------------- */
export async function PATCH(req: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const contentType = req.headers.get("content-type") || "";

    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Content-Type غير مدعوم" }, { status: 400 });
    }

    const formData = await req.formData();

    const id = formData.get("id") as string | null;
    const subCategoryName = formData.get("subCategoryName") as string | null;
    const isAvailable = formData.get("isAvailable") as string | null;
    const categoryId = formData.get("categoryId") as string | null;
    const subCategoryImage = formData.get("subCategoryImage") as string | null;

    if (!id) {
      return NextResponse.json({ error: "ID مطلوب" }, { status: 400 });
    }

    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return NextResponse.json({ error: "القسم الفرعي غير موجود" }, { status: 404 });
    }

    if (subCategoryName) subCategory.subCategoryName = subCategoryName;
    if (isAvailable !== null) subCategory.isAvailable = isAvailable === "true";

    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return NextResponse.json({ error: "القسم الرئيسي غير موجود" }, { status: 404 });
      }
      subCategory.categoryId = new mongoose.Types.ObjectId(categoryId);
    }

    // ✅ هنا نحفظ رابط الصورة المرسل من Cloudinary مباشرة
    if (subCategoryImage) {
      subCategory.image = subCategoryImage;
    }

    await subCategory.save();

    return NextResponse.json(subCategory, { status: 200 });
  } catch (error) {
    console.error("PATCH /subcategory error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
/* --------------------------------------------
   📍 DELETE — Remove subcategory & its dishes
-------------------------------------------- */
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: "ID مطلوب" }, { status: 400 });
    }

    const deletedSub = await SubCategory.findByIdAndDelete(body.id);
    if (!deletedSub) {
      return NextResponse.json(
        { error: "القسم الفرعي غير موجود" },
        { status: 404 }
      );
    }

    await Dish.deleteMany({ subCategoryId: body.id });

    return NextResponse.json(
      { message: "تم الحذف بنجاح مع الأطباق التابعة له" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message :"حدث خطأ غير متوقع";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
