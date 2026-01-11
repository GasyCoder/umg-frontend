import Link from "next/link";
import Image from "next/image";
import { Building2, ExternalLink } from "lucide-react";

interface Etablissement {
  id: number;
  name: string;
  slug: string;
  short_name?: string | null;
  description?: string | null;
  logo_url?: string | null;
}

interface EtablissementsSectionProps {
  etablissements: Etablissement[];
}

const placeholderImages = [
  "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
];

export function EtablissementsSection({ etablissements }: EtablissementsSectionProps) {
  if (!etablissements || etablissements.length === 0) return null;

  const displayEtabs = etablissements.slice(0, 3);
  const remainingCount = etablissements.length > 3 ? etablissements.length - 3 : 0;

  return (
    <section className="py-20 bg-white dark:bg-[#101622]">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-3 h-10 bg-[#d4af37] rounded-full"></div>
          <h2 className="text-3xl lg:text-4xl font-black text-[#1b4332] dark:text-white uppercase tracking-tight">
            Nos Établissements
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayEtabs.map((etab, index) => (
            <Link
              key={etab.id}
              href={`/etablissements/${etab.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-gray-200"
            >
              <Image
                src={etab.logo_url || placeholderImages[index % placeholderImages.length]}
                alt={etab.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b4332] to-transparent opacity-90"></div>
              <div className="absolute bottom-0 p-6 w-full text-white">
                <span className="text-xs font-bold text-[#d4af37] uppercase mb-2 block">
                  {etab.short_name || "Faculté"}
                </span>
                <h3 className="text-xl font-bold leading-tight mb-4">
                  {etab.name}
                </h3>
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-lg text-sm font-bold transition-all">
                  Consulter
                </button>
              </div>
            </Link>
          ))}

          {/* Plus Card */}
          <div className="group relative overflow-hidden rounded-2xl aspect-[4/5] text-center flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 bg-transparent">
            <Building2 className="w-16 h-16 text-[#d4af37] mb-4" />
            <h3 className="text-xl font-bold text-[#1b4332] dark:text-white mb-4">
              Et {remainingCount > 0 ? remainingCount : 7} autres Instituts et Écoles
            </h3>
            <Link
              href="/etablissements"
              className="text-[#d4af37] font-bold flex items-center gap-2 hover:underline"
            >
              Voir la liste complète <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
