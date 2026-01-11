"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Post } from "@/lib/types";

interface HeroSliderProps {
  slides: Post[];
  fallbackImage?: string;
}

export function HeroSlider({ 
  slides,
  fallbackImage = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80"
}: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const displaySlides = slides.length > 0 ? slides : [{
    id: 0,
    title: "Bâtissez votre avenir à la Cité des Fleurs",
    slug: "home",
    excerpt: "L'Université de Mahajanga vous offre un cadre académique d'exception, alliant tradition universitaire et ouverture sur le monde professionnel.",
    cover_image: { url: fallbackImage, type: 'image', id: 0 },
    is_slide: true 
  } as Post];

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % displaySlides.length);
  }, [displaySlides.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + displaySlides.length) % displaySlides.length);
  }, [displaySlides.length]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isPaused || displaySlides.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [isPaused, next, displaySlides.length]);

  return (
    <section 
      className="relative h-[650px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {displaySlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === current 
              ? "opacity-100 z-10" 
              : "opacity-0 z-0"
          }`}
        >
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0">
            <Image
              src={slide.cover_image?.url || fallbackImage}
              alt={slide.title}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="100vw"
            />
            {/* UM Green gradient overlay */}
            <div 
              className="absolute inset-0" 
              style={{
                background: 'linear-gradient(rgba(0,0,0,0.3), rgba(27,67,50,0.85))'
              }}
            />
          </div>

          {/* Content */}
          <div className="relative h-full max-w-[1400px] mx-auto px-4 lg:px-10 flex flex-col justify-center">
            <div className={`max-w-3xl transition-all duration-700 delay-100 ${
              index === current && isLoaded 
                ? "opacity-100 translate-x-0" 
                : "opacity-0 -translate-x-4"
            }`}>
              {/* Badge */}
              <span className="inline-block px-4 py-1.5 bg-[#d4af37] text-[#1b4332] text-xs font-bold uppercase tracking-widest mb-6 rounded-full">
                Excellence & Innovation
              </span>
              
              {/* Title */}
              <h1 className="text-white text-4xl md:text-5xl lg:text-7xl font-black leading-tight mb-6">
                {slide.title}
              </h1>
              
              {/* Description */}
              <p className="text-white/90 text-lg md:text-xl font-normal leading-relaxed mb-10 max-w-2xl">
                {slide.excerpt}
              </p>
              
              {/* CTAs */}
              <div className="flex flex-wrap gap-5">
                {slide.slug !== 'home' ? (
                  <Link
                    href={`/actualites/${slide.slug}`}
                    className="inline-flex items-center gap-2 bg-[#d4af37] hover:bg-yellow-600 text-[#1b4332] px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-xl"
                  >
                    Lire la suite
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/etablissements"
                      className="inline-flex items-center gap-2 bg-[#d4af37] hover:bg-yellow-600 text-[#1b4332] px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-xl"
                    >
                      Découvrir nos offres
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      href="/universite"
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/40 px-10 py-4 rounded-xl font-bold text-lg transition-all"
                    >
                      Admission 2024-2025
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      {displaySlides.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {displaySlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                current === idx 
                  ? "w-12 bg-[#d4af37]" 
                  : "w-12 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Aller au slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Arrow Navigation (optional, hidden on mobile) */}
      {displaySlides.length > 1 && (
        <>
          <button 
            onClick={prev}
            className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-colors"
            aria-label="Slide précédent"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={next}
            className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-colors"
            aria-label="Slide suivant"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
    </section>
  );
}
