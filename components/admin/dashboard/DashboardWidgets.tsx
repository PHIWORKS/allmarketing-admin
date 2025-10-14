"use client";
import React from "react";

export function KpiCard({
  title,
  value,
  sub,
  delta,
}: {
  title: string;
  value: number | string;
  sub?: string;
  delta?: number;
}) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {sub && <div className="mt-1 text-xs text-gray-400">{sub}</div>}
      {typeof delta === "number" && (
        <div
          className={`mt-2 inline-flex text-xs px-2 py-0.5 rounded-full ${
            delta >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          }`}
        >
          {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}
        </div>
      )}
    </div>
  );
}

export function Card({
  title,
  children,
  cta,
}: {
  title: string;
  children: React.ReactNode;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-semibold">{title}</h3>
        {cta && (
          <a className="text-sm text-emerald-600 hover:underline" href={cta.href}>
            {cta.label}
          </a>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export function Table({
  columns,
  rows,
}: {
  columns: string[];
  rows: (string | number)[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            {columns.map((c) => (
              <th key={c} className="px-3 py-2 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t">
              {r.map((cell, j) => (
                <td key={j} className="px-3 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
