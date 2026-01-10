import Container from "@/components/Container";
import { publicGet } from "@/lib/public-api";
import { Users, Crown, Briefcase, GraduationCap } from "lucide-react";

export const metadata = {
  title: "Organisation - Université de Mahajanga",
  description: "Organisation, présidence, directions et services de l'Université de Mahajanga",
};

type Page = {
  id: number;
  title: string;
  content: string | null;
  slug: string;
};

const directions = [
  {
    name: "Pr. Jean Andrianina",
    role: "Président de l'Université",
    department: "Présidence",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Dr. Marie Randri",
    role: "Vice-présidente Recherche",
    department: "Recherche & Innovation",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "M. Hery Andria",
    role: "Secrétaire général",
    department: "Administration",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Pr. Fara Raja",
    role: "Directrice des Études",
    department: "Pédagogie",
    image:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=800&q=80",
  },
];

export default async function OrganisationPage() {
  let pages: Page[] = [];
  try {
    const res = await publicGet<{ data: Page[] }>("/organization-pages/type/organisation", 60);
    pages = res.data || [];
  } catch {
    // No pages yet
  }

  let organigramme: Page[] = [];
  try {
    const res = await publicGet<{ data: Page[] }>("/organization-pages/type/organigramme", 60);
    organigramme = res.data || [];
  } catch {
    // No organigramme yet
  }

  return (
    <main className="bg-white dark:bg-slate-950">
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <Container>
          <div className="py-16 md:py-20">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-100">Organisation</p>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">Une gouvernance structurée</h1>
            <p className="mt-4 max-w-2xl text-lg text-indigo-100">
              La gouvernance de l'université repose sur une équipe de direction engagée et des
              structures administratives modernes.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div className="space-y-6">
              {pages.length > 0 ? (
                pages.map((page) => (
                  <article key={page.id} className="prose prose-slate dark:prose-invert max-w-none">
                    <h2>{page.title}</h2>
                    {page.content && <div dangerouslySetInnerHTML={{ __html: page.content }} />}
                  </article>
                ))
              ) : (
                <div className="rounded-3xl border border-slate-200/70 bg-slate-50/70 p-8 text-slate-600 shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                  Informations détaillées en cours de rédaction.
                </div>
              )}

              <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Organigramme</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Schéma simplifié des principales entités.
                </p>
                <div className="mt-6 grid gap-4">
                  <div className="rounded-2xl bg-indigo-600 px-4 py-3 text-white shadow">
                    <span className="text-sm font-semibold">Présidence</span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                      Vice-présidence Recherche
                    </div>
                    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                      Vice-présidence Pédagogie
                    </div>
                    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                      Secrétariat Général
                    </div>
                    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                      Directions Administratives
                    </div>
                  </div>
                </div>

                {organigramme.length > 0 && (
                  <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-700">
                    {organigramme.map((page) => (
                      <article key={page.id} className="prose prose-slate dark:prose-invert max-w-none">
                        {page.content && <div dangerouslySetInnerHTML={{ __html: page.content }} />}
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                <Users className="h-4 w-4" />
                Équipe de direction
              </div>
              <div className="mt-6 grid gap-6">
                {directions.map((direction, index) => {
                  const icons = [Crown, Briefcase, Users, GraduationCap];
                  const Icon = icons[index % icons.length];
                  return (
                    <div
                      key={direction.name}
                      className="rounded-3xl border border-slate-200/70 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="flex items-center gap-4 p-5">
                        <img
                          src={direction.image}
                          alt={direction.name}
                          className="h-16 w-16 rounded-2xl object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {direction.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{direction.role}</p>
                          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                            <Icon className="h-3.5 w-3.5" />
                            {direction.department}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
