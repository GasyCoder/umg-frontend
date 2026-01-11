import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import NewsletterForm from "@/components/NewsletterForm";
import HeroSlider from "@/components/HeroSlider";
import type { Post, Etablissement, PresidentMessage, Document } from "@/lib/types";
import { getSiteSettings } from "@/lib/public-api";

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

async function fetchData<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Accept: "application/json" },
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json;
  } catch {
    return null;
  }
}

// Format date helper
const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
};

export default async function HomePage() {
  // Parallel data fetching
  const [postsData, slidePostsData, etablissementsData, presidentData, documentsData, statsData, settings] = await Promise.all([
    fetchData<{ data: Post[] }>("/posts?per_page=4"),
    fetchData<{ data: Post[] }>("/posts?is_slide=1&per_page=5"),
    fetchData<{ data: Etablissement[] }>("/etablissements?per_page=4"),
    fetchData<{ data: PresidentMessage }>("/president-message"),
    fetchData<{ data: Document[] }>("/documents?per_page=4"),
    fetchData<any>("/stats"),
    getSiteSettings().catch(() => null),
  ]);

  const posts = postsData?.data || [];
  const slidePosts = slidePostsData?.data || [];
  const etablissements = etablissementsData?.data || [];
  const president = presidentData?.data || null;
  const documents = documentsData?.data || [];
  const stats = statsData || { students: 12000, staff: 450, formations: 50 };

  // Icon mapping for etablissements
  const getEtablissementIcon = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes("science")) return "biotech";
    if (lower.includes("médecine") || lower.includes("sante")) return "medical_services";
    if (lower.includes("droit") || lower.includes("gestion")) return "gavel";
    if (lower.includes("technolog")) return "memory";
    if (lower.includes("lettre")) return "menu_book";
    return "school";
  };

  return (
    <div className="bg-[#f6f6f8] dark:bg-[#101622] text-[#111318] dark:text-white min-h-screen transition-colors duration-200">
      
      {/* Hero Section & Stats */}
      <HeroSlider slides={slidePosts} stats={stats} />

      {/* Établissements Grid */}
      <section className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Nos Établissements</h2>
            <div className="mt-1 h-1 w-12 bg-[#135bec]"></div>
          </div>
          <Link href="/etablissements" className="text-sm font-bold text-[#135bec] hover:underline">
            Voir tout
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {etablissements.length > 0 ? (
            etablissements.map((etab) => (
              <Link
                key={etab.id}
                href={`/etablissements/${etab.slug}`}
                className="group cursor-pointer rounded-lg border border-[#dbdfe6] dark:border-[#2a303c] bg-white dark:bg-[#101622] p-6 transition-all hover:border-[#135bec]"
              >
                <span className="material-symbols-outlined text-4xl text-[#135bec] mb-4 block">
                  {getEtablissementIcon(etab.name)}
                </span>
                <h3 className="text-lg font-bold group-hover:text-[#135bec]">{etab.name}</h3>
                <p className="mt-2 text-sm text-[#616f89] dark:text-gray-400 line-clamp-2">
                  {etab.description || "Formation d'excellence et recherche de qualité."}
                </p>
              </Link>
            ))
          ) : (
            // Fallback static cards
            <>
              <div className="group cursor-pointer rounded-lg border border-[#dbdfe6] dark:border-[#2a303c] bg-white dark:bg-[#101622] p-6 transition-all hover:border-[#135bec]">
                <span className="material-symbols-outlined text-4xl text-[#135bec] mb-4 block">biotech</span>
                <h3 className="text-lg font-bold group-hover:text-[#135bec]">Faculté des Sciences</h3>
                <p className="mt-2 text-sm text-[#616f89] dark:text-gray-400">Pôle d'excellence en recherche et innovation scientifique.</p>
              </div>
              <div className="group cursor-pointer rounded-lg border border-[#dbdfe6] dark:border-[#2a303c] bg-white dark:bg-[#101622] p-6 transition-all hover:border-[#135bec]">
                <span className="material-symbols-outlined text-4xl text-[#135bec] mb-4 block">medical_services</span>
                <h3 className="text-lg font-bold group-hover:text-[#135bec]">Faculté de Médecine</h3>
                <p className="mt-2 text-sm text-[#616f89] dark:text-gray-400">Formation médicale de pointe et recherche en santé.</p>
              </div>
              <div className="group cursor-pointer rounded-lg border border-[#dbdfe6] dark:border-[#2a303c] bg-white dark:bg-[#101622] p-6 transition-all hover:border-[#135bec]">
                <span className="material-symbols-outlined text-4xl text-[#135bec] mb-4 block">gavel</span>
                <h3 className="text-lg font-bold group-hover:text-[#135bec]">Droit et Gestion</h3>
                <p className="mt-2 text-sm text-[#616f89] dark:text-gray-400">Expertise juridique et management stratégique.</p>
              </div>
              <div className="group cursor-pointer rounded-lg border border-[#dbdfe6] dark:border-[#2a303c] bg-white dark:bg-[#101622] p-6 transition-all hover:border-[#135bec]">
                <span className="material-symbols-outlined text-4xl text-[#135bec] mb-4 block">memory</span>
                <h3 className="text-lg font-bold group-hover:text-[#135bec]">Institut de Technologie</h3>
                <p className="mt-2 text-sm text-[#616f89] dark:text-gray-400">Ingénierie et nouvelles technologies appliquées.</p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Mot du Recteur */}
      {president && (
        <section className="bg-white dark:bg-[#1e2634] py-16">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="flex flex-col items-center gap-12 md:flex-row">
              <div className="w-full md:w-1/3">
                <div className="relative">
                  <div className="absolute -bottom-4 -right-4 h-full w-full rounded-lg border-2 border-[#135bec]/20"></div>
                  <div 
                    className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-200"
                    style={{
                      backgroundImage: president.photo ? `url(${president.photo})` : 'linear-gradient(135deg, #1b4332, #135bec)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <span className="text-sm font-bold uppercase tracking-widest text-[#135bec]">Le Mot du Président</span>
                <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
                  {president.title || "Engagement pour un futur académique brillant"}
                </h2>
                <div 
                  className="mt-6 text-lg font-light leading-relaxed text-[#616f89] dark:text-gray-300"
                  dangerouslySetInnerHTML={{ 
                    __html: president.intro || president.content?.slice(0, 300) || "Notre mission est de cultiver l'excellence et de préparer nos étudiants à devenir les leaders de demain."
                  }}
                />
                <div className="mt-8">
                  <p className="font-bold text-[#111318] dark:text-white">{president.president_name}</p>
                  <p className="text-sm text-[#616f89]">{president.president_title} de l'Université de Mahajanga</p>
                </div>
                <Link 
                  href="/universite"
                  className="mt-8 flex items-center gap-2 text-sm font-bold text-[#135bec] hover:gap-3 transition-all"
                >
                  Lire le message complet 
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* À la Une & Documents */}
      <section className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          
          {/* News Feed (2/3) */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">À la Une</h2>
              <Link href="/actualites" className="text-xs font-bold text-[#135bec]">
                Toutes les actus
              </Link>
            </div>
            <div className="space-y-4">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/actualites/${post.slug}`}
                    className="group flex cursor-pointer gap-4 rounded-lg bg-white dark:bg-[#1e2634] p-3 transition-colors hover:bg-[#135bec]/5"
                  >
                    <div 
                      className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100"
                      style={{
                        backgroundImage: post.cover_image?.url 
                          ? `url(${post.cover_image.url})` 
                          : 'linear-gradient(135deg, #1b4332, #0f2920)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    <div className="flex flex-col justify-center">
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-[#135bec]">
                        {post.categories?.[0]?.name || "Actualité"}
                      </span>
                      <h4 className="text-sm font-bold leading-snug group-hover:text-[#135bec] line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-xs text-[#616f89] mt-1">
                        Publié le {formatDate(post.published_at)}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-12 bg-white dark:bg-[#1e2634] rounded-lg">
                  <p className="text-gray-500">Aucune actualité disponible</p>
                </div>
              )}
            </div>
          </div>

          {/* Documents (1/3) */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">Documents</h2>
              <span className="material-symbols-outlined text-[#616f89]">folder_open</span>
            </div>
            <div className="divide-y divide-[#dbdfe6] dark:divide-[#2a303c] rounded-lg border border-[#dbdfe6] dark:border-[#2a303c] bg-white dark:bg-[#1e2634]">
              {documents.length > 0 ? (
                documents.slice(0, 4).map((doc) => (
                  <a 
                    key={doc.id}
                    href={doc.file_url || "#"}
                    className="flex items-center gap-3 p-4 hover:bg-[#135bec]/5 transition-colors group"
                    download
                  >
                    <span className="material-symbols-outlined text-[#135bec] group-hover:scale-110 transition-transform">
                      picture_as_pdf
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-1">{doc.title}</p>
                      <p className="text-[10px] text-[#616f89]">
                        {doc.mime_type?.toUpperCase().replace('APPLICATION/', '') || 'PDF'} • {doc.file_size ? `${Math.round(doc.file_size / 1024)} KB` : 'N/A'}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-xs text-[#616f89]">download</span>
                  </a>
                ))
              ) : (
                <>
                  <a className="flex items-center gap-3 p-4 hover:bg-[#135bec]/5 transition-colors group" href="#">
                    <span className="material-symbols-outlined text-[#135bec] group-hover:scale-110 transition-transform">picture_as_pdf</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Calendrier Universitaire</p>
                      <p className="text-[10px] text-[#616f89]">PDF • 1.2 MB</p>
                    </div>
                    <span className="material-symbols-outlined text-xs text-[#616f89]">download</span>
                  </a>
                  <a className="flex items-center gap-3 p-4 hover:bg-[#135bec]/5 transition-colors group" href="#">
                    <span className="material-symbols-outlined text-[#135bec] group-hover:scale-110 transition-transform">picture_as_pdf</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Guide de l'Étudiant</p>
                      <p className="text-[10px] text-[#616f89]">PDF • 4.5 MB</p>
                    </div>
                    <span className="material-symbols-outlined text-xs text-[#616f89]">download</span>
                  </a>
                  <a className="flex items-center gap-3 p-4 hover:bg-[#135bec]/5 transition-colors group" href="#">
                    <span className="material-symbols-outlined text-[#135bec] group-hover:scale-110 transition-transform">picture_as_pdf</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Gazette Officielle</p>
                      <p className="text-[10px] text-[#616f89]">PDF • 800 KB</p>
                    </div>
                    <span className="material-symbols-outlined text-xs text-[#616f89]">download</span>
                  </a>
                </>
              )}
            </div>
            <Link 
              href="/documents"
              className="mt-4 block text-center text-xs font-bold text-[#135bec] hover:underline"
            >
              Voir tous les documents
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter & Contact */}
{/* Newsletter & Contact Split */}
<section className="bg-white dark:bg-[#101622] text-[#1e293b] dark:text-white py-16 border-t border-gray-100 dark:border-white/5 transition-colors duration-300">
  <Container>
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
      
      {/* Newsletter */}
      <div className="border-b border-[#e2e8f0] dark:border-white/10 pb-12 md:border-b-0 md:border-r md:pb-0 md:pr-12">
        <h3 className="text-xl font-bold mb-2 text-[#1e293b] dark:text-white">Restez informé</h3>
        <p className="text-sm text-[#64748b] dark:text-gray-400 mb-6">
          Inscrivez-vous à notre newsletter pour recevoir les dernières actualités institutionnelles.
        </p>
        <NewsletterForm />
        
        <div className="mt-4">
          <Link 
            href="/evenements"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#135bec] hover:text-[#0d4abf] dark:hover:text-white transition-colors"
          >
            Voir nos événements à venir
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="flex flex-col justify-center md:pl-8">
        <h3 className="text-lg font-bold mb-1 text-[#1e293b] dark:text-white">Service d'accueil</h3>
        <p className="text-sm text-[#64748b] dark:text-gray-400 mb-6">
          Une question ? Nous sommes à votre écoute pour vous orienter.
        </p>
        <Link 
          href="/contact"
          className="inline-flex h-10 w-fit items-center gap-2 rounded bg-white dark:bg-white/5 border border-[#e2e8f0] dark:border-white/10 px-5 text-sm font-semibold text-[#1e293b] dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-white/10 hover:text-[#135bec] dark:hover:text-white transition-all"
        >
          <span className="material-symbols-outlined text-base text-[#135bec] dark:text-white">mail</span>
          Nous contacter
        </Link>
      </div>

    </div>
  </Container>
</section>

    </div>
  );
}
