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

  // First post is featured
  const [featured, ...rest] = posts;

  return (
    <section className="py-20 bg-white">
      <Container>
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Actualités</h2>
            <p className="mt-2 text-slate-600">Les dernières nouvelles de l'université</p>
          </div>
          <Link
            href="/actualites"
            className="group hidden md:inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Toutes les actualités
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Featured Post */}
          <Link
            href={`/actualites/${featured.slug}`}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100"
          >
            {featured.cover_image?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={featured.cover_image.url}
                alt={featured.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-blue-600" />
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              {featured.categories?.[0] && (
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium mb-3">
                  {featured.categories[0].name}
                </span>
              )}
              <h3 className="text-2xl font-bold leading-tight group-hover:text-indigo-200 transition-colors">
                {featured.title}
              </h3>
              <p className="mt-2 text-white/80 line-clamp-2">
                {featured.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-white/60">
                <Calendar className="w-4 h-4" />
                {formatDate(featured.published_at)}
              </div>
            </div>
          </Link>

          {/* Other Posts */}
          <div className="flex flex-col gap-4">
            {rest.map((post) => (
              <Link
                key={post.id}
                href={`/actualites/${post.slug}`}
                className="group flex gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                {post.cover_image?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.cover_image.url}
                    alt={post.title}
                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-indigo-100 to-blue-100 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  {post.categories?.[0] && (
                    <span className="text-xs font-medium text-indigo-600">
                      {post.categories[0].name}
                    </span>
                  )}
                  <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(post.published_at)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-indigo-600 font-medium"
          >
            Toutes les actualités
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
