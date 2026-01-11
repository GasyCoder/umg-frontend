import Link from "next/link";
import type { Post } from "@/lib/types";

interface NewsSectionProps {
  posts: Post[];
}

export function NewsSection({ posts }: NewsSectionProps) {
  // Debug: always show section even if empty
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            📰 Actualités
          </h2>
          <p className="text-gray-600">
            Les dernières nouvelles de l'Université de Mahajanga
          </p>
        </div>

        {/* Debug info */}
        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Debug:</strong> {posts?.length ?? 0} article(s) reçu(s)
          </p>
        </div>

        {/* Posts List */}
        {posts && posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article 
                key={post.id} 
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                {/* Category */}
                {post.categories?.[0] && (
                  <span className="inline-block text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded mb-3">
                    {post.categories[0].name}
                  </span>
                )}
                
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  <Link href={`/actualites/${post.slug}`} className="hover:text-green-700">
                    {post.title}
                  </Link>
                </h3>
                
                {/* Excerpt */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt || "Pas d'extrait disponible."}
                </p>
                
                {/* Date */}
                <p className="text-xs text-gray-400">
                  {formatDate(post.published_at)}
                </p>
                
                {/* Link */}
                <Link 
                  href={`/actualites/${post.slug}`}
                  className="inline-block mt-4 text-sm text-green-700 font-medium hover:underline"
                >
                  Lire la suite →
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
            <p className="text-gray-500">Aucune actualité disponible pour le moment.</p>
          </div>
        )}

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link 
            href="/actualites"
            className="inline-block px-6 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors"
          >
            Voir toutes les actualités
          </Link>
        </div>
      </div>
    </section>
  );
}
