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
    color: "from-orange-500 to-red-500",
  },
];

export function CTASection() {
  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">
            Comment pouvons-nous vous aider ?
          </h2>
          <p className="mt-3 text-slate-600 max-w-xl mx-auto">
            Explorez nos ressources et services pour trouver ce dont vous avez besoin
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group relative p-8 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-slate-200"
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${action.color} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                <action.icon className="w-7 h-7" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {action.title}
              </h3>
              <p className="mt-2 text-slate-600">
                {action.description}
              </p>

              {/* Arrow */}
              <div className="mt-6 flex items-center gap-2 text-indigo-600 font-medium">
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
