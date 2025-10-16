import { Suspense } from "react";
import InquiryEditClient from "./InquiryEditClient";

export default async function Page({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Promise 해제
  return (
    <Suspense fallback={<div>로딩중…</div>}>
      <InquiryEditClient id={id} />
    </Suspense>
  );
}
