// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed, role: "admin" });

  return NextResponse.json(user);
}
