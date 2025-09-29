import { connectDB } from "@/lib/db";
import {Home} from "@/app/(public)/page";

export default async function HomePage() {
  await connectDB();

  return (
    <div>
      <Home />
    </div>
  );
}
