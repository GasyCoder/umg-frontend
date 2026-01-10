import Link from "next/link";
import Container from "@/components/Container";
import { ArrowRight, FileText, Phone, Newspaper } from "lucide-react";

const actions = [
  {
    icon: Newspaper,
    title: "Actualités",
    description: "Suivez les dernières nouvelles et événements de l'université",
    href: "/actualites",
    color: "from-indigo-500 to-blue-600",
  },
  {
    icon: FileText,
    title: "Documents",
    description: "Accédez aux documents officiels, formulaires et ressources",
    href: "/documents",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Phone,
    title: "Contact",
    description: "Contactez-nous pour toute question ou demande d'information",
    href: "/contact",
    color: "from-amber-500 to-orange-600",
  },
];

export function CTASection() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
      <Container>
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Ressources</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
            Comment pouvons-nous vous aider ?
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Explorez nos ressources et services pour trouver ce dont vous avez besoin.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group relative rounded-3xl border border-slate-200/70 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div
                className={`inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br ${action.color} text-white shadow-lg group-hover:scale-110 transition-transform`}
              >
                <action.icon className="w-7 h-7" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white">
                {action.title}
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                {action.description}
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-indigo-600 font-semibold">
                En savoir plus
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
