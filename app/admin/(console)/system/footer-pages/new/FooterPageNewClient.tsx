"use client";

import { useRouter } from "next/navigation";
import FooterPageForm from "@/components/admin/system/FooterPageForm";

export default function FooterPageNewClient() {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">하단메뉴 · 새 페이지</h1>
      <FooterPageForm
        // ← 여기서는 클라이언트라서 핸들러를 넘겨도 OK
        onSaved={() => router.replace("/admin/(console)/system/footer-pages")}
      />
    </div>
  );
}
