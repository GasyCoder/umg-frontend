import "../globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "Université de Mahajanga",
  description: "Site officiel de l’Université de Mahajanga",
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-slate-50 text-slate-900">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}