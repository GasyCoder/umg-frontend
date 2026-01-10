import Container from "@/components/Container";
import Link from "next/link";
import { publicGet } from "@/lib/public-api";
import { Building2, ArrowRight, Filter } from "lucide-react";

export const metadata = {
  title: "Établissements - Université de Mahajanga",
  description: "Les facultés, écoles et instituts de l'Université de Mahajanga",
};

type Etablissement = {
  id: number;
  name: string;
  slug: string;
  acronym: string | null;
  description: string | null;
  director_name: string | null;
  director_title: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo: { url: string } | null;
  cover_image: { url: string } | null;
};

const filters = ["Tous", "Faculté", "École", "Institut", "Centre de recherche"];

export default async function EtablissementsPage() {
  let etablissements: Etablissement[] = [];
  try {
    const res = await publicGet<{ data: Etablissement[] }>("/etablissements?per_page=50", 60);
    etablissements = res.data || [];
  } catch {
    // No etablissements yet
  }

  return (
    <main className="bg-slate-50/60 dark:bg-slate-950">
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <Container>
          <div className="py-16 md:py-20">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-100">Établissements</p>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">
              Un réseau académique diversifié
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-emerald-100">
              Facultés, écoles et instituts spécialisés pour accompagner les parcours d'excellence.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200/70 bg-white/80 px-6 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <Filter className="h-4 w-4" />
              Filtrer par type
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className="rounded-full border border-slate-200/80 px-4 py-2 text-sm text-slate-600 transition hover:bg-emerald-600 hover:text-white dark:border-slate-700 dark:text-slate-300"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {etablissements.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {etablissements.map((etab, index) => (
                <Link
                  key={etab.id}
                  href={`/etablissements/${etab.slug}`}
                  className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex h-28 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900">
                    {etab.logo ? (
                      <img src={etab.logo.url} alt={etab.name} className="h-16 w-auto object-contain" />
                    ) : (
                      <Building2 className="h-10 w-10 text-slate-300" />
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-600 dark:text-white">
                        {etab.acronym || `Établissement ${index + 1}`}
                      </h2>
                      <ArrowRight className="h-4 w-4 text-emerald-500 opacity-0 transition-all group-hover:opacity-100" />
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {etab.name}
                    </p>
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {etab.description
                        ? etab.description.replace(/<[^>]*>/g, "").slice(0, 110)
                        : "Présentation de l'établissement en cours de mise à jour."}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-emerald-600/0 transition-colors duration-300 group-hover:bg-emerald-600/5" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-12 text-center">
              <Building2 className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-slate-500 dark:text-slate-300">
                Aucun établissement disponible pour le moment.
              </p>
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
