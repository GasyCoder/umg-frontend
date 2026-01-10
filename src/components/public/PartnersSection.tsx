import Container from "@/components/Container";

interface Partner {
  id: number;
  name: string;
  logo_url?: string | null;
  website_url?: string | null;
}

interface PartnersSectionProps {
  partners: Partner[];
}

export function PartnersSection({ partners }: PartnersSectionProps) {
  if (!partners || partners.length === 0) return null;

  const displayPartners = [...partners, ...partners];

  return (
    <section className="py-16 bg-white dark:bg-slate-950">
      <Container>
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Partenaires</p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">Nos collaborations</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Institutions académiques, entreprises et organismes publics à nos côtés.
          </p>
        </div>
      </Container>

      <div className="overflow-hidden">
        <div className="flex gap-8 px-8 animate-marquee">
          {displayPartners.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="flex h-20 w-40 items-center justify-center rounded-2xl border border-slate-200/70 bg-slate-50/70 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              {partner.logo_url ? (
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="max-h-12 max-w-[120px] object-contain"
                />
              ) : (
                <div className="text-center text-xs font-medium text-slate-500 dark:text-slate-300">
                  {partner.name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
