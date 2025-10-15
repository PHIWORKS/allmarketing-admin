"use client";

import { useRouter } from "next/navigation";
import MemberForm from "@/components/admin/members/MemberForm";

export default function NewMemberPage() {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">회원 신규 등록</h1>
      <MemberForm
        onSaved={() => {
          router.replace("/admin/(console)/members");
        }}
      />
    </div>
  );
}
