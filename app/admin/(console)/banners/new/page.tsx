"use client";

import { useRouter } from "next/navigation";
import BannerForm from "@/components/admin/banners/BannerForm";

export default function BannerNewPage() {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">새 배너 등록</h1>
      <BannerForm onSaved={()=>router.replace("/admin/(console)/banners")} />
    </div>
  );
}
