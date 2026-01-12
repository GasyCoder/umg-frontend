import Container from "@/components/Container";
import Link from "next/link";
import { publicGet } from "@/lib/public-api";
import { Briefcase, ArrowRight, MapPin, Phone, Mail, FileText } from "lucide-react";

export const metadata = {
  title: "Services - Université de Mahajanga",
  description: "Les services administratifs et académiques de l'Université de Mahajanga",
};

type Service = {
  id: number;
  name: string;
  slug: string;
  chef_service: string | null;
  address: string | null;
  contact: string | null;
  logo: { url: string } | null;
  document: { id: number; title: string; slug: string; file_url: string | null } | null;
};

export default async function ServicesPage() {
  let services: Service[] = [];
  try {
    const res = await publicGet<{ data: Service[] }>("/services?per_page=50", 60);
    services = res.data || [];
  } catch {
    // No services yet
  }

  return (
    <main className="bg-slate-50/60 dark:bg-slate-950">
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <Container>
          <div className="py-16 md:py-20">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-100">Services</p>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">
              Services administratifs et académiques
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-blue-100">
              Accédez aux différents services de l'université pour vos démarches administratives et académiques.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          {services.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex h-28 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
                    {service.logo ? (
                      <img src={service.logo.url} alt={service.name} className="h-16 w-auto object-contain" />
                    ) : (
                      <Briefcase className="h-10 w-10 text-blue-300" />
                    )}
                  </div>
                  <div className="p-5">
                    <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 dark:text-white">
                      {service.name}
                    </h2>
                    
                    {service.chef_service && (
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-medium">Chef de service:</span> {service.chef_service}
                      </p>
                    )}

                    {service.address && (
                      <div className="mt-3 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>{service.address}</span>
                      </div>
                    )}

                    {service.contact && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Phone className="h-4 w-4 shrink-0" />
                        <span>{service.contact}</span>
                      </div>
                    )}

                    {service.document && service.document.file_url && (
                      <Link
                        href={service.document.file_url}
                        target="_blank"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <FileText className="h-4 w-4" />
                        Télécharger le document
                      </Link>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-blue-600/0 transition-colors duration-300 group-hover:bg-blue-600/5" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-slate-500 dark:text-slate-300">
                Aucun service disponible pour le moment.
              </p>
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
