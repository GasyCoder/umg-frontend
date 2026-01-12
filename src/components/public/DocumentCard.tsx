import Link from 'next/link';
import { FileText, FileSpreadsheet, FileArchive, FileImage, Download, ExternalLink } from 'lucide-react';
import type { Document } from '@/lib/types';

interface DocumentCardProps {
  document: Document;
  variant?: 'default' | 'compact' | 'row';
  baseApiUrl?: string;
  className?: string;
}

export default function DocumentCard({ 
  document, 
  variant = 'default',
  baseApiUrl = process.env.NEXT_PUBLIC_API_URL || '',
  className = '' 
}: DocumentCardProps) {
  // Determine icon based on file type
  const getFileIcon = () => {
    const type = document.file_type?.toLowerCase() || '';
    if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv')) {
      return FileSpreadsheet;
    }
    if (type.includes('archive') || type.includes('zip') || type.includes('rar')) {
      return FileArchive;
    }
    if (type.includes('image') || type.includes('png') || type.includes('jpg')) {
      return FileImage;
    }
    return FileText;
  };

  const FileIcon = getFileIcon();

  // Format file size
  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return null;
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  const fileSize = formatFileSize(document.file_size);
  const fileType = document.file_type?.toUpperCase() || 'PDF';

  const formattedDate = new Date(document.created_at).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const downloadUrl = document.file_url || `${baseApiUrl}/documents/${document.id}/download`;

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 py-3 ${className}`}>
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
          <FileIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <Link 
            href={`/documents/${document.slug}`}
            className="text-sm font-medium text-slate-900 dark:text-white hover:text-blue-600 line-clamp-1"
          >
            {document.title}
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {fileType} {fileSize && `· ${fileSize}`}
          </p>
        </div>
        <a
          href={downloadUrl}
          className="flex-shrink-0 p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
          title="Télécharger"
        >
          <Download className="w-4 h-4" />
        </a>
      </div>
    );
  }

  if (variant === 'row') {
    return (
      <div
        className={`
          flex flex-col md:flex-row md:items-center md:justify-between gap-4
          rounded-xl border border-slate-200/80 bg-white px-5 py-4 
          shadow-sm transition-all hover:shadow-lg
          dark:border-slate-800 dark:bg-slate-900
          ${className}
        `}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
            <FileIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="min-w-0">
            <Link
              href={`/documents/${document.slug}`}
              className="text-lg font-semibold text-slate-900 dark:text-white hover:text-blue-600 transition-colors"
            >
              {document.title}
            </Link>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 line-clamp-1">
              {document.excerpt || 'Document institutionnel disponible en téléchargement.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:flex-shrink-0">
          <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
            {fileType} {fileSize && `· ${fileSize}`}
          </span>
          <a
            href={downloadUrl}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            <Download className="w-4 h-4" />
            Télécharger
          </a>
        </div>
      </div>
    );
  }

  // Default variant (card)
  return (
    <div
      className={`
        rounded-2xl border border-slate-200/80 bg-white p-6 
        shadow-sm transition-all hover:shadow-lg
        dark:border-slate-800 dark:bg-slate-900
        ${className}
      `}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 flex items-center justify-center">
          <FileIcon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {document.category && (
              <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                {document.category.name}
              </span>
            )}
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {formattedDate}
            </span>
          </div>
          <Link
            href={`/documents/${document.slug}`}
            className="text-lg font-bold text-slate-900 dark:text-white hover:text-blue-600 transition-colors"
          >
            {document.title}
          </Link>
          {document.excerpt && (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
              {document.excerpt}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {fileType} {fileSize && `· ${fileSize}`}
        </span>
        <a
          href={downloadUrl}
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-blue-600"
        >
          <Download className="w-4 h-4" />
          Télécharger
        </a>
      </div>
    </div>
  );
}

// Document list for sidebars
interface DocumentListProps {
  documents: Document[];
  maxItems?: number;
  className?: string;
}

export function DocumentList({
  documents,
  maxItems = 5,
  className = '',
}: DocumentListProps) {
  const items = documents.slice(0, maxItems);

  if (items.length === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400 italic">
        Aucun document disponible.
      </p>
    );
  }

  return (
    <div className={`divide-y divide-slate-100 dark:divide-slate-800 ${className}`}>
      {items.map((doc) => (
        <DocumentCard key={doc.id} document={doc} variant="compact" />
      ))}
      {documents.length > maxItems && (
        <Link
          href="/documents"
          className="pt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-blue-600"
        >
          Voir tous les documents
          <ExternalLink className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
