import Container from "@/components/Container";
import { publicGet, getSiteSettings } from "@/lib/public-api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { EtablissementTabs } from "@/components/public";
import { EtablissementJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";
import type { SiteSettings } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mahajanga-univ.mg";

type Etablissement = {
  id: number;
  name: string;
  slug: string;
  acronym: string | null;
  description: string | null;
  director_name: string | null;
  director_title: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  facebook: string | null;
  twitter: string | null;
  linkedin: string | null;
  logo: { url: string } | null;
  cover_image: { url: string } | null;
  is_doctoral: boolean;
  formations: { title: string; level?: string | null; description?: string | null }[];
  doctoral_teams: { name: string; focus?: string | null }[];
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const [res, settings] = await Promise.all([
      publicGet<{ data: Etablissement }>(`/etablissements/${slug}`, 60),
      getSiteSettings().catch(() => null),
    ]);
    const etab = res.data;
    const siteName = settings?.site_name || "Université de Mahajanga";
    const description = etab.description?.replace(/<[^>]*>/g, "").slice(0, 160) || `${etab.name} - Faculté de l'Université de Mahajanga`;
    const pageUrl = `${BASE_URL}/etablissements/${slug}`;
    const imageUrl = etab.cover_image?.url || etab.logo?.url || settings?.logo_url;

    return {
      title: etab.name,
      description,
      keywords: [etab.name, etab.acronym, "faculté", "école", "université", "mahajanga", "formation", "enseignement supérieur"].filter(Boolean) as string[],
      alternates: {
        canonical: pageUrl,
      },
      openGraph: {
        type: "website",
        locale: "fr_MG",
        url: pageUrl,
        siteName,
        title: `${etab.name}${etab.acronym ? ` (${etab.acronym})` : ""}`,
        description,
        images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: etab.name }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: etab.name,
        description,
        images: imageUrl ? [imageUrl] : undefined,
      },
    };
  } catch {
    return {
      title: "Établissement",
      robots: { index: false, follow: true },
    };
  }
}

export default async function EtablissementDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let etab: Etablissement;
  let settings: SiteSettings | null = null;
  try {
    const [res, settingsRes] = await Promise.all([
      publicGet<{ data: Etablissement }>(`/etablissements/${slug}`, 60),
      getSiteSettings().catch(() => null),
    ]);
    etab = res.data;
    settings = settingsRes;
  } catch {
    notFound();
  }

  const mapQuery = encodeURIComponent(etab.address || "Université de Mahajanga");
  const cover =
    etab.cover_image?.url ||
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80";

  const listLabel = etab.is_doctoral ? "Équipe d'accueil" : "Formations";
  const doctorates = etab.doctoral_teams || [];
  const formationsList = etab.formations || [];
  const listItems = etab.is_doctoral
    ? doctorates.map((team) => ({
        title: team.name,
        subtitle: team.focus || undefined,
      }))
    : formationsList.map((item) => {
        const subtitleParts = [item.level, item.description].filter(Boolean);
        return { title: item.title, subtitle: subtitleParts.join(" • ") || undefined };
      });

  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Établissements", url: "/etablissements" },
    { name: etab.name, url: `/etablissements/${slug}` },
  ];

  // Convert to Etablissement type for JSON-LD
  const etablissementForJsonLd = {
    id: etab.id,
    name: etab.name,
    slug: etab.slug,
    short_name: etab.acronym,
    description: etab.description,
    logo_url: etab.logo?.url,
    address: etab.address,
    phone: etab.phone,
    email: etab.email,
    website: etab.website,
  };

  return (
    <main className="bg-white dark:bg-slate-950">
      <EtablissementJsonLd etablissement={etablissementForJsonLd} settings={settings} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <section className="relative min-h-[320px] md:min-h-[480px] lg:min-h-[540px] overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <img
            src={cover}
            alt=""
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent" />
        </div>
        <Container className="relative z-10 flex h-full min-h-[320px] md:min-h-[480px] lg:min-h-[540px] flex-col justify-end pb-10">
          <Link
            href="/etablissements"
            className="absolute left-4 top-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:gap-8">
            {etab.logo && (
              <div className="h-24 w-24 shrink-0 rounded-2xl border-2 border-white/20 bg-white p-2 shadow-2xl md:h-28 md:w-28">
                <img src={etab.logo.url} alt={etab.name} className="h-full w-full object-contain" />
              </div>
            )}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                {etab.name}
                {etab.acronym && (
                  <span className="ml-3 inline-block rounded-lg bg-emerald-500/20 px-3 py-1 text-lg font-semibold text-emerald-300 md:text-xl">
                    {etab.acronym}
                  </span>
                )}
              </h1>
              {etab.director_name && (
                <p className="text-base text-slate-300 md:text-lg">
                  <span className="text-slate-400">{etab.director_title}:</span>{" "}
                  <span className="font-medium text-white">{etab.director_name}</span>
                </p>
              )}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-8">
              <EtablissementTabs
                presentation={etab.description}
                listLabel={listLabel}
                listItems={listItems}
                contacts={{
                  address: etab.address,
                  phone: etab.phone,
                  email: etab.email,
                  website: etab.website,
                }}
              />
            </div>
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Localisation</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Retrouvez l'établissement sur la carte.
                </p>
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700">
                  <iframe
                    title={`Carte ${etab.name}`}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=46.30%2C-15.76%2C46.40%2C-15.70&layer=mapnik&marker=-15.74%2C46.33&query=${mapQuery}`}
                    className="h-64 w-full"
                  />
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <MapPin className="h-4 w-4 text-emerald-500" />
                  {etab.address || "Mahajanga, Madagascar"}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200/70 bg-gradient-to-br from-emerald-600 to-teal-600 p-6 text-white shadow-lg">
                <h3 className="text-lg font-semibold">Contact direct</h3>
                <p className="mt-2 text-sm text-emerald-100">
                  Notre équipe vous répond pour toute question sur les formations et admissions.
                </p>
                <button
                  type="button"
                  className="mt-4 w-full rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20"
                >
                  Prendre rendez-vous
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
