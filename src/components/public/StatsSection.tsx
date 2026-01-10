"use client";

import Container from "@/components/Container";
import { Users, GraduationCap, Building2, Handshake } from "lucide-react";
import AnimatedCounter from "@/components/public/AnimatedCounter";

interface Stat {
  icon: React.ElementType;
  value: number;
  suffix?: string;
  label: string;
  description: string;
}

const stats: Stat[] = [
  { icon: Users, value: 15000, suffix: "+", label: "Étudiants", description: "Communauté étudiante active" },
  { icon: GraduationCap, value: 50, suffix: "+", label: "Formations", description: "Parcours diplômants" },
  { icon: Building2, value: 8, label: "Établissements", description: "Facultés & instituts" },
  { icon: Handshake, value: 30, suffix: "+", label: "Partenaires", description: "Réseaux académiques" },
];

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Container>
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Impact</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
            L'Université en chiffres
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Des décennies d'excellence académique et un engagement fort au service du développement régional.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform dark:bg-indigo-500/20 dark:text-indigo-200">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="mt-4">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} label={stat.label} />
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
