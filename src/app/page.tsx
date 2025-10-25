import { connectDB } from "@/lib/db";
import Home from "./(public)/page";
export default async function Main() {
  await connectDB();

  return (
    <div>
      <Home/>
    </div>
  );
}
