"use client";

export default function PartnersSection() {
  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Nos Partenaires</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {/* Placeholders for partners - can be replaced with real images later */}
          <div className="h-8 w-24 bg-slate-300 dark:bg-slate-700 rounded animate-pulse"></div>
          <div className="h-8 w-24 bg-slate-300 dark:bg-slate-700 rounded animate-pulse"></div>
          <div className="h-8 w-24 bg-slate-300 dark:bg-slate-700 rounded animate-pulse"></div>
          <div className="h-8 w-24 bg-slate-300 dark:bg-slate-700 rounded animate-pulse"></div>
          <div className="h-8 w-24 bg-slate-300 dark:bg-slate-700 rounded animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
