// import {DashboardSidebar} from "@/components/DashboardSidebar";

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex min-h-screen">
//       {/* <DashboardSidebar /> */}
//       <main className="flex-1 p-6 bg-gray-50">{children}</main>
//     </div>
//   );
// }

// app/layout.tsx أو _app.tsx لو Next.js <13
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
