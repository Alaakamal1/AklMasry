import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Link from "next/link";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
console.log(token);

  if (!token) {
    return (
      <div>
        <h1>Unauthorized</h1>
        <Link href="/login">Go to Login</Link>
      </div>
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };

    return (
      <div>
        <h1>Welcome to Dashboard</h1>
        <p>User ID: {decoded.id}</p>
        <p>Role: {decoded.role}</p>
      </div>
    );
  } catch {
    return (
      <div>
        <h1>Invalid token</h1>
        <Link href="/login">Go to Login</Link>
      </div>
    );
  }
}
