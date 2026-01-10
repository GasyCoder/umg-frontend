import Container from "@/components/Container";
import { publicGet } from "@/lib/public-api";
import { Calendar, Landmark } from "lucide-react";

export const metadata = {
  title: "Historique - Université de Mahajanga",
  description: "L'histoire de l'Université de Mahajanga depuis sa création",
};

type Page = {
  id: number;
  title: string;
  content: string | null;
  slug: string;
};

const timeline = [
  {
    year: "1977",
    title: "Création de l'Université",
    description: "Lancement officiel des premières filières et structuration des facultés fondatrices.",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    year: "1995",
    title: "Expansion académique",
    description: "Ouverture de nouveaux instituts et renforcement des partenariats scientifiques.",
    image:
      "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    year: "2010",
    title: "Modernisation des infrastructures",
    description: "Rénovation des campus, bibliothèques et laboratoires de recherche.",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    year: "2023",
    title: "Innovation & numérique",
    description: "Mise en place de dispositifs numériques et d'espaces pédagogiques connectés.",
    image:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80",
  },
];

export default async function HistoriquePage() {
  let pages: Page[] = [];
  try {
    const res = await publicGet<{ data: Page[] }>("/organization-pages/type/historique", 60);
    pages = res.data || [];
  } catch {
    // No pages yet
  }

  return (
    <main className="bg-white dark:bg-slate-950">
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <Container>
          <div className="py-16 md:py-20">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-100">Historique</p>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">Une histoire en mouvement</h1>
            <p className="mt-4 max-w-2xl text-lg text-blue-100">
              L'Université de Mahajanga évolue depuis des décennies pour répondre aux défis de la
              formation, de la recherche et du développement régional.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          {pages.length > 0 && (
            <div className="mb-12 rounded-3xl border border-slate-200/70 bg-slate-50/70 p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
              {pages.map((page) => (
                <article key={page.id} className="prose prose-slate dark:prose-invert max-w-none">
                  <h2>{page.title}</h2>
                  {page.content && <div dangerouslySetInnerHTML={{ __html: page.content }} />}
                </article>
              ))}
            </div>
          )}

          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Jalons clés
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-300">
                Explorez les étapes marquantes de notre parcours institutionnel.
              </p>
              <div className="mt-8 space-y-8">
                {timeline.map((event, index) => (
                  <div key={event.year} className="relative pl-10">
                    <span className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-md dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-indigo-500">
                        <Calendar className="h-4 w-4" />
                        {event.year}
                      </div>
                      <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                        {event.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                <Landmark className="h-4 w-4" />
                Archives visuelles
              </div>
              {timeline.map((event) => (
                <div
                  key={event.title}
                  className="group overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                >
                  <img
                    src={event.image}
                    alt={`Archive ${event.year}`}
                    className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
                      {event.year}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                      {event.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
