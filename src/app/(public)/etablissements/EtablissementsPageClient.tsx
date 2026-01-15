"use client";

import { useState } from "react";
import Link from "next/link";
import PageLayout from "@/components/layout/PageLayout";
import EtablissementsExplorer, {
  EtablissementsFilters,
} from "@/components/public/EtablissementsExplorer";

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

export default function EtablissementsPageClient({
  etablissements,
}: {
  etablissements: Etablissement[];
}) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"" | "faculte" | "ecole" | "institut">("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  return (
    <main className="bg-slate-50/60 dark:bg-slate-950">
      <PageLayout variant="full" containerClassName="max-w-[1280px] px-5 md:px-10">
        <div className="mb-8">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] text-[#111318] dark:text-white md:text-4xl">
              Nos établissements
            </h1>
            <p className="max-w-2xl text-base font-normal leading-normal text-[#616f89] dark:text-gray-400">
              Découvrez les établissements d'enseignement et de recherche de l'Université de Mahajanga. Explorez nos facultés, écoles et instituts répartis sur nos différents campus.
            </p>
          </div>
        </div>

        <EtablissementsFilters
          view={view}
          sortOrder={sortOrder}
          query={query}
          onQueryChange={setQuery}
          typeFilter={typeFilter}
          onViewChange={setView}
          onSortChange={setSortOrder}
          onTypeChange={setTypeFilter}
          className="mb-8"
        />

        <EtablissementsExplorer
          etablissements={etablissements}
          view={view}
          sortOrder={sortOrder}
          query={query}
          typeFilter={typeFilter}
        />

        <div className="mt-10 rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-5 text-slate-700 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-slate-200">
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
            Consultez nos documents disponibles
          </h3>
          <p className="mt-2 text-sm text-emerald-900/80 dark:text-emerald-100/80">
            Guides, rapports, formulaires et ressources utiles pour les étudiants et partenaires.
          </p>
          <Link
            href="/documents"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            Accéder aux documents
          </Link>
        </div>
      </PageLayout>
    </main>
  );
}
