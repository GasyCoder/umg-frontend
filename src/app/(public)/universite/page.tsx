import Container from "@/components/Container";
import Link from "next/link";
import { Building2, FileText, Landmark, Users, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Université - Université de Mahajanga",
  description: "Découvrez l'Université de Mahajanga, son histoire, son organisation et ses établissements",
};

const sections = [
  {
    href: "/universite/historique",
    title: "Historique",
    description: "L'histoire et l'évolution de l'Université de Mahajanga depuis sa création.",
    icon: FileText,
    color: "blue",
  },
  {
    href: "/universite/organisation",
    title: "Organisation",
    description: "La présidence, les directions, les services et l'organigramme de l'université.",
    icon: Landmark,
    color: "indigo",
  },
  {
    href: "/universite/textes",
    title: "Textes & Arrêtés",
    description: "Les textes réglementaires, décrets et arrêtés officiels.",
    icon: FileText,
    color: "amber",
  },
  {
    href: "/etablissements",
    title: "Établissements",
    description: "Les facultés, écoles et instituts de l'Université de Mahajanga.",
    icon: Building2,
    color: "emerald",
  },
];

const colorStyles: Record<string, { bg: string; text: string; hoverBg: string }> = {
  blue: { bg: "bg-blue-100", text: "text-blue-600", hoverBg: "group-hover:bg-blue-600" },
  indigo: { bg: "bg-indigo-100", text: "text-indigo-600", hoverBg: "group-hover:bg-indigo-600" },
  amber: { bg: "bg-amber-100", text: "text-amber-600", hoverBg: "group-hover:bg-amber-600" },
  emerald: { bg: "bg-emerald-100", text: "text-emerald-600", hoverBg: "group-hover:bg-emerald-600" },
};

export default function UniversitePage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 text-white">
        <Container>
          <div className="py-16 md:py-24">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                L'Université de Mahajanga
              </h1>
              <p className="mt-4 text-lg md:text-xl text-indigo-100">
                Institution d'enseignement supérieur et de recherche au service 
                du développement de Madagascar et de la région Boeny.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Sections Grid */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section) => {
              const styles = colorStyles[section.color];
              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className="group block p-6 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${styles.bg} ${styles.hoverBg} rounded-xl flex items-center justify-center transition-colors`}>
                      <section.icon className={`w-6 h-6 ${styles.text} group-hover:text-white transition-colors`} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                        {section.title}
                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </h2>
                      <p className="mt-1 text-slate-600">{section.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-slate-50">
        <Container>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">En quelques chiffres</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "5+", label: "Établissements" },
              { value: "10K+", label: "Étudiants" },
              { value: "500+", label: "Enseignants" },
              { value: "50+", label: "Filières" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-indigo-600">{stat.value}</p>
                <p className="mt-1 text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
