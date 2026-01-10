import Container from "@/components/Container";
import { publicGet } from "@/lib/public-api";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, ArrowRight } from "lucide-react";
import { ArticleGallery, ShareButtons } from "@/components/public";

const heroImage =
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80";

const relatedArticles = [
  {
    title: "La recherche scientifique au service du territoire",
    slug: "recherche-territoire",
    category: "Recherche",
  },
  {
    title: "Nouveaux partenariats internationaux signés en 2024",
    slug: "partenariats-2024",
    category: "Partenariats",
  },
  {
    title: "Innovation pédagogique : classes connectées",
    slug: "innovation-pedagogique",
    category: "Innovation",
  },
];

type Post = {
  title: string;
  slug: string;
  content_html?: string | null;
  published_at?: string | null;
};

export default async function NewsShow({ params }: { params: { slug: string } }) {
  const res = await publicGet<{ data: Post }>(`/posts/${params.slug}`, 30);
  const post = res.data;

  return (
    <main className="bg-white dark:bg-slate-950">
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img src={heroImage} alt="Université de Mahajanga" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/60 to-slate-950/80" />
        <Container>
          <div className="relative z-10 flex h-full flex-col justify-end pb-12 text-white">
            <Link
              href="/actualites"
              className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux actualités
            </Link>
            <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">{post.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/80">
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "Publication récente"}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Lecture 5 min
              </span>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-10">
              <article className="prose prose-slate max-w-none dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: post.content_html ?? "" }} />
              </article>

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Galerie
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Temps forts et moments clés de cette actualité.
                </p>
                <div className="mt-6">
                  <ArticleGallery />
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-300">
                  Partager l'article
                </h3>
                <div className="mt-4">
                  <ShareButtons />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-indigo-600 to-blue-600 p-6 text-white shadow-xl">
                <h3 className="text-lg font-semibold">Recevoir nos actualités</h3>
                <p className="mt-2 text-sm text-indigo-100">
                  Inscrivez-vous pour suivre les annonces officielles et événements.
                </p>
                <form className="mt-4 flex flex-col gap-3">
                  <label htmlFor="newsletter" className="sr-only">
                    Votre email
                  </label>
                  <input
                    id="newsletter"
                    type="email"
                    placeholder="votre@email.com"
                    className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-indigo-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-300"
                  >
                    S'inscrire
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 dark:bg-slate-900">
        <Container>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">À lire aussi</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Articles similaires
              </h2>
            </div>
            <Link href="/actualites" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
              Voir toutes les actualités
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {relatedArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/actualites/${article.slug}`}
                className="group rounded-2xl border border-white/70 bg-white p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950"
              >
                <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
                  {article.category}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-white">
                  {article.title}
                </h3>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600">
                  Lire l'article
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
