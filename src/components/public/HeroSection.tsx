"use client";

import Link from "next/link";
import Container from "@/components/Container";
import { ArrowRight, GraduationCap } from "lucide-react";

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
    <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image with Parallax effect */}
      <div className="absolute inset-0 z-0">
        {backgroundImage && (
          <img
            src={backgroundImage}
            alt="Campus Université de Mahajanga"
            className="h-full w-full object-cover object-center scale-105 animate-slow-zoom"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />
      </div>

      <Container className="relative z-10 w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400 backdrop-blur-sm mb-6">
            <GraduationCap className="h-4 w-4" />
            <span>Excellence & Innovation</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] font-display">
            {title}
          </h1>
          
          <p className="mt-6 text-xl text-slate-200 leading-relaxed max-w-2xl font-light">
            {subtitle}
          </p>
          
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/etablissements"
              className="group inline-flex items-center gap-2 rounded-full bg-amber-400 px-8 py-4 text-sm font-bold text-slate-900 transition-all hover:bg-amber-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Nos formations
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link
              href="/universite"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/50"
            >
              Découvrir l'Université
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
