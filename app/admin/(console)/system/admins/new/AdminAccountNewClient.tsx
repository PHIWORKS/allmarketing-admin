// ./app/admin/(console)/system/admins/new/AdminAccountNewClient.tsx
"use client";

import { useRouter } from "next/navigation";
import AdminAccountForm from "@/components/admin/system/AdminAccountForm";

export default function AdminAccountNewClient() {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">관리자계정 · 신규 등록</h1>
      <AdminAccountForm
        onSaved={() => {
          router.replace("/admin/(console)/system/admins");
        }}
      />
    </div>
  );
}
