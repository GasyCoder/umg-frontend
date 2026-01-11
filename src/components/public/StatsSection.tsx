"use client";

import { useEffect, useRef, useState } from "react";
import { Users, GraduationCap, Building2, FlaskConical } from "lucide-react";

interface StatItemProps {
  icon: React.ElementType;
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
}

function StatItem({ icon: Icon, value, suffix = "", label, delay = 0 }: StatItemProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setIsVisible(true);
          
          setTimeout(() => {
            const duration = 1500;
            const start = performance.now();
            
            const animate = (now: number) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setCount(Math.floor(eased * value));
              if (progress < 1) requestAnimationFrame(animate);
            };
            
            requestAnimationFrame(animate);
          }, delay);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [value, delay]);

  return (
    <div 
      ref={ref} 
      className={`text-center p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex justify-center mb-3">
        <div className="w-12 h-12 rounded-xl bg-[#1b4332]/10 dark:bg-[#d4af37]/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-[#1b4332] dark:text-[#d4af37]" />
        </div>
      </div>
      <div className="text-[#1b4332] dark:text-[#d4af37] text-4xl md:text-5xl font-black mb-2 tabular-nums">
        {count.toLocaleString('fr-FR')}{suffix}
      </div>
      <div className="text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wider text-sm">
        {label}
      </div>
    </div>
  );
}

interface Stats {
  students: number;
  staff: number;
  formations: number;
  establishments: number;
  services: number;
}

interface StatsSectionProps {
  stats?: Stats;
}

const defaultStats: Stats = {
  students: 15000,
  staff: 550,
  formations: 50,
  establishments: 10,
  services: 45,
};

export function StatsSection({ stats = defaultStats }: StatsSectionProps) {
  const statItems = [
    { icon: Users, value: stats.students, suffix: "+", label: "Étudiants" },
    { icon: GraduationCap, value: stats.staff, suffix: "+", label: "Enseignants" },
    { icon: Building2, value: stats.establishments, suffix: "", label: "Établissements" },
    { icon: FlaskConical, value: stats.services, suffix: "+", label: "Laboratoires" },
  ];

  return (
    <section className="py-16 bg-white dark:bg-[#101622]">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {statItems.map((stat, index) => (
            <StatItem 
              key={index} 
              {...stat} 
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
