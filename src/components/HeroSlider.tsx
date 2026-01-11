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

  const StatItem = ({ icon, count, label }: { icon: string; count: number; label: string }) => (
    <div className="flex items-center gap-3 px-4 md:px-6 border-r last:border-r-0 border-white/20 h-10">
      <span className="material-symbols-outlined text-[#facc15] text-2xl">{icon}</span>
      <div className="flex flex-col leading-none text-white">
        <span className="font-bold text-lg">{count.toLocaleString()}+</span>
        <span className="text-[10px] uppercase tracking-wider opacity-80">{label}</span>
      </div>
    </div>
  );

  return (
    <section className="relative mx-auto max-w-[1200px] mt-6 px-6">
      {/* Slider Container */}
      <div className="relative h-[400px] overflow-hidden rounded-2xl shadow-2xl group">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination, Navigation]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          loop={verifiedSlides.length > 1}
          className="h-full w-full"
        >
          {verifiedSlides.map((slide: any) => (
            <SwiperSlide key={slide.id}>
              <div className="relative h-full w-full">
                {/* Background Image */}
                <div className="absolute inset-0 bg-gray-900">
                   <Image
                    src={slide.cover_image_url || "/images/placeholder.jpg"}
                    alt={slide.title}
                    fill
                    className="object-cover opacity-80"
                    priority
                  /> 
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101622] via-[#101622]/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-4xl pt-10">
                  <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 drop-shadow-lg line-clamp-2 md:line-clamp-3">
                    {slide.title}
                  </h1>
                  <p className="text-white/90 text-sm md:text-lg font-medium max-w-2xl mb-8 line-clamp-2 md:line-clamp-2 leading-relaxed">
                    {slide.excerpt}
                  </p>
                  
                  {!slide.is_fallback && slide.slug && (
                    <Link
                      href={`/actualites/${slide.slug}`}
                      className="inline-flex w-fit items-center gap-2 rounded-full bg-[#135bec] px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#1e6aff] hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30"
                    >
                      Lire la suite
                      <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                    </Link>
                  )}
                  {slide.is_fallback && (
                     <Link 
                      href="/etablissements"
                      className="inline-flex w-fit items-center gap-2 rounded-full bg-[#135bec] px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#1e6aff] hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30"
                    >
                      Découvrir nos formations
                      <span className="material-symbols-outlined text-sm font-bold">school</span>
                    </Link>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
          
          {/* Custom Navigation Buttons (Visible on Hover) */}
          <div className="swiper-button-prev !text-white/70 after:!text-2xl transition-opacity opacity-0 group-hover:opacity-100 !left-4" />
          <div className="swiper-button-next !text-white/70 after:!text-2xl transition-opacity opacity-0 group-hover:opacity-100 !right-4" />
        </Swiper>

        {/* Integrated Stats Bar (Ultra-fine, absolute bottom) */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-[#101622]/90 backdrop-blur-md border-t border-white/10 py-3 hidden md:block">
            <div className="max-w-[1200px] mx-auto flex items-center justify-around">
               <StatItem icon="group" count={stats.students} label="Étudiants" />
               <StatItem icon="school" count={stats.formations} label="Formations" />
               <StatItem icon="person_apron" count={stats.staff} label="Enseignants & Staff" />
               <StatItem icon="apartment" count={12} label="Établissements" />
            </div>
        </div>
      </div>
      
      {/* Mobile Stats (Below Hero) */}
      <div className="md:hidden grid grid-cols-2 gap-3 mt-4">
        <div className="bg-white dark:bg-[#1e2634] p-3 rounded-lg border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center text-center">
             <span className="material-symbols-outlined text-[#135bec] mb-1">group</span>
             <span className="font-bold text-[#1e293b] dark:text-white text-lg">{stats.students.toLocaleString()}</span>
             <span className="text-[10px] text-gray-500 uppercase">Étudiants</span>
        </div>
         <div className="bg-white dark:bg-[#1e2634] p-3 rounded-lg border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center text-center">
             <span className="material-symbols-outlined text-[#135bec] mb-1">school</span>
             <span className="font-bold text-[#1e293b] dark:text-white text-lg">{stats.formations}</span>
             <span className="text-[10px] text-gray-500 uppercase">Formations</span>
        </div>
         <div className="bg-white dark:bg-[#1e2634] p-3 rounded-lg border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center text-center">
             <span className="material-symbols-outlined text-[#135bec] mb-1">person_apron</span>
             <span className="font-bold text-[#1e293b] dark:text-white text-lg">{stats.staff}</span>
             <span className="text-[10px] text-gray-500 uppercase">Personnel</span>
        </div>
         <div className="bg-white dark:bg-[#1e2634] p-3 rounded-lg border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center text-center">
             <span className="material-symbols-outlined text-[#135bec] mb-1">apartment</span>
             <span className="font-bold text-[#1e293b] dark:text-white text-lg">12</span>
             <span className="text-[10px] text-gray-500 uppercase">Établissements</span>
        </div>
      </div>
    </section>
  );
}
