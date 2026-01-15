"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, Tag, Clock } from "lucide-react";
import type { Post } from "@/lib/types";

interface NewsSectionProps {
  posts: Post[];
}

export default function NewsSection({ posts }: NewsSectionProps) {
  // Format date helper
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  // Calculate reading time
  const calculateReadingTime = (excerpt: string | null | undefined) => {
    if (!excerpt) return "3 min";
    const words = excerpt.split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min`;
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50 dark:from-[#101622] dark:to-slate-900/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 mb-4">
              <span className="size-2 rounded-full bg-accent animate-pulse"></span>
              <span className="text-xs font-bold text-accent uppercase tracking-wider">À la une</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
              Dernières actualités
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
              Restez informé de la vie universitaire et des événements
            </p>
          </div>
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all group"
          >
            Voir toutes les actualités
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {posts && posts.length > 0 ? (
          <>
            {/* Featured Post */}
            {posts[0] && (
              <article className="group relative mb-10 overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl dark:shadow-none transition-all">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="relative h-64 md:h-full min-h-[300px] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Image
                      src={posts[0].cover_image?.url || "/images/placeholder.jpg"}
                      alt={posts[0].title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    {posts[0].categories?.[0] && (
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-blue-600">
                          <Tag className="w-3 h-3" />
                          {posts[0].categories[0].name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(posts[0].published_at)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{calculateReadingTime(posts[0].excerpt)}</span>
                      </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {posts[0].title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 leading-relaxed">
                      {posts[0].excerpt || "Découvrez les derniers articles et mises à jour de l'Université de Mahajanga."}
                    </p>

                    <Link
                      href={`/actualites/${posts[0].slug}`}
                      className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm hover:gap-3 transition-all group/link"
                    >
                      Lire l&apos;article
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            )}

            {/* Grid of Posts */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(1, 7).map((post) => (
                <article
                  key={post.id}
                  className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-lg dark:hover:border-slate-700 transition-all"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Image
                      src={post.cover_image?.url || "/images/placeholder.jpg"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    {post.categories?.[0] && (
                      <div className="absolute bottom-3 left-3">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-sm text-xs font-bold text-blue-600">
                          {post.categories[0].name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(post.published_at)}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{calculateReadingTime(post.excerpt)}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed flex-grow">
                      {post.excerpt}
                    </p>

                    <Link
                      href={`/actualites/${post.slug}`}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:gap-3 transition-all"
                    >
                      Lire la suite
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-slate-200 dark:border-slate-800 border-dashed">
            <p className="text-slate-500 dark:text-slate-400 text-lg">Aucune actualité disponible pour le moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
