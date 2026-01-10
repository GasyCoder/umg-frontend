"use client";

import Link from "next/link";
import Container from "@/components/Container";
import { ArrowRight, GraduationCap, BookOpen, Users } from "lucide-react";

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
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        {backgroundImage && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={backgroundImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
            />
          </>
        )}
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl" />
        </div>
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Content */}
      <Container className="relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6">
            <GraduationCap className="w-4 h-4" />
            <span>Établissement public d'enseignement supérieur</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-xl text-white/80 leading-relaxed max-w-2xl">
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/actualites"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-white/90 transition-all shadow-lg shadow-black/20"
            >
              Actualités
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/etablissements"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold hover:bg-white/20 transition-all"
            >
              Nos établissements
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">8</div>
              <div className="text-sm text-white/60 mt-1">Établissements</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">15k+</div>
              <div className="text-sm text-white/60 mt-1">Étudiants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-sm text-white/60 mt-1">Formations</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
