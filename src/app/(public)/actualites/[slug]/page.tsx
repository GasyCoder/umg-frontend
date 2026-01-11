import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { publicGet } from '@/lib/public-api';
import type { Post, Event, Announcement } from '@/lib/types';
import Container from '@/components/Container';
import { Breadcrumb } from '@/components/layout';
import SidebarRight, { EventsWidget, NewsletterWidget } from '@/components/layout/SidebarRight';
import { ArticleGallery, ShareButtons, NewsCard, EventList } from '@/components/public';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

// Fetch single post
async function fetchPost(slug: string) {
  try {
    const res = await publicGet<{ data: Post }>(`/posts/${slug}`, 60);
    return res.data;
  } catch {
    return null;
  }
}

// Fetch related posts
async function fetchRelatedPosts(postId: number, categorySlug?: string) {
  try {
    const query = categorySlug 
      ? `/posts?per_page=3&exclude=${postId}&category=${categorySlug}`
      : `/posts?per_page=3&exclude=${postId}`;
    const res = await publicGet<{ data: Post[] }>(query, 120);
    return res.data || [];
  } catch {
    return [];
  }
}

// Fetch events for sidebar
async function fetchEvents() {
  try {
    const res = await publicGet<{ data: Event[] }>('/events?upcoming=true&per_page=3', 300);
    return res.data || [];
  } catch {
    return [];
  }
}

const heroImage =
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80';

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  
  const post = await fetchPost(slug);
  
  if (!post) {
    notFound();
  }

  const categorySlug = post.categories?.[0]?.slug;
  const [relatedPosts, events] = await Promise.all([
    fetchRelatedPosts(post.id, categorySlug),
    fetchEvents(),
  ]);

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'Publication récente';

  const coverImageUrl = post.cover_image?.url || heroImage;

  return (
    <main className="bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <Image
          src={coverImageUrl}
          alt={post.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/60 to-slate-950/90" />
        
        <Container>
          <div className="relative z-10 flex h-full flex-col justify-end pb-12 text-white">
            <Link
              href="/actualites"
              className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors w-fit"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux actualités
            </Link>
            
            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-slate-900"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            )}
            
            <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight md:text-5xl">
              {post.title}
            </h1>
            
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/80">
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </span>
              {post.reading_time && (
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {post.reading_time} min de lecture
                </span>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Breadcrumb */}
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <Container>
          <div className="py-3">
            <Breadcrumb
              items={[
                { label: 'Actualités', href: '/actualites' },
                { label: post.title },
              ]}
            />
          </div>
        </Container>
      </div>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
            {/* Main Content */}
            <div className="space-y-10">
              {/* Article Content */}
              <article className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-indigo-600 prose-img:rounded-xl">
                {post.content_html ? (
                  <div dangerouslySetInnerHTML={{ __html: post.content_html }} />
                ) : (
                  <p className="text-slate-600 dark:text-slate-300">
                    Contenu de l'article non disponible.
                  </p>
                )}
              </article>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/actualites?tags=${tag.slug}`}
                        className="rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                      >
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {post.gallery && post.gallery.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Galerie
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Temps forts et moments clés de cette actualité.
                  </p>
                  <div className="mt-6">
                    <ArticleGallery />
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <SidebarRight sticky>
              {/* Share */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                  Partager l'article
                </h3>
                <ShareButtons />
              </div>

              {/* Upcoming Events */}
              {events.length > 0 && (
                <EventsWidget>
                  <EventList events={events} maxItems={3} />
                </EventsWidget>
              )}

              {/* Newsletter */}
              <NewsletterWidget />
            </SidebarRight>
          </div>
        </Container>
      </section>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="bg-slate-50 dark:bg-slate-900 py-16">
          <Container>
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                  À lire aussi
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Articles similaires
                </h2>
              </div>
              <Link
                href="/actualites"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 flex items-center gap-1"
              >
                Voir toutes les actualités
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <NewsCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </main>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await fetchPost(slug);

  if (!post) {
    return {
      title: 'Article non trouvé',
    };
  }

  return {
    title: `${post.title} | Université de Mahajanga`,
    description: post.excerpt || `Découvrez: ${post.title}`,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.cover_image?.url ? [post.cover_image.url] : undefined,
    },
  };
}
