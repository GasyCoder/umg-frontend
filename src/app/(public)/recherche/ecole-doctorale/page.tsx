import Link from "next/link";
import { GraduationCap, FolderKanban, ArrowRight } from "lucide-react";

export const metadata = {
  title: "École doctorale - Université de Mahajanga",
  description: "Informations sur l'École doctorale de l'Université de Mahajanga.",
};

export default function EcoleDoctoralePage() {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-white py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
            Recherche
          </p>
          <h1 className="mt-4 text-3xl lg:text-4xl font-bold tracking-tight flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            École doctorale
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-2xl">
            Page en cours de préparation. Vous pouvez déjà consulter les projets associés.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/projets-internationale/infprev4frica"
            className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <FolderKanban className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Projet InfPrev4frica
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Découvrir la présentation du projet.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>
          </Link>

          <Link
            href="/projets-internationale/docet4africa"
            className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <FolderKanban className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Projet DOCET4AFRICA
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Découvrir la présentation du projet.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

