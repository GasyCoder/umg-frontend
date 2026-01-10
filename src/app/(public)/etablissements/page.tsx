import Container from "@/components/Container";
import Link from "next/link";
import { publicGet } from "@/lib/public-api";
import { Building2, MapPin, Phone, Mail, Globe, ArrowRight } from "lucide-react";

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

export default async function EtablissementsPage() {
  let etablissements: Etablissement[] = [];
  try {
    const res = await publicGet<{ data: Etablissement[] }>("/etablissements?per_page=50", 60);
    etablissements = res.data || [];
  } catch {
    // No etablissements yet
  }

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <Container>
          <div className="py-12 md:py-16">
            <h1 className="text-3xl md:text-4xl font-bold">Établissements</h1>
            <p className="mt-2 text-emerald-100">
              Facultés, écoles et instituts de l'Université de Mahajanga
            </p>
          </div>
        </Container>
      </section>

      {/* List */}
      <section className="py-12">
        <Container>
          {etablissements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {etablissements.map((etab) => (
                <Link
                  key={etab.id}
                  href={`/etablissements/${etab.slug}`}
                  className="group block bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300"
                >
                  {/* Cover / Logo */}
                  <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                    {etab.logo ? (
                      <img
                        src={etab.logo.url}
                        alt={etab.name}
                        className="h-20 w-auto object-contain"
                      />
                    ) : (
                      <Building2 className="w-12 h-12 text-slate-300" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h2 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors flex items-center gap-2">
                      {etab.name}
                      {etab.acronym && (
                        <span className="text-sm font-normal text-slate-500">
                          ({etab.acronym})
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h2>

                    {etab.director_name && (
                      <p className="mt-2 text-sm text-slate-600">
                        {etab.director_title}: {etab.director_name}
                      </p>
                    )}

                    {etab.description && (
                      <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                        {etab.description.replace(/<[^>]*>/g, "").slice(0, 120)}...
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                      {etab.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {etab.phone}
                        </span>
                      )}
                      {etab.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {etab.email}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Aucun établissement disponible pour le moment.</p>
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
