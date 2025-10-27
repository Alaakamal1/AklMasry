import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Akl Masry",
  description: "An Egyptian restaurant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
