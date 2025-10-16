import AdminAccountEditClient from "./AdminAccountEditClient";

export default async function Page({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminAccountEditClient id={id} />;
}
