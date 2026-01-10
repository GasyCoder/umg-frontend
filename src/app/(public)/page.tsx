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

export default async function HomePage() {
  // Fetch all data in parallel
  const [postsRes, etablissementsRes, partnersRes] = await Promise.all([
    publicGet<{ data: Post[] }>("/posts?per_page=4&status=published", 60).catch(() => ({ data: [] })),
    publicGet<{ data: Etablissement[] }>("/etablissements?per_page=8", 300).catch(() => ({ data: [] })),
    publicGet<{ data: Partner[] }>("/partners?per_page=20", 300).catch(() => ({ data: [] })),
  ]);

  return (
    <main>
      {/* Hero Section */}
      <HeroSection
        title="Université de Mahajanga"
        subtitle="Former les leaders de demain pour un Madagascar prospère. Excellence académique, recherche innovante et engagement communautaire."
      />

      {/* Stats Section */}
      <StatsSection />

      {/* Recent News */}
      <NewsSection posts={postsRes.data} />

      {/* Etablissements Grid */}
      <EtablissementsSection etablissements={etablissementsRes.data} />

      {/* Partners Scrolling */}
      <PartnersSection partners={partnersRes.data} />

      {/* Call to Actions */}
      <CTASection />
    </main>
  );
}