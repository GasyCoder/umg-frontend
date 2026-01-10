import Container from "@/components/Container";
import { publicGet } from "@/lib/public-api";
import { Globe, ArrowUpRight } from "lucide-react";

type Partner = {
  id: number;
  name: string;
  type: "national" | "international";
  website_url?: string | null;
};

const marqueeLogos = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80",
];

export default async function PartnershipsPage() {
  const res = await publicGet<{ data: Partner[] }>("/partners?per_page=100", 300);

  const national = res.data.filter((partner) => partner.type === "national");
  const international = res.data.filter((partner) => partner.type === "international");

  return (
    <main className="bg-slate-50/60 dark:bg-slate-950">
      <section className="bg-gradient-to-br from-indigo-700 via-blue-700 to-slate-900 text-white">
        <Container>
          <div className="py-16 md:py-20">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-100">Partenariats</p>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">
              Réseaux nationaux et internationaux
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-indigo-100">
              L'Université de Mahajanga collabore avec des institutions académiques, entreprises et
              organismes publics pour renforcer l'impact de ses actions.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              <Globe className="h-4 w-4" />
              Partenaires en mouvement
            </div>
            <div className="mt-4 overflow-hidden">
              <div className="flex gap-6 animate-marquee">
                {[...marqueeLogos, ...marqueeLogos].map((logo, index) => (
                  <div
                    key={`${logo}-${index}`}
                    className="flex h-20 w-40 items-center justify-center rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
                  >
                    <img src={logo} alt="Logo partenaire" className="h-12 w-28 object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-10">
            {[
              { title: "Nationaux", data: national },
              { title: "Internationaux", data: international },
            ].map((section) => (
              <div key={section.title}>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {section.title}
                  </h2>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {section.data.length} partenaires
                  </span>
                </div>
                <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {section.data.map((partner) => (
                    <div
                      key={partner.id}
                      className="group rounded-3xl border border-white/60 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                        <Globe className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-white">
                        {partner.name}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        Collaboration académique, mobilité et projets de recherche conjoints.
                      </p>
                      {partner.website_url && (
                        <a
                          href={partner.website_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600"
                        >
                          Visiter le site
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
