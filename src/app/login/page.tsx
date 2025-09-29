"use client";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include", // <== مهم جدًا لكي يتم حفظ الكوكيز
    });

    if (res.ok) {
          redirect("/dashboard");
    } else {
      const data = await res.json();
      alert(data.error || "خطأ في تسجيل الدخول");
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4 max-w-sm mx-auto mt-20">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Login
      </button>
    </form>
  );
}
