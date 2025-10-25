import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#613829] text-[#FFF8E8] py-6 mt-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <Link href="/login" className="text-sm hover:underline">
          &copy; {new Date().getFullYear()} أكل مصري. جميع الحقوق محفوظة.
        </Link>
        <div className="flex gap-4 mt-3 md:mt-0">
          <p>تواصل معنا</p>
        </div>
      </div>
    </footer>
  );
}
