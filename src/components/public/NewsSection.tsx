"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, FileText, Download } from "lucide-react";
import type { Post, Document } from "@/lib/types";

interface NewsSectionProps {
  posts: Post[];
  documents: Document[];
}

export default function NewsSection({ posts, documents }: NewsSectionProps) {
  // Format date helper
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <section className="py-20 bg-white dark:bg-[#101622] transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="size-2 rounded-full bg-accent"></span>
              <span className="text-xs font-bold text-accent uppercase tracking-wider">Informations</span>
            </div>
            <h2 className="text-xl md:text-xl font-black text-slate-900 dark:text-white">Actualités & Documents</h2>
          </div>
          <Link href="/actualites" className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-500 transition-colors bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700">
             Toutes les actualités
             <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* News List (2/3) */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {posts && posts.length > 0 ? (
                posts.slice(0, 4).map((post) => (
                    <article key={post.id} className="group relative flex flex-col md:flex-row gap-6 bg-white dark:bg-slate-900 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-800">
                        <div className="w-full md:w-48 h-32 shrink-0 rounded-xl overflow-hidden relative bg-slate-100">
                            <Image
                                src={post.cover_image?.url || "/images/placeholder.jpg"}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="flex flex-col justify-center flex-grow">
                             <div className="flex items-center gap-2 text-slate-400 text-xs mb-2 font-medium">
                                <Calendar className="w-3 h-3" />
                                {formatDate(post.published_at)}
                                {post.categories?.[0] && (
                                    <>
                                        <span>•</span>
                                        <span className="text-primary dark:text-blue-400 font-bold">{post.categories[0].name}</span>
                                    </>
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors line-clamp-2">
                                {post.title}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed">
                                {post.excerpt || "Découvrez les derniers articles et mises à jour de l'Université de Mahajanga."}
                            </p>
                            <Link href={`/actualites/${post.slug}`} className="absolute inset-0" aria-label={`Lire ${post.title}`} />
                        </div>
                    </article>
                ))
            ) : (
                 <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 border-dashed">
                      <p className="text-slate-500 dark:text-slate-400">Aucune actualité disponible pour le moment.</p>
                 </div>
            )}
          </div>

          {/* Documents Sidebar (1/3) */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-soft dark:shadow-none h-full">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-accent" /> Documents
                    </h3>
                    <Link href="/documents" className="text-xs font-bold text-primary dark:text-blue-400 hover:underline">
                        Voir tout
                    </Link>
                </div>
                
                <div className="flex flex-col gap-4">
                    {documents && documents.length > 0 ? (
                        documents.slice(0, 5).map((doc) => (
                            <div key={doc.id} className="group flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                                <div className="flex items-center justify-center w-10 h-10 bg-blue-50 dark:bg-slate-800 text-primary dark:text-blue-400 rounded-lg shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors truncate">
                                        {doc.title}
                                    </h4>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 uppercase tracking-wide">
                                        {doc.file_type?.replace('application/', '').toUpperCase() || 'PDF'} • {doc.file_size ? `${Math.round(doc.file_size / 1024)} KB` : 'N/A'}
                                    </p>
                                </div>
                                <a 
                                    href={doc.file_url || "#"} 
                                    download 
                                    className="flex items-center justify-center w-8 h-8 text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-500 transition-colors"
                                    title="Télécharger"
                                >
                                    <Download className="w-4 h-4" />
                                </a>
                            </div>
                        ))
                    ) : (
                         <div className="text-center py-8">
                             <p className="text-sm text-slate-500">Aucun document récent.</p>
                         </div>
                    )}
                </div>
                
                <Link href="/documents" className="mt-8 block w-full text-center py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                    Accéder à la bibliothèque
                </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
