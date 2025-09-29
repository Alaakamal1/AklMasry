// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export function middleware(req: NextRequest) {
  // pages محمية
  const protectedPaths = ["/dashboard"];

  const isProtected = protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// export const config = {
//   matcher: ["/dashboard/:path*"], // كل صفحات الداشبورد محمية
// };
