"use client";
import React from "react";

interface Column<T> {
  key: keyof T;
  label: string;
}

interface ListTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onDelete?: (id: string) => void;
}

export default function ListTable<T extends { _id: string }>({ data, columns, onDelete }: ListTableProps<T>) {
  return (
    <table className="table-auto border-collapse border border-gray-300 w-full">
      <thead>
        <tr>
          {columns.map(col => <th key={String(col.key)} className="border px-2 py-1">{col.label}</th>)}
          {onDelete && <th className="border px-2 py-1">خيارات</th>}
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={item._id}>
            {columns.map(col => <td key={String(col.key)} className="border px-2 py-1">{item[col.key]}</td>)}
            {onDelete && <td className="border px-2 py-1"><button onClick={() => onDelete(item._id)}>حذف</button></td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
