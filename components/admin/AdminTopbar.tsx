"use client";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminTopbar() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b">
      <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="font-extrabold tracking-tight text-xl hover:opacity-90"
          >
            AllMarketing <span className="text-emerald-600">Admin</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg hover:bg-gray-100" aria-label="알림">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full" />
          </button>
          <button
            onClick={logout}
            className="text-sm px-3 py-1.5 rounded-lg border hover:bg-gray-50"
          >
            로그아웃
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300" />
        </div>
      </div>
    </header>
  );
}
