import { publicGet } from "@/lib/public-api";
import {
  HeroSection,
  StatsSection,
  NewsSection,
  EtablissementsSection,
  PartnersSection,
  CTASection,
} from "@/components/public";

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  published_at?: string | null;
  cover_image?: { url: string } | null;
  categories?: { id: number; name: string }[];
};

type Etablissement = {
  id: number;
  name: string;
  slug: string;
  short_name?: string | null;
  description?: string | null;
  logo_url?: string | null;
};

type Partner = {
  id: number;
  name: string;
  logo_url?: string | null;
  website_url?: string | null;
};

const heroImage =
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80";

export default async function HomePage() {
  const [postsRes, etablissementsRes, partnersRes] = await Promise.all([
    publicGet<{ data: Post[] }>("/posts?per_page=4&status=published", 60).catch(() => ({ data: [] })),
    publicGet<{ data: Etablissement[] }>("/etablissements?per_page=8", 300).catch(() => ({ data: [] })),
    publicGet<{ data: Partner[] }>("/partners?per_page=20", 300).catch(() => ({ data: [] })),
  ]);

  return (
    <main className="bg-white dark:bg-slate-950">
      <HeroSection
        title="Université de Mahajanga"
        subtitle="Former les leaders de demain pour un Madagascar prospère. Excellence académique, recherche innovante et engagement communautaire."
        backgroundImage={heroImage}
      />

      <StatsSection />

      <NewsSection posts={postsRes.data} />

      <EtablissementsSection etablissements={etablissementsRes.data} />

      <PartnersSection partners={partnersRes.data} />

      <CTASection />
    </main>
  );
}
