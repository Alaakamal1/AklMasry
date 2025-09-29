import { NextResponse } from "next/server";
import Category from "@/models/Category";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().lean();
    return NextResponse.json(categories);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
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
      image: body.image || "",
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
    const { id, categoryName, isAvailable, image } = body;

    if (!id) {
      return NextResponse.json({ error: "ID مطلوب" }, { status: 400 });
    }

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: "القسم غير موجود" }, { status: 404 });
    }

    if (categoryName) category.categoryName = categoryName;
    if (isAvailable !== undefined) category.isAvailable = isAvailable;
    if (image) category.image = image;

    await category.save();

    return NextResponse.json(category, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
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

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json({ error: "القسم غير موجود" }, { status: 404 });

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



