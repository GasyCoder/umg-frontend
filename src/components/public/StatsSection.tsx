"use client";

import { useEffect, useRef, useState } from "react";
import Container from "@/components/Container";
import { Users, GraduationCap, Building2, Handshake } from "lucide-react";

interface Stat {
  icon: React.ElementType;
  value: number;
  suffix?: string;
  label: string;
}

const stats: Stat[] = [
  { icon: Users, value: 15000, suffix: "+", label: "Étudiants" },
  { icon: GraduationCap, value: 50, suffix: "+", label: "Formations" },
  { icon: Building2, value: 8, label: "Établissements" },
  { icon: Handshake, value: 30, suffix: "+", label: "Partenaires" },
];

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          // Animate count
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  // Format number with space separator for thousands
  const formatted = count.toLocaleString("fr-FR");

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-slate-900">
      {formatted}
      {suffix}
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">
            L'Université en chiffres
          </h2>
          <p className="mt-3 text-slate-600 max-w-xl mx-auto">
            Des décennies d'excellence académique au service du développement de Madagascar
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative group text-center p-8 rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-50 text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                <stat.icon className="w-7 h-7" />
              </div>

              {/* Counter */}
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />

              {/* Label */}
              <div className="mt-2 text-slate-600 font-medium">
                {stat.label}
              </div>

              {/* Decorative gradient */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
