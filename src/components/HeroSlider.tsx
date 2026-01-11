"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";
import type { Post } from "@/lib/types";

interface Stats {
  students: number;
  staff: number;
  formations: number;
}

interface HeroSliderProps {
  slides: Post[];
  stats: Stats;
}

export default function HeroSlider({ slides, stats }: HeroSliderProps) {
  const verifiedSlides = useMemo(() => {
    // If no slides, use a fallback static slide
    if (!slides || slides.length === 0) {
      return [
        {
          id: 0,
          title: "L'Excellence Académique au Cœur de Mahajanga",
          excerpt: "Construisez votre avenir avec une formation d'excellence au sein de l'Université de Mahajanga.",
          cover_image_url: "/images/campus-hero.jpg",
          slug: "excellence-academique", 
          is_fallback: true
        }
      ];
    }
    return slides;
  }, [slides]);

  const StatCard = ({ icon, count, label, colorClass }: { icon: string; count: number; label: string, colorClass: string }) => (
    <div className="relative group bg-white dark:bg-[#1e293b] rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden">
        {/* Decorative background blob */}
        <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-5 transition-transform group-hover:scale-150 ${colorClass}`} />
        
        <div className="relative z-10 flex flex-col items-start gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg ${colorClass}`}>
                <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>
            <div>
                <span className="block text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
                    {count.toLocaleString()}+
                </span>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    {label}
                </span>
            </div>
        </div>
    </div>
  );

  return (
    <section className="relative w-full bg-[#0f172a] overflow-hidden pb-32 pt-10 lg:pt-20">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute top-[40%] right-[0%] w-[40%] h-[60%] rounded-full bg-indigo-600/10 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination, Navigation]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={700}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{ 
            clickable: true,
            el: '.custom-swiper-pagination',
            bulletClass: 'w-3 h-3 bg-white/30 rounded-full cursor-pointer transition-all duration-300 hover:bg-white/80',
            bulletActiveClass: '!bg-blue-500 !w-8'
          }}
          loop={verifiedSlides.length > 1}
          className="w-full"
        >
          {verifiedSlides.map((slide: any) => (
            <SwiperSlide key={slide.id} className="!h-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                
                {/* Left Content */}
                <div className="flex flex-col items-start space-y-8 text-left max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        À la une
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
                        {slide.title}
                    </h1>
                    
                    <p className="text-lg text-slate-300 leading-relaxed max-w-xl line-clamp-3">
                        {slide.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                         {!slide.is_fallback && slide.slug ? (
                            <Link
                                href={`/actualites/${slide.slug}`}
                                className="group relative inline-flex items-center gap-3 rounded-full bg-[#135bec] px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-600 hover:scale-105 active:scale-95"
                            >
                                Lire l'article
                                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                            </Link>
                         ) : (
                             <Link 
                                href="/etablissements"
                                className="group relative inline-flex items-center gap-3 rounded-full bg-[#135bec] px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-600 hover:scale-105 active:scale-95"
                            >
                                Découvrir
                                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">explore</span>
                            </Link>
                         )}
                         
                         <button className="group inline-flex items-center gap-3 rounded-full px-8 py-4 text-base font-bold text-white border border-white/20 hover:bg-white/10 transition-all">
                             <span className="material-symbols-outlined">play_circle</span>
                             Voir la vidéo
                         </button>
                    </div>
                </div>

                {/* Right Image/Card */}
                <div className="relative lg:h-[600px] w-full flex items-center justify-center lg:justify-end">
                    <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-[500px] lg:w-[90%] rounded-3xl overflow-hidden shadow-2xl shadow-black/50 ring-4 ring-white/10 group-hover:ring-white/20 transition-all">
                        <Image
                            src={slide.cover_image_url || "/images/placeholder.jpg"}
                            alt={slide.title}
                            fill
                            className="object-cover transition-transform duration-700 hover:scale-105"
                            priority
                        />
                        {/* Overlay Gradient for consistency */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/40 to-transparent" />
                        
                        {/* Floating Date Badge */}
                        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md rounded-xl px-4 py-3 text-center shadow-lg">
                           <span className="block text-2xl font-black text-[#0f172a] leading-none">24</span>
                           <span className="block text-xs font-bold text-blue-600 uppercase">SEP</span>
                        </div>
                    </div>
                    
                    {/* Decorative Elements around image */}
                    <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#135bec] rounded-2xl -z-10 hidden lg:block animate-float" />
                    <div className="absolute -top-8 -right-8 w-32 h-32 border-2 border-white/10 rounded-full -z-10 hidden lg:block" />
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Custom Pagination */}
        <div className="custom-swiper-pagination flex gap-3 mt-12 bg-none!" />
      </div>

      {/* Floating Stats Section (Overlapping) */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 mt-16 lg:-mt-10 z-20">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
                icon="school" 
                count={stats.students} 
                label="Étudiants Actifs" 
                colorClass="bg-blue-600 group-hover:bg-blue-700"
            />
             <StatCard 
                icon="menu_book" 
                count={stats.formations} 
                label="Formations" 
                colorClass="bg-emerald-500 group-hover:bg-emerald-600"
            />
             <StatCard 
                icon="groups" 
                count={stats.staff} 
                label="Enseignants" 
                colorClass="bg-indigo-500 group-hover:bg-indigo-600"
            />
             <StatCard 
                icon="domain" 
                count={12} 
                label="Établissements" 
                colorClass="bg-amber-500 group-hover:bg-amber-600"
            />
         </div>
      </div>
    </section>
  );
}
