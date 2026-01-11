import { Suspense } from 'react';
import { publicGet } from '@/lib/public-api';
import type { Document, DocumentCategory, PaginatedResponse } from '@/lib/types';
import { PageHeader } from '@/components/layout/PageLayout';
import PageLayout from '@/components/layout/PageLayout';
import { Breadcrumb } from '@/components/layout';
import SidebarLeft, { SidebarWidget } from '@/components/layout/SidebarLeft';
import SidebarRight, { NewsletterWidget } from '@/components/layout/SidebarRight';
import { DocumentCard } from '@/components/public';
import Pagination from '@/components/ui/Pagination';
import SearchBox from '@/components/ui/SearchBox';
import { DocumentCategoryFilter } from '@/components/public/DocumentCategoryFilter';

interface DocumentsPageSearchParams {
  page?: string;
  category?: string;
  q?: string;
}

interface DocumentsPageProps {
  searchParams: Promise<DocumentsPageSearchParams>;
}

// Fetch documents with filters
async function fetchDocuments(params: DocumentsPageSearchParams) {
  const page = params.page || '1';
  const queryParts: string[] = [`per_page=12`, `page=${page}`];
  
  if (params.category) {
    queryParts.push(`category=${params.category}`);
  }
  if (params.q) {
    queryParts.push(`q=${encodeURIComponent(params.q)}`);
  }
  
  return publicGet<PaginatedResponse<Document>>(`/documents?${queryParts.join('&')}`, 60);
}

// Fetch categories for sidebar
async function fetchDocumentCategories() {
  return publicGet<{ data: DocumentCategory[] }>('/document-categories?with_count=true', 300).catch(() => ({ data: [] }));
}

export default async function DocumentsPage({ searchParams }: DocumentsPageProps) {
  const params = await searchParams;
  
  const [documentsRes, categoriesRes] = await Promise.all([
    fetchDocuments(params),
    fetchDocumentCategories(),
  ]);

  const documents = documentsRes.data || [];
  const meta = documentsRes.meta || { current_page: 1, last_page: 1, per_page: 12, total: 0 };
  const categories = categoriesRes.data || [];

  return (
    <main className="bg-slate-50/60 dark:bg-slate-950">
      {/* Page Header */}
      <PageHeader
        label="Documents"
        title="Ressources officielles et téléchargeables"
        subtitle="Accédez aux documents administratifs, guides, rapports et formulaires utiles pour étudiants, enseignants et partenaires."
        variant="dark"
      />

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb items={[{ label: 'Documents' }]} />
        </div>
      </div>

      {/* Main Content with 3-Column Layout */}
      <PageLayout
        variant="three-column"
        sidebarLeft={
          <SidebarLeft>
            {/* Search Widget */}
            <SidebarWidget title="Rechercher">
              <Suspense fallback={<div className="h-12 animate-pulse bg-slate-100 rounded" />}>
                <SearchBox 
                  placeholder="Rechercher un document..."
                  paramName="q"
                />
              </Suspense>
            </SidebarWidget>

            {/* Categories Widget */}
            <SidebarWidget title="Catégories">
              <Suspense fallback={<div className="h-20 animate-pulse bg-slate-100 rounded" />}>
                <DocumentCategoryFilter 
                  categories={categories} 
                  activeSlug={params.category}
                />
              </Suspense>
            </SidebarWidget>
          </SidebarLeft>
        }
        sidebarRight={
          <SidebarRight sticky>
            {/* Quick Info */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Informations
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Tous les documents sont disponibles en téléchargement gratuit. 
                Certains documents peuvent nécessiter une authentification.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold">{meta.total}</span> documents disponibles
                </p>
              </div>
            </div>

            {/* Newsletter Signup */}
            <NewsletterWidget />
          </SidebarRight>
        }
      >
        {/* Documents List */}
        {documents.length > 0 ? (
          <>
            <div className="space-y-4">
              {documents.map((doc) => (
                <DocumentCard 
                  key={doc.id} 
                  document={doc} 
                  variant="row"
                />
              ))}
            </div>

            {/* Pagination */}
            {meta.last_page > 1 && (
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                <Pagination
                  currentPage={meta.current_page}
                  totalPages={meta.last_page}
                  baseUrl="/documents"
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Aucun document trouvé
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Essayez de modifier vos filtres ou effectuez une nouvelle recherche.
            </p>
          </div>
        )}
      </PageLayout>
    </main>
  );
}
