// // import { withSessionRoute } from "@/lib/session";
// // import { connectDB } from "@/lib/db";
// // import User from "@/models/User";
// // import bcrypt from "bcryptjs";

// // export default withSessionRoute(async function loginRoute(req: any, res: any) {
// //   await connectDB();
// //   const { email, password } = await req.body;

// //   const user = await User.findOne({ email });
// //   if (!user) return res.status(404).json({ error: "User not found" });

// //   const isMatch = await bcrypt.compare(password, user.password);
// //   if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

// //   // حفظ البيانات في session
// //   req.session.user = { id: user._id, role: user.role, email: user.email };
// //   await req.session.save();

// //   return res.json({ message: "Login successful" });
// // });


// // import { NextResponse } from 'next/server'
// // import { cookies } from 'next/headers'

// // export async function POST(req: Request) {
// //   const { password } = await req.json()

// //   if (password === process.env.DASHBOARD_PASS) {
// //     const res = NextResponse.json({ success: true })
// //     res.cookies.set({
// //       name: 'auth',
// //       value: 'true',
// //       httpOnly: true,
// //       secure: process.env.NODE_ENV === 'production',
// //       path: '/dashboard',
// //       maxAge: 60 * 60, // ساعة
// //     })
// //     return res
// //   }

// //   return NextResponse.json({ success: false, message: 'كلمة السر غلط!' }, { status: 401 })
// // }

// import { NextResponse } from 'next/server'

// export async function POST(req: Request) {
//   const { password } = await req.json()

//   if (password === process.env.DASHBOARD_PASS) {
//     const res = NextResponse.json({ success: true })
//     res.cookies.set({
//       name: 'auth',
//       value: 'true',
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       path: '/',          // خليه متاح لكل الصفحات
//       maxAge: 60 * 60,    // ساعة
//     })
//     return res
//   }

//   return NextResponse.json(
//     { success: false, message: 'كلمة السر غلط!' },
//     { status: 401 }
//   )
// }


// src/app/api/login/route.ts
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/mongodb'

export async function POST(req: Request) {
  const { password } = await req.json()
  if (!password || typeof password !== 'string') {
    return NextResponse.json({ error: 'Password required' }, { status: 400 })
  }

  const { db } = await connectToDatabase()
  const admin = await db.collection('admins').findOne({ role: 'admin' })
  if (!admin || !admin.password) {
    return NextResponse.json({ error: 'No admin set' }, { status: 500 })
  }

  const match = await bcrypt.compare(password, admin.password)
  if (!match) {
    return NextResponse.json({ success: false, message: 'كلمة السر غلط!' }, { status: 401 })
  }

  // ناجح -> نصنع cookie
  const res = NextResponse.json({ success: true })
  res.cookies.set({
    name: process.env.DASHBOARD_COOKIE_NAME || 'auth',
    value: 'true', // ممكن تحطي قيمة أكثر أمانًا أو sign عليها بـ HMAC/JWT
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: Number(process.env.DASHBOARD_COOKIE_MAXAGE || 3600),
    sameSite: 'lax',
  })
  return res
}
