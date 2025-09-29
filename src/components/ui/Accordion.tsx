"use client";
import { useState } from "react";

export default function Accordion({ title, items }: { title: string, items: { name: string, price: number }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b">
      <button 
        onClick={() => setOpen(!open)} 
        className="flex justify-between w-full p-4 bg-gray-100"
      >
        <span>{title}</span>
        <span>{open ? "▼" : "▶"}</span>
      </button>

      {open && (
        <div className="p-4 space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span>{item.name}</span>
              <span>{item.price} EGP</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
