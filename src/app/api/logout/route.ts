
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const res = new NextResponse();

  const session = await getIronSession(request, res, sessionOptions);
  session.destroy();

  return NextResponse.json({ ok: true }, { status: 200 });
}
