import { Nunito } from "next/font/google";
import { getSiteSettings } from "@/lib/public-api";
import PublicHeader from "@/components/public/PublicHeader";
import ScrollToTop from "@/components/public/ScrollToTop";
import SiteFooter from "@/components/SiteFooter";
import type { Metadata } from "next";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null);
  return {
    title: {
      default: settings?.site_name || "Université de Mahajanga",
      template: `%s | ${settings?.site_name || "Université de Mahajanga"}`,
    },
    description: settings?.site_description || "Site officiel de l'Université de Mahajanga",
    icons: {
      icon: settings?.favicon_url || "/favicon.ico",
    },
  };
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings().catch(() => null);

  return (
    <div className={`min-h-screen flex flex-col ${nunito.className} bg-[#f6f6f8] dark:bg-[#101622] text-[#111318] dark:text-white transition-colors duration-300`}>
       {/* Material Symbols */}
       <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
          rel="stylesheet" 
       />
       {/* Nunito Font Fallback */}
       <link 
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap" 
          rel="stylesheet" 
       />
       <style>{`
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
          }
       `}</style>
       <PublicHeader settings={settings} />
       <main className="flex-1 w-full flex flex-col">
         {children}
       </main>
       <ScrollToTop />
       <SiteFooter settings={settings} />
    </div>
  );
}
