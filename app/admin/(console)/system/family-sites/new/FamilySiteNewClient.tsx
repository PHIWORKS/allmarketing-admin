"use client";

import { useRouter } from "next/navigation";
import FamilySiteForm from "@/components/admin/system/FamilySiteForm";

export default function FamilySiteNewClient() {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Family Site · 새 링크</h1>
      <FamilySiteForm
        onSaved={() => {
          router.replace("/admin/(console)/system/family-sites");
        }}
      />
    </div>
  );
}
