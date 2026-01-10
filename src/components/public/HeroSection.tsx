"use client";

import Link from "next/link";
import Container from "@/components/Container";
import { ArrowRight, GraduationCap, Sparkles } from "lucide-react";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
}

export function HeroSection({
  title = "Université de Mahajanga",
  subtitle = "Former les leaders de demain pour un Madagascar prospère",
  backgroundImage,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-blue-700 to-indigo-900 text-white">
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt="Campus Université de Mahajanga"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/50 to-slate-950/80" />

      <Container className="relative">
        <div className="py-20 md:py-28 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/80">
              <GraduationCap className="h-4 w-4" />
              Excellence académique
            </div>
            <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight">
              {title}
            </h1>
            <p className="mt-6 text-lg text-indigo-100 leading-relaxed max-w-2xl">
              {subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/actualites"
                className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg hover:bg-amber-300"
              >
                Découvrir nos actualités
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/universite"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Présentation de l'université
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {[
              {
                title: "Recherche & Innovation",
                description: "Laboratoires multidisciplinaires et projets territoriaux.",
              },
              {
                title: "Vie étudiante",
                description: "Associations, événements et accompagnement des talents.",
              },
              {
                title: "Partenariats stratégiques",
                description: "Coopérations nationales et internationales durables.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
                  <Sparkles className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-indigo-100">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
