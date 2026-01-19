"use client";

import { useState } from "react";
import Link from "next/link";
import PageLayout from "@/components/layout/PageLayout";
import EtablissementsExplorer, {
  EtablissementsFilters,
} from "@/components/public/EtablissementsExplorer";
import { useI18n } from "@/components/i18n/LanguageProvider";

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
  const { t } = useI18n();
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
              {t("etablissements.title")}
            </h1>
            <p className="max-w-2xl text-base font-normal leading-normal text-[#616f89] dark:text-gray-400">
              {t("etablissements.subtitle")}
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
            {t("etablissements.docs.title")}
          </h3>
          <p className="mt-2 text-sm text-emerald-900/80 dark:text-emerald-100/80">
            {t("etablissements.docs.subtitle")}
          </p>
          <Link
            href="/documents"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            {t("etablissements.docs.cta")}
          </Link>
        </div>
      </PageLayout>
    </main>
  );
}
