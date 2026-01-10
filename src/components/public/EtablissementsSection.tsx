import Link from "next/link";
import Container from "@/components/Container";
import { ArrowRight, Building2 } from "lucide-react";

interface Etablissement {
  id: number;
  name: string;
  slug: string;
  short_name?: string | null;
  description?: string | null;
  logo_url?: string | null;
}

interface EtablissementsSectionProps {
  etablissements: Etablissement[];
}

export function EtablissementsSection({ etablissements }: EtablissementsSectionProps) {
  if (!etablissements || etablissements.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Établissements</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
              Nos facultés et écoles
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Un réseau académique diversifié pour accompagner chaque parcours.
            </p>
          </div>
          <Link
            href="/etablissements"
            className="group inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-500 font-semibold"
          >
            Voir tous
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {etablissements.slice(0, 4).map((etab) => (
            <Link
              key={etab.id}
              href={`/etablissements/${etab.slug}`}
              className="group rounded-3xl border border-slate-200/70 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                {etab.logo_url ? (
                  <img
                    src={etab.logo_url}
                    alt={etab.name}
                    className="h-10 w-10 object-contain"
                  />
                ) : (
                  <Building2 className="h-7 w-7" />
                )}
              </div>

              {etab.short_name && (
                <div className="mt-4 text-xs font-semibold uppercase tracking-widest text-indigo-600">
                  {etab.short_name}
                </div>
              )}

              <h3 className="mt-2 text-lg font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-white line-clamp-2">
                {etab.name}
              </h3>

              {etab.description && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                  {etab.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
