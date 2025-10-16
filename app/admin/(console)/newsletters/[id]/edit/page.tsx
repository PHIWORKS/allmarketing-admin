// 서버 컴포넌트: params가 Promise 타입(typed routes)일 때 여기서만 await
import NewsletterEditClient from "./NewsletterEditClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ Promise 해제
  return <NewsletterEditClient id={id} />;
}