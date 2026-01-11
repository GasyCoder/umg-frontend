import Link from "next/link";
import { ArrowRight, FileText, Download, Table, FolderOpen } from "lucide-react";
import type { Document } from "@/lib/types";

interface ResourcesSectionProps {
  documents: Document[];
}

const getFileIcon = (type?: string | null) => {
  switch (type?.toLowerCase()) {
    case 'pdf':
      return { icon: FileText, color: 'text-red-500' };
    case 'docx':
    case 'doc':
      return { icon: FileText, color: 'text-blue-500' };
    case 'xlsx':
    case 'xls':
      return { icon: Table, color: 'text-green-500' };
    default:
      return { icon: FileText, color: 'text-gray-500' };
  }
};

const formatFileSize = (bytes?: number | null) => {
  if (!bytes) return null;
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

export function ResourcesSection({ documents }: ResourcesSectionProps) {
  const displayDocs = documents?.slice(0, 3) || [];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-3 h-10 bg-[#d4af37] rounded-full"></div>
          <h2 className="text-3xl lg:text-4xl font-black text-[#1b4332] dark:text-white uppercase tracking-tight">
            Espace Documents
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayDocs.map((doc) => {
            const { icon: Icon, color } = getFileIcon(doc.file_type);
            return (
              <div
                key={doc.id}
                className="bg-white dark:bg-[#101622] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="mb-4">
                  <Icon className={`w-10 h-10 ${color} mb-4`} />
                  <h4 className="font-bold text-[#1b4332] dark:text-white line-clamp-2">
                    {doc.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-2">
                    {doc.file_type?.toUpperCase() || 'PDF'} | {formatFileSize(doc.file_size) || '—'}
                  </p>
                </div>
                <a
                  href={doc.file_url || '#'}
                  className="flex items-center justify-center gap-2 w-full py-2 bg-gray-100 dark:bg-gray-800 rounded-lg font-bold text-sm text-[#1b4332] dark:text-white hover:bg-[#d4af37] hover:text-[#1b4332] transition-all"
                  download
                >
                  <Download className="w-4 h-4" /> Télécharger
                </a>
              </div>
            );
          })}

          {/* Archive Card */}
          <div className="bg-white dark:bg-[#101622] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="mb-4">
              <FolderOpen className="w-10 h-10 text-[#d4af37] mb-4" />
              <h4 className="font-bold text-[#1b4332] dark:text-white line-clamp-2">
                Tous les documents administratifs
              </h4>
              <p className="text-xs text-gray-400 mt-2">
                Accès aux archives
              </p>
            </div>
            <Link
              href="/documents"
              className="flex items-center justify-center gap-2 w-full py-2 bg-[#1b4332] text-white rounded-lg font-bold text-sm hover:bg-green-900 transition-all"
            >
              Accéder à l'archive
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
