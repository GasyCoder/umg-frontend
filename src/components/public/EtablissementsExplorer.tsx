"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";

const FALLBACK_IMAGE = "/images/placeholder.jpg";

type Etablissement = {
  id: number;
  name: string;
  slug: string;
  acronym: string | null;
  description: string | null;
  director_name?: string | null;
  director_title?: string | null;
  address?: string | null;
  logo?: { url: string } | null;
  cover_image?: { url: string } | null;
};

type SortOrder = "asc" | "desc";

type EtablissementsExplorerProps = {
  etablissements: Etablissement[];
  view?: "grid" | "list";
  sortOrder?: SortOrder;
  query?: string;
  typeFilter?: "faculte" | "ecole" | "institut" | "";
};

type EtablissementsFiltersProps = {
  view: "grid" | "list";
  sortOrder: SortOrder;
  query: string;
  onQueryChange: (value: string) => void;
  typeFilter: "faculte" | "ecole" | "institut" | "";
  onViewChange: (value: "grid" | "list") => void;
  onSortChange: (value: SortOrder) => void;
  onTypeChange: (value: "faculte" | "ecole" | "institut" | "") => void;
  className?: string;
};

export function EtablissementsFilters({
  view,
  sortOrder,
  query,
  onQueryChange,
  typeFilter,
  onViewChange,
  onSortChange,
  onTypeChange,
  className = "",
}: EtablissementsFiltersProps) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-[#1e2736]",
        className
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#616f89]">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Rechercher un établissement (ex: Médecine, Sciences...)"
            className="h-12 w-full rounded-lg border border-[#dbdfe6] bg-white pl-10 pr-3 text-[#111318] placeholder-[#616f89] transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="flex w-full flex-col gap-4 sm:flex-row lg:w-auto">
          <div className="relative min-w-[200px]">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#616f89]">
              <span className="material-symbols-outlined text-[20px]">school</span>
            </div>
            <select
              value={typeFilter}
              onChange={(event) => onTypeChange(event.target.value as EtablissementsFiltersProps["typeFilter"])}
              className="h-12 w-full appearance-none rounded-lg border border-[#dbdfe6] bg-white pl-10 pr-10 text-[#111318] transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="">Tous les types</option>
              <option value="faculte">Facultes</option>
              <option value="ecole">Ecoles</option>
              <option value="institut">Instituts</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[#616f89]">
              <span className="material-symbols-outlined text-[20px]">expand_more</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSortChange(sortOrder === "asc" ? "desc" : "asc")}
            className="flex h-12 items-center gap-2 rounded-lg border border-[#dbdfe6] bg-white px-4 text-sm font-medium text-[#111318] transition-all hover:border-primary/40 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <span className="material-symbols-outlined text-[20px] text-[#616f89]">sort_by_alpha</span>
            <span>{sortOrder === "asc" ? "A - Z" : "Z - A"}</span>
            <span className="material-symbols-outlined text-[18px] text-[#616f89]">
              {sortOrder === "asc" ? "south" : "north"}
            </span>
          </button>
          <div className="flex h-12 items-center gap-2 rounded-lg border border-[#dbdfe6] bg-white px-2 text-sm text-[#111318] dark:border-gray-600 dark:bg-gray-800 dark:text-white">
            <button
              type="button"
              onClick={() => onViewChange("grid")}
              className={clsx(
                "flex h-8 items-center gap-2 rounded-md px-3 transition",
                view === "grid" ? "bg-primary text-white" : "text-[#616f89]"
              )}
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
              Grille
            </button>
            <button
              type="button"
              onClick={() => onViewChange("list")}
              className={clsx(
                "flex h-8 items-center gap-2 rounded-md px-3 transition",
                view === "list" ? "bg-primary text-white" : "text-[#616f89]"
              )}
            >
              <span className="material-symbols-outlined text-[18px]">view_list</span>
              Liste
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EtablissementsExplorer({
  etablissements,
  view = "grid",
  sortOrder = "asc",
  query = "",
  typeFilter = "",
}: EtablissementsExplorerProps) {
  const getType = (name: string) => {
    const lowered = name.toLowerCase();
    if (lowered.includes("facult")) return "faculte";
    if (lowered.includes("ecole") || lowered.includes("école")) return "ecole";
    if (lowered.includes("institut")) return "institut";
    return "";
  };

  const getTypeBadge = (name: string) => {
    const type = getType(name);
    switch (type) {
      case "faculte":
        return { label: "Faculte", className: "text-primary ring-primary/20" };
      case "ecole":
        return { label: "Ecole", className: "text-green-600 ring-green-600/20" };
      case "institut":
        return { label: "Institut", className: "text-amber-600 ring-amber-600/20" };
      default:
        return { label: "Etablissement", className: "text-slate-600 ring-slate-400/20" };
    }
  };

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return etablissements.filter((item) => {
      const type = getType(item.name);
      if (typeFilter && typeFilter !== type) return false;
      if (!keyword) return true;
      const haystack = [
        item.name,
        item.acronym,
        item.description?.replace(/<[^>]*>/g, ""),
        item.director_name,
        item.address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(keyword);
    });
  }, [etablissements, query, typeFilter]);

  const sorted = useMemo(() => {
    const items = [...filtered];
    items.sort((a, b) => {
      const left = a.name || "";
      const right = b.name || "";
      return left.localeCompare(right, "fr", { sensitivity: "base" });
    });
    if (sortOrder === "desc") items.reverse();
    return items;
  }, [filtered, sortOrder]);

  if (sorted.length === 0) {
    return (
      <div className="mt-12 text-center">
        <span className="material-symbols-outlined mx-auto text-4xl text-slate-300">school</span>
        <p className="mt-4 text-slate-500 dark:text-slate-300">
          Aucun établissement disponible pour le moment.
        </p>
      </div>
    );
  }

  if (view === "list") {
    return (
      <div className="space-y-4">
        {sorted.map((etab) => {
          const badge = getTypeBadge(etab.name);
          return (
            <Link
              key={etab.id}
              href={`/etablissements/${etab.slug}`}
              className="group flex flex-col gap-4 rounded-xl border border-[#f0f2f4] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md md:flex-row md:items-center dark:border-gray-800 dark:bg-[#1e2736]"
            >
              <div className="relative h-28 w-full overflow-hidden rounded-lg bg-gray-200 md:h-24 md:w-40 dark:bg-gray-700">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url("${etab.cover_image?.url || FALLBACK_IMAGE}")` }}
                />
              </div>
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-bold leading-tight text-[#111318] dark:text-white">
                    {etab.name}
                  </h3>
                  <span
                    className={clsx(
                      "inline-flex items-center rounded-md bg-white/90 px-2 py-0.5 text-xs font-medium ring-1 dark:bg-black/70",
                      badge.className
                    )}
                  >
                    {badge.label}
                  </span>
                  {etab.acronym && (
                    <span className="rounded-md bg-[#eef2ff] px-2 py-0.5 text-xs font-semibold text-primary ring-1 ring-primary/20 dark:bg-blue-900/40 dark:text-blue-100">
                      {etab.acronym}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-[#616f89] dark:text-gray-400">
                  {etab.director_name && (
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">person</span>
                      {etab.director_title || "Direction"}: {etab.director_name}
                    </span>
                  )}
                  {etab.address && (
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">location_on</span>
                      {etab.address}
                    </span>
                  )}
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-normal text-[#616f89] dark:text-gray-400">
                  {etab.description
                    ? etab.description.replace(/<[^>]*>/g, "")
                    : "Présentation de l'établissement en cours de mise à jour."}
                </p>
              </div>
              <span className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 px-4 text-sm font-bold text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-white">
                Voir les détails
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sorted.map((etab) => {
        const badge = getTypeBadge(etab.name);
        return (
          <Link
            key={etab.id}
            href={`/etablissements/${etab.slug}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-[#f0f2f4] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-[#1e2736]"
          >
            <div className="relative h-48 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url("${etab.cover_image?.url || FALLBACK_IMAGE}")` }}
              />
              {etab.logo?.url && (
                <div className="absolute top-4 left-4 rounded-xl bg-white/90 p-2 shadow-sm ring-1 ring-white/60 backdrop-blur-sm dark:bg-black/60">
                  <img
                    src={etab.logo.url}
                    alt={`Logo ${etab.name}`}
                    className="h-10 w-10 object-contain"
                  />
                </div>
              )}
              <div className="absolute right-4 top-4">
                <span
                  className={clsx(
                    "inline-flex items-center rounded-md bg-white/90 px-2 py-1 text-xs font-medium ring-1 backdrop-blur-sm dark:bg-black/70",
                    badge.className
                  )}
                >
                  {badge.label}
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="mb-2 flex items-start justify-between gap-3">
                <h3 className="text-xl font-bold leading-tight text-[#111318] dark:text-white">
                  {etab.name}
                </h3>
                {etab.acronym && (
                  <span className="shrink-0 rounded-md bg-[#eef2ff] px-2 py-1 text-xs font-semibold text-primary ring-1 ring-primary/20 dark:bg-blue-900/40 dark:text-blue-100">
                    {etab.acronym}
                  </span>
                )}
              </div>
              <div className="mb-4 flex flex-col gap-2 text-sm text-[#616f89] dark:text-gray-400">
                {etab.director_name && (
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    <span className="font-medium">
                      {etab.director_title || "Direction"}: {etab.director_name}
                    </span>
                  </div>
                )}
                {etab.address && (
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                    <span>{etab.address}</span>
                  </div>
                )}
              </div>
              <p className="mb-4 line-clamp-2 text-sm leading-normal text-[#616f89] dark:text-gray-400">
                {etab.description
                  ? etab.description.replace(/<[^>]*>/g, "")
                  : "Présentation de l'établissement en cours de mise à jour."}
              </p>
              <span className="mt-auto inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-white">
                Voir les détails
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
