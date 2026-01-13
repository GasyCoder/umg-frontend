"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Handshake, ExternalLink } from "lucide-react";
import type { Partner } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

function PartnerCard({ partner }: { partner: Partner }) {
  const content = (
    <div className="group relative flex items-center justify-center w-40 h-24 md:w-48 md:h-28 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-600 transition-all duration-300 hover:-translate-y-1">
      {partner.logo_url ? (
        <Image
          src={partner.logo_url}
          alt={partner.name}
          fill
          className="object-contain p-4 filter grayscale group-hover:grayscale-0 transition-all duration-300"
          unoptimized
        />
      ) : (
        <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {partner.name}
        </span>
      )}

      {/* Hover overlay with name */}
      <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-gradient-to-t from-black/70 via-black/20 to-transparent absolute inset-0 rounded-xl" />
        <div className="relative pb-2 flex items-center gap-1">
          <span className="text-xs font-medium text-white truncate max-w-[140px]">
            {partner.name}
          </span>
          {partner.website_url && (
            <ExternalLink className="w-3 h-3 text-white/80" />
          )}
        </div>
      </div>
    </div>
  );

  if (partner.website_url) {
    return (
      <Link
        href={partner.website_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block flex-shrink-0"
      >
        {content}
      </Link>
    );
  }

  return <div className="flex-shrink-0">{content}</div>;
}

function InfiniteCarousel({ partners, direction = "left" }: { partners: Partner[]; direction?: "left" | "right" }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || partners.length < 4) return;

    let animationId: number;
    let scrollPos = direction === "left" ? 0 : scrollContainer.scrollWidth / 2;
    const speed = 0.5;

    const animate = () => {
      if (!scrollContainer) return;

      if (direction === "left") {
        scrollPos += speed;
        if (scrollPos >= scrollContainer.scrollWidth / 2) {
          scrollPos = 0;
        }
      } else {
        scrollPos -= speed;
        if (scrollPos <= 0) {
          scrollPos = scrollContainer.scrollWidth / 2;
        }
      }

      scrollContainer.scrollLeft = scrollPos;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    const handleMouseEnter = () => cancelAnimationFrame(animationId);
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(animate);
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [partners.length, direction]);

  // Duplicate partners for seamless loop
  const displayPartners = partners.length >= 4 ? [...partners, ...partners] : partners;

  return (
    <div
      ref={scrollRef}
      className="flex gap-6 overflow-x-hidden py-4 scrollbar-hide"
      style={{ scrollBehavior: "auto" }}
    >
      {displayPartners.map((partner, index) => (
        <PartnerCard key={`${partner.id}-${index}`} partner={partner} />
      ))}
    </div>
  );
}

function PartnerGrid({ partners }: { partners: Partner[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-6 py-4">
      {partners.map((partner) => (
        <PartnerCard key={partner.id} partner={partner} />
      ))}
    </div>
  );
}

export default function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch(`${API_URL}/partners?is_active=1`, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        if (res.ok) {
          const json = await res.json();
          setPartners(json.data || []);
        }
      } catch (error) {
        console.error("Error fetching partners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4 animate-pulse" />
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="w-40 h-24 md:w-48 md:h-28 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!partners || partners.length === 0) {
    return null;
  }

  const nationalPartners = partners.filter((p) => p.type === "national");
  const internationalPartners = partners.filter((p) => p.type === "international");
  const hasMultipleTypes = nationalPartners.length > 0 && internationalPartners.length > 0;

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-4">
            <Handshake className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Nos Partenaires
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ils nous font confiance
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Nous collaborons avec des institutions de renommée nationale et internationale
            pour offrir une formation d&apos;excellence.
          </p>
        </div>

        {/* Partners Display */}
        {hasMultipleTypes ? (
          <div className="space-y-12">
            {/* International Partners */}
            {internationalPartners.length > 0 && (
              <div>
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4">
                    Partenaires Internationaux
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                </div>
                {internationalPartners.length >= 4 ? (
                  <InfiniteCarousel partners={internationalPartners} direction="left" />
                ) : (
                  <PartnerGrid partners={internationalPartners} />
                )}
              </div>
            )}

            {/* National Partners */}
            {nationalPartners.length > 0 && (
              <div>
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4">
                    Partenaires Nationaux
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                </div>
                {nationalPartners.length >= 4 ? (
                  <InfiniteCarousel partners={nationalPartners} direction="right" />
                ) : (
                  <PartnerGrid partners={nationalPartners} />
                )}
              </div>
            )}
          </div>
        ) : (
          /* All Partners Together */
          partners.length >= 4 ? (
            <InfiniteCarousel partners={partners} direction="left" />
          ) : (
            <PartnerGrid partners={partners} />
          )
        )}

        {/* Stats or CTA */}
        <div className="mt-12 md:mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
                {partners.length}+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Partenaires actifs
              </div>
            </div>
            {internationalPartners.length > 0 && (
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
                  {internationalPartners.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Internationaux
                </div>
              </div>
            )}
            {nationalPartners.length > 0 && (
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-600 dark:text-amber-400">
                  {nationalPartners.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Nationaux
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
