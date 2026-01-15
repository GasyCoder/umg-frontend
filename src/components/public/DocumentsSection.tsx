"use client";

import Link from "next/link";
import { FileText, Download, ArrowRight, File, FileCode, FileImage, FolderOpen } from "lucide-react";
import type { Document } from "@/lib/types";

interface DocumentsSectionProps {
  documents: Document[];
}

export default function DocumentsSection({ documents }: DocumentsSectionProps) {
  // Get file icon based on type
  const getFileIcon = (fileType: string | null | undefined) => {
    if (!fileType) return FileText;

    if (fileType.includes('pdf')) return FileText;
    if (fileType.includes('word') || fileType.includes('document')) return File;
    if (fileType.includes('image')) return FileImage;
    if (fileType.includes('code') || fileType.includes('text')) return FileCode;
    return FileText;
  };

  // Get file color based on type
  const getFileColor = (fileType: string | null | undefined) => {
    if (!fileType) return "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";

    if (fileType.includes('pdf')) return "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400";
    if (fileType.includes('word') || fileType.includes('document')) return "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
    if (fileType.includes('image')) return "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400";
    if (fileType.includes('code') || fileType.includes('text')) return "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400";
    return "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
  };

  // Format file size
  const formatFileSize = (bytes: number | null | undefined) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-[#101622] transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 mb-4">
              <FolderOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Ressources</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
              Documents officiels
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
              Accédez aux documents administratifs et pédagogiques
            </p>
          </div>
          <Link
            href="/documents"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 dark:hover:text-amber-400 transition-all group"
          >
            Bibliothèque complète
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {documents && documents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.slice(0, 6).map((doc) => {
              const IconComponent = getFileIcon(doc.file_type);
              const colorClasses = getFileColor(doc.file_type);

              return (
                <div
                  key={doc.id}
                  className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all overflow-hidden"
                >
                  {/* Header with icon */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start gap-4">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${colorClasses} shrink-0 group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-2">
                          {doc.title}
                        </h3>
                        {doc.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                            {doc.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer with metadata */}
                  <div className="mt-auto px-6 pb-6">
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase">
                          {doc.file_type?.replace('application/', '').replace('/', ' ') || 'PDF'}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatFileSize(doc.file_size)}
                        </span>
                      </div>
                      <a
                        href={doc.file_url || "#"}
                        download
                        className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all group/btn"
                        title="Télécharger"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Download className="w-4 h-4 group-hover/btn:animate-bounce" />
                      </a>
                    </div>
                  </div>

                  {/* Category badge (if exists) */}
                  {doc.category && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {doc.category.name}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-slate-200 dark:border-slate-800 border-dashed">
            <FolderOpen className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-lg">Aucun document disponible pour le moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
