"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
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

  return (
    <div className="flex flex-col h-full">
      {/* Section Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Actualités
          </h2>
          <Link
            href="/actualites"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:gap-2 transition-all"
          >
            Voir tout
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="h-1 w-16 bg-blue-600 rounded-full"></div>
      </div>

      {/* Posts List */}
      {posts && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.slice(0, 6).map((post) => (
            <article
              key={post.id}
              className="group flex gap-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all"
            >
              {/* Image */}
              <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                <Image
                  src={post.cover_image?.url || "/images/placeholder.jpg"}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-grow min-w-0">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(post.published_at)}</span>
                  {post.categories?.[0] && (
                    <>
                      <span>•</span>
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">
                        {post.categories[0].name}
                      </span>
                    </>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  <Link href={`/actualites/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 border-dashed">
          <p className="text-slate-500 dark:text-slate-400 text-sm">Aucune actualité disponible.</p>
        </div>
      )}
    </div>
  );
}
