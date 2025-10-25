import { Toaster } from "react-hot-toast";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
        <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
