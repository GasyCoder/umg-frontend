import { getSiteSettings } from "@/lib/public-api";
import type { Post, Etablissement, PresidentMessage as PresidentMessageType, Document } from "@/lib/types";
import type { Slide } from "@/components/public/HeroSection";

// New Components
import HeroSection from "@/components/public/HeroSection";
import StatsSection from "@/components/public/StatsSection";
import AboutSection from "@/components/public/AboutSection";
import PresidentMessage from "@/components/public/PresidentMessage";
import NewsSection from "@/components/public/NewsSection";
import PartnersSection from "@/components/public/PartnersSection";
import NewsletterSection from "@/components/public/NewsletterSection";

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

export default async function HomePage() {
  // Parallel data fetching
  const [postsData, slidesData, presidentData, statsData, documentsData] = await Promise.all([
    fetchData<{ data: Post[] }>("/posts?per_page=4"),
    fetchData<{ data: Slide[] }>("/slides"),
    fetchData<{ data: PresidentMessageType }>("/president-message"),
    fetchData<any>("/stats"),
    fetchData<{ data: Document[] }>("/documents?per_page=5"),
  ]);

  const posts = postsData?.data || [];
  const slides = slidesData?.data || [];
  const president = presidentData?.data || null;
  const stats = statsData || { students: 12000, staff: 450, formations: 50 };
  const documents = documentsData?.data || [];

  // Map stats to new structure
  const mappedStats = {
      students: stats.students || 12000,
      teachers: stats.teachers || 500,
      staff: stats.staff || 200,
      establishments: stats.establishments || 6,
  };

  return (
    <div className="bg-slate-50 dark:bg-[#101622] min-h-screen">

      {/* Hero with Slider */}
      <HeroSection slides={slides} />

      {/* Stats with negative margin overlap */}
      <StatsSection stats={mappedStats} />

      {/* About Section (Innovation, etc.) */}
      <AboutSection />

      {/* President's Word */}
      <PresidentMessage data={president} />

      {/* News & Documents */}
      <NewsSection posts={posts} documents={documents} />

      {/* Partners */}
      <PartnersSection />

      {/* Newsletter & Candidature */}
      <NewsletterSection />

    </div>
  );
}
