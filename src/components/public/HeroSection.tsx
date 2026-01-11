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
import { ArrowRight, CheckCircle, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import type { Post } from "@/lib/types";

interface HeroSectionProps {
  slides: Post[];
}

export default function HeroSection({ slides }: HeroSectionProps) {
  const verifiedSlides = useMemo(() => {
    if (!slides || slides.length === 0) {
      return [
        {
          id: 0,
          title: "L’Excellence Académique au Cœur de Madagascar",
          content: "Former les leaders de demain à travers une pédagogie innovante, une recherche de pointe et un engagement communautaire fort.",
          cover_image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkeQiz_Jk1Dn_hBcGJfNF7fspqvjw6x0ui9NCGA4COyiBNWWl0QlARhUcuLIB9_jA4kAwbh0q5WR6fz8iGk4DBfmU3_Yzx7Ln3y19QjfryHwWuT7G-fRz_e-uomhlmdGP62gYnUpm-DcXeGA7pn2G4zzj9EYkO2isVINku9zw-uYvZttEyQoVegWdanUiM0Yb10NIHRa13pbhLRyBxSlmZF3jZj71m08_cTT3QP-ChRIfRWwxM42ZIMlSVjHZRK5sN9vYpqVsZ0-Y",
          slug: "excellence-academique",
          is_fallback: true
        }
      ];
    }
    return slides;
  }, [slides]);

  return (
    <section className="relative bg-primary dark:bg-slate-900 overflow-hidden pb-12 pt-8 lg:py-16">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination, Navigation]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={700}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          loop={verifiedSlides.length > 1}
          className="w-full"
          navigation={{
            prevEl: '.custom-prev',
            nextEl: '.custom-next'
          }}
          pagination={{ 
            clickable: true,
            el: '.custom-dots',
            bulletClass: 'w-2 h-1 bg-white/40 rounded-full cursor-pointer transition-all duration-300 mx-1',
            bulletActiveClass: '!bg-white !w-8'
          }}
        >
          {verifiedSlides.map((slide: any) => (
            <SwiperSlide key={slide.id}>
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <div className="flex flex-col gap-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm w-fit">
                    <span className="size-2 rounded-full bg-accent animate-pulse"></span>
                    <span className="text-accent text-[11px] font-bold uppercase tracking-widest">Inscriptions Ouvertes 2024</span>
                  </div>
                  
                  <h1 className="text-white text-xl md:text-xl lg:text-xl font-black leading-[1.1] tracking-tight">
                    {slide.title}
                  </h1>
                  
                  <div 
                    className="text-blue-100 text-lg md:text-xl font-light leading-relaxed max-w-lg"
                    dangerouslySetInnerHTML={{ __html: slide.content || slide.excerpt || "" }} 
                  />

                  <div className="flex flex-wrap gap-4 mt-2">
                    <Link href="/etablissements" className="bg-accent hover:bg-amber-600 text-white h-12 px-8 rounded-lg text-sm font-bold transition-all shadow-lg shadow-amber-900/20 flex items-center gap-2 hover:-translate-y-0.5">
                        Découvrir nos formations
                    </Link>
                    <Link href="/vie-etudiante" className="group bg-white/10 hover:bg-white/20 border border-white/20 text-white h-12 px-8 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
                        Vie Étudiante
                        <ArrowRight className="w-[18px] group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  
                  <div className="flex gap-8 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-accent w-5 h-5" />
                      <span className="text-sm font-medium text-blue-100">Diplômes reconnus</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="text-accent w-5 h-5" />
                      <span className="text-sm font-medium text-blue-100">Partenaires internationaux</span>
                    </div>
                  </div>
                </div>

                {/* Media Content */}
                <div className="relative w-full aspect-[4/3] lg:aspect-[16/11] rounded-2xl overflow-hidden shadow-2xl shadow-black/20 group">
                  <div className="absolute inset-0 bg-cover bg-center transform transition-transform duration-[3000ms] hover:scale-105" 
                       style={{ backgroundImage: `url(${slide.cover_image_url || "/images/placeholder.jpg"})` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                  </div>
                  
                  {/* Slider Controls */}
                  <div className="absolute bottom-6 right-6 flex items-center gap-3 z-20">
                    <div className="custom-dots flex gap-1.5 mr-4"></div>
                    
                    <button className="custom-prev w-10 h-10 rounded-full bg-white/10 hover:bg-white backdrop-blur-md text-white hover:text-primary flex items-center justify-center transition-all border border-white/20">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="custom-next w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center transition-all shadow-lg hover:bg-accent hover:text-white">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="absolute bottom-6 left-6 text-white max-w-xs z-20">
                    <p className="font-bold text-sm">Campus Ambondrona</p>
                    <p className="text-xs text-white/70">Un environnement moderne pour réussir.</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
