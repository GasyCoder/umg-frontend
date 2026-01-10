import Container from "@/components/Container";
import { publicGet } from "@/lib/public-api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Building2, MapPin, Phone, Mail, Globe, Facebook, Twitter, Linkedin, ArrowLeft } from "lucide-react";

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
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const etab = await publicGet<{ data: Etablissement }>(`/etablissements/${slug}`, 60);
    return {
      title: `${etab.data.name} - Université de Mahajanga`,
      description: etab.data.description?.replace(/<[^>]*>/g, "").slice(0, 160) || "",
    };
  } catch {
    return { title: "Établissement - Université de Mahajanga" };
  }
}

export default async function EtablissementDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let etab: Etablissement;
  try {
    const res = await publicGet<{ data: Etablissement }>(`/etablissements/${slug}`, 60);
    etab = res.data;
  } catch {
    notFound();
  }

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <Container>
          <div className="py-12 md:py-16">
            <Link
              href="/etablissements"
              className="inline-flex items-center gap-2 text-emerald-100 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux établissements
            </Link>
            <div className="flex items-center gap-6">
              {etab.logo && (
                <div className="w-20 h-20 bg-white rounded-2xl p-2 flex items-center justify-center">
                  <img src={etab.logo.url} alt="" className="max-h-full max-w-full object-contain" />
                </div>
              )}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  {etab.name}
                  {etab.acronym && <span className="ml-2 text-emerald-200">({etab.acronym})</span>}
                </h1>
                {etab.director_name && (
                  <p className="mt-2 text-emerald-100">
                    {etab.director_title}: {etab.director_name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-12">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {etab.description ? (
                <div
                  className="prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: etab.description }}
                />
              ) : (
                <p className="text-slate-500">Aucune description disponible.</p>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Contact</h3>
                <div className="space-y-3">
                  {etab.address && (
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                      <span className="text-slate-600">{etab.address}</span>
                    </div>
                  )}
                  {etab.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <a href={`tel:${etab.phone}`} className="text-slate-600 hover:text-emerald-600">
                        {etab.phone}
                      </a>
                    </div>
                  )}
                  {etab.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <a href={`mailto:${etab.email}`} className="text-slate-600 hover:text-emerald-600">
                        {etab.email}
                      </a>
                    </div>
                  )}
                  {etab.website && (
                    <div className="flex items-center gap-3 text-sm">
                      <Globe className="w-4 h-4 text-slate-400" />
                      <a
                        href={etab.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:underline"
                      >
                        Site web
                      </a>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                {(etab.facebook || etab.twitter || etab.linkedin) && (
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Réseaux sociaux</h4>
                    <div className="flex gap-3">
                      {etab.facebook && (
                        <a
                          href={etab.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-colors"
                        >
                          <Facebook className="w-4 h-4" />
                        </a>
                      )}
                      {etab.twitter && (
                        <a
                          href={etab.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 hover:bg-sky-500 hover:text-white transition-colors"
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                      )}
                      {etab.linkedin && (
                        <a
                          href={etab.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 hover:bg-blue-700 hover:text-white transition-colors"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
