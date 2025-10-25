import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import DashboardClient from "./DashboardClient";

interface SessionData {
  user?: {
    id: string;
    name: string;
    role: string;
  };
}

export default async function DashboardPage() {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const req = new Request("http://localhost", {
    headers: { cookie: cookieHeader },
  });
  const res = new Response();

  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  if (!session.user) {
    redirect("/");
  }

  return <DashboardClient user={session.user} />;
}
