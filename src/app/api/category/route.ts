import { NextResponse } from "next/server";
import Category from "@/models/Category";
import { connectDB } from "@/lib/db";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import SubCategory from "@/models/SubCategory";

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find().sort({ createdAt: -1 });
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const subCount = await SubCategory.countDocuments({ categoryId: cat._id });
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
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    await db.collection("categories").deleteOne({ _id: new ObjectId(id) });
    const subs = await db.collection("subcategories").find({ categoryId: id }).toArray();
    const subIds = subs.map((s) => s._id.toString());
    await db.collection("subcategories").deleteMany({ categoryId: id });
    if (subIds.length > 0) {
      await db.collection("dishes").deleteMany({ subcategoryId: { $in: subIds } });
    }

    return NextResponse.json({ success: true });
  }catch (error) {
  console.error("Delete category error:", error);

  const message =
    error instanceof Error ? error.message : "حدث خطأ غير متوقع";

  return NextResponse.json({ error: message }, { status: 500 });
}
}