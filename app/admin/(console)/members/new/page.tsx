"use client";

import MemberForm from "@/components/admin/members/MemberForm";

export default function NewMemberPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">회원 신규 등록</h1>
      <MemberForm onSaved={(m)=> {
        // 저장 후 목록으로 이동하거나 그대로 두기
        location.href = "/admin/(console)/members";
      }}/>
    </div>
  );
}
