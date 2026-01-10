import Container from "@/components/Container";
import Link from "next/link";
import { Search, SlidersHorizontal, Calendar, ArrowRight } from "lucide-react";
import { publicGet } from "@/lib/public-api";

const categories = [
  "Toutes",
  "Recherche",
  "Campus",
  "Vie étudiante",
  "Partenariats",
  "Innovation",
];

const coverImages = [
  "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1487528278747-ba99ed528ebc?auto=format&fit=crop&w=1200&q=80",
];

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  published_at?: string | null;
};

export default async function NewsPage() {
  const res = await publicGet<{ data: Post[] }>("/posts?per_page=12", 30);

  return (
    <main className="bg-slate-50/60 dark:bg-slate-950">
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 text-white">
        <Container>
          <div className="py-16 md:py-20">
            <p className="text-sm uppercase tracking-[0.2em] text-indigo-100">Actualités</p>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
              Informations, événements et annonces officielles
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-indigo-100">
              Restez informé des temps forts de l'Université de Mahajanga : vie académique,
              recherche, partenariats et initiatives étudiantes.
            </p>

            <div className="mt-8 grid gap-4 rounded-3xl bg-white/10 p-4 backdrop-blur-sm md:grid-cols-[1.2fr_auto]">
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
                <Search className="h-5 w-5 text-indigo-100" />
                <label htmlFor="search" className="sr-only">
                  Rechercher une actualité
                </label>
                <input
                  id="search"
                  type="search"
                  placeholder="Rechercher un article, une actualité, un événement..."
                  className="w-full bg-transparent text-sm text-white placeholder:text-indigo-100 focus:outline-none"
                />
              </div>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg hover:bg-amber-300"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtrer
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className="rounded-full border border-white/30 px-4 py-2 text-sm text-white/90 transition hover:bg-white/20"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {res.data.map((post, index) => (
              <article
                key={post.id}
                className="group overflow-hidden rounded-2xl border border-white/60 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={coverImages[index % coverImages.length]}
                    alt="Illustration de l'actualité"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-indigo-600">
                    Communiqué
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-300">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                        : "Mise à jour récente"}
                    </span>
                  </div>
                  <h2 className="mt-3 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
                    {post.excerpt ?? "Découvrez les dernières initiatives, annonces et réussites de l'université."}
                  </p>
                  <Link
                    href={`/actualites/${post.slug}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Lire la suite
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/80 px-6 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-600 dark:text-slate-300">Page 1 sur 5</p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`h-10 w-10 rounded-full text-sm font-semibold transition-colors ${
                    page === 1
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
