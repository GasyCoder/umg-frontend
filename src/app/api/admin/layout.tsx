import "../globals.css";
import AdminTopbar from "@/components/AdminTopbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-slate-50 text-slate-900">
        <AdminTopbar />
        {children}
      </body>
    </html>
  );
}