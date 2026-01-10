import Container from "@/components/Container";
import Link from "next/link";
import { publicGet, PUBLIC_API } from "@/lib/public-api";
import { Search, FileText, FileSpreadsheet, FileArchive, Download, Filter } from "lucide-react";

type Doc = { id: number; title: string; slug: string; excerpt?: string | null };

const categories = ["Tous", "Règlement", "Formulaire", "Rapport", "Appel d'offres", "Guide"];
const fileIcons = [FileText, FileSpreadsheet, FileArchive];

export default async function DocumentsPage() {
  const res = await publicGet<{ data: Doc[] }>("/documents?per_page=20", 60);

  return (
    <main className="bg-slate-50/70 dark:bg-slate-950">
      <section className="bg-gradient-to-br from-slate-900 via-indigo-700 to-blue-700 text-white">
        <Container>
          <div className="py-16 md:py-20">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-100">Documents</p>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">
              Ressources officielles et téléchargeables
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-indigo-100">
              Accédez aux documents administratifs, guides, rapports et formulaires utiles.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-4 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                <Filter className="h-4 w-4" />
                Catégories
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className="rounded-full border border-slate-200/80 px-4 py-2 text-sm text-slate-600 hover:bg-indigo-600 hover:text-white dark:border-slate-700 dark:text-slate-300"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
              <Search className="h-4 w-4 text-slate-400" />
              <label htmlFor="search-doc" className="sr-only">
                Rechercher un document
              </label>
              <input
                id="search-doc"
                type="search"
                placeholder="Rechercher un document..."
                className="w-full bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none dark:text-slate-200"
              />
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            {res.data.map((doc, index) => {
              const Icon = fileIcons[index % fileIcons.length];
              return (
                <div
                  key={doc.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-white px-5 py-4 shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <Link
                        href={`/documents/${doc.slug}`}
                        className="text-lg font-semibold text-slate-900 hover:text-indigo-600 dark:text-white"
                      >
                        {doc.title}
                      </Link>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {doc.excerpt ?? "Document institutionnel disponible en téléchargement."}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                      PDF · 2.4 Mo
                    </span>
                    <a
                      className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                      href={`${PUBLIC_API}/documents/${doc.id}/download`}
                    >
                      <Download className="h-4 w-4" />
                      Télécharger
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </main>
  );
}
