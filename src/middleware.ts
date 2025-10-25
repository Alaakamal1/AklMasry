// src/middleware.ts
import { getIronSession } from "iron-session";
import { NextResponse } from "next/server";
import { sessionOptions } from "@/lib/session";
import type { IronSession } from "iron-session";

export async function middleware(req: Request) {
  const res = NextResponse.next();
const session = (await getIronSession(req, res, sessionOptions)) as IronSession<{
  user?: {
    id: string;
    name: string;
    role: string;
  };
}>;
  // حدد المسارات المحمية
  const protectedRoutes = ["/dashboard"];

  if (protectedRoutes.some((path) => req.url.includes(path)) && !session.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*"], // أي صفحة داخل /dashboard
};
