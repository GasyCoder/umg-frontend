"use client";

import { Users, School, Building, Award } from "lucide-react";

interface StatsProps {
  stats?: {
    students: number;
    teachers: number;
    establishments: number;
    graduates: number;
  };
}

export default function StatsSection({ stats }: StatsProps) {
  return (
    <section className="py-12 -mt-8 relative z-20">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-700 flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
            <div className="size-12 rounded-lg bg-blue-50 dark:bg-slate-700 text-primary dark:text-primary-light flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {stats?.students ? `${(stats.students / 1000).toFixed(0)}k+` : "12k+"}
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Étudiants inscrits</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-700 flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
            <div className="size-12 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-accent flex items-center justify-center shrink-0">
              <School className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {stats?.teachers ? `${stats.teachers}+` : "500+"}
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Enseignants</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-700 flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
            <div className="size-12 rounded-lg bg-blue-50 dark:bg-slate-700 text-primary dark:text-primary-light flex items-center justify-center shrink-0">
              <Building className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {stats?.establishments || "6"}
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Établissements</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-700 flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
            <div className="size-12 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-accent flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {stats?.graduates ? `${(stats.graduates / 1000).toFixed(0)}k+` : "30k+"}
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Diplômés</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
