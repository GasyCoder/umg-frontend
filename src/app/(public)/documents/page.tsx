import { Suspense } from 'react';
import { publicGet } from '@/lib/public-api';
import type { Document, DocumentCategory, PaginatedResponse } from '@/lib/types';
import Container from '@/components/Container';
import PageLayout from '@/components/layout/PageLayout';
import { SidebarWidget } from '@/components/layout/SidebarLeft';
import SidebarRight, { NewsletterWidget } from '@/components/layout/SidebarRight';
import { DocumentCard } from '@/components/public';
import Pagination from '@/components/ui/Pagination';
import SearchBox from '@/components/ui/SearchBox';
import { DocumentCategoryFilter } from '@/components/public/DocumentCategoryFilter';

export const dynamic = "force-dynamic";

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
  
  return publicGet<PaginatedResponse<Document>>(`/documents?${queryParts.join('&')}`, 300);
}

// Fetch categories for sidebar
async function fetchDocumentCategories() {
  return publicGet<{ data: DocumentCategory[] }>('/document-categories?with_count=true', 300).catch(() => ({ data: [] }));
}

export default async function DocumentsPage({ searchParams }: DocumentsPageProps) {
  const params = await searchParams;
  
  const [documentsRes, categoriesRes] = await Promise.all([
    fetchDocuments(params).catch(() => ({
      data: [],
      meta: { current_page: 1, last_page: 1, per_page: 12, total: 0 },
    })),
    fetchDocumentCategories(),
  ]);

  const documents = documentsRes.data || [];
  const meta = documentsRes.meta || { current_page: 1, last_page: 1, per_page: 12, total: 0 };
  const categories = categoriesRes.data || [];

  return (
    <main className="bg-slate-50/60 dark:bg-slate-950">
      {/* Page Header */}
      <section className="bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-white">
        <Container className="max-w-[1280px] px-5 md:px-10">
          <div className="py-6 md:py-8">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
              Documents
            </p>
            <h1 className="mt-3 text-xl md:text-3xl font-bold tracking-tight">
              Ressources et téléchargements
            </h1>
            <p className="mt-3 max-w-xl text-base text-slate-600 dark:text-slate-300">
              Documents administratifs, guides, rapports et formulaires.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <PageLayout
        variant="with-right"
        containerClassName="max-w-[1280px] px-5 md:px-10"
        sidebarRight={
          <SidebarRight sticky>
            {/* Search */}
            <SidebarWidget title="Rechercher">
              <Suspense fallback={<div className="h-12 animate-pulse bg-slate-100 rounded" />}>
                <SearchBox placeholder="Rechercher un document..." paramName="q" />
              </Suspense>
            </SidebarWidget>

            {/* Categories Widget */}
            <SidebarWidget title="Catégories">
              <Suspense fallback={<div className="h-20 animate-pulse bg-slate-100 rounded" />}>
                <DocumentCategoryFilter categories={categories} activeSlug={params.category} />
              </Suspense>
            </SidebarWidget>

            {/* Quick Info */}
            <SidebarWidget title="Informations">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Téléchargement gratuit. Certains documents peuvent nécessiter une authentification.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold">{meta.total}</span> documents disponibles
                </p>
              </div>
            </SidebarWidget>

            {/* Newsletter Signup */}
            <NewsletterWidget />
          </SidebarRight>
        }
      >
        {/* Documents Grid */}
        {documents.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
              {documents.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
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
