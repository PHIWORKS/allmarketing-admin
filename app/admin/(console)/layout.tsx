// app/admin/(console)/layout.tsx
import AdminTopbar from "../../../components/admin/AdminTopbar";
import AdminSidebar from "../../../components/admin/AdminSidebar";

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <AdminTopbar />
      <div className="mx-auto max-w-7xl grid grid-cols-12 gap-8 px-6 py-8">
        <AdminSidebar />
        <main className="col-span-12 md:col-span-9 lg:col-span-10">{children}</main>
      </div>
    </div>
  );
}
