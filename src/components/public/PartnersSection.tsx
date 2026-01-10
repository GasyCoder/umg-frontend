"use client";

import Container from "@/components/Container";
import { useEffect, useRef } from "react";

interface Partner {
  id: number;
  name: string;
  logo_url?: string | null;
  website_url?: string | null;
}

interface PartnersSectionProps {
  partners: Partner[];
}

export function PartnersSection({ partners }: PartnersSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll animation
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || partners.length < 5) return;

    let animationId: number;
    let scrollPos = 0;

    const scroll = () => {
      scrollPos += 0.5;
      if (scrollPos >= scrollContainer.scrollWidth / 2) {
        scrollPos = 0;
      }
      scrollContainer.scrollLeft = scrollPos;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    // Pause on hover
    const handleMouseEnter = () => cancelAnimationFrame(animationId);
    const handleMouseLeave = () => { animationId = requestAnimationFrame(scroll); };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [partners.length]);

  if (!partners || partners.length === 0) return null;

  // Duplicate for infinite scroll effect
  const displayPartners = [...partners, ...partners];

  return (
    <section className="py-16 bg-slate-50">
      <Container>
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Nos Partenaires</h2>
          <p className="mt-2 text-slate-600">
            Ils nous font confiance et collaborent avec nous
          </p>
        </div>
      </Container>

      {/* Scrolling logos */}
      <div
        ref={scrollRef}
        className="flex gap-12 overflow-hidden px-8"
        style={{ scrollBehavior: "auto" }}
      >
        {displayPartners.map((partner, index) => (
          <div
            key={`${partner.id}-${index}`}
            className="flex-shrink-0 flex items-center justify-center w-40 h-20 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
          >
            {partner.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={partner.logo_url}
                alt={partner.name}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-center text-sm font-medium text-slate-500">
                {partner.name}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
