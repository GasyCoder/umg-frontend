import Link from "next/link";
import Container from "@/components/Container";
import { ArrowRight, Calendar } from "lucide-react";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  published_at?: string | null;
  cover_image?: { url: string } | null;
  categories?: { id: number; name: string }[];
}

interface NewsSectionProps {
  posts: Post[];
}

export function NewsSection({ posts }: NewsSectionProps) {
  if (!posts || posts.length === 0) return null;

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const [featured, ...rest] = posts;

  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Actualités</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
              Les dernières nouvelles
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Suivez les annonces officielles, événements et initiatives du campus.
            </p>
          </div>
          <Link
            href="/actualites"
            className="group inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-500 font-semibold"
          >
            Toutes les actualités
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
          <Link
            href={`/actualites/${featured.slug}`}
            className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-slate-100 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
          >
            {featured.cover_image?.url ? (
              <img
                src={featured.cover_image.url}
                alt={featured.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-600" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent" />
            <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white">
              {featured.categories?.[0] && (
                <span className="inline-flex w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                  {featured.categories[0].name}
                </span>
              )}
              <h3 className="mt-3 text-2xl font-bold leading-tight">
                {featured.title}
              </h3>
              <p className="mt-2 text-sm text-white/80 line-clamp-2">
                {featured.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-white/70">
                <Calendar className="h-4 w-4" />
                {formatDate(featured.published_at)}
              </div>
            </div>
          </Link>

          <div className="flex flex-col gap-4">
            {rest.map((post) => (
              <Link
                key={post.id}
                href={`/actualites/${post.slug}`}
                className="group flex gap-4 rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
              >
                {post.cover_image?.url ? (
                  <img
                    src={post.cover_image.url}
                    alt={post.title}
                    className="h-24 w-24 rounded-2xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 flex-shrink-0 dark:from-indigo-500/30 dark:to-blue-500/30" />
                )}
                <div className="flex-1 min-w-0">
                  {post.categories?.[0] && (
                    <span className="text-xs font-semibold text-indigo-600">
                      {post.categories[0].name}
                    </span>
                  )}
                  <h3 className="mt-1 font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-white line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(post.published_at)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
