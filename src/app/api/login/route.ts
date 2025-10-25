import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { sessionOptions } from "@/lib/session";
import { getIronSession, type IronSession, type IronSessionData } from "iron-session";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    const { db } = await connectToDatabase();
    const admin = await db.collection("admins").findOne({ role: "admin" });

    if (!admin) {
      return NextResponse.json({ error: "لم يتم العثور على المدير" }, { status: 404 });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
    }

    const res = NextResponse.json({ success: true });
    const session = (await getIronSession(req, res, sessionOptions)) as IronSession<IronSessionData>;

    session.user = {
      id: admin._id.toString(),
      name: admin.name || "Admin",
      role: admin.role,
    };

    await session.save();
    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
