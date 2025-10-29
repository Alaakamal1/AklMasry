import { NextRequest, NextResponse } from "next/server";
import Category from "@/models/Category";
import { connectDB } from "@/lib/db";
import { connectToDatabase } from "@/lib/mongodb";
import SubCategory from "@/models/SubCategory";

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find().sort({ createdAt: -1 });
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const subCount = await SubCategory.countDocuments({
          categoryId: cat._id,
        });
        return {
          ...cat.toObject(),
          subCount,
        };
      })
    );
    return NextResponse.json(categoriesWithCounts);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "Error fetching categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    if (!body.categoryName) {
      return NextResponse.json({ error: "اسم القسم مطلوب" }, { status: 400 });
    }
    const category = await Category.create({
      categoryName: body.categoryName,
      isAvailable: body.isAvailable ?? true,
    });

    return NextResponse.json(category, { status: 201 });
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
    const { id, categoryName, isAvailable } = body;
    if (!id) {
      return NextResponse.json({ error: "ID مطلوب" }, { status: 400 });
    }

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: "القسم غير موجود" }, { status: 404 });
    }

    if (categoryName) category.categoryName = categoryName;
    if (isAvailable !== undefined) category.isAvailable = isAvailable;
    await category.save();

    return NextResponse.json(category, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: "ID مطلوب" }, { status: 400 });
    }
    const deletedCategory = await Category.findByIdAndDelete(body.id);
    if (!deletedCategory) {
      return NextResponse.json(
        { error: "القسم الرئيسي غير موجود" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "تم الحذف بنجاح " },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "حدث خطأ غير متوقع";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
