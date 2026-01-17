"use client";

import { Quote } from "lucide-react";
import type { PresidentMessage } from "@/lib/types";

interface PresidentMessageProps {
    data?: PresidentMessage | null;
}

export default function PresidentMessage({ data }: PresidentMessageProps) {
  const photoUrl =
    data?.photo?.url ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCJsTyyt3qhu-9IbTwrB9In9ZkJ7cyG_NpJuOLXUCuXwkgnHBKdrUdm5F2qmT-3CGXAAmL_ICYgygjj_-TPlDcZlPlgUYcPrmX0HnJl0TKMJJmodknVFAuu39kxmu7ZzWzWtEx7TOSUaNzCyKfjSP0dA7usQKNv86m2xU1vL_xTyTAGvjBxR_ts11Yny5tjnhnVb2in91zKIZxxNNT41Pd_Zv4fY_Mq8EHdc7e5-jIcP6q_SkR4_ROMwV86XA1gjfTyTRwbLQytYtc";

  return (
    <section className="py-16 bg-slate-50 dark:bg-[#0B1120]/50 border-y border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          
          <div className="w-full md:w-1/3">
            <div className="relative">
              <div className="absolute top-4 left-4 w-full h-full border-2 border-primary dark:border-blue-500 rounded-2xl"></div>
              <div className="relative bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-xl">
                <div 
                  className="aspect-[4/5] w-full rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 bg-cover bg-center" 
                  style={{ backgroundImage: `url("${photoUrl}")` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-7/12">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-slate-300 dark:bg-slate-600"></span>
              <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-xs">Gouvernance</span>
            </div>
            
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">Le Mot du Président</h2>
            
            <div className="relative pl-8 mb-8">
              <span className="absolute top-0 left-0 text-6xl text-primary/20 dark:text-white/10 font-serif font-black leading-none">“</span>
              <blockquote className="text-xl font-medium text-slate-700 dark:text-slate-300 italic leading-relaxed">
                {data?.intro || "L'Université de Mahajanga s'engage à être un phare de savoir et d'innovation pour l'Océan Indien. Nous croyons en la force de la diversité et en la capacité de nos étudiants à transformer le monde de demain."}
              </blockquote>
            </div>
            
            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
               {data?.title ? data.title : "En rejoignant l'UMG, vous intégrez une communauté dynamique, solidaire et tournée vers l'excellence. Ensemble, construisons l'avenir de Madagascar."}
            </p>
            
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-6">
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-lg">{data?.president_name || "Prof. Ravelomanana Jean"}</p>
                <p className="text-sm text-primary dark:text-blue-400 font-medium">{data?.president_title || "Président de l'Université"}</p>
              </div>
              <img 
                alt="Signature" 
                className="h-12 opacity-80 dark:invert" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYztx2CFeWLJxIJa9ian_-rkTMDhVZ2IimFVi9jKogwMXMkrDYExTxtblC-DlByza-WbywcbD1fMdG6XKR5Z6e7I5NA2t1lYxnAg2-PH77BG-Yull0bzgo7k6HeYHDdMhNZMXBqMdm51SOr5W6X_Dss4XisYG8yFOiYCpQnGrZ7cPesYvX50Tvk5t6JpkK2veC0V0FKck9djEpt1F35i_aNdsyrr-bUeoMQ4oSnKoLzXVQepcP6Ot4vLDqFT9_dfnkgRLGUP4MtQg" 
              />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
