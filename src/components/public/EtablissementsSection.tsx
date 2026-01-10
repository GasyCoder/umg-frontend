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
    <section className="py-20 bg-slate-50">
      <Container>
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Nos Établissements</h2>
            <p className="mt-2 text-slate-600">
              Découvrez les facultés et écoles de l'Université de Mahajanga
            </p>
          </div>
          <Link
            href="/etablissements"
            className="group hidden md:inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Voir tous
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {etablissements.slice(0, 4).map((etab) => (
            <Link
              key={etab.id}
              href={`/etablissements/${etab.slug}`}
              className="group p-6 rounded-2xl bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300"
            >
              {/* Logo or Icon */}
              <div className="w-16 h-16 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                {etab.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={etab.logo_url}
                    alt={etab.name}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-indigo-600" />
                )}
              </div>

              {/* Short Name */}
              {etab.short_name && (
                <div className="text-sm font-bold text-indigo-600 mb-1">
                  {etab.short_name}
                </div>
              )}

              {/* Name */}
              <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {etab.name}
              </h3>

              {/* Description */}
              {etab.description && (
                <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                  {etab.description}
                </p>
              )}
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/etablissements"
            className="inline-flex items-center gap-2 text-indigo-600 font-medium"
          >
            Voir tous les établissements
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
